import { useEffect, useState } from "react";
import { projectToPortfolioItem, type Project } from "../types/portfolio";
import CardContainer from "../components/CardsContainer";

export function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch(
                    "http://localhost:5087/api/projects"
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

    if (error) {
        return <p>Error: {error}</p>;
    }

    const projectItems = projects.map(projectToPortfolioItem);

    return (
        <div>
            <div className="shared-header">
                <h1>Projects</h1>
                <p>
                    What I've created, how I've built it, and the problems I've
                    solved.
                </p>
            </div>
            {loading ? (
                <p>Loading projects...</p>
            ) : (
                <CardContainer PortfolioItems={projectItems} />
            )}
        </div>
    );
}
