import type React from "react";
import { useEffect, useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const PanoramaMesh: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
	const texture = useTexture(imageUrl);
	const meshRef = useRef<THREE.Mesh>(null);

	useEffect(() => {
		return () => {
			URL.revokeObjectURL(imageUrl);
		};
	}, [imageUrl]);

	return (
		<mesh ref={meshRef}>
			<sphereGeometry args={[500, 100, 100]} scale={[-1, 1, 1]} />
			<meshBasicMaterial map={texture} side={THREE.BackSide} />
		</mesh>
	);
};

export default PanoramaMesh;
