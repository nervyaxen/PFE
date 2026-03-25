import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const ParticleCluster = (props: any) => {
    const ref = useRef<any>();
    // Generate 2000 random points in a sphere of radius 1.5
    const sphere = random.inSphere(new Float32Array(2000), { radius: 1.5 });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#34D399" // Matches the Neon accent loosely (HSL 164 95 56)
                    size={0.005} // Small cinematic particles
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                />
            </Points>
        </group>
    );
};

export default function CinematicBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-hero">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ParticleCluster />
            </Canvas>
        </div>
    );
}
