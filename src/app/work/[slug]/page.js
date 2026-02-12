import { ALL_PROJECTS } from '@/data/projects';
import ProjectDetailPage from '@/components/pages/work/detail';

export async function generateStaticParams() {
    return ALL_PROJECTS.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const project = ALL_PROJECTS.find(p => p.slug === slug);
    return {
        title: project ? `nazca // ${project.name}` : 'nazca // project',
        description: project?.desc || 'Project detail page',
    };
}

export default async function Page({ params }) {
    const { slug } = await params;
    const project = ALL_PROJECTS.find(p => p.slug === slug);

    if (!project) {
        return <div>Project not found</div>;
    }

    return <ProjectDetailPage project={project} />;
}
