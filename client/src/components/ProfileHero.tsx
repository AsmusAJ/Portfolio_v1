import "./ProfileHero.css";
import headshot from "../assets/headshot.jpg";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function ProfileHero() {
    return (
        <section className="hero-container">
            <img src={headshot} alt="Profile" className="profile-image" />
            <div className="profile-content">
                <h1>Anthony Asmus</h1>
                <h3>Software Engineer @ UofM</h3>
                <p>
                    My passion is to create full-stack web applications that are
                    functional, scalable, and engaging. I'm passionate about
                    using code as both a problem-solving tool and a creative
                    medium.
                </p>
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
                        href="mailto:anthonyasmus@gmail.com"
                        aria-label="Email"
                        className="profile-link"
                    >
                        <FaEnvelope />
                    </a>
                </div>
            </div>
        </section>
    );
}
