import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { blogService } from "@/lib/appwrite-service";
import { Plus, Edit } from "lucide-react";

const blogCategories = [
    { value: "technology", label: "Technology" },
    { value: "web-development", label: "Web Development" },
    { value: "mobile-development", label: "Mobile Development" },
    { value: "programming", label: "Programming" },
    { value: "tutorial", label: "Tutorial" },
    { value: "opinion", label: "Opinion" },
    { value: "news", label: "News" }
];

export function BlogPostForm({ blogPost, onClose }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: blogPost?.title || "",
        slug: blogPost?.slug || "",
        excerpt: blogPost?.excerpt || "",
        content: blogPost?.content || "",
        category: blogPost?.category || "technology",
        imageUrl: blogPost?.imageUrl || "",
        featured: blogPost?.featured || false
    });

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: data => blogService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            toast({
                title: "Success",
                description: "Blog post created successfully"
            });
            setOpen(false);
            onClose?.();
            setFormData({
                title: "",
                slug: "",
                excerpt: "",
                content: "",
                category: "technology",
                imageUrl: "",
                featured: false
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create blog post",
                variant: "destructive"
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: data => blogService.update(blogPost.$id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            toast({
                title: "Success",
                description: "Blog post updated successfully"
            });
            setOpen(false);
            onClose?.();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update blog post",
                variant: "destructive"
            });
        }
    });

    const handleSubmit = e => {
        e.preventDefault();
        blogPost
            ? updateMutation.mutate(formData)
            : createMutation.mutate(formData);
    };

    const generateSlug = title =>
        title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const handleTitleChange = title => {
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title)
        });
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {blogPost ? (
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Blog Post
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {blogPost ? "Edit Blog Post" : "Add New Blog Post"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={e => handleTitleChange(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-white">
                            Slug
                        </Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    slug: e.target.value
                                })
                            }
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-white">
                            Excerpt
                        </Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    excerpt: e.target.value
                                })
                            }
                            rows={3}
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-white">
                            Content
                        </Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    content: e.target.value
                                })
                            }
                            rows={8}
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={value =>
                                setFormData({ ...formData, category: value })
                            }
                        >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                                {blogCategories.map(c => (
                                    <SelectItem key={c.value} value={c.value}>
                                        {c.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={checked =>
                                setFormData({
                                    ...formData,
                                    featured: Boolean(checked)
                                })
                            }
                        />
                        <Label htmlFor="featured" className="text-white">
                            Featured post
                        </Label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? "Saving..."
                                : blogPost
                                ? "Update"
                                : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function BlogPostFormTrigger() {
    return <BlogPostForm />;
}
