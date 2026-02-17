import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
import { useGetCallerUserProfile, useInitializeSkyWorld } from './hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import GameCanvas from './game/GameCanvas';
import SkyWorldPage from './pages/SkyWorldPage';
import SocialPage from './pages/SocialPage';
import RewardsPage from './pages/RewardsPage';
import CosmeticsShopPage from './pages/CosmeticsShopPage';
import HelpCommandsPage from './pages/HelpCommandsPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import LoginButton from './components/LoginButton';
import AudioControls from './components/AudioControls';
import { useAudioManager } from './audio/useAudioManager';
import { useTelegram } from './hooks/useTelegram';
import { parseDeepLink } from './lib/deepLinks';
import { Sparkles, Home, Users, Gift, ShoppingBag, HelpCircle } from 'lucide-react';

export default function App() {
    const { identity, isInitializing } = useInternetIdentity();
    const { actor, isFetching: actorFetching } = useActor();
    const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
    const { mutate: initializeSkyWorld } = useInitializeSkyWorld();
    const { isTelegram } = useTelegram();
    const { unlockAudio } = useAudioManager();
    
    const [activeTab, setActiveTab] = useState('play');
    const [showProfileSetup, setShowProfileSetup] = useState(false);

    const isAuthenticated = !!identity;
    const isLoading = isInitializing || actorFetching || profileLoading;

    // Handle deep links
    useEffect(() => {
        const deepLink = parseDeepLink();
        if (deepLink) {
            setActiveTab(deepLink.view);
        }
    }, []);

    // Check if profile setup is needed
    useEffect(() => {
        if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
            setShowProfileSetup(true);
        }
    }, [isAuthenticated, profileLoading, isFetched, userProfile]);

    // Unlock audio on first interaction
    useEffect(() => {
        const handleFirstInteraction = () => {
            unlockAudio();
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
        return () => {
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, [unlockAudio]);

    // Initialize Sky World after profile is created
    useEffect(() => {
        if (isAuthenticated && userProfile && !userProfile.pastelSkyProfile && actor) {
            initializeSkyWorld();
        }
    }, [isAuthenticated, userProfile, actor, initializeSkyWorld]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 via-peach-100 to-cream-100">
                <div className="text-center space-y-4">
                    <Sparkles className="w-12 h-12 mx-auto animate-pulse text-qudo-yellow" />
                    <p className="text-lg font-medium text-sky-700">Loading your Sky World...</p>
                </div>
            </div>
        );
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <div className="min-h-screen bg-gradient-to-b from-sky-200 via-peach-100 to-cream-100 pb-safe">
                {/* Header */}
                <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/50 px-4 py-3 safe-top">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img 
                                src="/assets/generated/qudo-sun-icon.dim_512x512.png" 
                                alt="Qudo" 
                                className="w-10 h-10 drop-shadow-glow"
                            />
                            <h1 className="text-2xl font-bold text-sky-700 bubble-text">Qudo Skyworld</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <AudioControls />
                            <LoginButton />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-6 mb-6 bg-white/50 backdrop-blur-sm rounded-3xl p-1">
                            <TabsTrigger value="play" className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-soft">
                                <Sparkles className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Play</span>
                            </TabsTrigger>
                            <TabsTrigger value="world" className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-soft">
                                <Home className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">World</span>
                            </TabsTrigger>
                            <TabsTrigger value="social" className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-soft">
                                <Users className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Social</span>
                            </TabsTrigger>
                            <TabsTrigger value="rewards" className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-soft">
                                <Gift className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Rewards</span>
                            </TabsTrigger>
                            <TabsTrigger value="shop" className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-soft">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Shop</span>
                            </TabsTrigger>
                            <TabsTrigger value="help" className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-soft">
                                <HelpCircle className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Help</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="play" className="mt-0">
                            <GameCanvas />
                        </TabsContent>

                        <TabsContent value="world" className="mt-0">
                            <SkyWorldPage />
                        </TabsContent>

                        <TabsContent value="social" className="mt-0">
                            <SocialPage />
                        </TabsContent>

                        <TabsContent value="rewards" className="mt-0">
                            <RewardsPage />
                        </TabsContent>

                        <TabsContent value="shop" className="mt-0">
                            <CosmeticsShopPage />
                        </TabsContent>

                        <TabsContent value="help" className="mt-0">
                            <HelpCommandsPage />
                        </TabsContent>
                    </Tabs>
                </main>

                {/* Footer */}
                <footer className="mt-12 py-6 text-center text-sm text-sky-600/70 border-t border-white/30">
                    <p>
                        © {new Date().getFullYear()} · Built with{' '}
                        <span className="text-pink-500">♥</span> using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-sky-700 transition-colors"
                        >
                            caffeine.ai
                        </a>
                    </p>
                </footer>

                {/* Profile Setup Modal */}
                {showProfileSetup && (
                    <ProfileSetupModal onClose={() => setShowProfileSetup(false)} />
                )}

                <Toaster />
            </div>
        </ThemeProvider>
    );
}
