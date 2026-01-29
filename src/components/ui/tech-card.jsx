import { motion } from "framer-motion";

export default function TechCard({
    name,
    icon,
    progress,
    color,
    documentationUrl
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="tech-card glassmorphism rounded-xl p-6 text-center"
        >
            <div
                className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full ${color}`}
            >
                {/* Support both emoji and image URL */}
                {icon && icon.startsWith("http") ? (
                    <img
                        src={icon}
                        alt={`${name} icon`}
                        className="w-10 h-10 object-contain"
                        onError={e => {
                            // Fallback to first letter if image fails to load
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `<span class="text-3xl font-bold">${name.charAt(
                                0
                            )}</span>`;
                        }}
                    />
                ) : (
                    <span className="text-3xl">{icon || name.charAt(0)}</span>
                )}
            </div>

            <h3 className="font-semibold mb-2">{name}</h3>

            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="progress-bar h-2 rounded-full"
                />
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{progress}%</span>
                {documentationUrl && (
                    <a
                        href={documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        onClick={e => e.stopPropagation()}
                    >
                        Docs
                    </a>
                )}
            </div>
        </motion.div>
    );
}
