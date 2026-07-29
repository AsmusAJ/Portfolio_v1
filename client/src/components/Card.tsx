import "./Card.css";

export default function Card({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <article className="card">
            <h2 style={{ marginTop: 0 }}>{title}</h2>
            <h3>Card Subtitle</h3>
            <p>{description}</p>
            <ul className="bottom-tags">
                <li>React</li>
                <li>TypeScript</li>
                <li>Node.js</li>
            </ul>
        </article>
    );
}
