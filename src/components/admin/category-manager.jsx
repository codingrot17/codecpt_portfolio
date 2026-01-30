import { useState } from "react";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { categoryService } from "@/lib/appwrite-service";

const categoryTypes = [
    { value: "project", label: "Project", color: "bg-blue-500" },
    { value: "blog", label: "Blog", color: "bg-purple-500" },
    { value: "tech", label: "Tech Stack", color: "bg-green-500" }
];

function CategoryForm({ category, onClose }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: category?.name || "",
        slug: category?.slug || "",
        type: category?.type || "project",
        description: category?.description || ""
    });

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: data => categoryService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Success",
                description: "Category created successfully"
            });
            setOpen(false);
            onClose?.();
            setFormData({
                name: "",
                slug: "",
                type: "project",
                description: ""
            });
        },
        onError: error => {
            toast({
                title: "Error",
                description: error.message || "Failed to create category",
                variant: "destructive"
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: data => categoryService.update(category.$id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Success",
                description: "Category updated successfully"
            });
            setOpen(false);
            onClose?.();
        },
        onError: error => {
            toast({
                title: "Error",
                description: error.message || "Failed to update category",
                variant: "destructive"
            });
        }
    });

    const handleSubmit = e => {
        e.preventDefault();

        // Auto-generate slug if empty
        const dataToSubmit = {
            ...formData,
            slug:
                formData.slug ||
                formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        };

        category
            ? updateMutation.mutate(dataToSubmit)
            : createMutation.mutate(dataToSubmit);
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {category ? (
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {category ? "Edit Category" : "Add New Category"}
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
                        <Label htmlFor="slug" className="text-white">
                            Slug (URL-friendly)
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
                            placeholder="auto-generated if empty"
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={value =>
                                setFormData({ ...formData, type: value })
                            }
                        >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                                {categoryTypes.map(type => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                : category
                                ? "Update"
                                : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function CategoryManager() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.list()
    });

    const deleteMutation = useMutation({
        mutationFn: id => categoryService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Success",
                description: "Category deleted successfully"
            });
        },
        onError: error => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete category",
                variant: "destructive"
            });
        }
    });

    const getTypeColor = type => {
        const typeObj = categoryTypes.find(t => t.value === type);
        return typeObj?.color || "bg-gray-500";
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-white flex items-center">
                        <Tag className="h-5 w-5 mr-2" />
                        Category Management
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Manage categories for projects, blog posts, and tech
                        stacks
                    </p>
                </div>
                <CategoryForm />
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-gray-400">
                    Loading categories...
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                    <Tag className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400 mb-4">No categories yet</p>
                    <CategoryForm />
                </div>
            ) : (
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-700 hover:bg-slate-700/50">
                                <TableHead className="text-gray-300">
                                    Name
                                </TableHead>
                                <TableHead className="text-gray-300">
                                    Slug
                                </TableHead>
                                <TableHead className="text-gray-300">
                                    Type
                                </TableHead>
                                <TableHead className="text-gray-300">
                                    Description
                                </TableHead>
                                <TableHead className="text-right text-gray-300">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map(category => (
                                <TableRow
                                    key={category.$id}
                                    className="border-slate-700 hover:bg-slate-700/50"
                                >
                                    <TableCell className="font-medium text-white">
                                        {category.name}
                                    </TableCell>
                                    <TableCell className="text-gray-400 font-mono text-sm">
                                        {category.slug}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`${getTypeColor(
                                                category.type
                                            )} text-white`}
                                        >
                                            {category.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-sm max-w-xs truncate">
                                        {category.description || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <CategoryForm category={category} />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 p-0 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                                onClick={() =>
                                                    deleteMutation.mutate(
                                                        category.$id
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
            )}
        </div>
    );
}
