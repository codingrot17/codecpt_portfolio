import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
    projectService,
    techStackService,
    blogService
} from "@/lib/appwrite-service";

export default function Terminal() {
    const [commands, setCommands] = useState([]);
    const [currentCommand, setCurrentCommand] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Fetch real data
    const { data: projectsData } = useQuery({
        queryKey: ["projects-terminal"],
        queryFn: () => projectService.list({ limit: 6 })
    });

    const { data: techData } = useQuery({
        queryKey: ["tech-terminal"],
        queryFn: () => techStackService.list({ limit: 100 })
    });

    const { data: blogData } = useQuery({
        queryKey: ["blog-terminal"],
        queryFn: () => blogService.list({ limit: 3 })
    });

    const projects = projectsData?.documents || [];
    const techStacks = techData?.documents || [];
    const blogPosts = blogData?.documents || [];

    useEffect(() => {
        if (!projects.length || !techStacks.length) return;

        const generateCommands = () => {
            const projectList = projects.map(p => `${p.title}/`).join("    ");

            const techList = techStacks
                .map(t => `${t.name} (${t.progress}%)`)
                .join("\n");

            const blogList = blogPosts.map(b => `- ${b.title}`).join("\n");

            return [
                {
                    command: "whoami",
                    output: "Full-Stack Developer | Mobile Development Enthusiast"
                },
                {
                    command: "cat skills.txt",
                    output: techList || "Loading skills..."
                },
                {
                    command: "ls projects/",
                    output: projectList || "No projects found"
                },
                {
                    command: "cat recent-posts.md",
                    output: blogList || "No blog posts yet"
                },
                {
                    command: 'echo "Total Projects: $(ls projects/ | wc -l)"',
                    output: `Total Projects: ${projects.length}`
                },
                {
                    command: 'echo "Contact me for amazing projects!"',
                    output: "Contact me for amazing projects!\n\n📧 Email: codingrot001@gmail.com\n📱 Phone: +234 (9) 033 747 946"
                }
            ];
        };

        const terminalCommands = generateCommands();

        const runCommands = async () => {
            for (let i = 0; i < terminalCommands.length; i++) {
                setIsTyping(true);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const cmd = terminalCommands[i];
                setCurrentCommand(cmd.command);

                await new Promise(resolve => setTimeout(resolve, 1500));
                setCommands(prev => [...prev, cmd.command, cmd.output]);
                setCurrentCommand("");
                setIsTyping(false);

                await new Promise(resolve => setTimeout(resolve, 500));
            }
        };

        runCommands();
    }, [projects, techStacks, blogPosts]);

    return (
        <div className="min-h-screen bg-black text-green-400 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Portfolio
                    </Link>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm">
                    <div className="flex items-center mb-4">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="ml-4 text-gray-400">
                            terminal@codecpt:~$
                        </span>
                    </div>

                    <div className="space-y-2">
                        {commands.map((line, index) => (
                            <div
                                key={index}
                                className={
                                    index % 2 === 0
                                        ? "text-blue-400"
                                        : "text-green-400"
                                }
                            >
                                {index % 2 === 0 && (
                                    <span className="text-blue-400">
                                        ademola@codecpt
                                    </span>
                                )}
                                {index % 2 === 0 && ":~$ "}
                                <span className="whitespace-pre-wrap">
                                    {line}
                                </span>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="text-blue-400">
                                <span className="text-blue-400">
                                    ademola@codecpt
                                </span>
                                :~${" "}
                                <span className="typing-animation">
                                    {currentCommand}
                                </span>
                            </div>
                        )}

                        <div className="text-green-400 mt-4">
                            <span className="text-blue-400">
                                ademola@codecpt
                            </span>
                            :~$ <span className="animate-pulse">|</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-400">
                        <span className="text-yellow-400">💡</span> Easter Egg
                        Found! You discovered the terminal interface.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Data is loaded live from Appwrite database
                    </p>
                </div>
            </div>
        </div>
    );
}
