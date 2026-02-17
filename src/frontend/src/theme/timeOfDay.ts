import { useState, useEffect } from 'react';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeTheme {
    timeOfDay: TimeOfDay;
    skyGradient: string[];
    cloudTint: string;
    sparkleOpacity: number;
    glowIntensity: number;
}

const THEMES: Record<TimeOfDay, TimeTheme> = {
    morning: {
        timeOfDay: 'morning',
        skyGradient: ['#87CEEB', '#FFE4B5', '#FFF8DC'],
        cloudTint: '#FFFFFF',
        sparkleOpacity: 0.6,
        glowIntensity: 0.8,
    },
    afternoon: {
        timeOfDay: 'afternoon',
        skyGradient: ['#87CEEB', '#FFDAB9', '#FFE4B5'],
        cloudTint: '#FFF5EE',
        sparkleOpacity: 0.8,
        glowIntensity: 1.0,
    },
    evening: {
        timeOfDay: 'evening',
        skyGradient: ['#FF6B6B', '#FFB347', '#FFF8DC'],
        cloudTint: '#FFE4E1',
        sparkleOpacity: 0.9,
        glowIntensity: 1.2,
    },
    night: {
        timeOfDay: 'night',
        skyGradient: ['#191970', '#4B0082', '#2F4F4F'],
        cloudTint: '#E6E6FA',
        sparkleOpacity: 1.0,
        glowIntensity: 1.5,
    },
};

function getTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 21) return 'evening';
    return 'night';
}

export function useTimeOfDay() {
    const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => {
        const override = localStorage.getItem('timeOfDayOverride');
        return (override as TimeOfDay) || getTimeOfDay();
    });

    useEffect(() => {
        const override = localStorage.getItem('timeOfDayOverride');
        if (!override) {
            const interval = setInterval(() => {
                setTimeOfDay(getTimeOfDay());
            }, 60000); // Check every minute
            return () => clearInterval(interval);
        }
    }, []);

    const setTimeOfDayOverride = (override: TimeOfDay | null) => {
        if (override) {
            localStorage.setItem('timeOfDayOverride', override);
            setTimeOfDay(override);
        } else {
            localStorage.removeItem('timeOfDayOverride');
            setTimeOfDay(getTimeOfDay());
        }
    };

    return {
        timeOfDay,
        theme: THEMES[timeOfDay],
        setTimeOfDayOverride,
    };
}
