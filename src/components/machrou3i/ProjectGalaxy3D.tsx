import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Html, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface NodeData {
    id: number;
    type: 'idea' | 'risk' | 'deadline' | 'step';
    position: [number, number, number];
    label: string;
    narrate: string;
}

const GALAXY_NODES: NodeData[] = [
    { id: 1, type: 'idea', position: [0, 0, 0], label: 'Core AI Idea', narrate: 'Core Concept|Synthesizing your primary objective' },
    { id: 2, type: 'step', position: [-1.5, 0.8, -0.5], label: 'Phase 1 MVP', narrate: 'Next Step|Initial build architecture' },
    { id: 3, type: 'risk', position: [1.2, -0.6, 0.5], label: 'Market Risk', narrate: 'Risk Factor|Competitor saturation detected' },
    { id: 4, type: 'deadline', position: [0.8, 1.2, -1], label: 'Q3 Launch', narrate: 'Deadline|Estimated time to market' },
    { id: 5, type: 'step', position: [-0.8, -1.2, 0.2], label: 'Funding', narrate: 'Milestone|Seed round preparation' }
];

export default function ProjectGalaxy3D({ t }: { t?: (k: string) => string }) {
    const { mouse } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    // Parallax rotation based on mouse
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.2, 0.05);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.2, 0.05);
        }
    });

    const getColor = (type: string) => {
        switch (type) {
            case 'idea': return '#34d399'; // neon
            case 'risk': return '#ef4444'; // destructive
            case 'deadline': return '#f2c84b'; // gold
            case 'step': return '#60a5fa'; // primary/blueish
            default: return '#ffffff';
        }
    };

    // Create connections between nodes
    const lines = useMemo(() => {
        const l = [];
        const core = GALAXY_NODES[0].position;
        for (let i = 1; i < GALAXY_NODES.length; i++) {
            l.push({ start: core, end: GALAXY_NODES[i].position });
        }
        // Connect 2 and 4
        l.push({ start: GALAXY_NODES[1].position, end: GALAXY_NODES[3].position });
        // Connect 3 and 5
        l.push({ start: GALAXY_NODES[2].position, end: GALAXY_NODES[4].position });
        return l;
    }, []);

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 5, 2]} intensity={1.5} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#34d399" distance={3} />

            {/* Network Lines */}
            {lines.map((line, i) => (
                <Line
                    key={`line-${i}`}
                    points={[line.start, line.end]}
                    color="hsl(var(--neon))"
                    opacity={0.15}
                    transparent
                    lineWidth={1}
                />
            ))}

            {/* Galaxy Nodes */}
            {GALAXY_NODES.map((node) => {
                const isHovered = hoveredNode === node.id;
                const color = getColor(node.type);
                const scale = isHovered ? 1.4 : node.type === 'idea' ? 1.2 : 0.8;

                return (
                    <Float
                        key={node.id}
                        speed={node.type === 'idea' ? 1 : 2}
                        rotationIntensity={isHovered ? 0 : 0.5}
                        floatIntensity={isHovered ? 0 : 0.5}
                        position={node.position}
                    >
                        <mesh
                            onPointerOver={() => setHoveredNode(node.id)}
                            onPointerOut={() => setHoveredNode(null)}
                            scale={scale}
                        >
                            <sphereGeometry args={[0.15, 32, 32]} />
                            <meshStandardMaterial
                                color={color}
                                emissive={color}
                                emissiveIntensity={isHovered ? 2 : 0.8}
                                roughness={0.2}
                                metalness={0.8}
                                transparent
                                opacity={0.9}
                            />

                            {/* Outer Glow */}
                            <Sphere args={[0.22, 16, 16]}>
                                <meshBasicMaterial color={color} transparent opacity={isHovered ? 0.3 : 0.15} blending={THREE.AdditiveBlending} />
                            </Sphere>

                            {/* HTML Overlay for Cursor Narrator hint */}
                            <Html position={[0, 0, 0]} center className="pointer-events-auto">
                                <div
                                    className="w-12 h-12 rounded-full cursor-pointer"
                                    data-narrate={node.narrate}
                                    aria-label={node.label}
                                />
                                {isHovered && (
                                    <div className="absolute top-6 left-6 whitespace-nowrap bg-surface/90 border border-border px-3 py-1.5 rounded-xl backdrop-blur-md shadow-xl z-50 animate-in fade-in zoom-in duration-200">
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-0.5">{node.type}</p>
                                        <p className="text-sm font-semibold text-foreground">{node.label}</p>
                                    </div>
                                )}
                            </Html>
                        </mesh>
                    </Float>
                );
            })}
        </group>
    );
}
