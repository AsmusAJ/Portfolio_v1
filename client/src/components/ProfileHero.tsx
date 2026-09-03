import "./ProfileHero.css";
import headshot from "../assets/headshot.jpg";
import SocialLinks from "./SocialLinks";

export default function ProfileHero() {
    return (
        <section className="hero-container">
            <img src={headshot} alt="Profile" className="profile-image" />
            <div className="profile-content">
                <h1>Anthony Asmus</h1>
                <h3>Software Engineer @ UofM</h3>
                <p>
                    Driven by a passion for building systems and solving complex problems, I bring projects to life at the intersection of software engineering and creative execution.
                </p>
                <SocialLinks />
            </div>
        </section>
    );
}
