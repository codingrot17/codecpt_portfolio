// Run this in your browser console or as a Node script to seed sample data
// Make sure you're logged into your Appwrite console first

import { projectService, blogService, techStackService } from './src/lib/appwrite-service';

// Sample Tech Stacks
const sampleTechStacks = [
    {
        name: "React",
        icon:
        "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
        progress: 90,
        category: "frontend",
        color: "bg-blue-500/20",
        documentationUrl: "https://react.dev"
    },
    {
        name: "Node.js",
        icon: "🟢",
        progress: 85,
        category: "backend",
        color: "bg-green-500/20",
        documentationUrl: "https://nodejs.org"
    },
    {
        name: "MongoDB",
        icon: "🍃",
        progress: 80,
        category: "database",
        color: "bg-green-500/20",
        documentationUrl: "https://mongodb.com"
    },
    {
        name: "Tailwind CSS",
        icon: "🎨",
        progress: 95,
        category: "frontend",
        color: "bg-blue-500/20",
        documentationUrl: "https://tailwindcss.com"
    }
];

// Sample Projects
const sampleProjects = [
    {
        title: "E-Commerce Platform",
        description: "A full-featured e-commerce platform with cart, payment integration, and admin dashboard",
        category: "web-development",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        features: [
            "User authentication and authorization",
            "Product catalog with search and filters",
            "Shopping cart and checkout",
            "Payment integration with Stripe",
            "Admin dashboard for managing products"
        ],
        liveUrl: "https://example-ecommerce.com",
        githubUrl: "https://github.com/yourusername/ecommerce",
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
        featured: true
    },
    {
        title: "Task Management App",
        description: "A collaborative task management application with real-time updates",
        category: "web-development",
        technologies: ["Next.js", "Firebase", "Tailwind CSS"],
        features: [
            "Real-time collaboration",
            "Task boards and lists",
            "Team management",
            "File attachments",
            "Activity tracking"
        ],
        liveUrl: "https://example-tasks.com",
        githubUrl: "https://github.com/yourusername/tasks",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
        featured: false
    }
];

// Sample Blog Posts
const sampleBlogPosts = [
    {
        title: "Getting Started with React Hooks",
        slug: "getting-started-with-react-hooks",
        excerpt: "Learn how to use React Hooks to build modern, functional components with state and side effects.",
        content: `# Getting Started with React Hooks

React Hooks revolutionized the way we write React components. In this post, we'll explore the most commonly used hooks and how to leverage them in your applications.

## useState Hook

The useState hook allows you to add state to functional components:

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect Hook

Handle side effects in your components with useEffect:

\`\`\`javascript
useEffect(() => {
  // Your side effect here
  return () => {
    // Cleanup function
  };
}, [dependencies]);
\`\`\`

Hooks make your code more reusable and easier to understand. Start using them today!`,
        category: "web-development",
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        featured: true
    },
    {
        title: "Building REST APIs with Node.js",
        slug: "building-rest-apis-with-nodejs",
        excerpt: "A comprehensive guide to creating scalable and secure REST APIs using Node.js and Express.",
        content: `# Building REST APIs with Node.js

Node.js is perfect for building fast and scalable APIs. Let's explore best practices.

## Setting Up Express

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());
\`\`\`

## Creating Routes

Define your API endpoints:

\`\`\`javascript
app.get('/api/users', async (req, res) => {
  // Get users logic
});
\`\`\`

Follow RESTful conventions and you'll have a maintainable API!`,
        category: "programming",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
        featured: false
    }
];

// Seed function
export async function seedDatabase() {
    console.log("🌱 Starting database seed...");

    try {
        // Seed Tech Stacks
        console.log("📚 Seeding tech stacks...");
        for (const tech of sampleTechStacks) {
            await techStackService.create(tech);
            console.log(`✅ Created: ${tech.name}`);
        }

        // Seed Projects
        console.log("🚀 Seeding projects...");
        for (const project of sampleProjects) {
            await projectService.create(project);
            console.log(`✅ Created: ${project.title}`);
        }

        // Seed Blog Posts
        console.log("📝 Seeding blog posts...");
        for (const post of sampleBlogPosts) {
            await blogService.create(post);
            console.log(`✅ Created: ${post.title}`);
        }

        console.log("🎉 Database seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    }
}

// Uncomment to run:
// seedDatabase();