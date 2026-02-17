import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PastelPanelProps {
    children: ReactNode;
    className?: string;
}

export default function PastelPanel({ children, className }: PastelPanelProps) {
    return (
        <div
            className={cn(
                'bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-white/50 shadow-soft',
                'relative overflow-hidden',
                className
            )}
            style={{
                backgroundImage: 'url(/assets/generated/ui-panel-texture.dim_1024x1024.png)',
                backgroundSize: '200px 200px',
                backgroundBlendMode: 'overlay',
            }}
        >
            {children}
        </div>
    );
}
