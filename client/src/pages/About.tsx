import openMic from "../assets/openMic.png";
import "./About.css";
import SocialLinks from "../components/SocialLinks";

export function About() {
    return (
        <div className="shared-header">
            <h1>About Me</h1>
            <img className="about-image" src={openMic} alt="Open mic" />
            <p>Image: Photo of Evelyne Lee (<a href="https://evelynelee.com" target="_blank" rel="noopener noreferrer">evelynelee.com</a>) and I at an open mic.</p>
            <h2>My Background</h2>
            <p> 
                Hey, thanks for checking out my portfolio! My name is Anthony Asmus, but most people call me AJ.  
                I'm passionate about creating systems and solutions.  Whether in programming or in music, I love to to make projects come to life.
            </p>
            <p>
                I'm currently a senior at the University of Michigan but I have previously held internships at KCF Technologies and Howmet Aerospace.  Currently, I am looking to 
                expand my experience and knowledge in full-stack web development.
            </p>
            <p>Feel free to reach out and say hello using one of the below resources!</p>
            <SocialLinks />
        </div>
    );
}