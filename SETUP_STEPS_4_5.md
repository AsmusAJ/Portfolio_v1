# Steps 4-5: DigitalOcean Setup & Cloudflare Configuration

This guide provides the detailed steps you need to complete the production deployment.

## Step 4: DigitalOcean Host Setup

### 4.1 Initial Server Setup (via DigitalOcean Dashboard or CLI)

**Create a droplet:**
- OS: Ubuntu 24.04 LTS
- Size: $6/month basic droplet is sufficient for a small portfolio
- Region: Choose closest to your users
- Enable IPv6
- Add SSH key during creation

### 4.2 Execute Server Configuration

All commands are in [DEPLOYMENT.md](./DEPLOYMENT.md) under **Step 1: Prepare the DigitalOcean Droplet**. Follow these subsections in order:

1. **1.1 Initial Security Configuration** — Firewall, SSH hardening
2. **1.2 Create Deployment User** — Non-root user with SSH key
3. **1.3 Install .NET Runtime** — ASP.NET Core 8
4. **1.4 Install and Configure Nginx** — Reverse proxy and TLS
5. **1.5 Create Application Directories** — Database and app paths

**Key decisions in 4.2:**

- Replace `yourdomain.com` with your actual domain everywhere
- Ensure you have SSH access to the droplet before proceeding
- The portfolio user will own all application and data files
- UFW firewall will only allow SSH, HTTP, and HTTPS

### 4.3 Initial Deployment

Once the droplet is ready, deploy the backend from your local machine:

```bash
cd Portfolio_v1
chmod +x scripts/deploy.sh
./scripts/deploy.sh api.yourdomain.com portfolio 22
```

This script:
- Builds a release locally
- Compresses and uploads the build
- Extracts it to `/opt/portfolio/server`
- Backs up any existing release
- Starts the systemd service

**Verify the service is running:**

```bash
# SSH into the droplet
ssh portfolio@api.yourdomain.com

# Check service status
systemctl status portfolio-api

# View recent logs
journalctl -u portfolio-api -n 20
```

**Test the health endpoint from the droplet:**

```bash
curl http://127.0.0.1:5000/api/health
```

You should see a JSON response with `"status": "healthy"` and database info.

### 4.4 Configure SSL/TLS

Once Nginx is running and your DNS is pointing to the droplet, request a certificate:

```bash
ssh portfolio@api.yourdomain.com
sudo certbot certonly --nginx -d api.yourdomain.com
```

Certbot will:
- Validate domain ownership
- Generate a certificate
- Update Nginx configuration automatically
- Enable auto-renewal

**Test HTTPS:**

```bash
curl https://api.yourdomain.com/api/health
```

If this works, TLS is configured correctly.

---

## Step 5: Cloudflare Configuration

### 5.1 Update Cloudflare DNS

**Log into Cloudflare Dashboard:**

1. Select your domain
2. Go to DNS → Records
3. Add an `A` record:
   - Name: `api`
   - Type: `A`
   - Content: Your droplet's IP address (from DigitalOcean dashboard)
   - TTL: Auto
   - Proxy status: **Proxied** (orange cloud) or **DNS only** (gray cloud)
     - **Proxied** = Cloudflare terminates TLS and proxies to your server; your Nginx certificate is not checked by the public internet
     - **DNS only** = Public internet connects directly to your Nginx with your certificate
     - For simplicity, use **DNS only** initially

4. Ensure your main domain (without `api.`) also points to Cloudflare Pages:
   - Name: `@`
   - Type: `CNAME`
   - Content: `<your-pages-project>.pages.dev`
   - Proxy status: **Proxied**

### 5.2 Test DNS Resolution

```bash
# Wait a minute for DNS to propagate
sleep 60

# Test DNS resolves to your droplet
nslookup api.yourdomain.com

# Should return your droplet's IP
```

### 5.3 Configure Cloudflare Pages (Frontend)

**Log into Cloudflare Dashboard:**

1. Go to Workers & Pages → Pages
2. Select your portfolio project
3. Go to Settings → Environment variables
4. Add a new environment variable:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://api.yourdomain.com`
   - Environments: Production (and Preview if you want to test)

5. Go to Settings → Builds & deployments
6. Verify:
   - **Build command**: `npm ci && npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `client`

7. Go to Settings → Custom domains
8. Add your custom domain (e.g., `yourdomain.com`)
9. Follow the prompts to add the required CNAME record to your Cloudflare DNS

### 5.4 Set SSL/TLS Mode (If Using Cloudflare Proxying)

If you set the API DNS record as **Proxied** (orange cloud):

1. Go to SSL/TLS → Overview
2. Set encryption mode to **Full (strict)**
3. This requires your origin (Nginx) to have a valid certificate
4. Since you used Certbot with a public certificate, this should work

If you set it as **DNS only** (gray cloud):

- Cloudflare is not involved in TLS; your Nginx certificate is used directly
- You don't need to configure SSL/TLS mode in Cloudflare for the API

### 5.5 Configure CORS in Backend

The backend CORS is already configured in `appsettings.Production.json`, but you need to update it with your actual domain:

**On the droplet:**

```bash
ssh portfolio@api.yourdomain.com
sudo nano /opt/portfolio/server/appsettings.Production.json
```

Update the `Cors.AllowedOrigins` array:

```json
"Cors": {
  "AllowedOrigins": [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
  ]
}
```

Save and restart the service:

```bash
sudo systemctl restart portfolio-api
```

### 5.6 End-to-End Testing

**From your local machine:**

1. **Test API health from the internet:**

```bash
curl -i https://api.yourdomain.com/api/health
```

Expected response: HTTP 200 with database info.

2. **Test CORS headers:**

```bash
curl -i -H "Origin: https://yourdomain.com" \
  https://api.yourdomain.com/api/projects
```

Expected: Response includes `Access-Control-Allow-Origin: https://yourdomain.com`

3. **Test with a disallowed origin (should fail):**

```bash
curl -i -H "Origin: https://random-domain.com" \
  https://api.yourdomain.com/api/projects
```

Expected: Response does NOT include `Access-Control-Allow-Origin` header.

4. **Open your portfolio in a browser:**

Navigate to `https://yourdomain.com`

- Check that the page loads without CORS errors in the browser console
- Navigate to `/work`, `/projects`, and `/about` pages
- Verify data loads correctly
- Test hard refresh (Ctrl+Shift+R or Cmd+Shift+R) to ensure SPA routing works

5. **Check Cloudflare Pages build:**

Go to Cloudflare Dashboard → Pages → Your project → Deployments

- Verify the latest deployment is active
- Check logs if there are any build warnings

---

## Verification Checklist

- [ ] Droplet firewall allows only SSH, HTTP, HTTPS
- [ ] .NET runtime is installed and accessible
- [ ] Nginx reverse proxy is configured and running
- [ ] SSL certificate is valid and auto-renewing
- [ ] Systemd service starts portfolio-api automatically
- [ ] Database exists at `/var/lib/portfolio/app.db` with seeded content
- [ ] API health endpoint returns `"status": "healthy"`
- [ ] API responds to `https://api.yourdomain.com/api/...`
- [ ] CORS headers are correctly set for your frontend domain
- [ ] Cloudflare Pages build uses correct API base URL
- [ ] Frontend loads and displays data without console errors
- [ ] SPA routing works (direct navigation to `/work`, `/projects`, `/about`)
- [ ] HTTPS works for both frontend and API (no mixed content warnings)

---

## Common Issues & Solutions

### API returns 503 Service Unavailable

**Solution:**

1. Check service status
2. Verify database file exists
3. If corrupted, redeploy the application (database will be recreated and seeded)

**Cause:** Service is stopped or database is inaccessible

### CORS errors in browser console

**Cause:** Frontend origin not in CORS allowed list

**Solution:**

1. Check `appsettings.Production.json` CORS origins
2. Ensure you're using the exact domain (with `https://`)
3. Restart the service: `sudo systemctl restart portfolio-api`
4. Check Nginx is proxying headers correctly

### Frontend shows "api.yourdomain.com" in console (debugging)

**Cause:** Vite environment variable not set correctly

**Solution:**

1. Go to Cloudflare Pages → Settings → Environment variables
2. Verify `VITE_API_BASE_URL = https://api.yourdomain.com`
3. Redeploy the Pages project: Go to Deployments → Retry latest build

### Certificate issues

**Cause:** Certbot failed to renew

**Solution:**

```bash
# Test renewal manually
sudo certbot renew --dry-run

# If it fails, check Nginx is running
sudo systemctl status nginx

# View Certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

---

## Next Steps & Maintenance

- **Uptime monitoring**: Set up a monitoring tool (e.g., Uptime Robot) to ping `/api/health` every 5 minutes
- **Log analysis**: Periodically review Nginx and service logs for errors or unusual activity
- **Backup verification**: Monthly, manually test restoring a backup to ensure recovery works
- **Updates**: Monitor .NET security updates and apply them
- **Scaling**: If traffic grows, consider:
  - Caching responses with Nginx or Cloudflare
  - Migrating to PostgreSQL for better performance
  - Adding a CDN for static assets (Cloudflare already does this for Pages)

Congratulations! Your portfolio is now production-ready on Cloudflare + DigitalOcean.
