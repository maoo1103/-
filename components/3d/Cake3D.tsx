import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Cylinder, Box, Extrude, Sphere, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { CakeConfig, ShapeType, Decoration } from '../../types';

// Fix for JSX.IntrinsicElements errors when @react-three/fiber types aren't picked up globally.
// We need to extend React.JSX.IntrinsicElements in newer React/TS versions.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      ringGeometry: any;
      pointLight: any;
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        group: any;
        mesh: any;
        meshStandardMaterial: any;
        meshBasicMaterial: any;
        ringGeometry: any;
        pointLight: any;
      }
    }
  }
}

interface Cake3DProps {
  config: CakeConfig;
  isBaking?: boolean;
  bakingProgress?: number; // 0 to 1
  onDecorationChange?: (id: string, newProps: Partial<Decoration>) => void;
  setOrbitEnabled?: (enabled: boolean) => void;
}

const CakeMaterial = ({ color, isBaking, bakingProgress = 0 }: { color: string, isBaking?: boolean, bakingProgress?: number }) => {
    const baseColor = new THREE.Color(color);
    const bakedColor = baseColor.clone().multiplyScalar(0.8).add(new THREE.Color('#d4a373').multiplyScalar(0.2));
    const finalColor = isBaking ? baseColor.clone().lerp(bakedColor, bakingProgress) : baseColor;

    return (
        <meshStandardMaterial 
            color={finalColor} 
            roughness={0.4} 
            metalness={0.1} 
        />
    );
};

const HeartShape = ({ color, isBaking, bakingProgress }: any) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = 0, y = 0;
    s.moveTo(x + 5, y + 5);
    s.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    s.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    s.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    s.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    s.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    s.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
    return s;
  }, []);

  return (
    <Extrude args={[shape, { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 }]} rotation={[Math.PI / 2, Math.PI, 0]} position={[0, 1, 0]} scale={[0.15, 0.15, 0.15]}>
        <CakeMaterial color={color} isBaking={isBaking} bakingProgress={bakingProgress} />
    </Extrude>
  );
};

const CustomShape = ({ points, color, isBaking, bakingProgress }: any) => {
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        if (!points || points.length < 3) {
            s.moveTo(0, 0); s.lineTo(1, 0); s.lineTo(0.5, 1); s.lineTo(0, 0);
            return s;
        }
        s.moveTo(points[0][0], points[0][1]);
        for(let i=1; i<points.length; i++) {
            s.lineTo(points[i][0], points[i][1]);
        }
        s.lineTo(points[0][0], points[0][1]);
        return s;
    }, [points]);

    return (
        <Extrude args={[shape, { depth: 1.5, bevelEnabled: true, bevelSegments: 3 }]} rotation={[Math.PI / 2, 0, 0]} position={[-1, 1, 1]} scale={0.5}>
            <CakeMaterial color={color} isBaking={isBaking} bakingProgress={bakingProgress} />
        </Extrude>
    )
}

const DecorationMesh: React.FC<{ 
    item: Decoration, 
    onUpdate?: (id: string, props: Partial<Decoration>) => void,
    setOrbitEnabled?: (enabled: boolean) => void 
}> = ({ item, onUpdate, setOrbitEnabled }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const [isActive, setIsActive] = useState(false);
    const { camera, gl, raycaster } = useThree();
    
    // Interaction State
    const [isDragging, setIsDragging] = useState(false);
    const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -item.position[1]), [item.position]);

    useEffect(() => {
        if (isActive) {
            // Add listeners to window/canvas for move/up when active
            const onPointerMove = (e: PointerEvent | TouchEvent) => {
                if (isDragging) {
                    handleDrag(e);
                }
            };
            const onPointerUp = () => {
                setIsDragging(false);
                setIsActive(false);
                setOrbitEnabled?.(true);
            };
            
            // Handle pinch zoom separately via simple touch distance logic if needed, 
            // but for simplicity we'll implement simple wheel/pinch logic here if we can.
            const onWheel = (e: WheelEvent) => {
                 if (isActive) {
                     e.preventDefault();
                     const newScale = Math.max(0.2, Math.min(3, item.scale - e.deltaY * 0.005));
                     onUpdate?.(item.id, { scale: newScale });
                 }
            };

            // Touch pinch simulation
            let initialPinchDist = 0;
            let initialScale = item.scale;
            const onTouchMove = (e: TouchEvent) => {
                if (e.touches.length === 2 && isActive) {
                    const dist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    if (initialPinchDist === 0) {
                        initialPinchDist = dist;
                        initialScale = item.scale;
                    } else {
                        const scaleFactor = dist / initialPinchDist;
                        onUpdate?.(item.id, { scale: Math.max(0.2, Math.min(3, initialScale * scaleFactor)) });
                    }
                }
            };
            
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            gl.domElement.addEventListener('wheel', onWheel);
            gl.domElement.addEventListener('touchmove', onTouchMove);

            return () => {
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onPointerUp);
                gl.domElement.removeEventListener('wheel', onWheel);
                gl.domElement.removeEventListener('touchmove', onTouchMove);
            }
        }
    }, [isActive, isDragging, item.id, item.scale, dragPlane, camera, onUpdate, setOrbitEnabled, gl.domElement]);

    const handleDrag = (e: PointerEvent | TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as PointerEvent).clientY;

        const rect = gl.domElement.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera({ x, y }, camera);
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, target);

        if (target) {
             onUpdate?.(item.id, { position: [target.x, item.position[1], target.z] });
        }
    };

    const onPointerDown = (e: any) => {
        e.stopPropagation();
        if (onUpdate) {
            setIsActive(true);
            setIsDragging(true);
            setOrbitEnabled?.(false);
        }
    };

    // Animation frames
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (item.type === 'dynamic' && groupRef.current) {
            if (item.model === 'disco_ball') {
                groupRef.current.rotation.y += 0.05;
                // groupRef.current.position.y += Math.sin(t * 3) * 0.005; // Conflict with drag
            }
            if (item.model === 'breathing_glow' && meshRef.current) {
                 // Special breathing visual handled locally, but actual scale prop is source of truth
            }
        }
    });

    const Geometry = useMemo(() => {
        // Static mappings
        if (item.type === 'static') {
            switch(item.model) {
                case 'strawberry': case 'cherry': return <Sphere args={[0.2, 16, 16]} />;
                case 'blueberry': case 'pearl': return <Sphere args={[0.15, 12, 12]} />;
                case 'candle_basic': return <Cylinder args={[0.04, 0.04, 0.6]} />;
                case 'star_candy': return <Sphere args={[0.18, 4, 2]} />; 
                case 'heart_topper': return <Box args={[0.4, 0.4, 0.05]} />;
                default: return <Box args={[0.2, 0.2, 0.2]} />;
            }
        }
        // Dynamic mappings
        switch(item.model) {
            case 'disco_ball': return <Sphere args={[0.25, 8, 4]} />;
            case 'candle_flicker': return <Cylinder args={[0.04, 0.04, 0.6]} />;
            case 'breathing_glow': return <Sphere args={[0.2, 16, 16]} />;
            case 'falling_frosting': return null;
            default: return <Box args={[0.2, 0.2, 0.2]} />;
        }
    }, [item.type, item.model]);

    return (
        <group 
            ref={groupRef} 
            position={item.position} 
            rotation={item.rotation} 
            scale={item.scale}
            onPointerDown={onPointerDown}
        >
            {/* Visual Indicator of Selection */}
            {isActive && (
                 <mesh position={[0, 0, 0]}>
                     <ringGeometry args={[0.3, 0.35, 32]} />
                     <meshBasicMaterial color="white" opacity={0.5} transparent side={THREE.DoubleSide} />
                 </mesh>
            )}

            {/* Mesh Representation */}
            {item.model !== 'falling_frosting' && (
                <mesh ref={meshRef}>
                    {Geometry}
                    <meshStandardMaterial 
                        color={item.color} 
                        roughness={item.model === 'disco_ball' ? 0 : 0.4}
                        metalness={item.model === 'disco_ball' ? 1 : 0.1}
                        emissive={item.model === 'breathing_glow' ? item.color : '#000'}
                        emissiveIntensity={isActive ? 0.2 : 0}
                    />
                </mesh>
            )}

            {/* Special Effects */}
            {item.model === 'candle_flicker' && (
                <group position={[0, 0.35, 0]}>
                    <Sphere args={[0.05, 8, 8]}>
                        <meshBasicMaterial color="orange" />
                    </Sphere>
                    <pointLight intensity={0.8} distance={2} color="orange" decay={2} />
                    <Sparkles count={5} scale={0.2} speed={2} size={1} color="#ffaa00" />
                </group>
            )}

            {item.model === 'disco_ball' && (
                <Sparkles count={10} scale={0.6} size={2} speed={0.5} color="#ffffff" />
            )}

            {item.model === 'falling_frosting' && (
                <Sparkles 
                    count={30} 
                    scale={[1, 3, 1]} 
                    size={2} 
                    speed={0.4} 
                    opacity={0.8} 
                    color="#ffffff" 
                    position={[0, -1, 0]} 
                />
            )}
            
            {item.model === 'candle_basic' && (
                 <group position={[0, 0.35, 0]}>
                    <Sphere args={[0.05, 8, 8]}>
                        <meshBasicMaterial color="orange" />
                    </Sphere>
                 </group>
            )}
        </group>
    );
};

export const Cake3D: React.FC<Cake3DProps> = ({ config, isBaking, bakingProgress = 0, onDecorationChange, setOrbitEnabled }) => {
  const cakeRef = useRef<THREE.Group>(null);

  // Baking Animation
  const scale = isBaking ? 0.8 + (bakingProgress * 0.2) : 1;
  const layerHeight = 1.2;
  
  const layers = config.layers || 1;
  const shape = config.shape || ShapeType.ROUND;
  const color = config.color || '#Fce7f3';
  const decorations = config.decorations || [];

  // Generate layers
  const renderLayers = () => {
    return Array.from({ length: layers }).map((_, i) => {
        const layerScale = 1 - (i * 0.2); // Each layer 20% smaller
        const yPos = i * (layerHeight * 0.85); // Stack with slight overlap

        return (
            <group key={`layer-${i}`} position={[0, yPos, 0]} scale={[layerScale, 1, layerScale]}>
                {shape === ShapeType.ROUND && (
                  <Cylinder args={[1.5, 1.5, layerHeight, 32]} position={[0, 0.6, 0]}>
                     <CakeMaterial color={color} isBaking={isBaking} bakingProgress={bakingProgress} />
                  </Cylinder>
                )}
                {shape === ShapeType.SQUARE && (
                   <Box args={[2.5, layerHeight, 2.5]} position={[0, 0.6, 0]}>
                      <CakeMaterial color={color} isBaking={isBaking} bakingProgress={bakingProgress} />
                   </Box>
                )}
                {shape === ShapeType.HEART && (
                    <group position={[-1.2, 0, 1]}>
                       <HeartShape color={color} isBaking={isBaking} bakingProgress={bakingProgress} />
                    </group>
                )}
                 {shape === ShapeType.CUSTOM && (
                    <group position={[0, 0, 0]}>
                       <CustomShape points={config.customPath} color={color} isBaking={isBaking} bakingProgress={bakingProgress} />
                    </group>
                )}
            </group>
        );
    });
  };

  return (
    <group ref={cakeRef} scale={[scale, scale, scale]}>
      {/* Base Cake Layers */}
      <group position={[0, -0.5, 0]}>
          {renderLayers()}
      </group>

      {/* Decorations */}
      <group position={[0, (layers - 1) * (layerHeight * 0.85) + 0.15, 0]}>
        {decorations.map((deco) => (
           <DecorationMesh 
              key={deco.id} 
              item={deco} 
              onUpdate={onDecorationChange}
              setOrbitEnabled={setOrbitEnabled}
            />
        ))}
      </group>

      {/* Magic Particles */}
      {(!isBaking || bakingProgress > 0.9) && (
          <Sparkles count={20} scale={4} size={2} speed={0.4} opacity={0.5} color={color} />
      )}
    </group>
  );
};