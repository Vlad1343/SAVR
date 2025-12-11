'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Float, MeshTransmissionMaterial } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';
import * as THREE from 'three';

type Props = { balance: number; goal: number; points?: number };

function tierFromPoints(pts: number) {
  if (pts >= 5000) return { name: 'Platinum', nextAt: null };
  if (pts >= 1500) return { name: 'Gold', nextAt: 5000 };
  if (pts >= 500)  return { name: 'Silver', nextAt: 1500 };
  return { name: 'Bronze', nextAt: 500 };
}

function FresnelRim() {
  return (
    <mesh>
      <cylinderGeometry args={[0.51, 0.51, 1.22, 100, 1, true]} />
      <shaderMaterial
        transparent
        uniforms={{
          color: { value: new THREE.Color('#a7fff2') },
          power: { value: 2.0 },
        }}
        vertexShader={/* glsl */`
          varying vec3 vN;
          varying vec3 vW;
          void main() {
            vN = normalize(normalMatrix * normal);
            vec4 wPos = modelMatrix * vec4(position, 1.0);
            vW = normalize(wPos.xyz - cameraPosition);
            gl_Position = projectionMatrix * viewMatrix * wPos;
          }
        `}
        fragmentShader={/* glsl */`
          uniform vec3 color; uniform float power;
          varying vec3 vN; varying vec3 vW;
          void main(){
            float rim = 1.0 - max(dot(vN, -vW), 0.0);
            float a = pow(rim, power);
            gl_FragColor = vec4(color, a * 0.5);
          }
        `}
      />
    </mesh>
  );
}

function Liquid({ level = 0.5 }: { level?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const { y } = useSpring({ y: level, config: { tension: 160, friction: 24 } });
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = y.get() * 0.9 - 0.45;
      ref.current.rotation.z = Math.sin(t * 0.35) * 0.035;
    }
  });
  return (
    <a.mesh ref={ref}>
      <cylinderGeometry args={[0.42, 0.42, 0.9, 96]} />
      <meshPhysicalMaterial
        color="#16ffe0"
        roughness={0.08}
        metalness={0.05}
        transmission={0.4}
        thickness={0.2}
        transparent
        opacity={0.85}
        clearcoat={1}
      />
    </a.mesh>
  );
}

function Pot() {
  return (
    <group>
      {/* Glass body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.2, 120]} />
        <MeshTransmissionMaterial
          ior={1.45}
          thickness={0.6}
          roughness={0.08}
          transmission={1}
          anisotropy={0.2}
          chromaticAberration={0.01}
          clearcoat={1}
          clearcoatRoughness={0.2}
          samples={8}
          resolution={512}
          color="#e8fff9"
        />
      </mesh>
      {/* Gold lid */}
      <mesh position={[0, 0.66, 0]}>
        <torusGeometry args={[0.43, 0.05, 40, 150]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.18} />
      </mesh>
      {/* Neon base */}
      <mesh position={[0, -0.66, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.06, 80]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Rim glow */}
      <FresnelRim />
    </group>
  );
}

export function SavingsPot3D({ balance, goal, points = 0 }: Props) {
  const pct = Math.min(balance / goal, 1);
  const tier = tierFromPoints(points);
  const ptsToNext = tier.nextAt ? Math.max(0, tier.nextAt - points) : 0;

  return (
    <div className="relative hover:scale-[1.02] transition-transform duration-500 ease-out transform-gpu">
      <div className="absolute inset-0 bg-gradient-radial from-emerald-400/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="relative w-full h-[500px] rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden premium-shine">
        <Canvas shadows camera={{ position: [2.4, 1.6, 2.4], fov: 45 }}>
          <color attach="background" args={['#0e1114']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 3, 2]} intensity={1.5} color="#fff8e7" castShadow />
          <spotLight position={[0, 5, 2]} intensity={2.4} angle={0.4} color="#00ffb0" penumbra={0.8} />
          <spotLight position={[-3, 4, -2]} intensity={1.2} angle={0.3} color="#34d399" penumbra={1} />
          <pointLight position={[-3, 2, -2]} intensity={1.0} color="#80ffe5" />
          <pointLight position={[3, -2, 2]} intensity={0.6} color="#10b981" />
          <Float speed={1.2} rotationIntensity={0.25}>
            <group>
              <Pot />
              <Liquid level={pct} />
            </group>
          </Float>
          <ContactShadows position={[0, -0.7, 0]} opacity={0.45} scale={6} blur={3} />
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.45} />
        </Canvas>

        {/* HUD */}
        <div className="absolute bottom-0 inset-x-0 px-5 py-4 bg-gradient-to-t from-black/45 to-transparent flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-white/70">Savings Pot</div>
            <div className="text-sm text-white/60">£{balance.toLocaleString()} / £{goal.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400">{Math.round(pct * 100)}%</div>
            <div className="text-xs text-white/70">
              {tier.name} • {tier.nextAt ? `${ptsToNext} pts to next` : 'Top tier'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
