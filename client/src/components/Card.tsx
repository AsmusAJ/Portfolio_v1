import "./Card.css";

type CardProps = {
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
};

export default function Card({
    title,
    subtitle,
    description,
    tags,
}: CardProps) {
    return (
        <article className="card">
            <h3 className="heading-strong" style={{ marginTop: 0 }}>
                {title}
            </h3>
            <h4>{subtitle}</h4>
            <p>{description}</p>
            <ul className="bottom-tags">
                {tags.map((tag, index) => (
                    <li key={index}>
                        <Tag text={tag} />
                    </li>
                ))}
            </ul>
        </article>
    );
}

function Tag({ text }: { text: string }) {
    return <p>{text}</p>;
}
