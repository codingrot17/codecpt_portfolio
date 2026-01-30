import { Client, Account, ID } from "appwrite";

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);

export const authService = {
    // Create new account (sign up)
    async createAccount(email, password, name) {
        try {
            const response = await account.create(
                ID.unique(),
                email,
                password,
                name
            );
            console.log("Account created:", response);
            return response;
        } catch (error) {
            console.error("Error creating account:", error);
            throw error;
        }
    },

    // Login with email and password
    async login(email, password) {
        try {
            const session = await account.createEmailPasswordSession(
                email,
                password
            );
            console.log("Login successful:", session);
            return session;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const user = await account.get();
            return user;
        } catch (error) {
            // User not logged in
            return null;
        }
    },

    // Logout
    async logout() {
        try {
            await account.deleteSession("current");
            console.log("Logout successful");
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    },

    // Check if user is logged in
    async isAuthenticated() {
        try {
            await account.get();
            return true;
        } catch (error) {
            return false;
        }
    },

    // Get all sessions
    async getSessions() {
        try {
            const sessions = await account.listSessions();
            return sessions;
        } catch (error) {
            console.error("Error getting sessions:", error);
            throw error;
        }
    },

    // Delete all sessions (logout from all devices)
    async logoutAll() {
        try {
            await account.deleteSessions();
            console.log("Logged out from all devices");
        } catch (error) {
            console.error("Error logging out from all devices:", error);
            throw error;
        }
    }
};

export { account };
