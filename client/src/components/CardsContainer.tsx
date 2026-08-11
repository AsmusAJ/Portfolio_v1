import Card from "./Card";
import "./CardsContainer.css";

export interface PortfolioItem {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    link: string;
    tags?: string[];
}

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
