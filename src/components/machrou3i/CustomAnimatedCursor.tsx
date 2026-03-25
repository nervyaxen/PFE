import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomAnimatedCursor() {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const smoothX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
    const smoothY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });

    const [isHovering, setIsHovering] = useState(false);
    const [hoverType, setHoverType] = useState<'button' | 'card' | 'interactive' | null>(null);
    const [text, setText] = useState('');

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const hintElement = target.closest('[data-narrate]') || target.closest('[data-cursor-text]') as HTMLElement;

            if (hintElement) {
                setIsHovering(true);
                setHoverType('interactive');
                setText(hintElement.getAttribute('data-narrate') || hintElement.getAttribute('data-cursor-text') || '');
                return;
            }

            if (target.closest('button') || target.closest('a')) {
                setIsHovering(true);
                setHoverType('button');
                setText('');
                return;
            }

            if (target.closest('.glass') || target.closest('.glass-panel') || target.closest('.cinematic-panel')) {
                setIsHovering(true);
                setHoverType('card');
                setText('');
                return;
            }

            setIsHovering(false);
            setHoverType(null);
            setText('');
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Determine visual state based on hover type
    const size = isHovering && hoverType === 'interactive' && text ? 96 : hoverType === 'button' ? 40 : hoverType === 'card' ? 24 : 12;
    const glow = hoverType === 'card' || hoverType === 'interactive' ? '0 0 20px 2px hsl(var(--neon) / 0.5)' : '0 0 10px 0px hsl(var(--neon) / 0.3)';

    return (
        <>
            {/* Smooth trailing glow circle */}
            <motion.div
                className="fixed top-0 left-0 flex items-center justify-center pointer-events-none z-[9999] mix-blend-screen"
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: size,
                    height: size,
                    backgroundColor: isHovering && text ? 'hsl(var(--neon) / 0.15)' : 'hsl(var(--neon) / 0.4)',
                    boxShadow: glow,
                    borderRadius: '50%',
                    border: text ? '1px solid hsl(var(--neon) / 0.4)' : 'none',
                    backdropFilter: text ? 'blur(4px)' : 'none',
                    scale: hoverType === 'button' ? 1.2 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                {/* Center Core dot */}
                {(!isHovering || hoverType === 'card') && (
                    <motion.div
                        className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_2px_#fff]"
                        animate={{ opacity: hoverType === 'card' ? 0.5 : 1 }}
                    />
                )}

                {/* Text for interactive elements */}
                {isHovering && text && (
                    <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] uppercase font-bold text-neon tracking-wider whitespace-nowrap"
                    >
                        {text.split('|')[0]}
                    </motion.span>
                )}
            </motion.div>
        </>
    );
}
