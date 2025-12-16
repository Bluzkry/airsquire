import type React from "react";
import { useEffect, useRef } from "react";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PanoramaMesh: React.FC<{ imageUrl: string; rotate?: boolean }> = ({ imageUrl, rotate }) => {
	const texture = useTexture(imageUrl);
	const meshRef = useRef<THREE.Mesh>(null);

	useEffect(() => {
		return () => {
			if (imageUrl?.startsWith("blob:")) {
				URL.revokeObjectURL(imageUrl);
			}
		};
	}, [imageUrl]);

	useFrame(() => {
		if (meshRef.current && rotate) meshRef.current.rotation.y += 0.001;
	});

	return (
		<>
			<mesh ref={meshRef}>
				<sphereGeometry args={[500, 100, 100]} scale={[-1, 1, 1]} />
				<meshBasicMaterial map={texture} side={THREE.BackSide} />
			</mesh>
			<OrbitControls enableDamping={true} enablePan={false} rotateSpeed={-0.3} minDistance={0.1} maxDistance={0.1} />
		</>
	);
};

const PanoramaCanvas: React.FC<{ imageUrl: string; rotate?: boolean }> = ({ imageUrl, rotate }) => (
	<Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
		<PanoramaMesh imageUrl={imageUrl} rotate={rotate} />
	</Canvas>
);

export default PanoramaCanvas;
