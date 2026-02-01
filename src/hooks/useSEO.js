import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PAGE_SEO, SEO_DEFAULTS } from "../lib/seoConfig";

/**
 * useSEO()
 *
 * Drop this into any page component (or once at the Router level)
 * and it automatically swaps the <title>, <meta description>,
 * Open Graph tags, Twitter Card tags, and canonical URL
 * to match whichever route is currently active.
 *
 * Usage — just call it at the top of each page component:
 *   function AboutPage() {
 *     useSEO();
 *     return ( ... );
 *   }
 *
 * Or, call it once inside your root App component and it handles
 * every route automatically via the router's location.
 */
export default function useSEO() {
    const { pathname } = useLocation();

    useEffect(() => {
        const pageMeta = PAGE_SEO[pathname] || PAGE_SEO["/"];
        const { baseUrl, ogImage } = SEO_DEFAULTS;
        const canonical = `${baseUrl}${pathname === "/" ? "" : pathname}`;

        // --- Title ---
        document.title = pageMeta.title;

        // --- Helper: set or create a meta tag ---
        const setMeta = (selector, value) => {
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement("meta");
                // selector is like 'meta[name="description"]' — extract the attribute
                const match = selector.match(/\[(\w+)="([^"]+)"\]/);
                if (match) el.setAttribute(match[1], match[2]);
                document.head.appendChild(el);
            }
            el.setAttribute("content", value);
        };

        // --- Primary Meta ---
        setMeta('meta[name="description"]', pageMeta.description);

        // --- Canonical ---
        let canonicalEl = document.querySelector('link[rel="canonical"]');
        if (canonicalEl) canonicalEl.setAttribute("href", canonical);

        // --- Open Graph ---
        setMeta('meta[property="og:title"]', pageMeta.title);
        setMeta('meta[property="og:description"]', pageMeta.description);
        setMeta('meta[property="og:url"]', canonical);
        setMeta('meta[property="og:image"]', ogImage);

        // --- Twitter Card ---
        setMeta('meta[name="twitter:title"]', pageMeta.title);
        setMeta('meta[name="twitter:description"]', pageMeta.description);
        setMeta('meta[name="twitter:image"]', ogImage);
    }, [pathname]);
}
