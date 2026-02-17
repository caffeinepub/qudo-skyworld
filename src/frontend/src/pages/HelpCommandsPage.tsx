import PastelPanel from '../components/PastelPanel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Play, Home, Users, Gift, ShoppingBag } from 'lucide-react';

export default function HelpCommandsPage() {
    return (
        <div className="space-y-6">
            <PastelPanel className="p-6">
                <h2 className="text-2xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6" />
                    Help & Commands
                </h2>
                <p className="text-sky-600">
                    Welcome to Qudo Skyworld! Here's everything you need to know to enjoy your relaxing
                    journey through the pastel skies.
                </p>
            </PastelPanel>

            <PastelPanel className="p-6">
                <h3 className="text-xl font-bold text-sky-700 mb-4">Bot Commands</h3>
                <p className="text-sm text-sky-600 mb-4">
                    When using Qudo Skyworld through Telegram, you can use these commands:
                </p>
                <Accordion type="single" collapsible className="space-y-2">
                    <AccordionItem value="start" className="bg-white/50 rounded-2xl px-4 border-none">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                                <Play className="w-4 h-4 text-sky-600" />
                                <span className="font-mono text-sm">/start</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-sky-600">
                            Opens the Qudo Skyworld Mini App and takes you to the main play screen. This is
                            your entry point to start playing!
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="play" className="bg-white/50 rounded-2xl px-4 border-none">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                                <Play className="w-4 h-4 text-sky-600" />
                                <span className="font-mono text-sm">/play</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-sky-600">
                            Opens the game canvas where you can start a new relaxing session. Guide your cloud
                            through the sky and collect flowers and sparkles!
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="world" className="bg-white/50 rounded-2xl px-4 border-none">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                                <Home className="w-4 h-4 text-sky-600" />
                                <span className="font-mono text-sm">/world</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-sky-600">
                            View your personal Sky World with all your collected decorations, stats, and
                            persistent stars. Watch your world grow as you play!
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="visit" className="bg-white/50 rounded-2xl px-4 border-none">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-sky-600" />
                                <span className="font-mono text-sm">/visit [code]</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-sky-600">
                            Visit a friend's Sky World using their friend code. You can leave them a nice
                            message and see their progress!
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="balance" className="bg-white/50 rounded-2xl px-4 border-none">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                                <Gift className="w-4 h-4 text-sky-600" />
                                <span className="font-mono text-sm">/balance</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-sky-600">
                            Check your Qudo token balance and view your recent rewards. See how much you've
                            earned from your relaxing sessions!
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="help" className="bg-white/50 rounded-2xl px-4 border-none">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-sky-600" />
                                <span className="font-mono text-sm">/help</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-sky-600">
                            Opens this help page with all available commands and gameplay instructions.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </PastelPanel>

            <PastelPanel className="p-6">
                <h3 className="text-xl font-bold text-sky-700 mb-4">How to Play</h3>
                <div className="space-y-4 text-sm text-sky-600">
                    <div>
                        <h4 className="font-bold text-sky-700 mb-2">🎮 Gameplay</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Move your mouse or finger to guide your cloud avatar</li>
                            <li>Collect falling flowers and floating sparkles</li>
                            <li>Catch the glowing Qudo symbol for 2x rewards</li>
                            <li>Each session lasts 2 minutes of relaxing gameplay</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sky-700 mb-2">🏆 Progression</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Unlock decorations for your Sky World</li>
                            <li>Build your daily streak for bonus rewards</li>
                            <li>Complete quests for extra Qudo tokens</li>
                            <li>Level up and earn cosmetic currency</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sky-700 mb-2">👥 Social Features</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Share your friend code with others</li>
                            <li>Visit friends' Sky Worlds</li>
                            <li>Leave messages in their inbox</li>
                            <li>Compare progress on the leaderboard</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sky-700 mb-2">🎨 Customization</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Earn currency by playing sessions</li>
                            <li>Buy cosmetics in the shop</li>
                            <li>Customize your cloud trail, flowers, sparkles, and frame</li>
                            <li>All cosmetics are visual-only and don't affect gameplay</li>
                        </ul>
                    </div>
                </div>
            </PastelPanel>

            <PastelPanel className="p-6">
                <h3 className="text-xl font-bold text-sky-700 mb-4">Tips for Maximum Relaxation</h3>
                <div className="space-y-2 text-sm text-sky-600">
                    <p>✨ Play with sound on for the full ambient experience</p>
                    <p>🌅 The sky changes based on your local time of day</p>
                    <p>🎯 Focus on smooth, flowing movements for the best experience</p>
                    <p>💫 Take breaks between sessions to enjoy your Sky World</p>
                    <p>🤝 Share your progress with friends for extra motivation</p>
                </div>
            </PastelPanel>
        </div>
    );
}
