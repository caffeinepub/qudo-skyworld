import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudioManager } from '../audio/useAudioManager';

export default function AudioControls() {
    const { volume, isMuted, setVolume, toggleMute } = useAudioManager();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-sky-700">Volume</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMute}
                            className="rounded-full"
                        >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                    </div>
                    <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        onValueChange={(values) => setVolume(values[0] / 100)}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
