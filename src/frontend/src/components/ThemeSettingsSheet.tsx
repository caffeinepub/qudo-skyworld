import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useTimeOfDay, TimeOfDay } from '../theme/timeOfDay';

export default function ThemeSettingsSheet() {
    const { timeOfDay, setTimeOfDayOverride } = useTimeOfDay();

    const handleThemeChange = (value: string) => {
        if (value === 'auto') {
            setTimeOfDayOverride(null);
        } else {
            setTimeOfDayOverride(value as TimeOfDay);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Settings className="w-4 h-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="bg-white/90 backdrop-blur-sm border-white/50">
                <SheetHeader>
                    <SheetTitle className="text-sky-700">Theme Settings</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-sky-700 mb-3">Time of Day</h3>
                        <RadioGroup value={timeOfDay} onValueChange={handleThemeChange}>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="auto" id="auto" />
                                    <Label htmlFor="auto" className="cursor-pointer">
                                        Automatic (based on your time)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="morning" id="morning" />
                                    <Label htmlFor="morning" className="cursor-pointer">
                                        🌅 Morning
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="afternoon" id="afternoon" />
                                    <Label htmlFor="afternoon" className="cursor-pointer">
                                        ☀️ Afternoon
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="evening" id="evening" />
                                    <Label htmlFor="evening" className="cursor-pointer">
                                        🌆 Evening
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="night" id="night" />
                                    <Label htmlFor="night" className="cursor-pointer">
                                        🌙 Night
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
