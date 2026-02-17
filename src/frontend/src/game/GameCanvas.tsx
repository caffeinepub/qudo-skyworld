import { useEffect, useRef, useState } from 'react';
import { useTimeOfDay } from '../theme/timeOfDay';
import { loadImage, ASSETS, CLOUD_FRAMES, FLOWER_FRAMES, SPARKLE_FRAMES } from './assets';
import { SessionState, createSession, updateSession, endSession } from './sessionLogic';
import SessionSummaryModal from '../components/SessionSummaryModal';
import HudOverlay from '../components/HudOverlay';
import { useCosmetics } from '../state/useCosmetics';
import PastelPanel from '../components/PastelPanel';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export default function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sessionState, setSessionState] = useState<SessionState | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [sessionSummary, setSessionSummary] = useState<any>(null);
    const [isPaused, setIsPaused] = useState(false);
    const { theme } = useTimeOfDay();
    const { equippedCosmetics } = useCosmetics();
    const animationFrameRef = useRef<number | null>(null);
    const imagesRef = useRef<Record<string, HTMLImageElement>>({});
    const inputRef = useRef({ mouseX: 0, mouseY: 0, isDown: false });

    // Load all images
    useEffect(() => {
        const loadAllImages = async () => {
            const images: Record<string, HTMLImageElement> = {};
            images.background = await loadImage(ASSETS.backgrounds[theme.timeOfDay]);
            images.cloudAvatar = await loadImage(ASSETS.sprites.cloudAvatar);
            images.flowers = await loadImage(ASSETS.sprites.flowers);
            images.sparkles = await loadImage(ASSETS.sprites.sparkles);
            images.qudoIcon = await loadImage(ASSETS.sprites.qudoIcon);
            imagesRef.current = images;
        };
        loadAllImages();
    }, [theme.timeOfDay]);

    // Handle input
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handlePointerMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            inputRef.current.mouseX = e.clientX - rect.left;
            inputRef.current.mouseY = e.clientY - rect.top;
        };

        const handlePointerDown = () => {
            inputRef.current.isDown = true;
        };

        const handlePointerUp = () => {
            inputRef.current.isDown = false;
        };

        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointerup', handlePointerUp);

        return () => {
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointerup', handlePointerUp);
        };
    }, []);

    // Game loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !sessionState || isPaused) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let lastTime = performance.now();

        const gameLoop = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            // Update session
            const updatedSession = updateSession(sessionState, deltaTime, inputRef.current, theme);
            setSessionState(updatedSession);

            // Check if session ended
            if (updatedSession.phase === 'ended') {
                const summary = endSession(updatedSession);
                setSessionSummary(summary);
                setShowSummary(true);
                setSessionState(null);
                return;
            }

            // Render
            render(ctx, canvas, updatedSession, theme, equippedCosmetics);

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [sessionState, isPaused, theme, equippedCosmetics]);

    const startSession = () => {
        setSessionState(createSession());
        setIsPaused(false);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const render = (
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        session: SessionState,
        theme: any,
        cosmetics: any
    ) => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        const bgImage = imagesRef.current.background;
        if (bgImage) {
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        }

        // Apply theme effects
        ctx.globalAlpha = theme.sparkleOpacity;

        // Draw sparkles
        session.sparkles.forEach((sparkle) => {
            const sparkleImage = imagesRef.current.sparkles;
            if (sparkleImage) {
                const frame = SPARKLE_FRAMES[sparkle.frameIndex % SPARKLE_FRAMES.length];
                ctx.save();
                ctx.globalAlpha = sparkle.opacity * theme.sparkleOpacity;
                ctx.drawImage(
                    sparkleImage,
                    frame.x,
                    frame.y,
                    frame.width,
                    frame.height,
                    sparkle.x - 16,
                    sparkle.y - 16,
                    32,
                    32
                );
                ctx.restore();
            }
        });

        ctx.globalAlpha = 1;

        // Draw flowers
        session.flowers.forEach((flower) => {
            const flowerImage = imagesRef.current.flowers;
            if (flowerImage) {
                const frame = FLOWER_FRAMES[flower.type % FLOWER_FRAMES.length];
                ctx.drawImage(
                    flowerImage,
                    frame.x,
                    frame.y,
                    frame.width,
                    frame.height,
                    flower.x - 20,
                    flower.y - 20,
                    40,
                    40
                );
            }
        });

        // Draw Qudo boost if active
        if (session.qudoBoost) {
            const qudoImage = imagesRef.current.qudoIcon;
            if (qudoImage) {
                ctx.save();
                ctx.globalAlpha = 0.8 + Math.sin(session.time * 3) * 0.2;
                ctx.drawImage(
                    qudoImage,
                    session.qudoBoost.x - 30,
                    session.qudoBoost.y - 30,
                    60,
                    60
                );
                ctx.restore();
            }
        }

        // Draw cloud avatar
        const cloudImage = imagesRef.current.cloudAvatar;
        if (cloudImage) {
            const frameIndex = Math.floor(session.time * 8) % CLOUD_FRAMES.length;
            const frame = CLOUD_FRAMES[frameIndex];
            
            // Apply cosmetic trail
            if (cosmetics.trail) {
                ctx.save();
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = cosmetics.trail;
                ctx.beginPath();
                ctx.arc(session.cloudX, session.cloudY, 40, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            ctx.drawImage(
                cloudImage,
                frame.x,
                frame.y,
                frame.width,
                frame.height,
                session.cloudX - 40,
                session.cloudY - 60,
                80,
                120
            );
        }
    };

    return (
        <div className="space-y-4">
            <PastelPanel className="relative overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-2xl touch-none"
                    style={{ maxHeight: '70vh' }}
                />
                
                {sessionState && (
                    <HudOverlay
                        session={sessionState}
                        onPause={togglePause}
                        isPaused={isPaused}
                    />
                )}

                {!sessionState && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-2xl">
                        <Button
                            size="lg"
                            onClick={startSession}
                            className="bg-white/90 hover:bg-white text-sky-700 font-bold text-xl px-8 py-6 rounded-full shadow-soft"
                        >
                            <Play className="w-6 h-6 mr-2" />
                            Start Session
                        </Button>
                    </div>
                )}
            </PastelPanel>

            <PastelPanel className="p-4">
                <h3 className="font-bold text-sky-700 mb-2">How to Play</h3>
                <p className="text-sm text-sky-600">
                    Move your mouse or finger to guide your cloud through the sky. Collect flowers and sparkles
                    to decorate your Sky World. Catch the glowing Qudo symbol for bonus rewards!
                </p>
            </PastelPanel>

            {showSummary && sessionSummary && (
                <SessionSummaryModal
                    summary={sessionSummary}
                    onClose={() => {
                        setShowSummary(false);
                        setSessionSummary(null);
                    }}
                />
            )}
        </div>
    );
}
