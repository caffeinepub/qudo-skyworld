import { SessionState } from '../game/sessionLogic';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';
import PastelPanel from './PastelPanel';

interface HudOverlayProps {
    session: SessionState;
    onPause: () => void;
    isPaused: boolean;
}

export default function HudOverlay({ session, onPause, isPaused }: HudOverlayProps) {
    const timeRemaining = Math.max(0, session.duration - session.time);
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = Math.floor(timeRemaining % 60);

    return (
        <div className="absolute top-4 left-4 right-4 pointer-events-none">
            <div className="flex items-start justify-between gap-4">
                <PastelPanel className="p-3 pointer-events-auto">
                    <div className="flex items-center gap-4 text-sm">
                        <div>
                            <div className="text-xs text-sky-600">Time</div>
                            <div className="font-bold text-sky-700">
                                {minutes}:{seconds.toString().padStart(2, '0')}
                            </div>
                        </div>
                        <div className="w-px h-8 bg-sky-200" />
                        <div>
                            <div className="text-xs text-sky-600">Flowers</div>
                            <div className="font-bold text-pink-500">{session.flowersCollected}</div>
                        </div>
                        <div className="w-px h-8 bg-sky-200" />
                        <div>
                            <div className="text-xs text-sky-600">Sparkles</div>
                            <div className="font-bold text-yellow-500">{session.sparklesCollected}</div>
                        </div>
                    </div>
                </PastelPanel>

                <Button
                    size="icon"
                    variant="secondary"
                    onClick={onPause}
                    className="pointer-events-auto rounded-full bg-white/90 hover:bg-white"
                >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
            </div>

            {session.qudoBoost && session.qudoBoost.active && (
                <PastelPanel className="mt-4 p-3 bg-yellow-100/90 border-yellow-300">
                    <div className="flex items-center gap-2">
                        <img
                            src="/assets/generated/qudo-sun-icon.dim_512x512.png"
                            alt="Qudo"
                            className="w-6 h-6"
                        />
                        <span className="text-sm font-medium text-yellow-800">
                            Qudo Boost Available! Catch it for 2x rewards!
                        </span>
                    </div>
                </PastelPanel>
            )}
        </div>
    );
}
