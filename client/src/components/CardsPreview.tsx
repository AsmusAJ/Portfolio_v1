export default function CardPreview() {
    return (
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
    );
}
