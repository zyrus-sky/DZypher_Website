export interface TeamMember {
    name: string;
    role: string;
    category: 'Faculty' | 'Core'; // Added category
    image?: string;
    socials?: {
        linkedin?: string;
        github?: string;
    };
}

export interface GalleryItem {
    src: string;
    alt: string;
    size: 'small' | 'medium' | 'large';
}

export interface CountdownItem {
    title: string;
    date: string;
}

export interface Event {
    title: string;
    date: string;
    description: string;
    link?: string;
    image?: string;
    type: 'workshop' | 'program' | 'other';
    registration_status?: 'OPEN' | 'CLOSED';
    registration_link?: string;
}

export const FACULTY_COORDINATORS: TeamMember[] = [
    {
        name: "SAGARA M R",
        role: "Faculty Advisor",
        category: "Faculty",
        image: "/assets/placeholder-faculty.jpg" // Placeholder
    }
];

export const CORE_TEAM: TeamMember[] = [
    {
        name: "Student Name",
        role: "President",
        category: "Core"
    },
    {
        name: "Student Name",
        role: "Vice President",
        category: "Core"
    }
];

export const EVENTS: Event[] = [
    {
        title: "GIT GRINDING",
        date: "2026-01-23",
        description: "Master GitHub Desktop and AI-assisted workflows in this hands-on workshop.",
        type: "workshop",
        registration_status: "OPEN",
        registration_link: "https://app.makemypass.com/event/git-grinding"
    },
    {
        title: "FANFICX",
        date: "2026-01-24",
        description: "AI-assisted Fanfiction writing competition. Upload to AO3!",
        type: "program",
        registration_status: "OPEN",
        registration_link: "https://app.makemypass.com/event/fanficx"
    },
    {
        title: "LAN PARTY",
        date: "2026-01-24",
        description: "Mobile and PC Gaming challenges.",
        type: "program",
        registration_status: "CLOSED",
        registration_link: "#"
    }
];


export const SOCIALS = {
    discord: "https://discord.gg/example",
    whatsapp: "https://chat.whatsapp.com/example",
    linkedin: "https://linkedin.com/company/example",
    instagram: "https://instagram.com/example",
    github: "https://github.com/example",
};

export interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    icon: string; // FontAwesome class
    resources: {
        title: string;
        link: string;
        registration_status?: 'OPEN' | 'CLOSED';
        registration_link?: string;
    }[];
}

export const DS_ROADMAP: RoadmapItem[] = [
    {
        id: "yukthi-26",
        title: "Yukthi'26 Tech Fest",
        description: "Jan 23 & 24 - A massive tech fest featuring workshops and competitions.",
        icon: "fas fa-laptop-code",
        resources: [
            {
                title: "GIT GRINDING (GitHub + AI Workshop)",
                link: "#",
                registration_status: "OPEN",
                registration_link: "https://app.makemypass.com/event/git-grinding"
            },
            {
                title: "FANFICX (AI Fanfic Competition)",
                link: "#",
                registration_status: "OPEN",
                registration_link: "https://app.makemypass.com/event/fanficx"
            },
            {
                title: "LAN PARTY (Mobile/PC Gaming)",
                link: "#",
                registration_status: "CLOSED"
            }
        ]
    },
    {
        id: "vortix-26",
        title: "VORTIX'26 (by DZypher)",
        description: "Feb 20 & 21 - Our flagship event with Datathons, workshops, and parties.",
        icon: "fas fa-meteor",
        resources: [
            { title: "Grand Datathon", link: "#" },
            { title: "20+ Technical Workshops", link: "#" },
            { title: "Campfire & DJ Form Party", link: "#" }
        ]
    }
];

export interface Resource {
    title: string;
    category: 'Python' | 'Mathematics' | 'Machine Learning' | 'Deep Learning' | 'Other';
    description: string;
    link: string; // URL to PDF or resource
    size?: string;
}

export const RESOURCES: Resource[] = [
    {
        title: "Python 3 Cheat Sheet",
        category: "Python",
        description: "Comprehensive guide to Python syntax, data types, and common functions.",
        link: "#",
        size: "2.5 MB"
    },
    {
        title: "NumPy & Pandas Basics",
        category: "Python",
        description: "Quick reference for data manipulation and analysis libraries.",
        link: "#",
        size: "1.8 MB"
    },
    {
        title: "Linear Algebra Rules",
        category: "Mathematics",
        description: "Essential matrix operations and vector calculus rules for ML.",
        link: "#",
        size: "1.2 MB"
    },
    {
        title: "Probability & Stats",
        category: "Mathematics",
        description: "Key statistical concepts and probability distributions.",
        link: "#",
        size: "3.0 MB"
    },
    {
        title: "Scikit-Learn Map",
        category: "Machine Learning",
        description: "Flowchart for choosing the right estimator for your problem.",
        link: "#",
        size: "0.5 MB"
    },
    {
        title: "Neural Network Architectures",
        category: "Deep Learning",
        description: "Visual guide to CNNs, RNNs, Transformers, and GANs.",
        link: "#",
        size: "4.2 MB"
    }
];

export interface Project {
    title: string;
    student: string;
    description: string;
    image: string;
    techStack: string[];
    link?: string;
    github?: string;
    category?: 'Code' | 'Design' | 'Art' | 'Event' | 'Other';
}

export const PROJECTS: Project[] = [
    {
        title: "AI Traffic Control",
        student: "Team Neural",
        description: "Adaptive traffic signal timing using computer vision and reinforcement learning.",
        image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=600",
        techStack: ["Python", "YOLOv8", "PyTorch", "Raspberry Pi"],
        github: "#",
        category: "Code"
    },
    {
        title: "DZypher Website",
        student: "Web Team",
        description: "The official platform for our association, built with modern web tech.",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600",
        techStack: ["SvelteKit", "TailwindCSS", "TypeScript"],
        github: "#",
        category: "Code"
    },
    {
        title: "Sentiment Analyzer",
        student: "Data Guys",
        description: "Real-time Twitter sentiment analysis dashboard for brand monitoring.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
        techStack: ["Python", "NLTK", "Flask", "React"],
        github: "#",
        category: "Code"
    }
];
