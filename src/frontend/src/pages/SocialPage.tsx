import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyVisits, useGetFriendSkyWorld, useVisitFriend } from '../hooks/useQueries';
import { useTelegram } from '../hooks/useTelegram';
import PastelPanel from '../components/PastelPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, Share2, Mail, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function SocialPage() {
    const { identity } = useInternetIdentity();
    const { data: visits, isLoading: visitsLoading } = useGetMyVisits();
    const { mutate: getFriendWorld, isPending: loadingFriend } = useGetFriendSkyWorld();
    const { mutate: visitFriend, isPending: visiting } = useVisitFriend();
    const { share } = useTelegram();

    const [friendCode, setFriendCode] = useState('');
    const [visitMessage, setVisitMessage] = useState('');
    const [friendWorld, setFriendWorld] = useState<any>(null);

    const myFriendCode = identity?.getPrincipal().toString() || '';

    const handleShareCode = () => {
        const shareText = `Join me in Qudo Skyworld! Use my friend code: ${myFriendCode}`;
        share(shareText);
        toast.success('Friend code copied to clipboard!');
    };

    const handleLoadFriend = () => {
        if (!friendCode.trim()) {
            toast.error('Please enter a friend code');
            return;
        }

        getFriendWorld(friendCode.trim(), {
            onSuccess: (world) => {
                if (world) {
                    setFriendWorld(world);
                    toast.success('Friend world loaded!');
                } else {
                    toast.error('Friend not found');
                }
            },
            onError: () => {
                toast.error('Invalid friend code');
            },
        });
    };

    const handleVisitFriend = () => {
        if (!friendCode.trim() || !visitMessage.trim()) {
            toast.error('Please enter a friend code and message');
            return;
        }

        visitFriend(
            {
                friendPrincipal: friendCode.trim(),
                message: visitMessage.trim(),
            },
            {
                onSuccess: () => {
                    setVisitMessage('');
                    setFriendWorld(null);
                },
            }
        );
    };

    if (!identity) {
        return (
            <PastelPanel className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-sky-400" />
                <h2 className="text-2xl font-bold text-sky-700 mb-2">Login to Connect with Friends</h2>
                <p className="text-sky-600">
                    Connect with Internet Identity to visit friends' Sky Worlds and share your own.
                </p>
            </PastelPanel>
        );
    }

    return (
        <div className="space-y-6">
            <PastelPanel className="p-6">
                <h2 className="text-2xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Your Friend Code
                </h2>
                <div className="bg-white/50 rounded-2xl p-4">
                    <p className="text-xs text-sky-600 mb-2">Share this code with friends:</p>
                    <div className="flex gap-2">
                        <Input
                            value={myFriendCode}
                            readOnly
                            className="bg-white/70 border-white/50 rounded-xl font-mono text-sm"
                        />
                        <Button onClick={handleShareCode} className="rounded-xl">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>
            </PastelPanel>

            <PastelPanel className="p-6">
                <h2 className="text-2xl font-bold text-sky-700 mb-4">Visit a Friend</h2>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="friendCode" className="text-sky-700">
                            Friend Code
                        </Label>
                        <div className="flex gap-2 mt-2">
                            <Input
                                id="friendCode"
                                value={friendCode}
                                onChange={(e) => setFriendCode(e.target.value)}
                                placeholder="Enter friend's code"
                                className="bg-white/70 border-white/50 rounded-xl font-mono"
                            />
                            <Button
                                onClick={handleLoadFriend}
                                disabled={loadingFriend}
                                className="rounded-xl"
                            >
                                Load
                            </Button>
                        </div>
                    </div>

                    {friendWorld && (
                        <div className="bg-white/50 rounded-2xl p-4 space-y-4">
                            <h3 className="font-bold text-sky-700">Friend's Sky World</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-pink-600">
                                        {Number(friendWorld.totalFlowersCollected)}
                                    </div>
                                    <div className="text-xs text-sky-600">Flowers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {Number(friendWorld.totalSparklesCollected)}
                                    </div>
                                    <div className="text-xs text-sky-600">Sparkles</div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="message" className="text-sky-700">
                                    Leave a Message
                                </Label>
                                <Textarea
                                    id="message"
                                    value={visitMessage}
                                    onChange={(e) => setVisitMessage(e.target.value)}
                                    placeholder="Say something nice..."
                                    className="bg-white/70 border-white/50 rounded-xl mt-2"
                                    maxLength={200}
                                />
                            </div>

                            <Button
                                onClick={handleVisitFriend}
                                disabled={visiting}
                                className="w-full rounded-xl"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Send Visit
                            </Button>
                        </div>
                    )}
                </div>
            </PastelPanel>

            <PastelPanel className="p-6">
                <h2 className="text-2xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                    <Mail className="w-6 h-6" />
                    Your Inbox
                </h2>
                {visitsLoading ? (
                    <p className="text-sky-600 text-center py-8">Loading visits...</p>
                ) : visits && visits.length > 0 ? (
                    <div className="space-y-3">
                        {visits.map((visit, index) => (
                            <div key={index} className="bg-white/50 rounded-2xl p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs text-sky-500 font-mono">
                                        {visit.visitor.toString().slice(0, 12)}...
                                    </span>
                                    <span className="text-xs text-sky-400">
                                        {new Date(Number(visit.timestamp) / 1000000).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-sky-700">{visit.message}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sky-600 text-center py-8">
                        No visits yet. Share your friend code to get started!
                    </p>
                )}
            </PastelPanel>
        </div>
    );
}
