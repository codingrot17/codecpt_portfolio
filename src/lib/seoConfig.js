/**
 * SEO Configuration — one place to define every page's meta.
 * Import this in your useSEO hook (see useSEO.js).
 *
 * Replace the BASE_URL if you move to a custom domain.
 * Fill in YOUR_GITHUB, YOUR_LINKEDIN, YOUR_TWITTER with real handles.
 */

const BASE_URL = "https://ademola-portfolio.vercel.app";

// OG image: host a 1200×630 screenshot or graphic at /og-image.png
// (see the guide for how to create one)
const OG_IMAGE = `${BASE_URL}/og-image.png`;

export const SEO_DEFAULTS = {
    baseUrl: BASE_URL,
    ogImage: OG_IMAGE,
    // Fill these in — they power the Person schema sameAs array
    socials: {
        github: "https://github.com/codingrot17",
        linkedin: "https://www.linkedin.com/in/emmanuel-ademola-b834b6290",
        twitter: "https://x.com/codingrot001"
    }
};

/**
 * Per-page SEO. Each key is the route path.
 * title: shown in browser tab + Google results (50-60 chars ideal)
 * description: shown under the title in Google (150-160 chars ideal)
 * keywords: optional, supplements the global set
 * canonical: defaults to baseUrl + route; override only if needed
 */
export const PAGE_SEO = {
    "/": {
        title: "Ademola Emmanuel Ayomide | Full-Stack Developer",
        description:
            "Hi, I'm Ademola — a full-stack developer building modern web and mobile applications with React, Next.js, Node.js, and Laravel. Browse my projects, tech stack, and blog."
    },
    "/about": {
        title: "About Me | Ademola Emmanuel Ayomide",
        description:
            "Learn about Ademola's background, experience, and passion for building clean, scalable web and mobile applications. Full-stack developer based in Nigeria."
    },
    "/projects": {
        title: "Projects | Ademola Emmanuel Ayomide",
        description:
            "Explore Ademola's portfolio of full-stack web and mobile projects — built with React, Next.js, Node.js, Laravel, and more. Live demos and source code included."
    },
    "/tech": {
        title: "Tech Stack | Ademola Emmanuel Ayomide",
        description:
            "A breakdown of the technologies Ademola works with daily — from React and Next.js on the frontend to Node.js, Laravel, and cloud platforms on the backend."
    },
    "/blog": {
        title: "Blog | Ademola Emmanuel Ayomide",
        description:
            "Ademola's blog — tutorials, deep dives, and lessons learned while building full-stack applications with React, Node.js, Laravel, and more."
    },
    "/contact": {
        title: "Contact | Ademola Emmanuel Ayomide",
        description:
            "Get in touch with Ademola. Open to freelance projects, collaborations, and full-time roles. Send a message or connect on GitHub and LinkedIn."
    }
};
