import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Flower2, Sun } from 'lucide-react';
import { useRecordReward } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { updateProgression, initializeProgression } from '../game/progression';
import { useEffect } from 'react';

interface SessionSummaryModalProps {
    summary: {
        flowersCollected: number;
        sparklesCollected: number;
        qudoBoostCollected: boolean;
        totalReward: number;
        duration: number;
        decorationsUnlocked: number;
    };
    onClose: () => void;
}

export default function SessionSummaryModal({ summary, onClose }: SessionSummaryModalProps) {
    const { mutate: recordReward } = useRecordReward();
    const { identity } = useInternetIdentity();

    useEffect(() => {
        // Update local progression
        const progression = initializeProgression();
        updateProgression(progression, summary);

        // Record reward if authenticated
        if (identity && summary.totalReward > 0) {
            recordReward({
                amount: BigInt(summary.totalReward),
                description: `Session completed: ${summary.flowersCollected} flowers, ${summary.sparklesCollected} sparkles`,
                timestamp: BigInt(Date.now() * 1000000),
            });
        }
    }, [identity, summary, recordReward]);

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gradient-to-b from-sky-100 to-peach-100 border-2 border-white/50">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-sky-700 text-center">
                        Session Complete! ✨
                    </DialogTitle>
                    <DialogDescription className="text-center text-sky-600">
                        You drifted through the sky for {Math.floor(summary.duration)} seconds
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/70 rounded-2xl p-4 text-center">
                            <Flower2 className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                            <div className="text-2xl font-bold text-pink-600">{summary.flowersCollected}</div>
                            <div className="text-xs text-sky-600">Flowers</div>
                        </div>

                        <div className="bg-white/70 rounded-2xl p-4 text-center">
                            <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                            <div className="text-2xl font-bold text-yellow-600">{summary.sparklesCollected}</div>
                            <div className="text-xs text-sky-600">Sparkles</div>
                        </div>
                    </div>

                    {summary.qudoBoostCollected && (
                        <div className="bg-yellow-100/70 rounded-2xl p-4 text-center border-2 border-yellow-300">
                            <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                            <div className="font-bold text-yellow-700">Qudo Boost Collected!</div>
                            <div className="text-sm text-yellow-600">Rewards doubled!</div>
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-sky-200 to-peach-200 rounded-2xl p-6 text-center">
                        <div className="text-sm text-sky-600 mb-1">Total Qudo Earned</div>
                        <div className="text-4xl font-bold text-sky-700">{summary.totalReward}</div>
                    </div>

                    {summary.decorationsUnlocked > 0 && (
                        <div className="text-center text-sm text-sky-600">
                            🎉 {summary.decorationsUnlocked} new decoration{summary.decorationsUnlocked > 1 ? 's' : ''} unlocked!
                        </div>
                    )}
                </div>

                <Button
                    onClick={onClose}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-full py-6 text-lg font-bold"
                >
                    Continue
                </Button>
            </DialogContent>
        </Dialog>
    );
}
