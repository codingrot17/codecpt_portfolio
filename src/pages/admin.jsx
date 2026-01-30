import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Trash2,
    MessageSquare,
    FileText,
    Code,
    Folder,
    LogOut,
    LayoutDashboard,
    Tag,
    TrendingUp,
    Star,
    ExternalLink,
    Github,
    Calendar,
    User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    projectService,
    blogService,
    techStackService,
    contactService
} from "@/lib/appwrite-service";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/login-form";
import AuthProvider from "@/components/auth/auth-provider";
import { TechStackForm } from "@/components/admin/tech-stack-form";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { ProjectForm } from "@/components/admin/project-form";
import CategoryManager from "@/components/admin/category-manager";

function AdminDashboard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("dashboard");
    const { logout, user } = useAuth();

    // Fetch all data
    const { data: techStacks = [], isLoading: techLoading } = useQuery({
        queryKey: ["tech-stacks"],
        queryFn: async () => {
            const data = await techStackService.list();
            return data.documents || data;
        }
    });

    const { data: blogPosts = [], isLoading: blogLoading } = useQuery({
        queryKey: ["blog-posts"],
        queryFn: async () => {
            const data = await blogService.list();
            return data.documents || data;
        }
    });

    const { data: projects = [], isLoading: projectsLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const data = await projectService.list();
            return data.documents || data;
        }
    });

    const { data: contactMessages = [], isLoading: messagesLoading } = useQuery(
        {
            queryKey: ["contact-messages"],
            queryFn: async () => {
                const data = await contactService.list();
                return data.documents || data;
            }
        }
    );

    // Delete mutations
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

    const formatDate = dateString => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const unreadMessages = contactMessages.filter(m => !m.isRead).length;
    const featuredProjects = projects.filter(p => p.featured).length;
    const featuredBlogs = blogPosts.filter(b => b.featured).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-lg">
                                <LayoutDashboard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                                    Admin Dashboard
                                </h1>
                                <p className="text-blue-100 flex items-center mt-1 text-xs sm:text-sm">
                                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    {user?.name || user?.email || "Admin"}
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={logout}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                        <TabsList className="inline-flex w-max min-w-full sm:grid sm:grid-cols-3 lg:grid-cols-6 bg-slate-800/50 backdrop-blur-sm mb-8 p-1">
                            <TabsTrigger
                                value="dashboard"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 whitespace-nowrap"
                            >
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                <span>Overview</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="categories"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 whitespace-nowrap"
                            >
                                <Tag className="h-4 w-4 mr-2" />
                                <span>Categories</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="tech-stacks"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 whitespace-nowrap"
                            >
                                <Code className="h-4 w-4 mr-2" />
                                <span>Tech</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="projects"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 whitespace-nowrap"
                            >
                                <Folder className="h-4 w-4 mr-2" />
                                <span>Projects</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="blog-posts"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 whitespace-nowrap"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                <span>Blog</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="messages"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 relative whitespace-nowrap"
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                <span>Messages</span>
                                {unreadMessages > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadMessages}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Dashboard Overview */}
                    <TabsContent value="dashboard" className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-xl">
                                <CardHeader className="pb-2 sm:pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xs sm:text-sm font-medium text-blue-100">
                                            Total Projects
                                        </CardTitle>
                                        <Folder className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="text-3xl sm:text-4xl font-bold text-white">
                                        {projects.length}
                                    </div>
                                    <p className="text-xs text-blue-200 mt-2 flex items-center">
                                        <Star className="h-3 w-3 mr-1" />
                                        {featuredProjects} featured
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 shadow-xl">
                                <CardHeader className="pb-2 sm:pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xs sm:text-sm font-medium text-purple-100">
                                            Blog Posts
                                        </CardTitle>
                                        <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-200" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="text-3xl sm:text-4xl font-bold text-white">
                                        {blogPosts.length}
                                    </div>
                                    <p className="text-xs text-purple-200 mt-2 flex items-center">
                                        <Star className="h-3 w-3 mr-1" />
                                        {featuredBlogs} featured
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 shadow-xl">
                                <CardHeader className="pb-2 sm:pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xs sm:text-sm font-medium text-green-100">
                                            Tech Stacks
                                        </CardTitle>
                                        <Code className="h-6 w-6 sm:h-8 sm:w-8 text-green-200" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="text-3xl sm:text-4xl font-bold text-white">
                                        {techStacks.length}
                                    </div>
                                    <p className="text-xs text-green-200 mt-2 flex items-center">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Active technologies
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-600 to-red-600 border-0 shadow-xl">
                                <CardHeader className="pb-2 sm:pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xs sm:text-sm font-medium text-orange-100">
                                            Messages
                                        </CardTitle>
                                        <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="text-3xl sm:text-4xl font-bold text-white">
                                        {unreadMessages}
                                    </div>
                                    <p className="text-xs text-orange-200 mt-2">
                                        Unread of {contactMessages.length} total
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-white text-lg sm:text-xl">
                                    Quick Actions
                                </CardTitle>
                                <p className="text-gray-400 text-xs sm:text-sm">
                                    Create new content quickly
                                </p>
                            </CardHeader>
                            <CardContent className="flex flex-col sm:flex-row flex-wrap gap-3">
                                <ProjectForm />
                                <BlogPostForm />
                                <TechStackForm />
                            </CardContent>
                        </Card>

                        {/* Recent Activity Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Projects */}
                            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white">
                                            Recent Projects
                                        </CardTitle>
                                        <Badge className="bg-blue-600">
                                            {projects.length}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {projects.slice(0, 3).map(project => (
                                        <div
                                            key={project.$id}
                                            className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium flex items-center gap-2">
                                                    {project.title}
                                                    {project.featured && (
                                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                    )}
                                                </h4>
                                                <p className="text-gray-400 text-sm">
                                                    {project.category}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {project.technologies.length}{" "}
                                                techs
                                            </Badge>
                                        </div>
                                    ))}
                                    {projects.length === 0 && (
                                        <p className="text-gray-400 text-center py-8">
                                            No projects yet
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Blog Posts */}
                            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white">
                                            Recent Blog Posts
                                        </CardTitle>
                                        <Badge className="bg-purple-600">
                                            {blogPosts.length}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {blogPosts.slice(0, 3).map(post => (
                                        <div
                                            key={post.$id}
                                            className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium flex items-center gap-2">
                                                    {post.title}
                                                    {post.featured && (
                                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                    )}
                                                </h4>
                                                <p className="text-gray-400 text-sm flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {formatDate(
                                                        post.$createdAt
                                                    )}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {post.category}
                                            </Badge>
                                        </div>
                                    ))}
                                    {blogPosts.length === 0 && (
                                        <p className="text-gray-400 text-center py-8">
                                            No blog posts yet
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Categories Tab */}
                    <TabsContent value="categories">
                        <CategoryManager />
                    </TabsContent>

                    {/* Tech Stacks Tab */}
                    <TabsContent value="tech-stacks">
                        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                    <div>
                                        <CardTitle className="text-white text-xl sm:text-2xl">
                                            Tech Stacks
                                        </CardTitle>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                            Manage your technology skills and
                                            expertise
                                        </p>
                                    </div>
                                    <TechStackForm />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {techLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-gray-400 mt-4">
                                            Loading tech stacks...
                                        </p>
                                    </div>
                                ) : techStacks.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Code className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 mb-4">
                                            No tech stacks yet
                                        </p>
                                        <TechStackForm />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                                        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                                                        <TableHead className="text-gray-300 font-semibold whitespace-nowrap">
                                                            Technology
                                                        </TableHead>
                                                        <TableHead className="text-gray-300 font-semibold whitespace-nowrap">
                                                            Category
                                                        </TableHead>
                                                        <TableHead className="text-gray-300 font-semibold whitespace-nowrap">
                                                            Progress
                                                        </TableHead>
                                                        <TableHead className="text-right text-gray-300 font-semibold whitespace-nowrap">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {techStacks.map(tech => (
                                                        <TableRow
                                                            key={tech.$id}
                                                            className="border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                                                        >
                                                            <TableCell className="text-white">
                                                                <div className="flex items-center gap-3">
                                                                    {tech.icon &&
                                                                    tech.icon.startsWith(
                                                                        "http"
                                                                    ) ? (
                                                                        <div className="w-10 h-10 rounded-lg bg-slate-700/50 p-2 flex items-center justify-center">
                                                                            <img
                                                                                src={
                                                                                    tech.icon
                                                                                }
                                                                                alt={
                                                                                    tech.name
                                                                                }
                                                                                className="w-full h-full object-contain"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-2xl">
                                                                            {
                                                                                tech.icon
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    <span className="font-medium">
                                                                        {
                                                                            tech.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-green-600/10 text-green-400 border-green-600/20"
                                                                >
                                                                    {
                                                                        tech.category
                                                                    }
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[100px]">
                                                                        <div
                                                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                                                                            style={{
                                                                                width: `${tech.progress}%`
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-gray-400 text-sm min-w-[40px]">
                                                                        {
                                                                            tech.progress
                                                                        }
                                                                        %
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <TechStackForm
                                                                        techStack={
                                                                            tech
                                                                        }
                                                                    />
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-8 w-8 p-0 border-red-600/50 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                                                                        onClick={() =>
                                                                            deleteTechStackMutation.mutate(
                                                                                tech.$id
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Projects Tab */}
                    <TabsContent value="projects">
                        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                    <div>
                                        <CardTitle className="text-white text-xl sm:text-2xl">
                                            Projects
                                        </CardTitle>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                            Showcase your work and achievements
                                        </p>
                                    </div>
                                    <ProjectForm />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {projectsLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-gray-400 mt-4">
                                            Loading projects...
                                        </p>
                                    </div>
                                ) : projects.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Folder className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 mb-4">
                                            No projects yet
                                        </p>
                                        <ProjectForm />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                                        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                                                        <TableHead className="text-gray-300 font-semibold whitespace-nowrap">
                                                            Project
                                                        </TableHead>
                                                        <TableHead className="text-gray-300 font-semibold whitespace-nowrap">
                                                            Category
                                                        </TableHead>
                                                        <TableHead className="text-gray-300 font-semibold whitespace-nowrap">
                                                            Technologies
                                                        </TableHead>
                                                        <TableHead className="text-gray-300 font-semibold whitespace-nowrap">
                                                            Links
                                                        </TableHead>
                                                        <TableHead className="text-right text-gray-300 font-semibold whitespace-nowrap">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {projects.map(project => (
                                                        <TableRow
                                                            key={project.$id}
                                                            className="border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                                                        >
                                                            <TableCell className="text-white">
                                                                <div className="flex items-center gap-2">
                                                                    {project.featured && (
                                                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                                    )}
                                                                    <span className="font-medium">
                                                                        {
                                                                            project.title
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-blue-600/10 text-blue-400 border-blue-600/20"
                                                                >
                                                                    {
                                                                        project.category
                                                                    }
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-gray-400 text-sm">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {project.technologies
                                                                        .slice(
                                                                            0,
                                                                            3
                                                                        )
                                                                        .map(
                                                                            (
                                                                                tech,
                                                                                i
                                                                            ) => (
                                                                                <Badge
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    variant="outline"
                                                                                    className="text-xs bg-slate-700/50"
                                                                                >
                                                                                    {
                                                                                        tech
                                                                                    }
                                                                                </Badge>
                                                                            )
                                                                        )}
                                                                    {project
                                                                        .technologies
                                                                        .length >
                                                                        3 && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-xs"
                                                                        >
                                                                            +
                                                                            {project
                                                                                .technologies
                                                                                .length -
                                                                                3}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex gap-2">
                                                                    {project.githubUrl && (
                                                                        <a
                                                                            href={
                                                                                project.githubUrl
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-gray-400 hover:text-white"
                                                                        >
                                                                            <Github className="h-4 w-4" />
                                                                        </a>
                                                                    )}
                                                                    {project.liveUrl && (
                                                                        <a
                                                                            href={
                                                                                project.liveUrl
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-gray-400 hover:text-white"
                                                                        >
                                                                            <ExternalLink className="h-4 w-4" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <ProjectForm
                                                                        project={
                                                                            project
                                                                        }
                                                                    />
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-8 w-8 p-0 border-red-600/50 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                                                                        onClick={() =>
                                                                            deleteProjectMutation.mutate(
                                                                                project.$id
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Blog Posts Tab */}
                    <TabsContent value="blog-posts">
                        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                    <div>
                                        <CardTitle className="text-white text-xl sm:text-2xl">
                                            Blog Posts
                                        </CardTitle>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                            Share your thoughts and knowledge
                                        </p>
                                    </div>
                                    <BlogPostForm />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {blogLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                                        <p className="text-gray-400 mt-4">
                                            Loading blog posts...
                                        </p>
                                    </div>
                                ) : blogPosts.length === 0 ? (
                                    <div className="text-center py-16">
                                        <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 mb-4">
                                            No blog posts yet
                                        </p>
                                        <BlogPostForm />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                                        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                                                        <TableHead className="text-gray-300 font-semibold whitespace-nowrap">
                                                            Title
                                                        </TableHead>
                                                        <TableHead className="text-gray-300 font-semibold whitespace-nowrap">
                                                            Category
                                                        </TableHead>
                                                        <TableHead className="text-gray-300 font-semibold whitespace-nowrap">
                                                            Date
                                                        </TableHead>
                                                        <TableHead className="text-right text-gray-300 font-semibold whitespace-nowrap">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {blogPosts.map(post => (
                                                        <TableRow
                                                            key={post.$id}
                                                            className="border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                                                        >
                                                            <TableCell className="text-white">
                                                                <div className="flex items-center gap-2">
                                                                    {post.featured && (
                                                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                                    )}
                                                                    <span className="font-medium">
                                                                        {
                                                                            post.title
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                                                                    {
                                                                        post.excerpt
                                                                    }
                                                                </p>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-purple-600/10 text-purple-400 border-purple-600/20"
                                                                >
                                                                    {
                                                                        post.category
                                                                    }
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-gray-400 text-sm">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {formatDate(
                                                                        post.$createdAt
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <BlogPostForm
                                                                        blogPost={
                                                                            post
                                                                        }
                                                                    />
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-8 w-8 p-0 border-red-600/50 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                                                                        onClick={() =>
                                                                            deleteBlogPostMutation.mutate(
                                                                                post.$id
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Messages Tab */}
                    <TabsContent value="messages">
                        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                    <div className="flex-1">
                                        <CardTitle className="text-white text-xl sm:text-2xl">
                                            Contact Messages
                                        </CardTitle>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                            {unreadMessages > 0 ? (
                                                <span className="text-orange-400">
                                                    {unreadMessages} unread
                                                    message
                                                    {unreadMessages !== 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            ) : (
                                                "All messages read"
                                            )}
                                        </p>
                                    </div>
                                    <Badge className="bg-cyan-600 text-white self-start sm:self-auto">
                                        {contactMessages.length} Total
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {messagesLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                                        <p className="text-gray-400 mt-4">
                                            Loading messages...
                                        </p>
                                    </div>
                                ) : contactMessages.length === 0 ? (
                                    <div className="text-center py-16">
                                        <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400">
                                            No messages yet
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {contactMessages.map(message => (
                                            <div
                                                key={message.$id}
                                                className={`p-4 sm:p-5 rounded-lg border transition-all ${
                                                    message.isRead
                                                        ? "border-slate-700/50 bg-slate-700/30"
                                                        : "border-cyan-600/50 bg-cyan-600/5 shadow-lg shadow-cyan-600/10"
                                                }`}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <h4 className="font-semibold text-white text-base sm:text-lg">
                                                                {message.name}
                                                            </h4>
                                                            {!message.isRead && (
                                                                <Badge className="bg-cyan-600 text-white text-xs">
                                                                    New
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs sm:text-sm text-gray-400 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                            <span className="truncate">
                                                                {message.email}
                                                            </span>
                                                            <span className="text-gray-600 hidden sm:inline">
                                                                •
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDate(
                                                                    message.$createdAt
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 border-red-600/50 text-red-400 hover:bg-red-600 hover:text-white self-start sm:self-auto"
                                                        onClick={() =>
                                                            deleteContactMessageMutation.mutate(
                                                                message.$id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                {message.subject && (
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 bg-slate-700/30 px-3 py-2 rounded break-words">
                                                        {message.subject}
                                                    </p>
                                                )}
                                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed bg-slate-900/30 p-3 sm:p-4 rounded-lg break-words">
                                                    {message.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function AdminContent() {
    const { isAuthenticated, login, signup, isLoading } = useAuth();
    const { toast } = useToast();

    const handleLogin = async (email, password) => {
        const result = await login(email, password);
        if (!result.success) {
            toast({
                title: "Login Failed",
                description: result.error,
                variant: "destructive"
            });
        }
        return result;
    };

    const handleSignup = async (email, password, name) => {
        const result = await signup(email, password, name);
        if (!result.success) {
            toast({
                title: "Signup Failed",
                description: result.error,
                variant: "destructive"
            });
        }
        return result;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-white text-xl">Loading...</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <LoginForm
                onLogin={handleLogin}
                onSignup={handleSignup}
                isLoading={isLoading}
            />
        );
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
