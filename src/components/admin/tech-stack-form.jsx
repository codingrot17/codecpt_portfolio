import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Slider } from "@/components/ui/slider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { techStackService } from "@/lib/appwrite-service";
import { Plus, Edit } from "lucide-react";

const techCategories = [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "database", label: "Database" },
    { value: "mobile", label: "Mobile" },
    { value: "tools", label: "Tools" },
    { value: "devops", label: "DevOps" }
];

const colorOptions = [
    { value: "bg-blue-500/20", label: "Blue", color: "bg-blue-500" },
    { value: "bg-green-500/20", label: "Green", color: "bg-green-500" },
    { value: "bg-purple-500/20", label: "Purple", color: "bg-purple-500" },
    { value: "bg-red-500/20", label: "Red", color: "bg-red-500" },
    { value: "bg-yellow-500/20", label: "Yellow", color: "bg-yellow-500" },
    { value: "bg-orange-500/20", label: "Orange", color: "bg-orange-500" },
    { value: "bg-pink-500/20", label: "Pink", color: "bg-pink-500" },
    { value: "bg-gray-500/20", label: "Gray", color: "bg-gray-500" }
];

export function TechStackForm({ techStack, onClose }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: techStack?.name || "",
        icon: techStack?.icon || "",
        progress: techStack?.progress || 50,
        category: techStack?.category || "frontend",
        color: techStack?.color || "bg-blue-500/20"
    });

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: data => techStackService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tech-stacks"] });
            toast({
                title: "Success",
                description: "Tech stack saved successfully"
            });
            setOpen(false);
            onClose?.();
            setFormData({
                name: "",
                icon: "",
                progress: 50,
                category: "frontend",
                color: "bg-blue-500/20"
            });
        },
        onError: err => {
            toast({
                title: "Error",
                description: err.message,
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
                description: "Tech stack saved successfully"
            });
            setOpen(false);
            onClose?.();
        },
        onError: err => {
            toast({
                title: "Error",
                description: err.message,
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
                    <Button className="bg-blue-600 hover:bg-blue-700">
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
                            Icon (Emoji)
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
                                {techCategories.map(c => (
                                    <SelectItem key={c.value} value={c.value}>
                                        {c.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Color</Label>
                        <Select
                            value={formData.color}
                            onValueChange={value =>
                                setFormData({ ...formData, color: value })
                            }
                        >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                                {colorOptions.map(c => (
                                    <SelectItem key={c.value} value={c.value}>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-4 h-4 rounded ${c.color}`}
                                            />
                                            {c.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">
                            Progress: {formData.progress}%
                        </Label>
                        <Slider
                            value={[formData.progress]}
                            onValueChange={v =>
                                setFormData({ ...formData, progress: v[0] })
                            }
                            max={100}
                            step={5}
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

export function TechStackFormTrigger() {
    return <TechStackForm />;
}
