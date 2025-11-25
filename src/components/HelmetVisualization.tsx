import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Sky, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface HelmetVisualizationProps {
  rotation: { x: number; y: number; z: number };
}

function ScooterModel({ rotation }: HelmetVisualizationProps) {
  // Charge le fichier depuis le dossier /public/
  // Assurez-vous que le fichier s'appelle bien 'scooter1.glb' dans votre dossier public
  const { scene } = useGLTF('/scooter1.glb'); 
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Conversion degrés -> radians pour Three.js
      // Nous appliquons la rotation reçue des capteurs
      
      // CORRECTION 1 : Ajout du "-" devant rotation.x pour inverser le sens (Haut/Bas)
      meshRef.current.rotation.x = -rotation.x * (Math.PI / 180);
      
      meshRef.current.rotation.y = rotation.y * (Math.PI / 180);
      meshRef.current.rotation.z = rotation.z * (Math.PI / 180);
    }
  });

  return (
    // On descend le groupe à Y=-0.5 pour qu'il touche le sol
    <group ref={meshRef} position={[0, -0.5, 0]}>
      <Center>
        <primitive 
          object={scene} 
          scale={0.5} 
          // CORRECTION 2 : Rotation à [0, 0, 0] pour mettre le scooter face à la caméra
          rotation={[0, 0, 0]} 
        />
      </Center>
    </group>
  );
}

// Décor : Ciel et Sol
function SceneEnvironment() {
  return (
    <>
      <Sky distance={450000} sunPosition={[5, 1, 8]} inclination={0} azimuth={0.25} />
      <Environment preset="city" background={false} />
      
      {/* Sol simple */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial 
          color="#4a5568" 
          metalness={0.2} 
          roughness={0.6} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Grille pour référence visuelle */}
      <gridHelper args={[20, 20, '#2d3748', '#4a5568']} position={[0, -0.99, 0]} />
    </>
  );
}

export default function HelmetVisualization({ rotation }: HelmetVisualizationProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
      <Canvas
        shadows
        // Caméra de face, légèrement surélevée
        camera={{ position: [0, 1.5, 4], fov: 45 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          castShadow 
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />

        <SceneEnvironment />

        {/* Le modèle 3D qui bouge */}
        <ScooterModel rotation={rotation} />

        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          // Limite l'angle de caméra pour ne pas passer sous le sol
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
      </Canvas>
    </div>
  );
}

// Préchargement du modèle
useGLTF.preload('/scooter1.glb');