# Portfolio

A full-stack portfolio application showcasing work experience, projects, and technical skills. Built with modern technologies and deployed for production use.

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite
- Responsive CSS with custom styling

**Backend:**
- ASP.NET Core 8
- Entity Framework Core for data access
- RESTful API architecture

**Infrastructure:**
- SQLite database
- Nginx reverse proxy
- DigitalOcean deployment with TLS

## Project Structure

```
client/          # React TypeScript frontend
server/          # .NET Core API backend
scripts/         # Deployment automation
```

## Getting Started

### Prerequisites
- Node.js 18+ (frontend)
- .NET 8 SDK (backend)

### Development Setup

**Frontend:**
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`

**Backend:**
```bash
cd server
dotnet run
```
Runs on `http://localhost:5087`

The frontend is configured to proxy API requests to the backend.

## Features

- **Responsive Design** — Optimized for desktop, tablet, and mobile
- **Dynamic Content** — Portfolio data served from REST API
- **Database Seeding** — Automatic initialization with sample data
- **Type Safety** — Full TypeScript coverage on frontend and C# on backend
- **Production Ready** — Configured for secure deployment

## Build & Deployment

Frontend builds optimize assets for production:
```bash
cd client
npm run build
```

Backend publishes with self-contained runtime:
```bash
cd server
dotnet publish -c Release
```


## Development Notes

- The API uses CORS configuration for local development
- Database is automatically seeded on first run if empty
- Client routes are configured for SPA routing with Vite