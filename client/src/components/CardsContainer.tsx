import Card from "./Card";
import "./CardsContainer.css";
import type { PortfolioItem } from "../types/portfolio";

type CardContainerProps = {
    PortfolioItems: PortfolioItem[];
};

export default function CardContainer({ PortfolioItems }: CardContainerProps) {
    return (
        <div className="card-box">
            {PortfolioItems.map((item) => (
                <Card
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    description={item.description}
                    link={item.link}
                    tags={item.tags}
                />
            ))}
        </div>
    );
}
