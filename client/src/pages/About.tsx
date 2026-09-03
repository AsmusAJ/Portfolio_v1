import openMic from "../assets/openMic.png";
import "./About.css";

export function About() {
    return (
        <div className="shared-header">
            <h1>About Me</h1>
            <img className="about-image" src={openMic} alt="Open mic" />
            <p>Image: photo of me and Evelyne Lee (<a href="https://evelynelee.com" target="_blank" rel="noopener noreferrer">evelynelee.com</a>) at an open mic.</p>
        </div>
    );
}