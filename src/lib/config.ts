
const isDevelopment = process.env.NODE_ENV === 'development';

// ─── Backend API URL ──────────────────────────────────────────────────────────
// To override: set NEXT_PUBLIC_API_BASE_URL in .env.local
// Both dev and prod now use the live Heroku backend for real API calls through next.config.ts rewrites.
// MockDB bypasses in sign-in/admin-login pages are hit FIRST before this URL.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    || '';

export const DRAFT_KEY = 'medical_case_sheet_draft';

/**
 * fetch() wrapper with a configurable timeout (default 5s).
 * Prevents pages from hanging when the backend is unreachable.
 */
export async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs = 30000
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort('Timeout reached'), timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        return response;
    } finally {
        clearTimeout(id);
    }
}