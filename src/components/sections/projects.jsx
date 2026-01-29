import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import ProjectModal from "@/components/ui/project-modal";
import { projectService, categoryService } from "@/lib/appwrite-service";
import Pagination from "@/components/ui/pagination";

export default function Projects() {
    const sectionRef = useRef(null);
    const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: ["categories", "project"],
        queryFn: () => categoryService.list("project")
    });

    // Fetch projects with pagination
    const {
        data: projectsData,
        isLoading,
        error
    } = useQuery({
        queryKey: ["projects", activeFilter, currentPage],
        queryFn: () =>
            projectService.list({
                category: activeFilter,
                page: currentPage,
                limit: 9
            })
    });

    const projects = projectsData?.documents || [];
    const totalPages = projectsData?.totalPages || 1;

    const handleFilterChange = filter => {
        setActiveFilter(filter);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handlePageChange = page => {
        setCurrentPage(page);
        // Smooth scroll to top of section
        sectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    if (error) {
        return (
            <section id="projects" className="section-padding" ref={sectionRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-400">
                            Error loading projects: {error.message}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="section-padding" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        My <span className="text-blue-400">Projects</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        A showcase of my latest work and creative solutions
                    </p>
                </motion.div>

                {/* Project Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    <Button
                        variant={activeFilter === "all" ? "default" : "outline"}
                        onClick={() => handleFilterChange("all")}
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                            activeFilter === "all"
                                ? "bg-blue-500 text-white"
                                : "border-2 border-current hover:bg-current hover:text-white"
                        }`}
                    >
                        All Projects
                    </Button>
                    {categories.map(category => (
                        <Button
                            key={category.$id}
                            variant={
                                activeFilter === category.slug
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => handleFilterChange(category.slug)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                                activeFilter === category.slug
                                    ? "bg-blue-500 text-white"
                                    : "border-2 border-current hover:bg-current hover:text-white"
                            }`}
                        >
                            {category.name}
                        </Button>
                    ))}
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse glassmorphism rounded-xl overflow-hidden"
                            >
                                <div className="bg-gray-700 h-48 w-full"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-700 rounded"></div>
                                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects Grid */}
                {!isLoading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.$id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.1
                                }}
                                className="project-card rounded-xl overflow-hidden group cursor-pointer"
                                onClick={() => setSelectedProject(project)}
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            project.imageUrl ||
                                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=600"
                                        }
                                        alt={project.title}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                                    {project.featured && (
                                        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            Featured
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-semibold">
                                            {project.title}
                                        </h3>
                                        <div className="flex space-x-2">
                                            {project.technologies
                                                .slice(0, 2)
                                                .map(tech => (
                                                    <span
                                                        key={tech}
                                                        className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>

                                    <p className="text-gray-300 mb-4 line-clamp-2">
                                        {project.description}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-3">
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    onClick={e =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                                    onClick={e =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <Github className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                        <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                                            Learn More{" "}
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && projects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">
                            No projects found for the selected filter.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
}
