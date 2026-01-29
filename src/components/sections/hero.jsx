import { motion } from "framer-motion";
import { Code, Mail, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThreeBackground from "@/components/ui/three-background";

export default function Hero() {
    const handleResumeDownload = () => {
        // Create a link element to trigger download
        const link = document.createElement("a");

        // Try to get resume from public folder
        // The file should be in public/resume.pdf
        link.href = "/resume.pdf";
        link.download = "Ademola_Emmanuel_Ayomide_Resume.pdf";

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            <ThreeBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="floating-animation"
                >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-blue-400 glow-effect">
                        <img
                            src="https://i.ibb.co/n8DLPjn3/IMG-20241225-WA0002-1.jpg"
                            alt="Ademola Emmanuel Ayomide - Full-Stack Developer"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 slide-in-left break-words px-2"
                >
                    <span className="text-blue-400">Ademola</span> Emmanuel
                    <br />
                    <span className="text-purple-400">Ayomide</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 px-2 break-words"
                >
                    Full-Stack Developer & Mobile Enthusiast
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto px-4"
                >
                    Crafting exceptional digital experiences with modern
                    technologies. Specializing in React, Next.js, Node.js, and
                    innovative mobile development solutions.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 max-w-3xl mx-auto"
                >
                    <Button
                        asChild
                        size="lg"
                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold glow-effect"
                    >
                        <a
                            href="#projects"
                            className="flex items-center justify-center"
                        >
                            <Code className="w-5 h-5 mr-2" />
                            View My Work
                        </a>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
                    >
                        <a
                            href="#contact"
                            className="flex items-center justify-center"
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            Get In Touch
                        </a>
                    </Button>

                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={handleResumeDownload}
                        className="w-full sm:w-auto glassmorphism text-white hover:text-blue-400 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Download CV
                    </Button>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
            >
                <a
                    href="#about"
                    className="text-white hover:text-blue-400 transition-colors"
                >
                    <ChevronDown className="w-8 h-8" />
                </a>
            </motion.div>
        </section>
    );
}
