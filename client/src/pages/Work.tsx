import { useEffect, useState } from "react";
import type { Experience } from "../types/portfolio";
import { experienceToPortfolioItem } from "../types/portfolio";
import { fetchWorkExperiences } from "../api";
import CardContainer from "../components/CardsContainer";

export function Work() {
    const [workExperience, setWorkExperience] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadWorkExperience() {
            try {
                const data = await fetchWorkExperiences();
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

    if (error) {
        return <p>Error: {error}</p>;
    }

    const experienceItems = workExperience.map(experienceToPortfolioItem);

    return (
        <div>
            <div className="shared-header">
                <h1>Work</h1>
                <p>
                    What I've built, where I've contributed, and what I've
                    learned.
                </p>
            </div>
            {loading ? (
                <p>Loading work experience...</p>
            ) : (
                <CardContainer PortfolioItems={experienceItems} />
            )}
        </div>
    );
}
