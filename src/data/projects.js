export const ALL_PROJECTS = [
    {
        id: "01",
        slug: "flashpark",
        type: 'personal',
        name: "FlashPark",
        cat: "web application",
        stack: "Next.js / PostgreSQL",
        color: "#ff003c",
        year: "2025",
        role: "fullstack developer",
        duration: "2 weeks",
        status: "finished",
        image: "/images/works/web/flashpark/page1.png",
        images: [
            "/images/works/web/flashpark/page1.png",
            "/images/works/web/flashpark/page2.png",
            "/images/works/web/flashpark/page3.png",
        ],
        desc: "a smart parking management system featuring real-time iot monitoring, admin dashboard, and automated slot reservation with mqtt communication protocol.",
        features: [],
        tools: ["Next.js", "React", "PostgreSQL", "Prisma", "Vanilla CSS", "Recharts", "jsPDF"],
        link: "#"
    },
    {
        id: "02",
        slug: "porsche-landing-page",
        type: 'personal',
        name: "Porsche Landing Page",
        cat: "web design",
        stack: "Figma",
        color: "#ff003c",
        year: "2025",
        role: "ui/ux designer",
        duration: "3 days",
        status: "finished",
        image: "/images/works/design/work1/page1.png",
        images: [
            "/images/works/design/work1/page1.png",
            "/images/works/design/work1/page2.png",
            "/images/works/design/work1/page3.png",
            "/images/works/design/work1/page4.png",
            "/images/works/design/work1/page5.png",
        ],
        desc: "a high-fidelity landing page concept for porsche, crafted in figma with a focus on premium typography, bold visual hierarchy, and an immersive automotive experience.",
        features: [],
        tools: ["Figma"],
        link: "#"
    },
    {
        id: "03",
        slug: "aquanime",
        type: 'freelance',
        name: "Aquanime",
        cat: "web application",
        stack: "Next.js / Tailwind CSS",
        color: "#ff003c",
        year: "2025",
        role: "frontend developer",
        duration: "1 week",
        status: "finished",
        image: "/images/works/web/aquanime/page1.png",
        images: [
            "/images/works/web/aquanime/page1.png",
            "/images/works/web/aquanime/page2.png",
            "/images/works/web/aquanime/page3.png",
            "/images/works/web/aquanime/page7.png",
            "/images/works/web/aquanime/page8.png",
        ],
        desc: "a community-driven anime platform built as a freelance project, featuring a vibrant sky-themed design with dark mode support, project showcases, and social media integration.",
        features: [],
        tools: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        link: "#"
    },
];

export function getProjectBySlug(slug) {
    return ALL_PROJECTS.find(p => p.slug === slug) || null;
}

export function getProjectById(id) {
    return ALL_PROJECTS.find(p => p.id === id) || null;
}
