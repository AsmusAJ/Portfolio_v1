import "./SocialLinks.css";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function SocialLinks() {
    return (
        <div className="profile-links">
            <a
                href="https://www.linkedin.com/in/anthonyasmus/"
                aria-label="LinkedIn"
                className="profile-link"
                target="_blank"
                rel="noreferrer"
            >
                <FaLinkedin />
            </a>
            <a
                href="https://github.com/AsmusAJ"
                aria-label="GitHub"
                className="profile-link"
                target="_blank"
                rel="noreferrer"
            >
                <FaGithub />
            </a>
            <a
                href="mailto:anthonyasmus+portfolio@gmail.com"
                aria-label="Email"
                className="profile-link"
            >
                <FaEnvelope />
            </a>
        </div>
    );
}
