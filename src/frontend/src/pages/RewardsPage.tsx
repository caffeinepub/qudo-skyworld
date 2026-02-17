import { useGetRewards, useGetSkyWorld } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PastelPanel from '../components/PastelPanel';
import { Gift, TrendingUp, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RewardsPage() {
    const { identity } = useInternetIdentity();
    const { data: rewards, isLoading: rewardsLoading } = useGetRewards();
    const { data: skyWorld } = useGetSkyWorld();

    if (!identity) {
        return (
            <PastelPanel className="p-8 text-center">
                <Gift className="w-12 h-12 mx-auto mb-4 text-sky-400" />
                <h2 className="text-2xl font-bold text-sky-700 mb-2">Login to View Your Rewards</h2>
                <p className="text-sky-600">
                    Connect with Internet Identity to track your Qudo token rewards.
                </p>
            </PastelPanel>
        );
    }

    const totalRewards = rewards?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;

    return (
        <div className="space-y-6">
            <PastelPanel className="p-6">
                <h2 className="text-2xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                    <Gift className="w-6 h-6" />
                    Your Qudo Balance
                </h2>
                <div className="bg-gradient-to-r from-sky-200 to-peach-200 rounded-3xl p-8 text-center">
                    <div className="text-sm text-sky-600 mb-2">Total Qudo Earned</div>
                    <div className="text-5xl font-bold text-sky-700">{totalRewards}</div>
                    <div className="text-xs text-sky-500 mt-2">
                        From {rewards?.length || 0} session{rewards?.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </PastelPanel>

            <PastelPanel className="p-6">
                <h3 className="text-xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Rewards
                </h3>
                {rewardsLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                ) : rewards && rewards.length > 0 ? (
                    <div className="space-y-3">
                        {rewards.slice(-10).reverse().map((reward, index) => (
                            <div
                                key={index}
                                className="bg-white/50 rounded-2xl p-4 flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <p className="text-sm text-sky-700 font-medium">
                                        {reward.description}
                                    </p>
                                    <p className="text-xs text-sky-500 mt-1 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(Number(reward.timestamp) / 1000000).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-green-600">
                                        +{Number(reward.amount)}
                                    </div>
                                    <div className="text-xs text-sky-500">Qudo</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sky-600 text-center py-8">
                        Play sessions to start earning Qudo rewards!
                    </p>
                )}
            </PastelPanel>

            <PastelPanel className="p-6">
                <h3 className="text-xl font-bold text-sky-700 mb-4">How Rewards Work</h3>
                <div className="space-y-3 text-sm text-sky-600">
                    <p>
                        • Earn Qudo tokens by playing sessions and collecting flowers and sparkles
                    </p>
                    <p>
                        • Catch the glowing Qudo symbol during sessions for 2x rewards
                    </p>
                    <p>
                        • Active play is rewarded - move your cloud and interact with the game
                    </p>
                    <p>
                        • Build your daily streak for bonus rewards
                    </p>
                    <p className="text-xs text-sky-500 mt-4">
                        Note: Qudo tokens are currently tracked internally. Future updates will enable
                        on-chain token transfers.
                    </p>
                </div>
            </PastelPanel>
        </div>
    );
}
