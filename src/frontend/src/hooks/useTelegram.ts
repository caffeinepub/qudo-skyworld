import { useEffect, useState } from 'react';
import { getTelegramWebApp, isTelegramAvailable } from '../lib/telegramWebApp';

export function useTelegram() {
    const [isTelegram, setIsTelegram] = useState(false);
    const [initData, setInitData] = useState<string | null>(null);

    useEffect(() => {
        const available = isTelegramAvailable();
        setIsTelegram(available);

        if (available) {
            const webApp = getTelegramWebApp();
            setInitData(webApp.initData || null);
            webApp.ready();
            webApp.expand();
        }
    }, []);

    const share = (text: string, url?: string) => {
        if (isTelegram) {
            const webApp = getTelegramWebApp();
            const shareUrl = url || window.location.href;
            webApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`);
        } else {
            // Fallback to clipboard
            const shareText = url ? `${text} ${url}` : text;
            navigator.clipboard.writeText(shareText);
        }
    };

    const haptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
        if (isTelegram) {
            const webApp = getTelegramWebApp();
            if (webApp.HapticFeedback) {
                webApp.HapticFeedback.impactOccurred(type === 'light' ? 'light' : type === 'medium' ? 'medium' : 'heavy');
            }
        }
    };

    return {
        isTelegram,
        initData,
        share,
        haptic,
    };
}
