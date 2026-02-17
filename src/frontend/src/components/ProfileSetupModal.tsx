import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Sparkles } from 'lucide-react';

interface ProfileSetupModalProps {
    onClose: () => void;
}

export default function ProfileSetupModal({ onClose }: ProfileSetupModalProps) {
    const [name, setName] = useState('');
    const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            saveProfile(
                {
                    name: name.trim(),
                    pastelSkyProfile: undefined,
                },
                {
                    onSuccess: () => {
                        onClose();
                    },
                }
            );
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gradient-to-b from-sky-100 to-peach-100 border-2 border-white/50">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-sky-700 text-center flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6" />
                        Welcome to Qudo Skyworld!
                    </DialogTitle>
                    <DialogDescription className="text-center text-sky-600">
                        Let's create your profile to get started
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sky-700">
                            Your Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="bg-white/70 border-white/50 rounded-2xl"
                            maxLength={30}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={!name.trim() || isPending}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-full py-6 text-lg font-bold"
                    >
                        {isPending ? 'Creating...' : 'Start Your Journey'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
