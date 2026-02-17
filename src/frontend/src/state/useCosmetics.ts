import { useState, useEffect } from 'react';

export interface CosmeticItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    category: string;
    preview: string;
    icon: string;
}

export const COSMETICS_CATALOG: Record<string, CosmeticItem[]> = {
    trails: [
        { id: 'trail_pink', name: 'Pink Dream', description: 'Soft pink trail', cost: 0, category: 'trails', preview: '#FFB6C1', icon: '🌸' },
        { id: 'trail_blue', name: 'Sky Blue', description: 'Calm blue trail', cost: 100, category: 'trails', preview: '#87CEEB', icon: '💙' },
        { id: 'trail_gold', name: 'Golden Sun', description: 'Shimmering gold', cost: 200, category: 'trails', preview: '#FFD700', icon: '✨' },
        { id: 'trail_rainbow', name: 'Rainbow', description: 'Colorful trail', cost: 500, category: 'trails', preview: 'linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF)', icon: '🌈' },
    ],
    flowers: [
        { id: 'flower_cherry', name: 'Cherry Blossom', description: 'Delicate pink', cost: 0, category: 'flowers', preview: '#FFB7C5', icon: '🌸' },
        { id: 'flower_sunflower', name: 'Sunflower', description: 'Bright yellow', cost: 150, category: 'flowers', preview: '#FFD700', icon: '🌻' },
        { id: 'flower_rose', name: 'Rose', description: 'Classic red', cost: 200, category: 'flowers', preview: '#FF6B6B', icon: '🌹' },
        { id: 'flower_lotus', name: 'Lotus', description: 'Peaceful white', cost: 300, category: 'flowers', preview: '#F0F8FF', icon: '🪷' },
    ],
    sparkles: [
        { id: 'sparkle_star', name: 'Star', description: 'Classic star', cost: 0, category: 'sparkles', preview: '#FFD700', icon: '⭐' },
        { id: 'sparkle_heart', name: 'Heart', description: 'Lovely hearts', cost: 150, category: 'sparkles', preview: '#FF69B4', icon: '💖' },
        { id: 'sparkle_diamond', name: 'Diamond', description: 'Shiny gems', cost: 250, category: 'sparkles', preview: '#B9F2FF', icon: '💎' },
        { id: 'sparkle_moon', name: 'Moon', description: 'Crescent moons', cost: 300, category: 'sparkles', preview: '#F0E68C', icon: '🌙' },
    ],
    frames: [
        { id: 'frame_none', name: 'No Frame', description: 'Clean look', cost: 0, category: 'frames', preview: 'transparent', icon: '⬜' },
        { id: 'frame_cloud', name: 'Cloud Frame', description: 'Fluffy clouds', cost: 200, category: 'frames', preview: '#FFFFFF', icon: '☁️' },
        { id: 'frame_stars', name: 'Star Frame', description: 'Starry border', cost: 300, category: 'frames', preview: '#FFD700', icon: '✨' },
        { id: 'frame_rainbow', name: 'Rainbow Frame', description: 'Colorful border', cost: 500, category: 'frames', preview: 'linear-gradient(90deg, #FF6B6B, #FFD93D)', icon: '🌈' },
    ],
};

interface CosmeticsState {
    currency: number;
    purchased: string[];
    equipped: Record<string, string>;
}

export function useCosmetics() {
    const [state, setState] = useState<CosmeticsState>(() => {
        const stored = localStorage.getItem('cosmetics');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            currency: 500, // Starting currency
            purchased: ['trail_pink', 'flower_cherry', 'sparkle_star', 'frame_none'],
            equipped: {
                trails: 'trail_pink',
                flowers: 'flower_cherry',
                sparkles: 'sparkle_star',
                frames: 'frame_none',
            },
        };
    });

    useEffect(() => {
        localStorage.setItem('cosmetics', JSON.stringify(state));
    }, [state]);

    const purchaseCosmetic = (itemId: string, cost: number) => {
        if (state.currency >= cost && !state.purchased.includes(itemId)) {
            setState({
                ...state,
                currency: state.currency - cost,
                purchased: [...state.purchased, itemId],
            });
        }
    };

    const equipCosmetic = (itemId: string) => {
        const item = Object.values(COSMETICS_CATALOG)
            .flat()
            .find((i) => i.id === itemId);
        if (item && state.purchased.includes(itemId)) {
            setState({
                ...state,
                equipped: {
                    ...state.equipped,
                    [item.category]: itemId,
                },
            });
        }
    };

    const addCurrency = (amount: number) => {
        setState({
            ...state,
            currency: state.currency + amount,
        });
    };

    return {
        currency: state.currency,
        purchased: state.purchased,
        equippedCosmetics: state.equipped,
        purchaseCosmetic,
        equipCosmetic,
        addCurrency,
    };
}
