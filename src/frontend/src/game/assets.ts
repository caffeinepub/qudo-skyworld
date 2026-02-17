export interface SpriteFrame {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const ASSETS = {
    backgrounds: {
        morning: '/assets/generated/sky-bg-morning.dim_1920x1080.png',
        afternoon: '/assets/generated/sky-bg-afternoon.dim_1920x1080.png',
        evening: '/assets/generated/sky-bg-evening.dim_1920x1080.png',
        night: '/assets/generated/sky-bg-night.dim_1920x1080.png',
    },
    sprites: {
        cloudAvatar: '/assets/generated/cloud-avatar-sprites.dim_1024x1024.png',
        flowers: '/assets/generated/flower-icons-sheet.dim_1024x1024.png',
        sparkles: '/assets/generated/sparkle-particles.dim_1024x1024.png',
        qudoIcon: '/assets/generated/qudo-sun-icon.dim_512x512.png',
    },
    ui: {
        panelTexture: '/assets/generated/ui-panel-texture.dim_1024x1024.png',
    },
};

// Cloud avatar sprite frames (8 frames in 4x2 grid)
export const CLOUD_FRAMES: SpriteFrame[] = Array.from({ length: 8 }, (_, i) => ({
    x: (i % 4) * 256,
    y: Math.floor(i / 4) * 512,
    width: 256,
    height: 512,
}));

// Flower icons (16 icons in 4x4 grid)
export const FLOWER_FRAMES: SpriteFrame[] = Array.from({ length: 16 }, (_, i) => ({
    x: (i % 4) * 256,
    y: Math.floor(i / 4) * 256,
    width: 256,
    height: 256,
}));

// Sparkle particles (16 particles in 4x4 grid)
export const SPARKLE_FRAMES: SpriteFrame[] = Array.from({ length: 16 }, (_, i) => ({
    x: (i % 4) * 256,
    y: Math.floor(i / 4) * 256,
    width: 256,
    height: 256,
}));

export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
