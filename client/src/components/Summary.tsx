import { useEffect, useState } from "react";
import Card from "./Card";
import "./Summary.css";

export default function Summary() {
    type Project = {
        id: number;
        title: string;
        description: string;
    };
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

    if (loading) {
        return <p>Loading projects...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <section>
            <h1>At a Glance</h1>
            <div className="card-box">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        title={project.title}
                        description={project.description}
                    />
                ))}
            </div>
        </section>
    );
}
