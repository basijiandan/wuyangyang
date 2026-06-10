import React, { useEffect, useRef, useState } from "react";

// Declaring variables loaded from index.html scripts globally to keep TypeScript compiler happy.
declare const THREE: any;
declare const Hands: any;
declare const Camera: any;
declare const drawConnectors: any;
declare const drawLandmarks: any;
declare const HAND_CONNECTIONS: any;

interface Artifact {
  id: string;
  title: string;
  era: string;
  size: string;
  material: string;
  textures: string;
  description: string;
  color1: [number, number, number];
  color2: [number, number, number];
  mathType: string;
  metalColor: number;
  roughness: number;
  customData?: Float32Array;
}

const defaultArtifacts: Artifact[] = [
  {
    id: "dajiyang",
    title: "大吉羊花钱",
    era: "宋代 (公元960 - 1279年)",
    size: "直径 52.5 mm | 厚度 3.1 mm",
    material: "青铜古铸 (Patinated Bronze)",
    textures: "经典方孔圆钱，背铸篆书「大吉」吉语、踏云神羊浮雕、缠枝连理纹饰。",
    description: "经典方孔圆钱，其背铸吉羊踏祥云浮雕。双重冷铜粒子重构其千载风霜。",
    color1: [0.85, 0.70, 0.35], // 浅古金
    color2: [0.10, 0.45, 0.50], // 锈斑蓝绿
    mathType: "flower_dajiyang",
    metalColor: 0xcd7f32,
    roughness: 0.35
  },
  {
    id: "weiyang_shengxiao",
    title: "未羊生肖花钱",
    era: "元明时期 (公元1271 - 1644年)",
    size: "直径 38.0 mm | 厚度 2.4 mm",
    material: "传世黄铜 (Heirloom Brass)",
    textures: "八角莲瓣精工外郭，核心浮雕未羊生肖神、灵羊跪乳图腾及太极八卦星宿纹。",
    description: "十二生肖之「未羊」专铸花钱。外郭多为莲瓣八角花边，粒子精细刻画灵羊跪乳之温驯线条。",
    color1: [0.90, 0.75, 0.40], // 暖金色
    color2: [0.20, 0.30, 0.40], // 玄铁墨灰
    mathType: "flower_zodiac",
    metalColor: 0xd4af37,
    roughness: 0.25
  },
  {
    id: "hongwu_tongbao",
    title: "洪武通宝背马牛羊花钱",
    era: "明洪武年间 (公元1368 - 1398年)",
    size: "直径 45.2 mm | 厚度 2.8 mm",
    material: "青纯古铜 (Aged Copper-Bronze)",
    textures: "双郭圆穿，正面为「洪武通宝」真书，背面浮雕奔马、瑞牛与吉羊三合图腾。",
    description: "传统吉祥寓意钱，背铸瑞马、壮牛与伏地祥羊三合。青铜星砂盘盘盘出其磅礴雕功。",
    color1: [0.80, 0.60, 0.30], // 古红铜色
    color2: [0.05, 0.55, 0.45], // 青荧绿
    mathType: "hongwu_animals",
    metalColor: 0xb87333,
    roughness: 0.4
  },
  {
    id: "guangdong_wuyang",
    title: "广东五羊壹仙铜币",
    era: "民国二十五年 (公元1936年)",
    size: "直径 22.1 mm | 厚度 1.5 mm",
    material: "精炼红铜 (Pure Red Copper)",
    textures: "双郭圆穿，外郭对称回纹、中央齿孔齿轮纹、下半五只写实灵羊图腾、背景远山及隶书「中华民国廿五年」与「广东省造」。",
    description: "带有极高地域和现代工业气息的机制铜币，中心主图为广州标志性的「五羊」雕塑意象。",
    color1: [0.88, 0.55, 0.35], // 黄铜铜混合
    color2: [0.15, 0.25, 0.35], // 深岩灰
    mathType: "guangdong_five",
    metalColor: 0xa0522d,
    roughness: 0.3
  },
  {
    id: "sanyang_kaitai",
    title: "三阳开泰花钱",
    era: "清乾嘉年间 (公元1736 - 1820年)",
    size: "直径 56.4 mm | 厚度 3.5 mm",
    material: "洒金黄铜 (Gold-dust Brass)",
    textures: "厚郭重廓，正面铸造「三阳开泰」吉祥祝祷吉语，背面三羊首互呈120°对称分布。",
    description: "取“易经”三阳开泰之吉祥寓意，币面中心由3个成120度角对称的羊头浮雕浮现。",
    color1: [0.95, 0.85, 0.45], // 灿金
    color2: [0.35, 0.45, 0.55], // 钛金蓝
    mathType: "sanyang_kaitai",
    metalColor: 0xffd700,
    roughness: 0.2
  },
  {
    id: "rmb_muyang",
    title: "第一套人民币5000元牧羊图",
    era: "新中国早期 (1951年10月1日发行)",
    size: "票面 140 mm × 75 mm",
    material: "高韧特制钞票纸 (RMB Paper)",
    textures: "精细版画雕刻纹理，正面右侧描绘牧羊人于草原驾驭浩荡羊群原野，背面衬饰花符、维文印记。",
    description: "纸钞艺术。20万粒子化为一副纯平银幕沙盘，并在中央立体升腾起牧羊人与茫茫羊群在原野上的浮雕剪影。",
    color1: [0.55, 0.75, 0.60], // 纸币油墨绿
    color2: [0.85, 0.82, 0.75], // 宣纸微黄
    mathType: "paper_muyang",
    metalColor: 0x8fbc8f,
    roughness: 0.8
  },
  {
    id: "coin_2003_comm",
    title: "2003癸未羊年普通纪念币",
    era: "现代 (公元2003年2月发行)",
    size: "直径 25.0 mm | 厚度 1.9 mm",
    material: "铜锌合金黄铜 (Yellow Copper Alloy)",
    textures: "正面印有国号与面值，背面经典压印手持提灯童子逗引迎春羊、背景点缀剪纸菊花。",
    description: "我国发行的第一枚生肖普通纪念币。双色铜合金结构，粒子模拟出双金属光泽与提灯童子逗羊之姿。",
    color1: [0.92, 0.82, 0.40], // 黄铜芯
    color2: [0.75, 0.78, 0.82], // 白铜环
    mathType: "modern_comm",
    metalColor: 0xe5e4e2,
    roughness: 0.15
  },
  {
    id: "silver_2003_1oz",
    title: "2003癸未羊年1盎司普制银币",
    era: "现代 (公元2003年发行)",
    size: "直径 40.0 mm | 厚度 3.0 mm",
    material: "99.9% 纯银 (Fine Silver)",
    textures: "双面高精磨砂喷砂镜面工艺，背面铸造写实大盘角公羊侧面图、并辅以秀丽翠竹与「吉」印。",
    description: "精制贵金属银币，主打细腻镜面工艺。粒子凝聚成高反光的纯白银色，呈现壮美盘角公羊的局部雕刻。",
    color1: [0.92, 0.95, 0.98], // 纯白银
    color2: [0.25, 0.35, 0.45], // 磨砂阴影蓝
    mathType: "silver_1oz",
    metalColor: 0xffffff,
    roughness: 0.1
  }
];

const PARTICLE_COUNT = 200000;

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);

  // States
  const [activeView, setActiveView] = useState<"orbit" | "detail">("orbit");
  const [artifactsList, setArtifactsList] = useState<Artifact[]>(defaultArtifacts);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [narration, setNarration] = useState<string>("系统就绪。请触发选择以开启量子共鸣解说。");
  const [loadingNarration, setLoadingNarration] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [handState, setHandState] = useState<"NO HAND" | "ACTIVE">("NO HAND");
  const [gestureOpen, setGestureOpen] = useState<boolean>(true);
  const [bloomStrength, setBloomStrength] = useState<number>(1.3);
  const [okPercentage, setOkPercentage] = useState<number>(0);
  const [isOkActive, setIsOkActive] = useState<boolean>(false);
  const [customLoadStatus, setCustomLoadStatus] = useState<string>("点击上传");

  // Three.js State Refs to bridge reactivity and requestAnimationFrame
  const threeRef = useRef<{
    scene: any;
    camera: any;
    renderer: any;
    composer: any;
    bloomPass: any;
    particleSystem: any;
    particleGeometry: any;
    orbitGroup: any;
    orbitCoins: any[];
    timeUniform: { value: number };
    transitionProgressUniform: { value: number };
    chaosPositions: Float32Array;
    colorArray: Float32Array;
    isTransitioning: boolean;
    transitionStartTime: number;
    targetRotationY: number;
    currentRotationY: number;
    targetScale: number;
    currentScale: number;
    glbModel: any;
    glbVertices: Float32Array | null;
  } | null>(null);

  // MediaPipe Ref
  const cameraObjRef = useRef<any>(null);

  // 1. Procedural High-Poly Coin Bump Texture Gen
  const createProceduralBumpMap = (art: Artifact, index: number) => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0c0d10";
    ctx.fillRect(0, 0, size, size);
    ctx.translate(size / 2, size / 2);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(0, 0, size / 2 - 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, size / 2 - 45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#a1a1a1";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, size / 2 - 60, 0, Math.PI * 2);
    ctx.stroke();

    if (art.id === "dajiyang" || art.id === "hongwu_tongbao") {
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 10;
      ctx.fillRect(-60, -60, 120, 120);
      ctx.strokeRect(-60, -60, 120, 120);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 50px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (art.id === "dajiyang") {
        ctx.fillText("大", 0, -120);
        ctx.fillText("吉", 0, 120);
        ctx.fillText("羊", -120, 0);
        ctx.fillText("祥", 120, 0);
      } else {
        ctx.fillText("洪", 0, -120);
        ctx.fillText("武", 0, 120);
        ctx.fillText("通", -120, 0);
        ctx.fillText("宝", 120, 0);
      }
    } else if (art.id === "guangdong_wuyang") {
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(0, 0, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 6;
      ctx.stroke();

      for (let i = 0; i < 24; i++) {
        let angle = (i * Math.PI * 2) / 24;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 70, Math.sin(angle) * 70);
        ctx.lineTo(Math.cos(angle) * 85, Math.sin(angle) * 85);
        ctx.stroke();
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px 'Noto Serif SC', serif";
      ctx.fillText("中華民國廿五年", 0, -140);
      ctx.fillText("广东省造", 0, -100);

      ctx.font = "bold 28px 'Noto Serif SC', serif";
      ctx.fillText("五羊壹仙", 0, 130);
    } else if (art.id === "rmb_muyang") {
      ctx.fillStyle = "#1c2e1c";
      ctx.fillRect(-size / 2 + 20, -size / 2 + 20, size - 40, size - 40);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.strokeRect(-size / 2 + 30, -size / 2 + 30, size - 60, size - 60);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("中国人民银行", 0, -140);
      ctx.font = "bold 60px 'Noto Serif SC', serif";
      ctx.fillText("伍仟圓", 0, 10);
    } else if (art.id === "sanyang_kaitai") {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.fillText("三阳开泰", 0, -120);
      for (let a = 0; a < 3; a++) {
        const angle = (a * 120 * Math.PI) / 180 - Math.PI / 2;
        ctx.save();
        ctx.translate(Math.cos(angle) * 110, Math.sin(angle) * 110);
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI, true);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.restore();
      }
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 50px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.fillText("未羊", 0, -100);
      ctx.font = "bold 30px 'Noto Serif SC', serif";
      ctx.fillText("吉祥之瑞", 0, 110);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // 2. High-fidelity Mathematical Particle Formula Generator
  const generateProceduralModelPositions = (mathType: string) => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);

    if (mathType === "flower_dajiyang") {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const r = Math.random();
        if (r < 0.65) {
          const theta = Math.random() * Math.PI * 2;
          const radius = 2.4 + (Math.random() - 0.5) * 0.2;
          arr[i3] = Math.cos(theta) * radius;
          arr[i3 + 1] = Math.sin(theta) * radius;
          arr[i3 + 2] = (Math.random() - 0.5) * 0.1;
        } else if (r < 0.85) {
          const side = i % 4;
          const pos = (Math.random() - 0.5) * 1.5;
          const fixed = 0.75 * (Math.random() > 0.5 ? 1 : -1);
          if (side < 2) {
            arr[i3] = pos;
            arr[i3 + 1] = fixed;
          } else {
            arr[i3] = fixed;
            arr[i3 + 1] = pos;
          }
          arr[i3 + 2] = (Math.random() - 0.5) * 0.1;
        } else {
          const t = Math.random() * Math.PI * 2;
          const shell = Math.random();
          arr[i3] = Math.cos(t) * 1.2 * Math.sqrt(shell);
          arr[i3 + 1] = Math.sin(t) * 0.9 * Math.sqrt(shell) - 0.2;
          arr[i3 + 2] = 0.2 + Math.sin(t * 4.0) * 0.15;
        }
      }
    } else if (mathType === "flower_zodiac") {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const r = Math.random();
        if (r < 0.7) {
          const theta = Math.random() * Math.PI * 2;
          const wave = Math.sin(theta * 8.0) * 0.25;
          const radius = 2.3 + wave + (Math.random() - 0.5) * 0.1;
          arr[i3] = Math.cos(theta) * radius;
          arr[i3 + 1] = Math.sin(theta) * radius;
          arr[i3 + 2] = (Math.random() - 0.5) * 0.12;
        } else {
          const t = Math.random() * Math.PI * 2;
          arr[i3] = Math.cos(t) * 1.1;
          arr[i3 + 1] = Math.sin(t) * 1.1 + Math.cos(t * 3.0) * 0.2;
          arr[i3 + 2] = (Math.random() - 0.5) * 0.08 + Math.cos(t * 2.0) * 0.1;
        }
      }
    } else if (mathType === "hongwu_animals") {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const r = Math.random();
        if (r < 0.5) {
          const theta = Math.random() * Math.PI * 2;
          const radius = 2.5 + (Math.random() - 0.5) * 0.3;
          arr[i3] = Math.cos(theta) * radius;
          arr[i3 + 1] = Math.sin(theta) * radius;
          arr[i3 + 2] = (Math.random() - 0.5) * 0.15;
        } else {
          const animalSector = i % 3;
          const angle = (animalSector * 120 * Math.PI) / 180;
          const dist = 1.2 + Math.random() * 0.5;
          const localTheta = Math.random() * Math.PI * 2;
          const localR = 0.35 * Math.random();
          arr[i3] = Math.cos(angle) * dist + Math.cos(localTheta) * localR;
          arr[i3 + 1] = Math.sin(angle) * dist + Math.sin(localTheta) * localR;
          arr[i3 + 2] = animalSector === 0 ? 0.25 : 0.05;
        }
      }
    } else if (mathType === "guangdong_five") {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const r = Math.random();
        if (r < 0.35) {
          const theta = Math.random() * Math.PI * 2;
          const radius = 0.45 + Math.random() * 2.05;
          let zDepth = -0.05;
          if (radius > 2.3) {
            const steps = Math.floor((theta * 30) / Math.PI);
            zDepth = 0.08 + Math.sin(steps * 4.0) * 0.05;
          } else if (radius < 0.55) {
            const teeth = Math.floor((theta * 24) / Math.PI);
            zDepth = 0.05 + Math.sin(teeth * 3.0) * 0.04;
          }
          arr[i3] = Math.cos(theta) * radius;
          arr[i3 + 1] = Math.sin(theta) * radius;
          arr[i3 + 2] = zDepth + (Math.random() - 0.5) * 0.01;
        } else if (r < 0.75) {
          const sheepConfigs = [
            { cx: -1.3, cy: -0.4, scale: 0.35, rotY: 0.3 },
            { cx: -0.75, cy: -0.75, scale: 0.32, rotY: 0.1 },
            { cx: -0.05, cy: -1.0, scale: 0.38, rotY: -0.2 },
            { cx: 0.7, cy: -0.85, scale: 0.30, rotY: -0.5 },
            { cx: 1.4, cy: -0.4, scale: 0.36, rotY: -0.4 }
          ];
          const sheepId = i % 5;
          const cfg = sheepConfigs[sheepId];
          const subPart = Math.random();
          let lx = 0, ly = 0, lz = 0;

          if (subPart < 0.5) {
            const u = Math.random();
            const v = Math.random() * Math.PI * 2;
            const w = Math.random() * Math.PI;
            const rx = 0.8 * Math.sqrt(u);
            const ry = 0.5 * Math.sqrt(u);
            const rz = 0.4 * Math.sqrt(u);
            lx = Math.cos(v) * Math.sin(w) * rx;
            ly = Math.sin(v) * Math.sin(w) * ry;
            lz = Math.cos(w) * rz;
          } else if (subPart < 0.75) {
            const u = Math.random();
            const theta = Math.random() * Math.PI * 2;
            const h = u * 0.5;
            const r_neck = 0.15 * (1.0 - u * 0.3);
            lx = Math.cos(theta) * r_neck + 0.4;
            ly = h + 0.3;
            lz = Math.sin(theta) * r_neck;
          } else if (subPart < 0.9) {
            const legId = i % 4;
            const legX = (legId < 2 ? -0.4 : 0.4) + (Math.random() - 0.5) * 0.1;
            const legY = -0.5 - Math.random() * 0.4;
            const legZ = (legId % 2 === 0 ? 0.25 : -0.25) + (Math.random() - 0.5) * 0.05;
            lx = legX;
            ly = legY;
            lz = legZ;
          } else {
            const t = Math.random() * Math.PI * 3;
            const hornR = t * 0.05 + 0.05;
            lx = Math.cos(t) * hornR + 0.3;
            ly = Math.sin(t) * hornR + 0.7;
            lz = (i % 2 === 0 ? 0.2 : -0.2) + (Math.random() - 0.5) * 0.05;
          }

          const cosR = Math.cos(cfg.rotY);
          const sinR = Math.sin(cfg.rotY);
          arr[i3] = cfg.cx + (lx * cosR - lz * sinR) * cfg.scale;
          arr[i3 + 1] = cfg.cy + ly * cfg.scale;
          arr[i3 + 2] = 0.15 + (lx * sinR + lz * cosR) * cfg.scale;
        } else if (r < 0.85) {
          const mountainId = i % 2 === 0 ? -1 : 1;
          const mx = mountainId * (1.1 + Math.random() * 0.6);
          const my = -0.1 + Math.random() * 0.3;
          const mz = 0.05 + Math.exp(-Math.pow(mx - mountainId * 1.4, 2) * 5.0) * 0.15;
          arr[i3] = mx;
          arr[i3 + 1] = my;
          arr[i3 + 2] = mz;
        } else {
          const lineId = i % 2 === 0 ? 0 : 1;
          if (lineId === 0) {
            const theta = ((35 + Math.random() * 110) * Math.PI) / 180;
            const pulse = Math.cos(theta * 14.0) * 0.08;
            arr[i3] = Math.cos(theta) * (1.6 + pulse);
            arr[i3 + 1] = Math.sin(theta) * (1.6 + pulse);
            arr[i3 + 2] = 0.12 + Math.abs(Math.sin(theta * 7.0)) * 0.05;
          } else {
            const theta = ((45 + Math.random() * 90) * Math.PI) / 180;
            const pulse = Math.cos(theta * 8.0) * 0.06;
            arr[i3] = Math.cos(theta) * (1.15 + pulse);
            arr[i3 + 1] = Math.sin(theta) * (1.15 + pulse);
            arr[i3 + 2] = 0.12 + Math.abs(Math.sin(theta * 4.0)) * 0.05;
          }
        }
      }
    } else if (mathType === "sanyang_kaitai") {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const r = Math.random();
        if (r < 0.35) {
          const theta = Math.random() * Math.PI * 2;
          const radius = 2.4 + (Math.random() - 0.5) * 0.1;
          arr[i3] = Math.cos(theta) * radius;
          arr[i3 + 1] = Math.sin(theta) * radius;
          arr[i3 + 2] = (Math.random() - 0.5) * 0.1;
        } else {
          const headIndex = i % 3;
          const angle = (headIndex * 120 * Math.PI) / 180;
          const u = Math.random();
          const v = Math.random() * Math.PI * 2;
          const len = u * 1.2;
          const rad = 0.45 * (1.0 - u * 0.5);
          arr[i3] = Math.cos(angle) * (len + 0.3) + Math.cos(v) * rad;
          arr[i3 + 1] = Math.sin(angle) * (len + 0.3) + Math.sin(v) * rad;
          arr[i3 + 2] = u * 0.8;
        }
      }
    } else if (mathType === "paper_muyang") {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const r = Math.random();
        if (r < 0.65) {
          arr[i3] = (Math.random() - 0.5) * 4.6;
          arr[i3 + 1] = (Math.random() - 0.5) * 2.8;
          arr[i3 + 2] = -0.05;
        } else if (r < 0.85) {
          const tx = (Math.random() - 0.5) * 4.0;
          const ty = (Math.random() - 0.5) * 2.2;
          arr[i3] = tx;
          arr[i3 + 1] = ty;
          arr[i3 + 2] = Math.exp(-(tx * tx + ty * ty) * 0.5) * 0.3;
        } else {
          const flockIndex = i % 12;
          const fx = -1.2 + flockIndex * 0.25 + (Math.random() - 0.5) * 0.15;
          const fy = (Math.random() - 0.5) * 0.6;
          arr[i3] = fx;
          arr[i3 + 1] = fy;
          arr[i3 + 2] = 0.15 + Math.sin(fx * 5.0) * 0.1;
        }
      }
    } else if (mathType === "modern_comm") {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const r = Math.random();
        if (r < 0.45) {
          const theta = Math.random() * Math.PI * 2;
          const radius = 2.0 + Math.random() * 0.4;
          arr[i3] = Math.cos(theta) * radius;
          arr[i3 + 1] = Math.sin(theta) * radius;
          arr[i3 + 2] = (Math.random() - 0.5) * 0.08;
        } else if (r < 0.75) {
          const theta = Math.random() * Math.PI * 2;
          const radius = Math.random() * 2.0;
          arr[i3] = Math.cos(theta) * radius;
          arr[i3 + 1] = Math.sin(theta) * radius;
          arr[i3 + 2] = (Math.random() - 0.5) * 0.05;
        } else {
          const theta = Math.random() * Math.PI * 2;
          const pulse = Math.cos(theta * 3.0) * 0.3;
          arr[i3] = Math.cos(theta) * (1.1 + pulse);
          arr[i3 + 1] = Math.sin(theta) * (1.1 + pulse);
          arr[i3 + 2] = 0.15 + Math.sin(theta * 5.0) * 0.05;
        }
      }
    } else {
      // default: silver_1oz
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const r = Math.random();
        if (r < 0.5) {
          const theta = Math.random() * Math.PI * 2;
          const radius = 2.4 * Math.sqrt(Math.random());
          arr[i3] = Math.cos(theta) * radius;
          arr[i3 + 1] = Math.sin(theta) * radius;
          arr[i3 + 2] = -0.1;
        } else {
          const t = Math.random() * Math.PI * 4;
          const hornR = t * 0.1 + 0.2;
          arr[i3] = Math.cos(t) * hornR - 0.2;
          arr[i3 + 1] = Math.sin(t) * hornR + 0.3;
          arr[i3 + 2] = 0.18 + Math.sin(t) * 0.08;
        }
      }
    }

    // Offset globally upwards
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3 + 1] += 0.2;
    }
    return arr;
  };

  // 3. Gemini Server AI Guidance API Call Proxy
  const getAISecureNarration = async (modelTitle: string, defaultDesc: string) => {
    setLoadingNarration(true);
    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelName: modelTitle })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          typewriteText(data.text);
          return;
        }
      }
      typewriteText(defaultDesc);
    } catch (e) {
      console.error(e);
      typewriteText(defaultDesc);
    } finally {
      setLoadingNarration(false);
    }
  };

  const typewriteText = (text: string) => {
    setNarration("");
    let i = 0;
    const speed = 25;
    const timer = setInterval(() => {
      if (i < text.length) {
        setNarration((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  };

  // 4. Initialize Three.js Environment
  useEffect(() => {
    if (!containerRef.current || !THREE) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000204, 0.05);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 5, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000204, 1.0);
    containerRef.current.appendChild(renderer.domElement);

    // Render pass & bloom pass setup
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(width, height), bloomStrength, 0.4, 0.85);
    bloomPass.threshold = 0.03;
    bloomPass.strength = Math.max(1.8, bloomStrength);
    bloomPass.radius = 1.0;

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f2fe, 1.0);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xd4af37, 3.2, 18);
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);

    // Orbit rings setup
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = 0.35;
    scene.add(orbitGroup);

    const ringGeom = new THREE.RingGeometry(8.9, 9.0, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x224455,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2
    });
    const orbitRing = new THREE.Mesh(ringGeom, ringMat);
    orbitRing.rotation.x = Math.PI / 2;
    orbitGroup.add(orbitRing);

    // Orbit dynamic coins loading
    const orbitCoins: any[] = [];
    const radius = 9.0;

    artifactsList.forEach((art, index) => {
      const angle = (index / artifactsList.length) * Math.PI * 2;
      const coinGroup = new THREE.Group();

      coinGroup.position.x = Math.cos(angle) * radius;
      coinGroup.position.z = Math.sin(angle) * radius;
      coinGroup.position.y = 0;

      let geom;
      if (art.id === "rmb_muyang") {
        geom = new THREE.BoxGeometry(2.4, 1.3, 0.05);
      } else {
        geom = new THREE.CylinderGeometry(1.2, 1.2, 0.12, 48);
      }

      const bumpTex = createProceduralBumpMap(art, index);
      const mat = new THREE.MeshStandardMaterial({
        color: art.metalColor,
        metalness: 0.95,
        roughness: art.roughness,
        bumpMap: bumpTex,
        bumpScale: 0.03,
        roughnessMap: bumpTex,
        emissive: art.metalColor,
        emissiveIntensity: 0.22
      });

      const mesh = new THREE.Mesh(geom, mat);
      if (art.id !== "rmb_muyang") {
        mesh.rotation.x = Math.PI / 2;
      }
      coinGroup.add(mesh);

      coinGroup.userData = { index, art };
      orbitCoins.push(coinGroup);
      orbitGroup.add(coinGroup);
    });

    // Main Particle Engine setup
    const chaosPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colorArray = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2.0) * 8.0 + 0.1;
      const theta = Math.random() * Math.PI * 2.0;
      const phi = (Math.random() - 0.5) * 0.35;

      const armOffset = i % 2 === 0 ? 0.0 : Math.PI;
      const twist = r * 0.75;

      chaosPositions[i3] = Math.cos(theta + twist + armOffset) * r;
      chaosPositions[i3 + 1] = phi * r;
      chaosPositions[i3 + 2] = Math.sin(theta + twist + armOffset) * r;

      const ratio = Math.random();
      const colCyan = [0.0, 0.95, 1.0];
      const colGold = [0.83, 0.68, 0.21];

      if (ratio > 0.5) {
        colorArray[i3] = colCyan[0] * ratio + colGold[0] * (1.0 - ratio);
        colorArray[i3 + 1] = colCyan[1] * ratio + colGold[1] * (1.0 - ratio);
        colorArray[i3 + 2] = colCyan[2] * ratio + colGold[2] * (1.0 - ratio);
      } else {
        colorArray[i3] = colGold[0] * (1.0 - ratio) + colCyan[0] * ratio;
        colorArray[i3 + 1] = colGold[1] * (1.0 - ratio) + colCyan[1] * ratio;
        colorArray[i3 + 2] = colGold[2] * (1.0 - ratio) + colCyan[2] * ratio;
      }
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(chaosPositions), 3));
    particleGeometry.setAttribute("aChaos", new THREE.BufferAttribute(chaosPositions, 3));
    particleGeometry.setAttribute("aTarget", new THREE.BufferAttribute(new Float32Array(chaosPositions), 3));
    particleGeometry.setAttribute("aColor", new THREE.BufferAttribute(colorArray, 3));

    const timeUniform = { value: 0 };
    const transitionProgressUniform = { value: 0 };

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: timeUniform,
        uTransitionProgress: transitionProgressUniform,
        uPointSize: { value: window.devicePixelRatio < 2 ? 0.8 : 0.5 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uTransitionProgress;
        uniform float uPointSize;

        attribute vec3 aChaos;
        attribute vec3 aTarget;
        attribute vec3 aColor;

        varying vec3 vColor;
        varying float vProgress;

        vec3 getTurbulence(vec3 p) {
            float speed = uTime * 0.4;
            float waveX = sin(p.y * 3.0 + speed) * 0.04;
            float waveY = cos(p.x * 3.0 + speed) * 0.04;
            float waveZ = sin(p.z * 3.0 + speed) * 0.04;
            return vec3(waveX, waveY, waveZ);
        }

        void main() {
            vColor = aColor;
            vProgress = uTransitionProgress;

            float easedProgress = smoothstep(0.0, 1.0, uTransitionProgress);
            vec3 mixedPos = mix(aChaos, aTarget, easedProgress);

            float transitionFactor = sin(easedProgress * 3.1415926);
            vec3 noise = getTurbulence(mixedPos) * transitionFactor * 0.8;
            
            vec3 ambientNoise = vec3(
                sin(uTime * 0.15 + aChaos.y) * 0.005,
                cos(uTime * 0.15 + aChaos.z) * 0.005,
                sin(uTime * 0.15 + aChaos.x) * 0.005
            );

            vec4 mvPosition = modelViewMatrix * vec4(mixedPos + noise + ambientNoise, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = uPointSize * (18.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vProgress;

        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;

            float alpha = smoothstep(0.5, 0.0, dist);
            vec3 centerGlow = vec3(1.0) * (1.0 - dist * 2.0) * 0.2;
            gl_FragColor = vec4(vColor + centerGlow, alpha * 0.95);
        }
      `
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    particleSystem.visible = false;
    scene.add(particleSystem);

    // Save references to state ref
    threeRef.current = {
      scene,
      camera,
      renderer,
      composer,
      bloomPass,
      particleSystem,
      particleGeometry,
      orbitGroup,
      orbitCoins,
      timeUniform,
      transitionProgressUniform,
      chaosPositions,
      colorArray,
      isTransitioning: false,
      transitionStartTime: 0,
      targetRotationY: 0,
      currentRotationY: 0,
      targetScale: 1.0,
      currentScale: 1.0,
      glbModel: null,
      glbVertices: null
    };

    // 5. High intensity Raycaster Interaction click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(orbitGroup.children, true);

      if (intersects.length > 0) {
        let clickedCoin = intersects[0].object;
        while (clickedCoin.parent && clickedCoin.parent !== orbitGroup) {
          clickedCoin = clickedCoin.parent;
        }
        if (clickedCoin.userData && clickedCoin.userData.index !== undefined) {
          // Trigger view state change and selection
          triggerInteractiveModel(clickedCoin.userData.index);
        }
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer && renderer.domElement && containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [artifactsList]);

  useEffect(() => {
    const loadHashSelection = () => {
      const coinId = window.location.hash.slice(1);
      if (!coinId) return;
      const index = artifactsList.findIndex((artifact) => artifact.id === coinId);
      if (index >= 0) {
        triggerInteractiveModel(index);
      }
    };

    loadHashSelection();
    window.addEventListener("hashchange", loadHashSelection);
    return () => window.removeEventListener("hashchange", loadHashSelection);
  }, [artifactsList]);

  // Adjust Bloom Strengths
  useEffect(() => {
    if (threeRef.current && threeRef.current.bloomPass) {
      threeRef.current.bloomPass.strength = bloomStrength;
    }
  }, [bloomStrength]);

  // View state and animation loop
  const triggerInteractiveModel = (index: number) => {
    setCurrentIndex(index);
    setActiveView("detail");
    window.history.replaceState(null, "", `#${artifactsList[index]?.id || ""}`);
    setGestureOpen(true);

    const t = threeRef.current;
    if (!t) return;

    // Load AI narration
    const activeArtifact = artifactsList[index];
    getAISecureNarration(activeArtifact.title, activeArtifact.description);

    // Orbit visibility adjustment
    t.orbitCoins.forEach((c, idx) => {
      c.visible = idx === index;
    });

    t.particleSystem.position.copy(t.orbitCoins[index].position);
    t.particleSystem.visible = true;

    // Transform points to targeting math state
    t.isTransitioning = true;
    t.transitionStartTime = performance.now();

    const targetPositions = activeArtifact.customData
      ? activeArtifact.customData
      : generateProceduralModelPositions(activeArtifact.mathType);

    t.particleGeometry.setAttribute("aTarget", new THREE.BufferAttribute(targetPositions, 3));
    t.particleGeometry.attributes.aTarget.needsUpdate = true;

    // Shift colors
    const activeArt = artifactsList[index];
    const cols = t.particleGeometry.attributes.aColor.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const ratio = Math.random();
      cols[i3] = activeArt.color1[0] * ratio + activeArt.color2[0] * (1.0 - ratio);
      cols[i3 + 1] = activeArt.color1[1] * ratio + activeArt.color2[1] * (1.0 - ratio);
      cols[i3 + 2] = activeArt.color1[2] * ratio + activeArt.color2[2] * (1.0 - ratio);
    }
    t.particleGeometry.attributes.aColor.needsUpdate = true;

    // Zoom camera in
    const coin = t.orbitCoins[index];
    const startCamPos = t.camera.position.clone();
    const endCamPos = new THREE.Vector3(coin.position.x, coin.position.y, coin.position.z + 5.5);

    let zoomStart = performance.now();
    const duration = 900;

    const zoomStep = () => {
      const elapsed = performance.now() - zoomStart;
      const progress = Math.min(1.0, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      t.camera.position.lerpVectors(startCamPos, endCamPos, eased);
      if (progress < 1.0) {
        requestAnimationFrame(zoomStep);
      }
    };
    requestAnimationFrame(zoomStep);
  };

  const backToOrbitView = () => {
    setActiveView("orbit");
    setNarration("系统就绪。请触发选择以开启量子共鸣解说。");
    window.history.replaceState(null, "", window.location.pathname + window.location.search);

    const t = threeRef.current;
    if (!t) return;

    t.orbitCoins.forEach((c) => {
      c.visible = true;
    });
    t.particleSystem.visible = false;

    // Pull camera back
    const startCamPos = t.camera.position.clone();
    const endCamPos = new THREE.Vector3(0, 5, 20);

    let zoomStart = performance.now();
    const duration = 1000;

    const zoomStep = () => {
      const elapsed = performance.now() - zoomStart;
      const progress = Math.min(1.0, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      t.camera.position.lerpVectors(startCamPos, endCamPos, eased);
      if (progress < 1.0) {
        requestAnimationFrame(zoomStep);
      }
    };
    requestAnimationFrame(zoomStep);
  };

  // Main high speed animation loop inside React
  useEffect(() => {
    let animId: number;

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);

      const t = threeRef.current;
      if (!t) return;

      t.timeUniform.value = now * 0.001;

      // Orbit view natural self-rotates and floats
      if (activeView === "orbit") {
        t.orbitGroup.rotation.y += 0.0012;
        t.orbitCoins.forEach((c, idx) => {
          c.rotation.y = now * 0.0013 + idx;
          c.position.y = Math.sin(now * 0.002 + idx) * 0.15;
        });
      }

      // Transition points progress interpolator
      if (activeView === "detail" && t.isTransitioning) {
        const elapsed = now - t.transitionStartTime;
        let progress = elapsed / 1200; // transition duration is 1.2s
        if (progress >= 1.0) {
          progress = 1.0;
          t.isTransitioning = false;
        }
        t.transitionProgressUniform.value = progress;
      }

      // Smooth filters for palm gestures with lag damping
      t.currentRotationY += (t.targetRotationY - t.currentRotationY) * 0.06;
      t.currentScale += (t.targetScale - t.currentScale) * 0.08;

      if (activeView === "detail" && t.particleSystem) {
        t.particleSystem.rotation.y = t.currentRotationY;

        // Auto self-rotate when no hand is present
        if (handState === "NO HAND") {
          t.particleSystem.rotation.y = now * 0.00018;
          t.targetScale = 1.0;
        }
        t.particleSystem.scale.set(t.currentScale, t.currentScale, t.currentScale);
      }

      t.composer.render();
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeView, handState]);

  // 6. MediaPipe Neural Network Integration for Hand Tracking
  useEffect(() => {
    if (!Camera || !Hands || !isCameraActive || !webcamRef.current) {
      setHandState("NO HAND");
      return;
    }

    const webcam = webcamRef.current;
    let localOkGestureTimer = 0;
    const okRequiredDuration = 1500;
    let localIsOkActive = false;

    const onResults = (results: any) => {
      const t = threeRef.current;
      if (!t) return;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setHandState("ACTIVE");
        const landmarks = results.multiHandLandmarks[0];

        // Draw skeletons on canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = webcam.videoWidth;
            canvas.height = webcam.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
              color: "rgba(0, 242, 254, 0.4)",
              lineWidth: 2
            });
            drawLandmarks(ctx, landmarks, { color: "#d4af37", radius: 2 });
          }
        }

        if (activeView === "detail") {
          // Rotation mapping
          const palmX = landmarks[9].x;
          t.targetRotationY = (palmX - 0.5) * Math.PI * 3.0;

          // Pinch scaling mapping
          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];
          const distance = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
          );
          const mappedScale = ((distance - 0.03) * (1.6 - 0.4)) / (0.25 - 0.03) + 0.4;
          t.targetScale = Math.max(0.4, Math.min(1.7, mappedScale));

          // OK gesture checker: pinch with index, and extend middle, ring, pinky
          const dThumbIndex = Math.sqrt(
            Math.pow(landmarks[4].x - landmarks[8].x, 2) +
              Math.pow(landmarks[4].y - landmarks[8].y, 2)
          );
          const isPinching = dThumbIndex < 0.04;
          const middleExt = landmarks[12].y < landmarks[10].y;
          const ringExt = landmarks[16].y < landmarks[14].y;
          const pinkyExt = landmarks[20].y < landmarks[18].y;

          const isOK = isPinching && middleExt && ringExt && pinkyExt;

          if (isOK) {
            if (!localIsOkActive) {
              localIsOkActive = true;
              setIsOkActive(true);
              localOkGestureTimer = performance.now();
            } else {
              const elapsed = performance.now() - localOkGestureTimer;
              const percentage = Math.min(100, (elapsed / okRequiredDuration) * 100);
              setOkPercentage(percentage);

              if (elapsed >= okRequiredDuration) {
                // Trigger wheel rotation to next model
                localIsOkActive = false;
                setIsOkActive(false);
                setOkPercentage(0);
                const nextIdx = (currentIndex + 1) % artifactsList.length;
                triggerInteractiveModel(nextIdx);
              }
            }
          } else {
            localIsOkActive = false;
            setIsOkActive(false);
            setOkPercentage(0);
          }
        } else {
          // Under orbit wheel state: slide palm horizontally to roll orbit group
          const palmX = landmarks[9].x;
          t.orbitGroup.rotation.y += (palmX - 0.5) * 0.03;
          setGestureOpen(false);
        }
      } else {
        setHandState("NO HAND");
        setIsOkActive(false);
        setOkPercentage(0);
        localIsOkActive = false;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.65
    });

    hands.onResults(onResults);

    const cameraObj = new Camera(webcam, {
      onFrame: async () => {
        if (isCameraActive) {
          await hands.send({ image: webcam });
        }
      },
      width: 320,
      height: 240
    });

    cameraObjRef.current = cameraObj;
    cameraObj.start();

    return () => {
      if (cameraObjRef.current) {
        cameraObjRef.current.stop();
      }
    };
  }, [isCameraActive, activeView, currentIndex, artifactsList]);

  // OBJ File Scanner for custom user models
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !THREE) return;

    setCustomLoadStatus("解析中...");

    const reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const text = event.target.result;
        const loader = new THREE.OBJLoader();
        const obj = loader.parse(text);

        let vertices: number[] = [];
        obj.traverse((child: any) => {
          if (child.isMesh) {
            const positionAttr = child.geometry.attributes.position;
            for (let i = 0; i < positionAttr.count; i++) {
              vertices.push(positionAttr.getX(i), positionAttr.getY(i), positionAttr.getZ(i));
            }
          }
        });

        if (vertices.length === 0) {
          throw new Error("无网格几何点数据");
        }

        const paddedArray = new Float32Array(PARTICLE_COUNT * 3);
        const vLen = vertices.length;

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        for (let i = 0; i < vLen; i += 3) {
          minX = Math.min(minX, vertices[i]);
          maxX = Math.max(maxX, vertices[i]);
          minY = Math.min(minY, vertices[i + 1]);
          maxY = Math.max(maxY, vertices[i + 1]);
          minZ = Math.min(minZ, vertices[i + 2]);
          maxZ = Math.max(maxZ, vertices[i + 2]);
        }

        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const cz = (minZ + maxZ) / 2;

        const maxDim = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1.0;
        const scaleFactor = 4.0 / maxDim;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const sourceIdx = i3 % vLen;
          paddedArray[i3] = (vertices[sourceIdx] - cx) * scaleFactor;
          paddedArray[i3 + 1] = (vertices[sourceIdx + 1] - cy) * scaleFactor;
          paddedArray[i3 + 2] = (vertices[sourceIdx + 2] - cz) * scaleFactor;
        }

        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const customArtifact: Artifact = {
          id: `custom_${Date.now()}`,
          title: baseName,
          era: "用户数字遗产扫描",
          size: "自适应缩放规格",
          material: "自定义点云网格",
          textures: "根据上传的 OBJ 几何顶点分布自适应还原。",
          description: `从自定义点集重构出的艺术纹样，在粒子场中形成全新对流。`,
          color1: [0.0, 0.95, 1.0],
          color2: [1.0, 0.45, 0.0],
          mathType: "custom",
          metalColor: 0x00f2fe,
          roughness: 0.15,
          customData: paddedArray
        };

        const listCopy = [...artifactsList, customArtifact];
        setArtifactsList(listCopy);
        setCustomLoadStatus("已载入");

        setTimeout(() => {
          setCustomLoadStatus("点击上传");
        }, 3000);

        // Immediate transition using the custom target
        triggerInteractiveModel(listCopy.length - 1);
      } catch (err) {
        console.error(err);
        setCustomLoadStatus("解析失败");
        setTimeout(() => {
          setCustomLoadStatus("点击上传");
        }, 3000);
      }
    };
    reader.readAsText(file);
  };

  const activeArt = artifactsList[currentIndex];

  return (
    <div className="relative w-full h-screen select-none overflow-hidden bg-[#000204]">
      {/* Full-Screen WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 w-full h-full" id="canvas-container" />

      {/* Top Overlay UI Layer */}
      <div
        id="ui-overlay"
        className="absolute inset-0 z-10 flex flex-col justify-between p-6 pointer-events-none transition-all duration-700"
      >
        {/* Header Title Bar */}
        <header className="flex justify-between items-start pointer-events-auto w-full">
          <div className="flex flex-col space-y-1">
            <h1 className="text-xl md:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-[#d4af37] to-[#00f2fe] font-serif">
              CYBER ARCHAEOLOGY · 羊币谱牒
            </h1>
            <p className="text-[10px] text-slate-400 font-sans tracking-widest">
              中国历代羊主题货泉与钱币遗产粒子重构系统
            </p>
          </div>

          {/* Controls & State Badges */}
          <div className="flex items-center space-x-4">
            {activeView === "detail" && (
              <button
                id="back-to-orbit-btn"
                onClick={backToOrbitView}
                className="text-xs font-mono tracking-widest bg-[#d4af37]/10 border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] px-4 py-2 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)] pointer-events-auto cursor-pointer"
              >
                <i className="fa-solid fa-rotate-left mr-1.5"></i> [ 返回星轨谱牒 / ROTARY GALLERY ]
              </button>
            )}

            <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400 bg-black/60 px-4 py-2 rounded-xl border border-white/10">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>60 FPS</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>GEMINI PROXY ACTIVE</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    handState === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                ></span>
                <span>{handState}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Central interactive HUD panels */}
        <div
          id="detail-panel"
          className={`transition-all duration-700 flex justify-between items-stretch flex-grow my-8 overflow-hidden w-full ${
            activeView === "detail" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12 pointer-events-none"
          }`}
        >
          {/* Left Panel: Hand gestural cockpit */}
          <div className={`w-80 bg-black/60 backdrop-blur-xl border border-[#00f2fe]/20 rounded-2xl p-5 flex flex-col justify-between pointer-events-auto shadow-2xl transition-all duration-700 ${gestureOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>
            <div className="flex flex-col h-full overflow-hidden justify-between space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#d4af37] tracking-[0.24em] border-b border-white/10 pb-2 mb-3 flex items-center">
                  <i className="fa-solid fa-hand-paper mr-2 text-[#d4af37]"></i>
                  手势简示
                </h2>
                <p className="text-sm text-slate-200 leading-relaxed font-medium mb-4 text-justify">
                  横移旋转、捏合缩放、OK停 1.5s 切换。张开展开信息框，捏合收起隐藏。
                </p>
              </div>

              <div className="bg-black/40 border border-slate-800 rounded-2xl p-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-arrows-left-right text-[#00f2fe] w-5"></i>
                  <span>左右滑动：旋转当前币体</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-compress-arrows-alt text-[#00f2fe] w-5"></i>
                  <span>捏合手势：放大 / 缩小视图</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-[#d4af37] w-5"></i>
                  <span>OK 停留 1.5 秒：切换到下一枚</span>
                </div>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed px-1 pt-2">
                当前状态：{gestureOpen ? "详情已展开" : "详情已隐藏"}
              </div>

              {/* Bloom adjuster slider */}
              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>BLOOM INTENSITY</span>
                <input
                  id="bloom-strength-slider"
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={bloomStrength}
                  onChange={(e) => setBloomStrength(parseFloat(e.target.value))}
                  className="w-24 accent-slate-300 bg-slate-800 h-1 rounded-lg pointer-events-auto cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Panel: AI smart narration & historical specification ledger */}
          <div className={`w-96 bg-black/60 backdrop-blur-xl border border-[#00f2fe]/20 rounded-2xl p-5 flex flex-col justify-between pointer-events-auto overflow-hidden shadow-2xl transition-all duration-700 ${gestureOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
            <div className="space-y-4 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-sm font-mono text-slate-400 tracking-[0.25em] uppercase">
                    SPECTRUM REPORT
                  </span>
                  <h3 id="artifact-title" className="text-lg md:text-xl font-bold text-slate-200 neon-gold-glow">
                    {activeArt?.title || "未命名钱币"}
                  </h3>
                </div>
              </div>

              {/* Document specifications grid */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-black/30 text-sm font-sans">
                <div className="grid grid-cols-3 border-b border-white/5">
                  <div className="bg-white/5 px-3 py-3 text-slate-400 border-r border-white/5 font-semibold text-sm">
                    历史年代
                  </div>
                  <div id="spec-era" className="col-span-2 px-3 py-3 text-slate-200 text-sm">
                    {activeArt?.era || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-white/5">
                  <div className="bg-white/5 px-3 py-3 text-slate-400 border-r border-white/5 font-semibold text-sm">
                    尺寸规格
                  </div>
                  <div id="spec-size" className="col-span-2 px-3 py-3 text-slate-200 font-mono text-sm">
                    {activeArt?.size || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-white/5">
                  <div className="bg-white/5 px-3 py-3 text-slate-400 border-r border-white/5 font-semibold text-sm">
                    材质成分
                  </div>
                  <div id="spec-material" className="col-span-2 px-3 py-3 text-slate-200 text-sm">
                    {activeArt?.material || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-white/5">
                  <div className="bg-white/5 px-3 py-3 text-slate-400 border-r border-white/5 font-semibold text-sm">
                    工艺亮点
                  </div>
                  <div id="spec-textures" className="col-span-2 px-3 py-3 text-slate-300 leading-relaxed text-sm">
                    {activeArt?.textures || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="bg-white/5 px-3 py-3 text-slate-400 border-r border-white/5 font-semibold text-sm">
                    传承意义
                  </div>
                  <div id="spec-significance" className="col-span-2 px-3 py-3 text-slate-300 leading-relaxed text-sm">
                    {activeArt?.description || "-"}
                  </div>
                </div>
              </div>

              {/* Creative poetry prose block */}
              <div className="relative bg-black/40 rounded-xl p-4 flex-grow min-h-[140px] max-h-[180px] flex items-center border border-white/5 overflow-y-auto">
                {loadingNarration && (
                  <div
                    id="narration-loading"
                    className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center space-y-2 rounded-xl z-20"
                  >
                    <i className="fa-solid fa-compass-drafting fa-spin text-xs text-amber-500/80"></i>
                    <span className="text-[9px] text-slate-500 tracking-widest font-mono">
                      AI 时空织网中...
                    </span>
                  </div>
                )}
                <p
                  id="artifact-narration"
                  className="text-xs text-slate-300 leading-relaxed text-justify font-light whitespace-pre-line"
                >
                  {narration}
                </p>
              </div>

              <div className={`overflow-hidden transition-all duration-500 ${gestureOpen ? "max-h-[320px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}>
                <div className="rounded-2xl border border-white/10 bg-[#04181f]/80 p-4 space-y-4">
                  <div className="flex items-center justify-between text-sm uppercase tracking-[0.24em] text-slate-400">
                    <span>深度档案</span>
                    <span>{gestureOpen ? "展开中" : "已收起"}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/5 p-4 text-sm text-slate-300">
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest">历史价值</div>
                      <p className="mt-2 leading-relaxed text-slate-200">{activeArt?.description || "暂无补充说明。"}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4 text-sm text-slate-300">
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest">收藏提示</div>
                      <p className="mt-2 leading-relaxed text-slate-200">适合置于暗光玻璃柜、现代展陈或私人雅集，体现古朴与光泽对比。</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4 text-sm text-slate-300">
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest">陈列焦点</div>
                      <p className="mt-2 leading-relaxed text-slate-200">强调币面对称纹饰、主色金属与辅助冷色调的光影反差。</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4 text-sm text-slate-300">
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest">材质提示</div>
                      <p className="mt-2 leading-relaxed text-slate-200">金属与铜绿形成天然古朴质感，保存时请避免强光与潮湿。</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom local OBJ uploader */}
              <div className="pt-3 border-t border-white/5">
                <label className="flex items-center justify-between text-[10px] text-slate-400 hover:text-white cursor-pointer transition">
                  <span className="flex items-center">
                    <i className="fa-solid fa-folder-open mr-1.5"></i>
                    导入自定义 OBJ 模型
                  </span>
                  <input
                    id="obj-upload"
                    type="file"
                    accept=".obj"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span id="upload-label" className="text-[#00f2fe] font-mono">
                    {customLoadStatus}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Orbit mode tips */}
        {activeView === "orbit" && (
          <div
            id="orbit-instructions"
            className="flex-grow flex flex-col items-center justify-center pointer-events-none select-none"
          >
            <div className="text-center space-y-3 px-6 py-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl animate-pulse">
              <p className="text-xs text-[#d4af37] tracking-[0.35em] font-medium uppercase font-serif">
                点击轨道中的宏伟古币 · 开启赛博解构仪式
              </p>
              <p className="text-[9px] text-slate-400 font-mono tracking-[0.15em]">
                DRAG SPACE TO ROTATE · CLICK TO ARCHAEOLOGY
              </p>
            </div>
          </div>
        )}

        {/* Footer info line */}
        <footer className="w-full flex justify-between items-end text-[9px] text-slate-600 font-mono tracking-widest">
          <span>CORE: THREE.JS + GLSL SHADER + MEDIAPIPE</span>

          {handState === "ACTIVE" && (
            <div
              id="gesture-banner"
              className="flex items-center space-x-1.5 text-amber-500 bg-amber-500/5 px-3 py-1.5 rounded-full border border-amber-500/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
              <span>手势交互映射中</span>
            </div>
          )}

          {/* Avoiding camera overlap bottom-right spacer */}
          <div className="w-48 h-32"></div>
        </footer>
      </div>

      {/* Floating webcam and bone skeleton recognition screen (Right-Bottom Corner) */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto flex flex-col items-end space-y-2">
        <div className="relative w-44 h-32 rounded-xl border border-white/10 bg-black overflow-hidden shadow-2xl">
          <video
            ref={webcamRef}
            id="webcam"
            className={`w-full h-full object-cover scale-x-[-1] ${isCameraActive ? "" : "hidden"}`}
            autoPlay
            playsInline
          />
          <canvas
            ref={canvasRef}
            id="hand-canvas"
            className={`absolute inset-0 w-full h-full scale-x-[-1] pointer-events-none ${
              isCameraActive ? "" : "hidden"
            }`}
          />

          {/* OK Circular count progress ring */}
          {isOkActive && (
            <div
              id="ok-progress-container"
              className="absolute inset-0 bg-black/80 flex items-center justify-center transition-all duration-300"
            >
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="rgba(255,255,255,0.05)"
                    stroke-width="3"
                    fill="transparent"
                  />
                  <circle
                    id="ok-progress-bar"
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#d4af37"
                    stroke-width="3"
                    fill="transparent"
                    strokeDasharray="163"
                    strokeDashoffset={163 - (okPercentage / 100) * 163}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-amber-500 font-mono animate-pulse">
                  OK
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCameraActive((prev) => !prev)}
          id="toggle-camera-btn"
          className="text-[9px] text-slate-500 hover:text-slate-300 font-mono tracking-wider cursor-pointer bg-transparent border-0"
        >
          [ CAMERA {isCameraActive ? "OFF" : "ON"} ]
        </button>
      </div>
    </div>
  );
}
