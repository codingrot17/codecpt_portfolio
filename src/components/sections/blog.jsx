import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import BlogModal from "@/components/ui/blog-modal";
import { blogService } from "@/lib/appwrite-service";

export default function Blog() {
    const sectionRef = useRef(null);
    const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });
    const [selectedPost, setSelectedPost] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");

    const {
        data: blogPosts = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ["blog-posts"],
        queryFn: () => blogService.list()
    });

    const filters = [
        { id: "all", label: "All Posts" },
        { id: "web-development", label: "Web Dev" },
        { id: "mobile-development", label: "Mobile" },
        { id: "tutorials", label: "Tutorials" },
        { id: "career", label: "Career" }
    ];

    const filteredPosts = blogPosts.filter(
        post => activeFilter === "all" || post.category === activeFilter
    );

    const formatDate = dateString => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    if (isLoading) {
        return (
            <section
                id="blog"
                className="section-padding bg-primary-800/50"
                ref={sectionRef}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                        <p className="mt-4 text-gray-300">
                            Loading blog posts...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section
                id="blog"
                className="section-padding bg-primary-800/50"
                ref={sectionRef}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-400">
                            Error loading blog posts: {error.message}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="blog"
            className="section-padding bg-primary-800/50"
            ref={sectionRef}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Latest{" "}
                        <span className="text-purple-400">Blog Posts</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Insights, tutorials, and thoughts on development
                    </p>
                </motion.div>

                {/* Blog Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    {filters.map(filter => (
                        <Button
                            key={filter.id}
                            variant={
                                activeFilter === filter.id
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                                activeFilter === filter.id
                                    ? "bg-purple-500 text-white"
                                    : "border-2 border-current hover:bg-current hover:text-white"
                            }`}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </motion.div>

                {/* Blog Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                        <motion.article
                            key={post.$id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="blog-card rounded-xl overflow-hidden group cursor-pointer"
                            onClick={() => setSelectedPost(post)}
                        >
                            <div className="relative">
                                <img
                                    src={
                                        post.imageUrl ||
                                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=600"
                                    }
                                    alt={post.title}
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={e => {
                                        e.target.src =
                                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=600";
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                                {post.featured && (
                                    <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        Featured
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {formatDate(post.$createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        <span>5 min</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-gray-300 mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Tag className="w-4 h-4 text-purple-400" />
                                        <span className="text-sm text-purple-400">
                                            {post.category}
                                        </span>
                                    </div>
                                    <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                                        Read More{" "}
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">
                            No blog posts found for the selected filter.
                        </p>
                    </div>
                )}
            </div>

            {selectedPost && (
                <BlogModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </section>
    );
}
