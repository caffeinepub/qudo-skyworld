import { useEffect, useRef, useState } from 'react';

export function useAudioManager() {
    const [volume, setVolumeState] = useState(() => {
        const stored = localStorage.getItem('audioVolume');
        return stored ? parseFloat(stored) : 0.5;
    });
    const [isMuted, setIsMuted] = useState(() => {
        const stored = localStorage.getItem('audioMuted');
        return stored === 'true';
    });
    const [isUnlocked, setIsUnlocked] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBuffersRef = useRef<Record<string, AudioBuffer>>({});
    const audioSourcesRef = useRef<Record<string, AudioBufferSourceNode>>({});
    const gainNodeRef = useRef<GainNode | null>(null);

    useEffect(() => {
        localStorage.setItem('audioVolume', volume.toString());
    }, [volume]);

    useEffect(() => {
        localStorage.setItem('audioMuted', isMuted.toString());
    }, [isMuted]);

    const unlockAudio = async () => {
        if (isUnlocked) return;

        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            audioContextRef.current = ctx;

            const gainNode = ctx.createGain();
            gainNode.connect(ctx.destination);
            gainNodeRef.current = gainNode;

            // Load audio files
            const audioFiles = [
                { key: 'wind', url: '/assets/audio/wind-loop.mp3' },
                { key: 'chimes', url: '/assets/audio/chimes-loop.mp3' },
                { key: 'melody', url: '/assets/audio/melody-loop.mp3' },
            ];

            for (const file of audioFiles) {
                try {
                    const response = await fetch(file.url);
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
                    audioBuffersRef.current[file.key] = audioBuffer;

                    // Start playing
                    const source = ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.loop = true;
                    source.connect(gainNode);
                    source.start(0);
                    audioSourcesRef.current[file.key] = source;
                } catch (error) {
                    console.warn(`Failed to load audio: ${file.key}`, error);
                }
            }

            setIsUnlocked(true);
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    };

    useEffect(() => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const setVolume = (newVolume: number) => {
        setVolumeState(Math.max(0, Math.min(1, newVolume)));
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return {
        volume,
        isMuted,
        isUnlocked,
        setVolume,
        toggleMute,
        unlockAudio,
    };
}
