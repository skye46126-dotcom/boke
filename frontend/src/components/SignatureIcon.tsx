'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SignatureIconProps {
  geometry?: 'icosahedron' | 'torus' | 'octahedron';
  color?: string;
  size?: number;
  rotationSpeed?: number; // radians per frame
  className?: string;
}

export default function SignatureIcon({
  geometry = 'icosahedron',
  color = '#333333',
  size = 1,
  rotationSpeed = 0.005,
  className = ''
}: SignatureIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Initialize Three.js scene with enhanced error handling
  const initThreeJS = () => {
    if (!containerRef.current || hasError) return;

    try {
      // Check for WebGL support
      if (!window.WebGLRenderingContext) {
        throw new Error('WebGL not supported');
      }

      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        1, // aspect ratio will be 1:1
        0.1,
        1000
      );
      camera.position.z = 3;

      // Renderer setup with enhanced error handling
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!context) {
        throw new Error('WebGL context not available');
      }

      const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true, 
        alpha: true,
        powerPreference: 'low-power', // Optimize for battery life
        failIfMajorPerformanceCaveat: true // Fail if performance would be poor
      });
      
      renderer.setSize(100, 100); // Fixed size for signature icon
      renderer.setClearColor(0x000000, 0); // Transparent background
      rendererRef.current = renderer;

      // Add canvas to container
      containerRef.current.appendChild(renderer.domElement);

      // Create geometry based on prop
      let geometryObj: THREE.BufferGeometry;
      switch (geometry) {
        case 'torus':
          geometryObj = new THREE.TorusGeometry(0.8, 0.3, 8, 16);
          break;
        case 'octahedron':
          geometryObj = new THREE.OctahedronGeometry(1);
          break;
        case 'icosahedron':
        default:
          geometryObj = new THREE.IcosahedronGeometry(1, 0);
          break;
      }

      // Material setup
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(color),
        wireframe: true // Minimalist wireframe style
      });

      // Create mesh
      const mesh = new THREE.Mesh(geometryObj, material);
      mesh.scale.setScalar(size);
      meshRef.current = mesh;
      scene.add(mesh);

      // Start animation if visible
      if (isVisible) {
        startAnimation();
      }
    } catch (error) {
      console.warn('Three.js initialization failed, falling back to hidden state:', error);
      setHasError(true);
      // Graceful degradation - hide container on error
      if (containerRef.current) {
        containerRef.current.style.display = 'none';
      }
    }
  };

  // Animation loop with non-uniform rotation and performance monitoring
  const animate = () => {
    if (!meshRef.current || !rendererRef.current || !sceneRef.current || hasError) return;

    // Performance optimization: skip frames if performance is poor
    const now = performance.now();
    const deltaTime = now - (animate as any).lastTime || 0;
    (animate as any).lastTime = now;

    // Target 30fps for battery optimization (33.33ms per frame)
    if (deltaTime < 33) {
      rafIdRef.current = requestAnimationFrame(animate);
      return;
    }

    // Non-uniform rotation speeds for more organic movement
    meshRef.current.rotation.x += rotationSpeed * 0.7;
    meshRef.current.rotation.y += rotationSpeed * 1.3;
    meshRef.current.rotation.z += rotationSpeed * 0.5;

    // Render the scene
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;
    
    try {
      rendererRef.current.render(sceneRef.current, camera);
    } catch (error) {
      console.warn('Render error, stopping animation:', error);
      setHasError(true);
      stopAnimation();
      return;
    }

    // Continue animation loop
    rafIdRef.current = requestAnimationFrame(animate);
  };

  // Start animation loop
  const startAnimation = () => {
    if (rafIdRef.current) return; // Already running
    rafIdRef.current = requestAnimationFrame(animate);
  };

  // Stop animation loop
  const stopAnimation = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  // Handle visibility changes with performance optimization
  const handleVisibilityChange = (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    const visible = entry.isIntersecting;
    
    // Only update state if visibility actually changed
    if (visible !== isVisible) {
      setIsVisible(visible);

      if (visible && meshRef.current && !hasError) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }
  };

  // Setup intersection observer for visibility detection
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(handleVisibilityChange, {
      threshold: 0.1, // Trigger when 10% visible
      rootMargin: '50px' // Start animation slightly before entering viewport
    });

    observer.observe(containerRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Initialize Three.js when component mounts
  useEffect(() => {
    initThreeJS();

    return () => {
      // Enhanced cleanup with proper disposal
      stopAnimation();
      
      // Dispose of Three.js resources
      if (meshRef.current) {
        if (meshRef.current.geometry) {
          meshRef.current.geometry.dispose();
        }
        if (meshRef.current.material) {
          if (Array.isArray(meshRef.current.material)) {
            meshRef.current.material.forEach(material => material.dispose());
          } else {
            meshRef.current.material.dispose();
          }
        }
        // Remove mesh from scene
        if (sceneRef.current) {
          sceneRef.current.remove(meshRef.current);
        }
      }
      
      if (rendererRef.current) {
        // Dispose of renderer resources
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        
        // Remove canvas from DOM
        if (containerRef.current && rendererRef.current.domElement) {
          try {
            containerRef.current.removeChild(rendererRef.current.domElement);
          } catch (e) {
            // Canvas might already be removed
            console.debug('Canvas already removed from DOM');
          }
        }
      }
      
      // Clear scene
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, []);

  // Update animation when visibility changes
  useEffect(() => {
    if (isVisible && meshRef.current && !hasError) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isVisible, hasError]);

  // Don't render anything if there's an error
  if (hasError) {
    return (
      <div 
        className={`signature-icon ${className}`}
        style={{
          width: '100px',
          height: '100px',
          display: 'none' // Hide when there's an error
        }}
        aria-label="3D signature icon"
        role="img"
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`signature-icon ${className}`}
      style={{
        width: '100px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      aria-label="3D signature icon"
      role="img"
    />
  );
}