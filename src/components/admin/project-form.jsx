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
import { projectService, categoryService } from "@/lib/appwrite-service";

export function ProjectForm({ project }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: project?.title || "",
        description: project?.description || "",
        technologies: project?.technologies?.join(", ") || "",
        features: project?.features?.join(", ") || "",
        category: project?.category || "",
        githubUrl: project?.githubUrl || "",
        liveUrl: project?.liveUrl || "",
        imageUrl: project?.imageUrl || "",
        featured: project?.featured || false
    });

    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch project categories
    const { data: categories = [] } = useQuery({
        queryKey: ["categories", "project"],
        queryFn: () => categoryService.list("project")
    });

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                technologies: project.technologies.join(", "),
                features: project.features.join(", "),
                category: project.category,
                githubUrl: project.githubUrl || "",
                liveUrl: project.liveUrl || "",
                imageUrl: project.imageUrl || "",
                featured: project.featured || false
            });
        }
    }, [project]);

    const createMutation = useMutation({
        mutationFn: data => projectService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast({
                title: "Success",
                description: "Project created successfully"
            });
            setOpen(false);
            setFormData({
                title: "",
                description: "",
                technologies: "",
                features: "",
                category: "",
                githubUrl: "",
                liveUrl: "",
                imageUrl: "",
                featured: false
            });
        },
        onError: error => {
            toast({
                title: "Error",
                description: error.message || "Failed to create project",
                variant: "destructive"
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: data => projectService.update(project.$id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast({
                title: "Success",
                description: "Project updated successfully"
            });
            setOpen(false);
        },
        onError: error => {
            toast({
                title: "Error",
                description: error.message || "Failed to update project",
                variant: "destructive"
            });
        }
    });

    const handleSubmit = e => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            technologies: formData.technologies
                .split(",")
                .map(t => t.trim())
                .filter(Boolean),
            features: formData.features
                .split(",")
                .map(f => f.trim())
                .filter(Boolean)
        };

        project
            ? updateMutation.mutate(dataToSubmit)
            : createMutation.mutate(dataToSubmit);
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {project ? (
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {project ? "Edit Project" : "Add New Project"}
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
                        <Label htmlFor="description" className="text-white">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value
                                })
                            }
                            rows={3}
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="technologies" className="text-white">
                            Technologies (comma-separated)
                        </Label>
                        <Input
                            id="technologies"
                            value={formData.technologies}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    technologies: e.target.value
                                })
                            }
                            placeholder="React, Node.js, MongoDB"
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="features" className="text-white">
                            Features (comma-separated)
                        </Label>
                        <Textarea
                            id="features"
                            value={formData.features}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    features: e.target.value
                                })
                            }
                            rows={2}
                            placeholder="User authentication, Real-time updates"
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="githubUrl" className="text-white">
                                GitHub URL (Optional)
                            </Label>
                            <Input
                                id="githubUrl"
                                value={formData.githubUrl}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        githubUrl: e.target.value
                                    })
                                }
                                placeholder="https://github.com/..."
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="liveUrl" className="text-white">
                                Live URL (Optional)
                            </Label>
                            <Input
                                id="liveUrl"
                                value={formData.liveUrl}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        liveUrl: e.target.value
                                    })
                                }
                                placeholder="https://example.com"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
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
                            Featured Project
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
                                : project
                                ? "Update"
                                : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
