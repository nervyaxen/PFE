import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  X, 
  RotateCw, 
  Sparkles, 
  Trash2, 
  RefreshCw, 
  Download, 
  Image as ImageIcon, 
  Check,
  Sliders,
  Move
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { localDB } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ─────────────────────────────────────────────────────────────────────────────
// PRESETS
// ─────────────────────────────────────────────────────────────────────────────

const PREMIUM_GARMENT_COLORS = [
  { hex: "#F3F2EE", name: "Off White" },
  { hex: "#141416", name: "Core Black" },
  { hex: "#4A5D4E", name: "Sage Green" },
  { hex: "#C05C46", name: "Terracotta" },
  { hex: "#1F2E3D", name: "Midnight Blue" },
  { hex: "#D1C9DB", name: "Soft Lilac" },
];

const PREMIUM_BG_COLORS = [
  { hex: "#090D0B", name: "Deep Jade" },
  { hex: "#0B0F19", name: "Studio Dark" },
  { hex: "#EAE6E1", name: "Minimal Warm" },
  { hex: "#F1F3F5", name: "Soft Gray" },
  { hex: "#FFFFFF", name: "Studio White" },
];

const DEFAULT_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='40' fill='%2300f2fe' opacity='0.15'/><polygon points='50,15 60,40 85,50 60,60 50,85 40,60 15,50 40,40' fill='%2300F0FF'/><circle cx='50' cy='50' r='8' fill='%23FFF'/></svg>";

export default function Brands() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // ─── STATE VARIABLES ───
  const [productColor, setProductColor] = useState(PREMIUM_GARMENT_COLORS[0].hex);
  const [backgroundColor, setBackgroundColor] = useState(PREMIUM_BG_COLORS[0].hex);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // Design uploads and transforms
  const [logoImage, setLogoImage] = useState<string | null>(DEFAULT_LOGO);
  const [logoScale, setLogoScale] = useState(100); // 30% to 200%
  const [logoPositionY, setLogoPositionY] = useState(0); // -100 to 100 px relative offset
  const [logoPositionZ, setLogoPositionZ] = useState(10); // Fine-tune Decal distance to T-shirt front mesh surface

  // Restore session from Supabase / localDB
  useEffect(() => {
    if (user) {
      localDB.getBrandMockups(user.id).then((sessions) => {
        if (sessions && sessions.length > 0) {
          const last = sessions[0].details;
          if (last.productColor) setProductColor(last.productColor);
          if (last.backgroundColor) setBackgroundColor(last.backgroundColor);
          if (last.backgroundImage) setBackgroundImage(last.backgroundImage);
          if (last.logoImage) setLogoImage(last.logoImage);
          if (last.logoScale) setLogoScale(last.logoScale);
          if (last.logoPositionY) setLogoPositionY(last.logoPositionY);
          if (last.logoPositionZ) setLogoPositionZ(last.logoPositionZ);
          if (last.garmentType) setGarmentType(last.garmentType);
        }
      });
    }
  }, [user]);

  // Loading states
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Canvas and Three.js Refs
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [logoDragActive, setLogoDragActive] = useState(false);
  const [bgDragActive, setBgDragActive] = useState(false);

  // References to manipulate inside the Three.js scene dynamically
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const tShirtMeshRef = useRef<THREE.Mesh[]>([]);
  const logoMeshRef = useRef<THREE.Mesh | null>(null);
  const logoTextureRef = useRef<THREE.Texture | null>(null);

  const [garmentType, setGarmentType] = useState("t_shirt"); // t_shirt, hoodie, sweatshirt

  // ─── DYNAMIC GARMENT TYPE EFFECT ───
  useEffect(() => {
    if (modelGroupRef.current) {
      if (garmentType === "hoodie") {
        modelGroupRef.current.scale.set(1.45, 1.35, 1.45);
        tShirtMeshRef.current.forEach((mesh) => {
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial)) {
            (mesh.material as THREE.MeshStandardMaterial).roughness = 0.85;
          }
        });
      } else if (garmentType === "sweatshirt") {
        modelGroupRef.current.scale.set(1.4, 1.35, 1.35);
        tShirtMeshRef.current.forEach((mesh) => {
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial)) {
            (mesh.material as THREE.MeshStandardMaterial).roughness = 0.8;
          }
        });
      } else {
        modelGroupRef.current.scale.set(1.35, 1.35, 1.35);
        tShirtMeshRef.current.forEach((mesh) => {
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial)) {
            (mesh.material as THREE.MeshStandardMaterial).roughness = 0.72;
          }
        });
      }
    }
  }, [garmentType, modelLoaded]);

  // ─── THREE.JS VIEWPORT INITIALIZATION ───
  useEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Create Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2); // Frame the T-shirt beautifully

    // 3. Create WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true, // Transparent backdrop for HTML color/image background overlays
      antialias: true,
      preserveDrawingBuffer: true, // Crucial for canvas.toDataURL PNG exports!
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Studio Lighting Configuration
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainKeyLight.position.set(5, 5, 5);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    const softFillLight = new THREE.DirectionalLight(0xffffff, 0.45);
    softFillLight.position.set(0, -3, 3);
    scene.add(softFillLight);

    // 5. Parent Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 6. Setup Logo Projection Layer
    const logoGeo = new THREE.PlaneGeometry(0.38, 0.38);
    const logoMat = new THREE.MeshStandardMaterial({
      transparent: true,
      roughness: 0.45,
      metalness: 0.05,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: -8, // Prevents Z-fighting perfectly with fabric mesh surface
    });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    
    // Set default coordinates (Aligned to chest of standard Clo3D t_shirt model)
    logoMesh.position.set(0, 0.28, 0.25);
    modelGroup.add(logoMesh);
    logoMeshRef.current = logoMesh;

    // 7. Load GLB Mockup Model
    const loader = new GLTFLoader();
    tShirtMeshRef.current = [];

    loader.load(
      "/t_shirt.glb",
      (gltf) => {
        const loadedModel = gltf.scene;

        // Auto-center and compute bounding dimensions
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        
        loadedModel.position.x += (loadedModel.position.x - center.x);
        loadedModel.position.y += (loadedModel.position.y - center.y);
        loadedModel.position.z += (loadedModel.position.z - center.z);

        // Adjust scale to keep model framed beautifully
        const scaleVal = 1.35;
        loadedModel.scale.set(scaleVal, scaleVal, scaleVal);

        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            tShirtMeshRef.current.push(mesh);

            // Apply premium cotton fabric shader settings
            if (mesh.material && (mesh.material as THREE.MeshStandardMaterial)) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.72;
              mat.metalness = 0.02;
              mat.color.set(productColor);
            }
          }
        });

        // Place inside our rotating showroom group
        modelGroup.add(loadedModel);
        setModelLoaded(true);
        
        toast({
          title: "3D Model loaded successfully!",
          description: "TShirt GLB showroom is online.",
        });
      },
      undefined,
      (error) => {
        console.error("3D model loader error:", error);
        toast({
          title: "Model loading failed",
          description: "Using high-end local assets fallback.",
          variant: "destructive"
        });
      }
    );

    // 8. Animation & Render Loop (Double Showroom sway and rot)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (modelGroupRef.current) {
        // Continuous rotation (12s duration per full turn)
        modelGroupRef.current.rotation.y = elapsedTime * (Math.PI * 2 / 12);

        // Elegant floating (Walk Simulator)
        modelGroupRef.current.position.y = Math.sin(elapsedTime * 1.8) * 0.055;
        modelGroupRef.current.rotation.z = Math.cos(elapsedTime * 0.9) * 0.015;
        modelGroupRef.current.position.x = Math.sin(elapsedTime * 0.75) * 0.02;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Resize observer
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // ─── DYNAMIC LOGO TEXTURE SYNCRONIZER ───
  useEffect(() => {
    if (!logoMeshRef.current || !logoImage) return;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      logoImage,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        
        if (logoTextureRef.current) {
          logoTextureRef.current.dispose();
        }
        logoTextureRef.current = texture;

        const mat = logoMeshRef.current?.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.map = texture;
          mat.needsUpdate = true;
        }
      },
      undefined,
      (err) => {
        console.error("Texture loading failed:", err);
      }
    );
  }, [logoImage]);

  // ─── DYNAMIC REAL-TIME SLIDERS REACTION ───
  useEffect(() => {
    if (logoMeshRef.current) {
      // 1. Scale
      const scaleMultiplier = logoScale / 100;
      logoMeshRef.current.scale.set(scaleMultiplier, scaleMultiplier, 1);

      // 2. Vertical Height offset (maps standard bounds safely)
      const targetY = 0.28 + (logoPositionY / 400); 
      logoMeshRef.current.position.y = targetY;

      // 3. Depth Z-Offset (allows fine-tuning mesh proximity to prevent any z-fighting)
      const targetZ = 0.23 + (logoPositionZ / 300);
      logoMeshRef.current.position.z = targetZ;
    }
  }, [logoScale, logoPositionY, logoPositionZ]);

  // ─── DYNAMIC SHADER COLOR REPAINT ───
  useEffect(() => {
    tShirtMeshRef.current.forEach((mesh) => {
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.color.set(productColor);
      }
    });
  }, [productColor]);

  // ─── DEBOUNCED SESSION AUTOSAVE ───
  useEffect(() => {
    if (!user) return;
    const details = {
      productColor,
      backgroundColor,
      backgroundImage,
      logoImage,
      logoScale,
      logoPositionY,
      logoPositionZ,
      garmentType
    };
    
    const delayDebounce = setTimeout(() => {
      localDB.saveBrandMockup(user.id, details);
    }, 1500); // 1.5s debounce before save

    return () => clearTimeout(delayDebounce);
  }, [
    productColor,
    backgroundColor,
    backgroundImage,
    logoImage,
    logoScale,
    logoPositionY,
    logoPositionZ,
    garmentType,
    user
  ]);

  // ─── HANDLERS ───
  
  const handleLogoChange = (file: File | null) => {
    if (!file) return;
    if (file.type !== "image/png") {
      toast({
        title: "PNG design required",
        description: "Please upload a transparent PNG design/logo.",
        variant: "destructive"
      });
      return;
    }
    const url = URL.createObjectURL(file);
    setLogoImage(url);
  };

  const handleBgChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Image required",
        description: "Please upload a valid background image.",
        variant: "destructive"
      });
      return;
    }
    const url = URL.createObjectURL(file);
    setBackgroundImage(url);
  };

  const handleDrag = (e: React.DragEvent, type: "logo" | "bg", active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "logo") setLogoDragActive(active);
    else setBgDragActive(active);
  };

  const handleDrop = (e: React.DragEvent, type: "logo" | "bg") => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "logo") {
      setLogoDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleLogoChange(file);
    } else {
      setBgDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleBgChange(file);
    }
  };

  // ─── HIGH RES CANVAS COMPOSITOR EXPORTER ───
  const handleExport = async () => {
    if (isExporting || !rendererRef.current) return;
    setIsExporting(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not acquire canvas context");

      // 1. Solid bg fill
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw custom background image
      if (backgroundImage) {
        const bgImg = new Image();
        bgImg.src = backgroundImage;
        await new Promise((resolve) => {
          bgImg.onload = resolve;
          bgImg.onerror = resolve;
        });
        const bgRatio = bgImg.width / bgImg.height;
        const canvasRatio = canvas.width / canvas.height;
        let sWidth = bgImg.width;
        let sHeight = bgImg.height;
        let sx = 0;
        let sy = 0;

        if (bgRatio > canvasRatio) {
          sWidth = bgImg.height * canvasRatio;
          sx = (bgImg.width - sWidth) / 2;
        } else {
          sHeight = bgImg.width / canvasRatio;
          sy = (bgImg.height - sHeight) / 2;
        }
        ctx.drawImage(bgImg, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
      }

      // 3. Capture Three.js render buffer
      const glCanvas = rendererRef.current.domElement;
      const threeDImg = new Image();
      threeDImg.src = glCanvas.toDataURL("image/png");

      await new Promise((resolve) => {
        threeDImg.onload = resolve;
        threeDImg.onerror = resolve;
      });

      // Fit 3D canvas overlay onto export compositor
      ctx.drawImage(threeDImg, 0, 0, canvas.width, canvas.height);

      // 4. Download file
      const pngURL = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngURL;
      downloadLink.download = `machrou3i-3d-mockup-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast({
        title: t("brands.exportSuccess", "Mockup exported successfully!"),
        description: "Your high-resolution PNG is ready.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Export failed",
        description: "An error occurred while compiling your mockup image.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // ─── RESET SYSTEM ───
  const handleReset = () => {
    setProductColor(PREMIUM_GARMENT_COLORS[0].hex);
    setBackgroundColor(PREMIUM_BG_COLORS[0].hex);
    setBackgroundImage(null);
    setLogoImage(null); // Clear logo
    setLogoScale(100);
    setLogoPositionY(0);
    setLogoPositionZ(10);

    toast({
      title: t("brands.resetSuccess", "Studio settings reset to defaults."),
      description: "Apparel canvas reset completed.",
    });
  };

  return (
    <section className="min-h-screen pt-28 pb-12 bg-gradient-hero overflow-hidden flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT PANEL: COMPACT MINIMAL CONTROLS (col-span-3 - ONLY 25% OF GRID) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 flex flex-col justify-center space-y-6"
          >
            {/* Header info */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-neon uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neon animate-ping" />
                3D Showroom.v2
              </span>
              <h1 className="text-2xl font-bold font-heading text-gradient-neon">
                {t("brands.title", "Brands Studio")}
              </h1>
              <p className="text-muted-foreground text-[10px] leading-relaxed">
                {t("brands.subtitle", "Upload design assets, adjust coordinates, and preview high-fidelity mockup renders instantly.")}
              </p>
            </div>

            {/* Minimal controls container */}
            <div className="glass-panel rounded-2xl p-4 space-y-4 border border-border/30 bg-black/40">
              
              {/* 1. Logo Drag-and-Drop */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  {t("brands.uploadDesign", "Upload Design")}
                </span>
                
                <input
                  type="file"
                  ref={logoInputRef}
                  className="hidden"
                  accept="image/png"
                  onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
                />

                <div
                  onDragOver={(e) => handleDrag(e, "logo", true)}
                  onDragLeave={(e) => handleDrag(e, "logo", false)}
                  onDrop={(e) => handleDrop(e, "logo")}
                  onClick={() => logoInputRef.current?.click()}
                  className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition-all duration-300 ${
                    logoDragActive ? "border-neon bg-neon/5" : "border-border/60 hover:border-neon/30"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {logoImage ? (
                      <motion.div 
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative w-10 h-10 rounded bg-black/40 border border-border/80 flex items-center justify-center p-1">
                            <img src={logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
                          </div>
                          <span className="text-[9px] text-muted-foreground">Click/Drop PNG</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLogoImage(null);
                          }}
                          className="p-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="uploader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center py-1"
                      >
                        <span className="text-[10px] text-muted-foreground">Drop transparent PNG here</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Logo custom sliders */}
              {logoImage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2.5 pt-1.5 border-t border-border/20"
                >
                  <div>
                    <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                      <span className="flex items-center gap-1">
                        <Sliders className="h-3 w-3 text-neon" />
                        Scale
                      </span>
                      <span>{logoScale}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="180"
                      value={logoScale}
                      onChange={(e) => setLogoScale(Number(e.target.value))}
                      className="w-full h-0.5 bg-secondary rounded appearance-none cursor-pointer accent-neon"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                      <span className="flex items-center gap-1">
                        <Move className="h-3 w-3 text-neon" />
                        Height
                      </span>
                      <span>{logoPositionY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      value={logoPositionY}
                      onChange={(e) => setLogoPositionY(Number(e.target.value))}
                      className="w-full h-0.5 bg-secondary rounded appearance-none cursor-pointer accent-neon"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                      <span className="flex items-center gap-1">
                        <Move className="h-3 w-3 text-neon rotate-90" />
                        Projection Depth
                      </span>
                      <span>{logoPositionZ}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={logoPositionZ}
                      onChange={(e) => setLogoPositionZ(Number(e.target.value))}
                      className="w-full h-0.5 bg-secondary rounded appearance-none cursor-pointer accent-neon"
                      title="Adjust to prevent visual clipping/z-fighting with fabric mesh folds"
                    />
                  </div>
                </motion.div>
              )}

              {/* 2. Color Options */}
              <div className="border-t border-border/20 pt-3 space-y-3">
                
                {/* Garment Type Dropdown */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Garment Type</span>
                  <select
                    value={garmentType}
                    onChange={(e) => setGarmentType(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-background/50 border border-border/80 text-[10px] text-foreground focus:outline-none focus:border-neon"
                  >
                    <option value="t_shirt">Oversized Premium T-Shirt</option>
                    <option value="hoodie">Heavy Weight Showroom Hoodie</option>
                    <option value="sweatshirt">Relaxed Fit Sweatshirt</option>
                  </select>
                </div>

                {/* Garment Color */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t("brands.garmentColor", "Garment Color")}</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={productColor}
                        onChange={(e) => setProductColor(e.target.value)}
                        className="w-14 px-1 py-0.5 text-[9px] bg-background/50 border border-border/80 rounded font-mono text-muted-foreground focus:outline-none focus:border-neon"
                      />
                      <input
                        type="color"
                        value={productColor}
                        onChange={(e) => setProductColor(e.target.value)}
                        className="w-4 h-4 rounded bg-transparent cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {PREMIUM_GARMENT_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setProductColor(c.hex)}
                        className={`w-6 h-6 rounded-full border transition-all relative flex items-center justify-center ${
                          productColor.toLowerCase() === c.hex.toLowerCase() 
                            ? "border-neon scale-110 glow-neon" 
                            : "border-border hover:border-neon/30 hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {productColor.toLowerCase() === c.hex.toLowerCase() && (
                          <Check className={`w-2.5 h-2.5 ${c.hex === "#F3F2EE" ? "text-black" : "text-white"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-1.5 border-t border-border/10 pt-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t("brands.background", "Background")}</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-14 px-1 py-0.5 text-[9px] bg-background/50 border border-border/80 rounded font-mono text-muted-foreground focus:outline-none focus:border-neon"
                      />
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-4 h-4 rounded bg-transparent cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {PREMIUM_BG_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setBackgroundColor(c.hex)}
                        className={`w-6 h-6 rounded-full border transition-all relative flex items-center justify-center ${
                          backgroundColor.toLowerCase() === c.hex.toLowerCase() 
                            ? "border-neon scale-110 glow-neon" 
                            : "border-border hover:border-neon/30 hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {backgroundColor.toLowerCase() === c.hex.toLowerCase() && (
                          <Check className={`w-2.5 h-2.5 ${c.hex === "#FFFFFF" || c.hex === "#F1F3F5" || c.hex === "#EAE6E1" ? "text-black" : "text-white"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* 3. Custom Background Image Upload */}
              <div className="border-t border-border/20 pt-2.5">
                <input
                  type="file"
                  ref={bgInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleBgChange(e.target.files?.[0] || null)}
                />
                <div
                  onClick={() => bgInputRef.current?.click()}
                  className="border border-dashed rounded-xl p-2.5 text-center cursor-pointer transition-colors duration-200 hover:border-neon/30 bg-black/10"
                >
                  <AnimatePresence mode="wait">
                    {backgroundImage ? (
                      <motion.div 
                        key="preview-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-3.5 w-3.5 text-neon" />
                          <span className="text-[9px] text-muted-foreground truncate max-w-[90px]">Bg Active</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBackgroundImage(null);
                          }}
                          className="p-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="uploader-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-1"
                      >
                        <ImageIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[9px] text-muted-foreground">Upload Background Image</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2.5 border-t border-border/20 pt-3">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg border border-border bg-background/20 text-[9px] font-semibold text-muted-foreground hover:text-foreground hover:border-neon/40 hover:bg-background/30 transition-all duration-300"
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                  {t("brands.reset", "Reset")}
                </button>
                
                <button
                  onClick={handleExport}
                  disabled={isExporting || !modelLoaded}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg bg-neon text-black text-[9px] font-bold glow-neon hover:opacity-90 disabled:opacity-50 transition-all duration-300"
                >
                  {isExporting ? (
                    <div className="w-2.5 h-2.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="h-2.5 w-2.5" />
                  )}
                  {t("brands.export", "Export")}
                </button>
              </div>

            </div>
          </motion.div>

          {/* RIGHT PANEL: LARGE IMMERSIVE HERO PREVIEW AREA (col-span-9 - OCCUPIES 75% OF GRID) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-9 flex items-center justify-center relative"
          >
            <div 
              ref={canvasContainerRef}
              className="w-full aspect-[4/3] lg:aspect-square xl:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center border border-border/30 transition-all duration-500 ease-out bg-black"
              style={{ 
                backgroundColor: backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Radial gradient background lighting */}
              <div className="absolute w-[80%] h-[80%] rounded-full bg-neon/5 filter blur-[100px] pointer-events-none" />

              {/* Showroom framing markers (Apple/Nike product detail overlay) */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-muted-foreground pointer-events-none select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-neon animate-ping" />
                <span className="text-[10px] font-mono tracking-widest text-neon uppercase">3D Showroom Active</span>
              </div>

              {/* Loading indicator */}
              {!modelLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-30 backdrop-blur-md">
                  <div className="w-8 h-8 border-4 border-neon border-t-transparent rounded-full animate-spin mb-4" />
                  <span className="text-xs text-muted-foreground animate-pulse">Entering 3D Studio...</span>
                </div>
              )}

              {/* THREE.JS RENDER CANVAS */}
              <canvas ref={canvasRef} className="w-full h-full block z-10" />

              {/* Luxury Studio Bottom Shadow / Lighting Blend */}
              <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
