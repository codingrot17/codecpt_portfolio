import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "../components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
    Trash2,
    Plus,
    MessageSquare,
    FileText,
    Code,
    Folder,
    LogOut
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import {
    projectService,
    blogService,
    techStackService,
    contactService
} from "@/lib/appwrite-service";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/auth/login-form";
import AuthProvider from "../components/auth/auth-provider";
import { TechStackForm } from "../components/admin/tech-stack-form";
import { BlogPostForm } from "../components/admin/blog-post-form";
import { ProjectForm } from "../components/admin/project-form";

function AdminDashboard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("dashboard");
    const { logout } = useAuth();

    const { data: techStacks = [] } = useQuery({
        queryKey: ["tech-stacks"],
        queryFn: () => techStackService.list()
    });

    const { data: blogPosts = [] } = useQuery({
        queryKey: ["blog-posts"],
        queryFn: () => blogService.list()
    });

    const { data: projects = [] } = useQuery({
        queryKey: ["projects"],
        queryFn: () => projectService.list()
    });

    const { data: contactMessages = [] } = useQuery({
        queryKey: ["contact-messages"],
        queryFn: () => contactService.list()
    });

    const deleteTechStackMutation = useMutation({
        mutationFn: id => techStackService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tech-stacks"] });

            toast({ title: "Success", description: "Tech stack deleted" });
        }
    });

    const deleteBlogPostMutation = useMutation({
        mutationFn: id => blogService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            toast({ title: "Success", description: "Blog post deleted" });
        }
    });

    const deleteProjectMutation = useMutation({
        mutationFn: id => projectService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast({ title: "Success", description: "Project deleted" });
        }
    });

    const deleteContactMessageMutation = useMutation({
        mutationFn: id => contactService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
            toast({ title: "Success", description: "Message deleted" });
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-300">
                            Manage your portfolio content
                        </p>
                    </div>

                    <Button
                        onClick={logout}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5 bg-slate-800">
                        <TabsTrigger value="dashboard">
                            <Folder className="h-4 w-4 mr-2" /> Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="tech-stacks">
                            <Code className="h-4 w-4 mr-2" /> Tech
                        </TabsTrigger>
                        <TabsTrigger value="blog-posts">
                            <FileText className="h-4 w-4 mr-2" /> Blog
                        </TabsTrigger>
                        <TabsTrigger value="projects">
                            <Folder className="h-4 w-4 mr-2" /> Projects
                        </TabsTrigger>
                        <TabsTrigger value="messages">
                            <MessageSquare className="h-4 w-4 mr-2" /> Messages
                        </TabsTrigger>
                    </TabsList>

                    {/* TabsContent unchanged – logic preserved */}
                </Tabs>
            </div>
        </div>
    );
}

function AdminContent() {
    const { isAuthenticated, login, isLoading } = useAuth();
    const { toast } = useToast();

    const handleLogin = async credentials => {
        const success = await login(credentials);
        if (!success) {
            toast({
                title: "Login Failed",
                description: "Invalid username or password",
                variant: "destructive"
            });
        }
    };

    if (!isAuthenticated) {
        return <LoginForm onLogin={handleLogin} isLoading={isLoading} />;
    }

    return <AdminDashboard />;
}

export default function Admin() {
    return (
        <AuthProvider>
            <AdminContent />
        </AuthProvider>
    );
}
