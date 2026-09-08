import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import "./Summary.css";
import CardContainer from "./CardsContainer";
import { fetchTopWorkExperiences, fetchTopProjects } from "../api";
import type { Experience, Project } from "../types/portfolio";
import {
    experienceToPortfolioItem,
    projectToPortfolioItem,
} from "../types/portfolio";

export default function Summary() {
    const [workExperience, setWorkExperience] = useState<Experience[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadWorkExperience() {
            try {
                const data = await fetchTopWorkExperiences();
                setWorkExperience(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        }

        loadWorkExperience();
    }, []);

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await fetchTopProjects();
                setProjects(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        }

        loadProjects();
    }, []);

    if (loading) {
        return <p>Loading experience...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const experienceItems = workExperience.map(experienceToPortfolioItem);
    const projectItems = projects.map(projectToPortfolioItem);

    return (
        <section>
            <h2 className="heading-strong">At a Glance</h2>
            <div className="summary-box">
                <div className="header-box">
                    <h3>Work Experience</h3>
                    <NavLink to="/work">
                        <h3>View All Experience</h3>
                        <FaExternalLinkAlt />
                    </NavLink>
                </div>
                <CardContainer PortfolioItems={experienceItems} />
            </div>
            <div className="summary-box">
                <div className="header-box">
                    <h3>Projects</h3>
                    <NavLink to="/projects">
                        <h3>View All Projects</h3>
                        <FaExternalLinkAlt />
                    </NavLink>
                </div>
                <CardContainer PortfolioItems={projectItems} />
            </div>
        </section>
    );
}
