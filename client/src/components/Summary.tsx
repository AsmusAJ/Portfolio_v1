import { useEffect, useState } from "react";
import Card from "./Card";
import "./Summary.css";

export default function Summary() {
    interface PortfolioItem {
        id: number;
        title: string;
        subtitle: string;
        description: string;
    }

    type Experience = {
        id: number;
        title: string;
        company: string;
        description: string;
    };
    const [workExperience, setWorkExperience] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWorkExperience() {
            try {
                const response = await fetch(
                    "http://localhost:5087/api/work-experiences"
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

    if (loading) {
        return <p>Loading work experience...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <section>
            <h2 className="heading-strong">At a Glance</h2>
            <div className="card-box">
                {workExperience.map((experience) => (
                    <Card
                        key={experience.id}
                        title={experience.title}
                        subtitle={experience.company}
                        description={experience.description}
                    />
                ))}
            </div>
        </section>
    );
}
