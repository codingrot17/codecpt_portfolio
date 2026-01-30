import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { blogService, categoryService } from "@/lib/appwrite-service";

export function BlogPostForm({ blogPost }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: blogPost?.title || "",
        excerpt: blogPost?.excerpt || "",
        content: blogPost?.content || "",
        category: blogPost?.category || "",
        featured: blogPost?.featured || false,
        imageUrl: blogPost?.imageUrl || ""
    });

    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch blog categories
    const { data: categories = [] } = useQuery({
        queryKey: ["categories", "blog"],
        queryFn: () => categoryService.list("blog")
    });

    useEffect(() => {
        if (blogPost) {
            setFormData({
                title: blogPost.title,
                excerpt: blogPost.excerpt,
                content: blogPost.content,
                category: blogPost.category,
                featured: blogPost.featured || false,
                imageUrl: blogPost.imageUrl || ""
            });
        }
    }, [blogPost]);

    const createMutation = useMutation({
        mutationFn: data => blogService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            toast({
                title: "Success",
                description: "Blog post created successfully"
            });
            setOpen(false);
            setFormData({
                title: "",
                excerpt: "",
                content: "",
                category: "",
                featured: false,
                imageUrl: ""
            });
        },
        onError: error => {
            toast({
                title: "Error",
                description: error.message || "Failed to create blog post",
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
        },
        onError: error => {
            toast({
                title: "Error",
                description: error.message || "Failed to update blog post",
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

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {blogPost ? (
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Blog Post
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
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
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value
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
                            rows={2}
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-white">
                            Content (Markdown supported)
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
                            className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
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
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                                {categories.map(cat => (
                                    <SelectItem key={cat.$id} value={cat.slug}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl" className="text-white">
                            Image URL (Optional)
                        </Label>
                        <Input
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    imageUrl: e.target.value
                                })
                            }
                            placeholder="https://example.com/image.jpg"
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={checked =>
                                setFormData({ ...formData, featured: checked })
                            }
                        />
                        <Label
                            htmlFor="featured"
                            className="text-white cursor-pointer"
                        >
                            Featured Post
                        </Label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
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
