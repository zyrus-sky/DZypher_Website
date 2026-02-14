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
    discord: "https://discord.gg/mTZAm8bz",
    whatsapp: "https://chat.whatsapp.com/DC4KgEcvJjF8z94p7qWbkg?mode=gi_t",
    linkedin: "https://linkedin.com/company/example",
    instagram: "https://www.instagram.com/dzypher.stist?igsh=ZnJ4cW5xNDA4Mnln",
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
        resources: [ {
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
            }]
    },
    {
        id: "vortix-26",
        title: "VORTIX'26 (by DZypher)",
        description: "Feb 20 & 21 - Our flagship event with Datathons, workshops, and parties.",
        icon: "fas fa-meteor",
        resources: [
           
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
    // === Python ===
    {
        title: "Python 3 Cheat Sheet",
        category: "Python",
        description: "Comprehensive Python 3 quick reference — syntax, data types, string ops, list comprehensions, file I/O, and more.",
        link: "https://perso.limsi.fr/pointal/_media/python:cours:mementopython3-english.pdf",
        size: "PDF · 2 pages"
    },
    {
        title: "NumPy Cheat Sheet",
        category: "Python",
        description: "DataCamp's visual guide to NumPy: array creation, indexing, slicing, math ops, linear algebra, and broadcasting.",
        link: "https://images.datacamp.com/image/upload/v1676302459/Marketing/Blog/Numpy_Cheat_Sheet.pdf",
        size: "PDF · 1 page"
    },
    {
        title: "Pandas Cheat Sheet",
        category: "Python",
        description: "DataCamp's Pandas quick reference — DataFrames, selection, filtering, groupby, merging, reshaping, and time series.",
        link: "https://images.datacamp.com/image/upload/v1676302204/Marketing/Blog/Pandas_Cheat_Sheet.pdf",
        size: "PDF · 1 page"
    },
    {
        title: "Matplotlib Cheat Sheet",
        category: "Python",
        description: "DataCamp's guide to Matplotlib: figure anatomy, plot types, customization, subplots, and saving figures.",
        link: "https://images.datacamp.com/image/upload/v1676302533/Marketing/Blog/Matplotlib_Cheat_Sheet.pdf",
        size: "PDF · 1 page"
    },
    // === Mathematics ===
    {
        title: "Linear Algebra Review (Stanford CS229)",
        category: "Mathematics",
        description: "Stanford's concise linear algebra refresher for ML: vectors, matrices, eigenvalues, SVD, and matrix calculus.",
        link: "https://cs229.stanford.edu/section/cs229-linalg.pdf",
        size: "PDF · 30 pages"
    },
    {
        title: "Probability & Statistics Cheat Sheet",
        category: "Mathematics",
        description: "MIT-style probability reference: distributions, Bayes' theorem, expectation, variance, common PDFs and PMFs.",
        link: "https://static1.squarespace.com/static/54bf3241e4b0f0d81bf7ff36/t/55e9494fe4b011aed10e48e5/1441352015658/probability_cheatsheet.pdf",
        size: "PDF · 10 pages"
    },
    {
        title: "Calculus Rules for ML",
        category: "Mathematics",
        description: "Key derivative rules, gradient computation, chain rule, and multivariate calculus essentials for optimization.",
        link: "https://cs229.stanford.edu/section/cs229-calculus.pdf",
        size: "PDF · 5 pages"
    },
    // === Machine Learning ===
    {
        title: "Scikit-Learn Algorithm Cheat Sheet",
        category: "Machine Learning",
        description: "Official Scikit-Learn flowchart for choosing the right estimator: classification, regression, clustering, dimensionality reduction.",
        link: "https://scikit-learn.org/stable/_static/ml_map.png",
        size: "PNG · Flowchart"
    },
    {
        title: "Machine Learning Cheat Sheet (Stanford CS229)",
        category: "Machine Learning",
        description: "Covers supervised & unsupervised learning, SVMs, kernels, decision trees, ensemble methods, and evaluation metrics.",
        link: "https://stanford.edu/~shervine/teaching/cs-229/cheatsheet-supervised-learning",
        size: "Web · Multi-page"
    },
    {
        title: "Feature Engineering Techniques",
        category: "Machine Learning",
        description: "Practical guide to feature scaling, encoding, imputation, binning, polynomial features, and feature selection methods.",
        link: "https://images.datacamp.com/image/upload/v1688741085/Marketing/Blog/scikit-learn_cheat_sheet.pdf",
        size: "PDF · 1 page"
    },
    // === Deep Learning ===
    {
        title: "Neural Network Architectures Zoo",
        category: "Deep Learning",
        description: "Visual chart of every major neural network architecture: CNNs, RNNs, LSTMs, Transformers, GANs, Autoencoders, and more.",
        link: "https://www.asimovinstitute.org/wp-content/uploads/2019/04/NeuralNetworkZoo20042019.png",
        size: "PNG · Poster"
    },
    {
        title: "Deep Learning Cheat Sheet (Stanford CS230)",
        category: "Deep Learning",
        description: "Convolutional networks, recurrent networks, training tips, regularization, hyperparameter tuning, and optimization.",
        link: "https://stanford.edu/~shervine/teaching/cs-230/cheatsheet-convolutional-neural-networks",
        size: "Web · Multi-page"
    },
    {
        title: "PyTorch Cheat Sheet",
        category: "Deep Learning",
        description: "Official PyTorch quick start: tensors, autograd, nn.Module, DataLoader, training loops, GPU acceleration, and saving models.",
        link: "https://pytorch.org/tutorials/beginner/ptcheat.html",
        size: "Web · Tutorial"
    },
    // === Other ===
    {
        title: "Git & GitHub Cheat Sheet",
        category: "Other",
        description: "GitHub's official reference: init, clone, branch, merge, rebase, stash, log, diff, remote, and pull request workflows.",
        link: "https://education.github.com/git-cheat-sheet-education.pdf",
        size: "PDF · 2 pages"
    },
    {
        title: "SQL Cheat Sheet",
        category: "Other",
        description: "Essential SQL commands: SELECT, JOIN, GROUP BY, subqueries, window functions, indexing, and common patterns for data work.",
        link: "https://images.datacamp.com/image/upload/v1675360372/Marketing/Blog/SQL_Basics_For_Data_Science.pdf",
        size: "PDF · 1 page"
    },
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
