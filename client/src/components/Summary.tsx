import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import "./Summary.css";
import CardContainer from "./CardsContainer";

export default function Summary() {
    type Experience = {
        id: number;
        title: string;
        company: string;
        description: string;
        tags: string[];
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

    const portfolioItems = workExperience.map((exp) => ({
        id: exp.id,
        title: exp.title,
        subtitle: exp.company,
        description: exp.description,
        tags: exp.tags,
    }));

    return (
        <section>
            <h2 className="heading-strong">At a Glance</h2>
            <div>
                <div className="header-box">
                    <h3>Work Experience</h3>
                    <NavLink to="/work">
                        <h3 style={{ marginRight: "0" }}>
                            View All Experience
                        </h3>
                        <FaExternalLinkAlt />
                    </NavLink>
                </div>
                <CardContainer PortfolioItems={portfolioItems} />
            </div>
        </section>
    );
}
