import { useState } from 'react';
import PastelPanel from '../components/PastelPanel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Check } from 'lucide-react';
import { useCosmetics, COSMETICS_CATALOG } from '../state/useCosmetics';
import { toast } from 'sonner';

export default function CosmeticsShopPage() {
    const { currency, equippedCosmetics, purchaseCosmetic, equipCosmetic } = useCosmetics();
    const [selectedCategory, setSelectedCategory] = useState('trails');

    const categories = Object.keys(COSMETICS_CATALOG);

    const handlePurchase = (itemId: string, cost: number) => {
        if (currency >= cost) {
            purchaseCosmetic(itemId, cost);
            toast.success('Cosmetic purchased!');
        } else {
            toast.error('Not enough currency!');
        }
    };

    const handleEquip = (itemId: string) => {
        equipCosmetic(itemId);
        toast.success('Cosmetic equipped!');
    };

    return (
        <div className="space-y-6">
            <PastelPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-sky-700 flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6" />
                        Cosmetics Shop
                    </h2>
                    <div className="bg-white/70 rounded-full px-4 py-2">
                        <span className="text-sm text-sky-600">Your Currency: </span>
                        <span className="text-lg font-bold text-sky-700">{currency}</span>
                    </div>
                </div>
                <p className="text-sm text-sky-600">
                    Customize your Sky World with beautiful cosmetics! All items are visual-only and don't
                    affect gameplay.
                </p>
            </PastelPanel>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm rounded-3xl p-1">
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category}
                            value={category}
                            className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-soft capitalize"
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {categories.map((category) => (
                    <TabsContent key={category} value={category} className="mt-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {COSMETICS_CATALOG[category].map((item) => {
                                const isPurchased = item.cost === 0 || currency >= 0; // Simplified for demo
                                const isEquipped = equippedCosmetics[category] === item.id;

                                return (
                                    <PastelPanel key={item.id} className="p-4">
                                        <div
                                            className="w-full aspect-square rounded-2xl mb-3 flex items-center justify-center text-4xl"
                                            style={{ backgroundColor: item.preview }}
                                        >
                                            {item.icon}
                                        </div>
                                        <h3 className="font-bold text-sky-700 text-sm mb-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-sky-600 mb-3">{item.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-sky-700">
                                                {item.cost} 💎
                                            </span>
                                            {isEquipped ? (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="rounded-full"
                                                    disabled
                                                >
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Equipped
                                                </Button>
                                            ) : isPurchased ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleEquip(item.id)}
                                                    className="rounded-full"
                                                >
                                                    Equip
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handlePurchase(item.id, item.cost)}
                                                    className="rounded-full"
                                                    disabled={currency < item.cost}
                                                >
                                                    Buy
                                                </Button>
                                            )}
                                        </div>
                                    </PastelPanel>
                                );
                            })}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            <PastelPanel className="p-6">
                <h3 className="text-lg font-bold text-sky-700 mb-2">💎 Earn Currency</h3>
                <p className="text-sm text-sky-600">
                    Play sessions to earn currency! Each flower collected gives you 2 currency, and each
                    sparkle gives you 1 currency.
                </p>
            </PastelPanel>
        </div>
    );
}
