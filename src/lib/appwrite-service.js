import { Client, Databases, ID, Query } from "appwrite";

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const COLLECTIONS = {
    PROJECTS: "projects",
    BLOG_POSTS: "blog_posts",
    TECH_STACKS: "tech_stacks",
    CONTACT_MESSAGES: "contact_messages"
};

// ==================== PROJECTS ====================
export const projectService = {
    async list() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.PROJECTS,
                [Query.orderDesc("$createdAt")]
            );
            return response.documents;
        } catch (error) {
            console.error("Error listing projects:", error);
            throw error;
        }
    },

    async get(id) {
        try {
            return await databases.getDocument(
                DATABASE_ID,
                COLLECTIONS.PROJECTS,
                id
            );
        } catch (error) {
            console.error("Error getting project:", error);
            throw error;
        }
    },

    async create(data) {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.PROJECTS,
                ID.unique(),
                {
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    technologies: data.technologies || [],
                    features: data.features || [],
                    liveUrl: data.liveUrl || "",
                    githubUrl: data.githubUrl || "",
                    imageUrl: data.imageUrl || "",
                    featured: data.featured || false
                }
            );
        } catch (error) {
            console.error("Error creating project:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.PROJECTS,
                id,
                data
            );
        } catch (error) {
            console.error("Error updating project:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.PROJECTS,
                id
            );
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    }
};

// ==================== BLOG POSTS ====================
export const blogService = {
    async list() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.BLOG_POSTS,
                [Query.orderDesc("$createdAt")] // Use $createdAt instead of publishedAt
            );
            return response.documents;
        } catch (error) {
            console.error("Error listing blog posts:", error);
            throw error;
        }
    },

    async get(id) {
        try {
            return await databases.getDocument(
                DATABASE_ID,
                COLLECTIONS.BLOG_POSTS,
                id
            );
        } catch (error) {
            console.error("Error getting blog post:", error);
            throw error;
        }
    },

    async create(data) {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.BLOG_POSTS,
                ID.unique(),
                {
                    title: data.title,
                    slug:
                        data.slug ||
                        data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    excerpt: data.excerpt || "",
                    content: data.content,
                    category: data.category,
                    imageUrl: data.imageUrl || "",
                    featured: data.featured || false
                }
            );
        } catch (error) {
            console.error("Error creating blog post:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.BLOG_POSTS,
                id,
                data
            );
        } catch (error) {
            console.error("Error updating blog post:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.BLOG_POSTS,
                id
            );
        } catch (error) {
            console.error("Error deleting blog post:", error);
            throw error;
        }
    }
};

// ==================== TECH STACKS ====================
export const techStackService = {
    async list() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.TECH_STACKS,
                [Query.orderAsc("category")]
            );
            return response.documents;
        } catch (error) {
            console.error("Error listing tech stacks:", error);
            throw error;
        }
    },

    async get(id) {
        try {
            return await databases.getDocument(
                DATABASE_ID,
                COLLECTIONS.TECH_STACKS,
                id
            );
        } catch (error) {
            console.error("Error getting tech stack:", error);
            throw error;
        }
    },

    async create(data) {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.TECH_STACKS,
                ID.unique(),
                {
                    name: data.name,
                    icon: data.icon || "",
                    progress: data.progress || 0,
                    category: data.category,
                    color: data.color || "#4F46E5"
                }
            );
        } catch (error) {
            console.error("Error creating tech stack:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.TECH_STACKS,
                id,
                data
            );
        } catch (error) {
            console.error("Error updating tech stack:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.TECH_STACKS,
                id
            );
        } catch (error) {
            console.error("Error deleting tech stack:", error);
            throw error;
        }
    }
};

// ==================== CONTACT MESSAGES ====================
export const contactService = {
    async list() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.CONTACT_MESSAGES,
                [Query.orderDesc("$createdAt")] // Use $createdAt
            );
            return response.documents;
        } catch (error) {
            console.error("Error listing contact messages:", error);
            throw error;
        }
    },

    async create(data) {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.CONTACT_MESSAGES,
                ID.unique(),
                {
                    name: data.name,
                    email: data.email,
                    subject: data.subject || "",
                    message: data.message
                    // Appwrite automatically adds $createdAt
                }
            );
        } catch (error) {
            console.error("Error creating contact message:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.CONTACT_MESSAGES,
                id
            );
        } catch (error) {
            console.error("Error deleting contact message:", error);
            throw error;
        }
    }
};
