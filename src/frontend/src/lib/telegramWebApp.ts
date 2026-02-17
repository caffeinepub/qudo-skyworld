interface TelegramWebApp {
    initData: string;
    initDataUnsafe: any;
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: any;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    BackButton: any;
    MainButton: any;
    HapticFeedback: any;
    ready: () => void;
    expand: () => void;
    close: () => void;
    openTelegramLink: (url: string) => void;
    openLink: (url: string) => void;
    showPopup: (params: any) => void;
    showAlert: (message: string) => void;
    showConfirm: (message: string) => void;
}

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }
}

export function isTelegramAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

export function getTelegramWebApp(): TelegramWebApp {
    if (!isTelegramAvailable()) {
        // Return a mock object for non-Telegram environments
        return {
            initData: '',
            initDataUnsafe: {},
            version: '0.0.0',
            platform: 'unknown',
            colorScheme: 'light',
            themeParams: {},
            isExpanded: false,
            viewportHeight: window.innerHeight,
            viewportStableHeight: window.innerHeight,
            headerColor: '#ffffff',
            backgroundColor: '#ffffff',
            isClosingConfirmationEnabled: false,
            BackButton: {},
            MainButton: {},
            HapticFeedback: {},
            ready: () => {},
            expand: () => {},
            close: () => {},
            openTelegramLink: () => {},
            openLink: (url: string) => window.open(url, '_blank'),
            showPopup: () => {},
            showAlert: (message: string) => alert(message),
            showConfirm: (message: string) => confirm(message),
        };
    }
    return window.Telegram!.WebApp;
}
