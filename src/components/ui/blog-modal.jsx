import { Calendar, Clock, Tag, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

export default function BlogModal({ post, onClose }) {
    const formatDate = dateString => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glassmorphism">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-purple-400">
                        {post.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.$createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>5 min read</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400">
                                {post.category}
                            </span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.imageUrl && (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-64 object-cover rounded-lg"
                            onError={e => {
                                e.target.src =
                                    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=600";
                            }}
                        />
                    )}

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-lg text-gray-300 italic border-l-4 border-purple-400 pl-4">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Content */}
                    <div className="prose prose-invert max-w-none">
                        <div
                            className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* Tags/Categories */}
                    <div className="pt-6 border-t border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">
                            Category
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                                {post.category}
                            </span>
                            {post.featured && (
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                    Featured
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
