import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false
        },
        mutations: {
            retry: false
        }
    }
});

// Keep apiRequest for backward compatibility (deprecated - use Appwrite services instead)
export async function apiRequest(method, url, data) {
    const options = {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);

    if (!res.ok) {
        if (res.status >= 500) {
            throw new Error(`${res.status}: ${res.statusText}`);
        }

        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
    }

    if (res.headers.get("content-type")?.includes("application/json")) {
        return res.json();
    }

    return res;
}
