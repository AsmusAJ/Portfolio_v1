import "./Card.css";

type CardProps = {
    title: string;
    subtitle: string;
    description: string;
};

export default function Card({ title, subtitle, description }: CardProps) {
    return (
        <article className="card">
            <h3 className="heading-strong" style={{ marginTop: 0 }}>
                {title}
            </h3>
            <h4>{subtitle}</h4>
            <p>{description}</p>
            <ul className="bottom-tags">
                <li>React</li>
                <li>TypeScript</li>
                <li>Node.js</li>
            </ul>
        </article>
    );
}
