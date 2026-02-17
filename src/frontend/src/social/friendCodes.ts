export function generateFriendCode(principal: string): string {
    // Use the principal as the friend code
    return principal;
}

export function parseFriendCode(code: string): string | null {
    try {
        // Validate that it's a valid principal format
        if (code && code.length > 0) {
            return code;
        }
        return null;
    } catch {
        return null;
    }
}

export function createShareText(friendCode: string): string {
    return `Join me in Qudo Skyworld! 🌸✨\n\nUse my friend code to visit my Sky World:\n${friendCode}\n\nLet's drift through the pastel skies together!`;
}

export function createShareUrl(friendCode: string): string {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#social?visit=${encodeURIComponent(friendCode)}`;
}
