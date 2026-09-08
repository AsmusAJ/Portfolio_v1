import { useEffect, useState } from "react";
import { projectToPortfolioItem, type Project } from "../types/portfolio";
import { fetchProjects as loadProjects } from "../api";
import CardContainer from "../components/CardsContainer";

export function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAndLoadProjects() {
            try {
                const data = await loadProjects();
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

        fetchAndLoadProjects();
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
