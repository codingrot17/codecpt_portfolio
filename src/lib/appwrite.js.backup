import { Client, Databases, Account } from "appwrite";

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Or your self-hosted URL
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Get from Appwrite Console

export const databases = new Databases(client);
export const account = new Account(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTIONS = {
    PROJECTS: "projects",
    BLOG: "blog_posts",
    SKILLS: "skills"
};
