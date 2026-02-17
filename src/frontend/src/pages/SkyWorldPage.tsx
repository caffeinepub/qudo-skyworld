import { useGetSkyWorld } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PastelPanel from '../components/PastelPanel';
import { Sparkles, Flower2, Star, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SkyWorldPage() {
    const { identity } = useInternetIdentity();
    const { data: skyWorld, isLoading } = useGetSkyWorld();

    if (!identity) {
        return (
            <PastelPanel className="p-8 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-sky-400" />
                <h2 className="text-2xl font-bold text-sky-700 mb-2">Login to View Your Sky World</h2>
                <p className="text-sky-600">
                    Connect with Internet Identity to save your progress and view your personal Sky World.
                </p>
            </PastelPanel>
        );
    }

    if (isLoading) {
        return (
            <PastelPanel className="p-8 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </PastelPanel>
        );
    }

    if (!skyWorld) {
        return (
            <PastelPanel className="p-8 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-sky-400" />
                <h2 className="text-2xl font-bold text-sky-700 mb-2">Your Sky World is Being Created</h2>
                <p className="text-sky-600">Play your first session to start building your world!</p>
            </PastelPanel>
        );
    }

    return (
        <div className="space-y-6">
            <PastelPanel className="p-6">
                <h2 className="text-2xl font-bold text-sky-700 mb-4">Your Sky World</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/50 rounded-2xl p-4 text-center">
                        <Flower2 className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                        <div className="text-2xl font-bold text-pink-600">
                            {Number(skyWorld.world.totalFlowersCollected)}
                        </div>
                        <div className="text-xs text-sky-600">Total Flowers</div>
                    </div>
                    <div className="bg-white/50 rounded-2xl p-4 text-center">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold text-yellow-600">
                            {Number(skyWorld.world.totalSparklesCollected)}
                        </div>
                        <div className="text-xs text-sky-600">Total Sparkles</div>
                    </div>
                    <div className="bg-white/50 rounded-2xl p-4 text-center">
                        <Star className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold text-blue-600">
                            {Number(skyWorld.world.activeSessions)}
                        </div>
                        <div className="text-xs text-sky-600">Sessions Played</div>
                    </div>
                    <div className="bg-white/50 rounded-2xl p-4 text-center">
                        <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold text-purple-600">
                            {Number(skyWorld.world.highScore)}
                        </div>
                        <div className="text-xs text-sky-600">High Score</div>
                    </div>
                </div>
            </PastelPanel>

            <PastelPanel className="p-6">
                <h3 className="text-xl font-bold text-sky-700 mb-4">Decorations</h3>
                {skyWorld.world.decorations.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {skyWorld.world.decorations.map((decoration, index) => (
                            <div
                                key={index}
                                className="bg-white/50 rounded-xl p-3 text-center aspect-square flex items-center justify-center"
                            >
                                <span className="text-2xl">{decoration}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sky-600 text-center py-8">
                        Play sessions to unlock decorations for your Sky World!
                    </p>
                )}
            </PastelPanel>

            <PastelPanel className="p-6">
                <h3 className="text-xl font-bold text-sky-700 mb-4">Persistent Stars</h3>
                {skyWorld.world.persistentStars.length > 0 ? (
                    <div className="space-y-2">
                        {skyWorld.world.persistentStars.slice(0, 5).map((star, index) => (
                            <div
                                key={index}
                                className="bg-white/50 rounded-xl p-3 flex items-center justify-between"
                            >
                                <span className="text-sm text-sky-600">
                                    Star #{index + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-sky-500">
                                        Brightness: {star.brightness.toFixed(2)}
                                    </span>
                                    <Star className="w-4 h-4 text-yellow-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sky-600 text-center py-8">
                        Collect special stars during your sessions!
                    </p>
                )}
            </PastelPanel>
        </div>
    );
}
