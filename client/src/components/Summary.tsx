import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import "./Summary.css";
import CardContainer from "./CardsContainer";
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
        async function fetchWorkExperience() {
            try {
                const response = await fetch(
                    "http://localhost:5087/api/top-work-experiences"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch work experience");
                }

                const data = await response.json();
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

        fetchWorkExperience();
    }, []);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch(
                    "http://localhost:5087/api/top-projects"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }

                const data = await response.json();
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

        fetchProjects();
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
