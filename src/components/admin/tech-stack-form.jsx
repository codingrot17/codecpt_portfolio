import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { techStackService, categoryService } from "@/lib/appwrite-service";

export function TechStackForm({ techStack }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: techStack?.name || "",
        icon: techStack?.icon || "",
        category: techStack?.category || "",
        progress: techStack?.progress || 0,
        description: techStack?.description || ""
    });

    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch tech categories
    const { data: categories = [] } = useQuery({
        queryKey: ["categories", "tech"],
        queryFn: () => categoryService.list("tech")
    });

    useEffect(() => {
        if (techStack) {
            setFormData({
                name: techStack.name,
                icon: techStack.icon,
                category: techStack.category,
                progress: techStack.progress,
                description: techStack.description || ""
            });
        }
    }, [techStack]);

    const createMutation = useMutation({
        mutationFn: data => techStackService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tech-stacks"] });
            toast({
                title: "Success",
                description: "Tech stack created successfully"
            });
            setOpen(false);
            setFormData({
                name: "",
                icon: "",
                category: "",
                progress: 0,
                description: ""
            });
        },
        onError: error => {
            toast({
                title: "Error",
                description: error.message || "Failed to create tech stack",
                variant: "destructive"
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: data => techStackService.update(techStack.$id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tech-stacks"] });
            toast({
                title: "Success",
                description: "Tech stack updated successfully"
            });
            setOpen(false);
        },
        onError: error => {
            toast({
                title: "Error",
                description: error.message || "Failed to update tech stack",
                variant: "destructive"
            });
        }
    });

    const handleSubmit = e => {
        e.preventDefault();
        techStack
            ? updateMutation.mutate(formData)
            : createMutation.mutate(formData);
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {techStack ? (
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tech Stack
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {techStack ? "Edit Tech Stack" : "Add New Tech Stack"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                })
                            }
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="icon" className="text-white">
                            Icon URL
                        </Label>
                        <Input
                            id="icon"
                            value={formData.icon}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    icon: e.target.value
                                })
                            }
                            placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/..."
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                        />
                        <p className="text-xs text-gray-400">
                            Get icons from{" "}
                            <a
                                href="https://devicon.dev/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                            >
                                DevIcon
                            </a>
                        </p>
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
                        <Label htmlFor="progress" className="text-white">
                            Progress (%)
                        </Label>
                        <Input
                            id="progress"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.progress}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    progress: parseInt(e.target.value)
                                })
                            }
                            className="bg-slate-700 border-slate-600 text-white"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                            Description (Optional)
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
                        />
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
                                : techStack
                                ? "Update"
                                : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
