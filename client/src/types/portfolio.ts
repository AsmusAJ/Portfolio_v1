export type Experience = {
    id: number;
    title: string;
    company: string;
    description: string;
    companyUrl: string;
    tags: string[];
};

export type PortfolioItem = {
    id: number;
    title: string;
    subtitle?: string;
    description: string;
    link: string;
    tags?: string[];
};

export type Project = {
    id: number;
    title: string;
    description: string;
    url: string;
    tags: string[];
};

export function experienceToPortfolioItem(exp: Experience): PortfolioItem {
    return {
        id: exp.id,
        title: exp.title,
        subtitle: exp.company,
        description: exp.description,
        link: exp.companyUrl,
        tags: exp.tags,
    };
}

export function projectToPortfolioItem(project: Project): PortfolioItem {
    return {
        id: project.id,
        title: project.title,
        description: project.description,
        link: project.url,
        tags: project.tags,
    };
}
