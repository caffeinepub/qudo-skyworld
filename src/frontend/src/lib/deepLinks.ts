export type DeepLinkView = 'play' | 'world' | 'social' | 'rewards' | 'shop' | 'help';

export interface DeepLink {
    view: DeepLinkView;
    params?: Record<string, string>;
}

export function parseDeepLink(): DeepLink | null {
    const hash = window.location.hash;
    if (!hash || hash.length <= 1) return null;

    const hashContent = hash.substring(1);
    const queryIndex = hashContent.indexOf('?');

    let view = hashContent;
    let params: Record<string, string> = {};

    if (queryIndex !== -1) {
        view = hashContent.substring(0, queryIndex);
        const queryString = hashContent.substring(queryIndex + 1);
        const urlParams = new URLSearchParams(queryString);
        urlParams.forEach((value, key) => {
            params[key] = value;
        });
    }

    // Remove leading slash if present
    view = view.replace(/^\//, '');

    const validViews: DeepLinkView[] = ['play', 'world', 'social', 'rewards', 'shop', 'help'];
    if (validViews.includes(view as DeepLinkView)) {
        return { view: view as DeepLinkView, params };
    }

    return null;
}

export function createDeepLink(view: DeepLinkView, params?: Record<string, string>): string {
    const baseUrl = window.location.origin + window.location.pathname;
    let link = `${baseUrl}#${view}`;

    if (params && Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        link += `?${queryString}`;
    }

    return link;
}

export function createShareableLink(view: DeepLinkView, params?: Record<string, string>): string {
    return createDeepLink(view, params);
}

export function createFriendVisitLink(friendCode: string): string {
    return createDeepLink('social', { visit: friendCode });
}
