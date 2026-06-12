import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';

// --- IMPORTED WEBSITES LIST ---
const websiteFiles = [
  "a-1.html",
  "a.html",
  "about.html",
  "ai-settings-dashboard.html",
  "app.html",
  "BAC_Francais_Complet-index.html",
  "blog.html",
  "bureau.html",
  "c-1.html",
  "c.html",
  "cl.html",
  "clih-1.html",
  "clih.html",
  "clinical.html",
  "compound-n7.html",
  "contact.html",
  "d-1.html",
  "d-2.html",
  "d.html",
  "dad.html",
  "daddy.html",
  "dih-1.html",
  "dih-2.html",
  "dih.html",
  "Documents-index.html",
  "Documents-saas-landing.html",
  "Downloads-Qwen_html_20260524_oazsvmt8j.html",
  "fangsauce.html",
  "features.html",
  "fih.html",
  "g.html",
  "index-1.html",
  "index-11.html",
  "index-14.html",
  "index-15.html",
  "index-16.html",
  "index-17.html",
  "index-18.html",
  "index-19.html",
  "index-2.html",
  "index-3.html",
  "index-4.html",
  "index-5.html",
  "index-7.html",
  "index.html",
  "index1.html",
  "index2-1.html",
  "index2-2.html",
  "index2.html",
  "index3-1.html",
  "index3-2.html",
  "index3-3.html",
  "index3.html",
  "index4-1.html",
  "index4-2.html",
  "index4-3.html",
  "index4.html",
  "index5.html",
  "kid.html",
  "kih.html",
  "logclub.html",
  "nutristaple-9.html",
  "obol-foundry.html",
  "portfolio.html",
  "privacy.html",
  "puter-ai-gateway-index.html",
  "register-1.html",
  "register-landing.html",
  "register.html",
  "saas-landing-beurre.html",
  "si.html",
  "son.html",
  "standalone-playground.html",
  "terms.html",
  "test.html",
  "the-dukes-drop.html",
  "titanic-minecraftclone.html",
  "tmp-daddy.html",
  "turd.html",
  "VS-Code-test.html"
];

// --- GENERATE WEBSITES METADATA AND TITLES ---
function formatFilename(name) {
  let base = name.replace(/\.html$/, '');
  base = base.replace(/[-_]/g, ' ');
  return base.toUpperCase();
}

function getProjectMetadata(name) {
  const title = formatFilename(name);
  let tags = 'Web Project / HTML5 / Static';
  let sector = 'Frontend Development';
  let description = `A custom-built interactive frontend module imported from ${name}. This site explores modern web design practices, responsive structures, and custom layouts.`;
  let client = 'Desktop Imports';
  let role = 'Creative Developer';

  if (name.includes('dashboard') || name.includes('settings')) {
    tags = 'SaaS / Interface / App';
    sector = 'System Controls';
    description = `A fully featured control center interface. Designed with custom charts, widgets, and layout modularity to organize complex system parameters into a clean dashboard.`;
    role = 'Lead UX Developer';
  } else if (name.includes('landing') || name.includes('saas')) {
    tags = 'Marketing / Landing Page';
    sector = 'Product Launch';
    description = `A premium, high-converting product landing page. Focused on visual hierarchy, smooth animations, pricing tables, and responsive call-to-actions.`;
    role = 'Creative Technologist';
  } else if (name.includes('portfolio') || name.includes('index')) {
    tags = 'Portfolio / Interactive / Showcase';
    sector = 'Digital Showcase';
    description = `A personal showcase website demonstrating creative design, client projects, and frontend coding capabilities in a clean grid layout.`;
    role = 'Design Technologist';
  } else if (name.includes('minecraft') || name.includes('clone') || name.includes('game') || name.includes('drop') || name.includes('playground')) {
    tags = 'Game Dev / WebGL / Interactive';
    sector = 'Web Gaming';
    description = `An interactive web-based gaming experience. Exploring physics loops, client input rendering, and real-time controls in a standard web browser.`;
    role = 'WebGL Engineer';
  }

  if (name.includes('google') || name.includes('visitor')) client = 'Google Inc.';
  else if (name.includes('netflix') || name.includes('stranger')) client = 'Netflix LLC';
  else if (name.includes('diageo') || name.includes('aura') || name.includes('don')) client = 'Diageo Plc';

  return { title, tags, sector, description, client, role, filename: name };
}

const galleryItems = websiteFiles.map((filename, index) => {
  const meta = getProjectMetadata(filename);
  const years = ['2024', '2025', '2026'];
  const year = years[index % years.length];
  return {
    ...meta,
    subtitle: meta.sector, // Subtitle mapped to sector to fix UNDEFINED bug
    year,
    id: index
  };
});

// --- STATE MANAGEMENT ---
let currentLayout = 'sphere'; // 'sphere' or 'grid'
let activeCard = null;
let isAnimating = false;
let isDragging = false;
let startX = 0, startY = 0;
let startRotX = 0, startRotY = 0;
let targetRotationX = 0, targetRotationY = 0;
let currentRotationX = 0, currentRotationY = 0;
let mouseX = 0, mouseY = 0;
let dragDistance = 0;

// Grid Pan state
let targetGridPanX = 0, targetGridPanY = 0;
let currentGridPanX = 0, currentGridPanY = 0;
let startGridPanX = 0, startGridPanY = 0;

// Dimensions of card in 3D
const CARD_WIDTH = 2.4;
const CARD_HEIGHT = 3.2;
const SPHERE_RADIUS = 13.0;

// --- INITIALIZE THREE.JS ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const galleryGroup = new THREE.Group();
scene.add(galleryGroup);

const linesGroup = new THREE.Group();
galleryGroup.add(linesGroup);

// --- PRELOAD TEMPLATE TEXTURES FOR FALLBACKS ---
const templateUrls = [
  '/assets/ai_compass.png',
  '/assets/red_stranger.png',
  '/assets/pixel_tech.png',
  '/assets/visitor_guide.png',
  '/assets/blue_bottles.png',
  '/assets/desert_agave.png'
];
const textureLoader = new THREE.TextureLoader();

function getUvScale(tex, width, height) {
  if (!tex.image) return new THREE.Vector2(1, 1);
  const texAspect = tex.image.width / tex.image.height;
  const meshAspect = width / height;
  const scale = new THREE.Vector2(1, 1);
  if (meshAspect > texAspect) {
    scale.y = texAspect / meshAspect;
  } else {
    scale.x = meshAspect / texAspect;
  }
  return scale;
}

// --- CREATE BACKGROUND SPHERICAL LINES ---
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.12,
  depthWrite: false
});

const latitudes = [37.5, 22.5, 7.5, -7.5, -22.5, -37.5];
latitudes.forEach(latDeg => {
  const points = [];
  const segments = 96;
  const latRad = latDeg * Math.PI / 180;
  const r = SPHERE_RADIUS * Math.cos(latRad);
  const y = SPHERE_RADIUS * Math.sin(latRad);
  
  for (let i = 0; i <= segments; i++) {
    const phi = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(r * Math.sin(phi), y, r * Math.cos(phi)));
  }
  
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geo, lineMaterial);
  linesGroup.add(line);
});

const numVerticalLines = 16;
for (let i = 0; i < numVerticalLines; i++) {
  const phi = (i + 0.5) * (Math.PI * 2 / 16);
  const points = [];
  const segments = 32;
  const startLat = -37.5 * Math.PI / 180;
  const endLat = 37.5 * Math.PI / 180;
  
  for (let j = 0; j <= segments; j++) {
    const lat = startLat + (j / segments) * (endLat - startLat);
    const r = SPHERE_RADIUS * Math.cos(lat);
    const y = SPHERE_RADIUS * Math.sin(lat);
    points.push(new THREE.Vector3(r * Math.sin(phi), y, r * Math.cos(phi)));
  }
  
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geo, lineMaterial);
  linesGroup.add(line);
}

// --- CREATE FLOATING DUST PARTICLES ---
const particleCount = 250;
const particlePos = new Float32Array(particleCount * 3);
const particleDrift = [];

for (let i = 0; i < particleCount; i++) {
  const radius = 3 + Math.random() * (SPHERE_RADIUS - 3.5);
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);
  
  particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  particlePos[i * 3 + 2] = radius * Math.cos(phi);
  
  particleDrift.push({
    x: (Math.random() - 0.5) * 0.001,
    y: (Math.random() - 0.5) * 0.001,
    z: (Math.random() - 0.5) * 0.001
  });
}

const pGeometry = new THREE.BufferGeometry();
pGeometry.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

const pCanvas = document.createElement('canvas');
pCanvas.width = 16; pCanvas.height = 16;
const pCtx = pCanvas.getContext('2d');
const pGrad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
pCtx.fillStyle = pGrad; pCtx.fillRect(0, 0, 16, 16);
const pTexture = new THREE.CanvasTexture(pCanvas);

const pMaterial = new THREE.PointsMaterial({
  color: 0xffffff, size: 0.07, map: pTexture,
  transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false
});

const particleSystem = new THREE.Points(pGeometry, pMaterial);
scene.add(particleSystem);

// --- CREATE GALLERY CARDS ---
const cardGeometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT, 8, 8);
const cardMeshes = [];
const cardsOverlayContainer = document.getElementById('cards-overlay');

galleryItems.forEach((item, index) => {
  
  // Custom WebGL shader supporting cover mapping, zoom, and opacity
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: new THREE.Texture() }, // placeholder until loaded
      uHover: { value: 0.0 },
      uOpacity: { value: 1.0 },
      uUvScale: { value: new THREE.Vector2(1, 1) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform float uHover;
      uniform float uOpacity;
      uniform vec2 uUvScale;
      varying vec2 vUv;
      
      void main() {
        // Fit texture as cover
        vec2 uv = (vUv - 0.5) * uUvScale + 0.5;
        // Zoom on hover
        uv = (uv - 0.5) * (1.0 - uHover * 0.08) + 0.5;
        
        vec4 color = texture2D(uTexture, uv);
        color.rgb += uHover * 0.08; // Hover exposure highlight
        
        gl_FragColor = vec4(color.rgb, color.a * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: true
  });

  const mesh = new THREE.Mesh(cardGeometry, material);
  mesh.userData = { 
    id: index, 
    item: item,
    data: item
  };

  // Spherical positions
  const row = Math.floor(index / 16);
  const col = index % 16;
  
  const theta = (2 - row) * 15 * Math.PI / 180;
  const phi = col * (Math.PI * 2 / 16);
  
  const sx = SPHERE_RADIUS * Math.cos(theta) * Math.sin(phi);
  const sy = SPHERE_RADIUS * Math.sin(theta);
  const sz = SPHERE_RADIUS * Math.cos(theta) * Math.cos(phi);
  
  mesh.position.set(sx, sy, sz);
  mesh.lookAt(0, 0, 0);
  
  mesh.userData.spherePosition = mesh.position.clone();
  mesh.userData.sphereRotation = mesh.rotation.clone();
  mesh.userData.theta = theta;
  mesh.userData.phi = phi;

  // Grid Positions
  const gridColSpacing = 3.5;
  const gridRowSpacing = 4.2;
  const gx = (col - 7.5) * gridColSpacing;
  const gy = (2 - row) * gridRowSpacing;
  const gz = -10.0;
  
  mesh.userData.gridPosition = new THREE.Vector3(gx, gy, gz);
  mesh.userData.gridRotation = new THREE.Euler(0, 0, 0);

  galleryGroup.add(mesh);
  cardMeshes.push(mesh);

  // Load webpage screenshot texture with robust fallback logic
  const previewUrl = `/assets/previews/${item.filename}.png`;
  const fallbackUrl = templateUrls[index % templateUrls.length];

  textureLoader.load(
    previewUrl,
    (tex) => {
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      material.uniforms.uTexture.value = tex;
      material.uniforms.uUvScale.value.copy(getUvScale(tex, CARD_WIDTH, CARD_HEIGHT));
    },
    undefined,
    (err) => {
      // If screenshot preview image is not found/still rendering, fall back to template textures
      textureLoader.load(fallbackUrl, (fallbackTex) => {
        fallbackTex.wrapS = THREE.ClampToEdgeWrapping;
        fallbackTex.wrapT = THREE.ClampToEdgeWrapping;
        fallbackTex.minFilter = THREE.LinearFilter;
        material.uniforms.uTexture.value = fallbackTex;
        material.uniforms.uUvScale.value.copy(getUvScale(fallbackTex, CARD_WIDTH, CARD_HEIGHT));
      });
    }
  );

  // HTML Overlay Labels
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card-element';
  cardDiv.id = `card-element-${index}`;
  cardDiv.innerHTML = `
    <div class="card-meta">
      <span>${item.tags}</span>
      <span>${item.year}</span>
    </div>
    <div class="card-clicker" data-id="${index}"></div>
    <div class="card-title-group">
      <span class="card-title">${item.title}</span>
      <span class="card-subtitle">${item.subtitle}</span>
    </div>
  `;
  
  cardsOverlayContainer.appendChild(cardDiv);

  const clicker = cardDiv.querySelector('.card-clicker');
  
  clicker.addEventListener('pointerenter', () => {
    if (isAnimating || isDragging || (activeCard && activeCard.id !== index)) return;
    cardDiv.classList.add('hovered');
    gsap.to(material.uniforms.uHover, { value: 1.0, duration: 0.4, ease: 'power2.out' });
  });
  
  clicker.addEventListener('pointerleave', () => {
    if (isAnimating || (activeCard && activeCard.id === index)) return;
    cardDiv.classList.remove('hovered');
    gsap.to(material.uniforms.uHover, { value: 0.0, duration: 0.4, ease: 'power2.out' });
  });

  clicker.addEventListener('click', () => {
    if (isAnimating || isDragging) return;
    if (dragDistance > 6) return;
    
    if (activeCard) {
      if (activeCard.id === index) closeProjectDetail();
    } else {
      openProjectDetail(mesh);
    }
  });
});

// --- CARD SCREEN DIMENSIONS ---
let cardWidthPx = 0;
let cardHeightPx = 0;

function calculateCardScreenSizes() {
  const visibleHeight = 2.0 * SPHERE_RADIUS * Math.tan(camera.fov * Math.PI / 360);
  const pxScale = window.innerHeight / visibleHeight;
  
  cardWidthPx = CARD_WIDTH * pxScale;
  cardHeightPx = CARD_HEIGHT * pxScale;
}
calculateCardScreenSizes();

// --- PROJECT 3D POSITION TO SCREEN OVERLAY ---
const tempVec = new THREE.Vector3();
const cameraDirection = new THREE.Vector3();

function updateCardOverlays() {
  cameraDirection.set(0, 0, -1).applyQuaternion(camera.quaternion);

  cardMeshes.forEach(mesh => {
    const idx = mesh.userData.id;
    const cardDiv = document.getElementById(`card-element-${idx}`);
    
    tempVec.copy(mesh.position);
    tempVec.applyMatrix4(galleryGroup.matrixWorld);

    const cardDirNorm = tempVec.clone().normalize();
    const dot = cardDirNorm.dot(cameraDirection);

    tempVec.project(camera);

    const isBehindCamera = tempVec.z > 1.0;

    let opacityVal = 1.0;
    if (currentLayout === 'sphere') {
      opacityVal = Math.max(0, Math.min(1, (dot - 0.12) / 0.38));
    }

    if (activeCard) {
      opacityVal = activeCard.id === idx ? 1.0 : 0.0;
    }

    if (isBehindCamera || opacityVal <= 0.0) {
      cardDiv.style.opacity = 0;
      cardDiv.style.pointerEvents = 'none';
      mesh.material.uniforms.uOpacity.value = 0.0;
    } else {
      const x = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-tempVec.y * 0.5 + 0.5) * window.innerHeight;

      cardDiv.style.width = `${cardWidthPx}px`;
      cardDiv.style.height = `${cardHeightPx}px`;
      cardDiv.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      
      cardDiv.style.opacity = opacityVal;
      cardDiv.style.pointerEvents = activeCard ? (activeCard.id === idx ? 'auto' : 'none') : 'auto';
      mesh.material.uniforms.uOpacity.value = opacityVal;
    }
  });
}

// --- PROJECT DETAIL PANEL TRANSITIONS WITH LIVE IFRAME PREVIEW ---
const detailOverlay = document.getElementById('detail-overlay');
const detailContent = document.querySelector('.detail-content');
const livePreviewContainer = document.getElementById('live-preview-container');
const livePreviewIframe = document.getElementById('live-preview-iframe');
const livePreviewUrl = document.getElementById('live-preview-url');

function openProjectDetail(mesh) {
  isAnimating = true;
  activeCard = mesh.userData;
  
  const data = mesh.userData.data;
  document.getElementById('detail-tags').innerText = data.tags;
  document.getElementById('detail-year').innerText = data.year;
  document.getElementById('detail-title').innerText = data.title;
  document.getElementById('detail-subtitle').innerText = data.subtitle;
  document.getElementById('detail-description').innerText = data.description;
  document.getElementById('detail-client').innerText = data.client;
  document.getElementById('detail-agency').innerText = data.agency;
  document.getElementById('detail-role').innerText = data.role;
  document.getElementById('detail-sector').innerText = data.sector;
  document.querySelector('.visit-btn').href = `/projects/${data.filename}`;

  livePreviewIframe.src = `/projects/${data.filename}`;
  livePreviewUrl.innerText = `https://localhost/projects/${data.filename}`;

  const cardDiv = document.getElementById(`card-element-${mesh.userData.id}`);
  cardDiv.classList.add('hovered');

  let targetYRot = -mesh.userData.phi;
  let targetXRot = mesh.userData.theta;
  
  if (currentLayout === 'sphere') {
    targetYRot += 0.22;
  } else {
    const targetGridPosX = mesh.userData.gridPosition.x + currentGridPanX + 1.6;
    gsap.to(mesh.position, { x: targetGridPosX, duration: 1.2, ease: 'power2.out' });
  }

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
    }
  });

  if (currentLayout === 'sphere') {
    tl.to(galleryGroup.rotation, { 
      x: targetXRot, 
      y: targetYRot, 
      duration: 1.2, 
      ease: 'power2.out' 
    }, 0);
  }
  
  tl.to(camera, { 
    fov: 34, 
    duration: 1.2, 
    ease: 'power2.out', 
    onUpdate: () => {
      camera.updateProjectionMatrix();
      calculateCardScreenSizes();
    }
  }, 0);

  tl.to(mesh.material.uniforms.uHover, { 
    value: 1.0, 
    duration: 1.2, 
    ease: 'power2.out' 
  }, 0);

  cardMeshes.forEach(m => {
    if (m !== mesh) {
      tl.to(m.material.uniforms.uOpacity, { 
        value: 0.0, 
        duration: 0.6, 
        ease: 'power2.out' 
      }, 0);
    }
  });

  tl.to(detailOverlay, { 
    x: '0%', 
    duration: 1.0, 
    ease: 'power3.out' 
  }, 0.2);

  tl.to(detailContent, { 
    opacity: 1, 
    y: 0, 
    duration: 0.8, 
    ease: 'power2.out' 
  }, 0.5);

  tl.to(livePreviewContainer, {
    opacity: 1,
    x: 0,
    pointerEvents: 'auto',
    duration: 0.8,
    ease: 'power2.out'
  }, 0.5);
  livePreviewContainer.classList.add('active');
}

function closeProjectDetail() {
  if (!activeCard) return;
  isAnimating = true;
  
  const mesh = cardMeshes.find(m => m.userData.id === activeCard.id);
  const cardDiv = document.getElementById(`card-element-${activeCard.id}`);

  const tl = gsap.timeline({
    onComplete: () => {
      livePreviewIframe.src = 'about:blank';
      activeCard = null;
      isAnimating = false;
      cardDiv.classList.remove('hovered');
      
      targetRotationX = galleryGroup.rotation.x;
      targetRotationY = galleryGroup.rotation.y;
    }
  });

  tl.to(detailContent, { 
    opacity: 0, 
    y: 20, 
    duration: 0.5, 
    ease: 'power2.in' 
  }, 0);

  tl.to(detailOverlay, { 
    x: '100%', 
    duration: 0.8, 
    ease: 'power3.inOut' 
  }, 0.1);

  tl.to(livePreviewContainer, {
    opacity: 0,
    x: -30,
    pointerEvents: 'none',
    duration: 0.6,
    ease: 'power2.inOut'
  }, 0);
  livePreviewContainer.classList.remove('active');

  if (currentLayout === 'grid') {
    tl.to(mesh.position, { x: mesh.userData.gridPosition.x + currentGridPanX, duration: 1.0, ease: 'power2.inOut' }, 0);
  }

  tl.to(camera, { 
    fov: 60, 
    duration: 1.2, 
    ease: 'power2.inOut', 
    onUpdate: () => {
      camera.updateProjectionMatrix();
      calculateCardScreenSizes();
    }
  }, 0);

  tl.to(mesh.material.uniforms.uHover, { 
    value: 0.0, 
    duration: 1.0, 
    ease: 'power2.inOut' 
  }, 0);

  cardMeshes.forEach(m => {
    if (m !== mesh) {
      tl.to(m.material.uniforms.uOpacity, { 
        value: 1.0, 
        duration: 1.0, 
        ease: 'power2.inOut' 
      }, 0.2);
    }
  });
}

document.getElementById('close-detail').addEventListener('click', closeProjectDetail);

// --- LAYOUT SWITCHING (SPHERE <-> GRID) ---
const layoutToggle = document.getElementById('layout-toggle');
const iconSphere = document.querySelector('.icon-sphere');
const iconGrid = document.querySelector('.icon-grid');

layoutToggle.addEventListener('click', () => {
  if (isAnimating) return;
  if (activeCard) closeProjectDetail();

  isAnimating = true;
  currentLayout = currentLayout === 'sphere' ? 'grid' : 'sphere';

  if (currentLayout === 'grid') {
    iconSphere.style.display = 'none';
    iconGrid.style.display = 'block';
    targetGridPanX = 0; targetGridPanY = 0;
    currentGridPanX = 0; currentGridPanY = 0;
  } else {
    iconSphere.style.display = 'block';
    iconGrid.style.display = 'none';
  }

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
      targetRotationX = 0;
      targetRotationY = 0;
      currentRotationX = 0;
      currentRotationY = 0;
    }
  });

  tl.to(galleryGroup.rotation, { x: 0, y: 0, duration: 1.2, ease: 'power2.inOut' }, 0);

  cardMeshes.forEach((mesh) => {
    const targetPos = currentLayout === 'grid' ? mesh.userData.gridPosition : mesh.userData.spherePosition;
    const targetRot = currentLayout === 'grid' ? mesh.userData.gridRotation : mesh.userData.sphereRotation;
    
    tl.to(mesh.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 1.2,
      ease: 'power2.inOut'
    }, 0);

    tl.to(mesh.rotation, {
      x: targetRot.x,
      y: targetRot.y,
      z: targetRot.z,
      duration: 1.2,
      ease: 'power2.inOut'
    }, 0);
  });

  if (currentLayout === 'grid') {
    tl.to(linesGroup.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.8, ease: 'power2.inOut' }, 0);
    linesGroup.children.forEach(line => {
      tl.to(line.material, { opacity: 0, duration: 0.8 }, 0);
    });
  } else {
    tl.to(linesGroup.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power2.inOut' }, 0);
    linesGroup.children.forEach(line => {
      tl.to(line.material, { opacity: 0.12, duration: 1.2 }, 0);
    });
  }
});

// --- MOUSE & TOUCH DRAGGING ---
function onPointerDown(e) {
  if (isAnimating || activeCard) return;
  
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  
  if (currentLayout === 'sphere') {
    startRotX = targetRotationX;
    startRotY = targetRotationY;
  } else {
    startGridPanX = targetGridPanX;
    startGridPanY = targetGridPanY;
  }
  
  dragDistance = 0;
  document.body.classList.add('grabbing');
}

function onPointerMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!isDragging) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  dragDistance = Math.sqrt(dx * dx + dy * dy);

  if (currentLayout === 'sphere') {
    targetRotationY = startRotY + dx * 0.0022;
    targetRotationX = startRotX + dy * 0.0022;
    targetRotationX = Math.max(-0.48, Math.min(0.48, targetRotationX));
  } else {
    targetGridPanX = startGridPanX + dx * 0.018;
    targetGridPanY = startGridPanY - dy * 0.018;
    
    targetGridPanX = Math.max(-20.0, Math.min(20.0, targetGridPanX));
    targetGridPanY = Math.max(-6.5, Math.min(6.5, targetGridPanY));
  }
}

function onPointerUp() {
  if (!isDragging) return;
  isDragging = false;
  document.body.classList.remove('grabbing');
}

window.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);

// Scroll Wheel
window.addEventListener('wheel', (e) => {
  if (isAnimating || activeCard) return;

  if (currentLayout === 'sphere') {
    targetRotationY += e.deltaX * 0.0008;
    targetRotationX += e.deltaY * 0.0008;
    targetRotationX = Math.max(-0.48, Math.min(0.48, targetRotationX));
  } else {
    targetGridPanX -= e.deltaX * 0.005;
    targetGridPanY += e.deltaY * 0.005;
    targetGridPanX = Math.max(-20.0, Math.min(20.0, targetGridPanX));
    targetGridPanY = Math.max(-6.5, Math.min(6.5, targetGridPanY));
  }
}, { passive: true });

// --- CLOCK UPDATES ---
function updateClocks() {
  const getFmtTime = (tz) => {
    const date = new Date();
    const timeStr = date.toLocaleTimeString('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' });
    const parts = formatter.formatToParts(date);
    const tzName = parts.find(p => p.type === 'timeZoneName').value;
    return `${timeStr} ${tzName}`;
  };

  document.getElementById('london-time').innerText = getFmtTime('Europe/London');
  document.getElementById('auckland-time').innerText = getFmtTime('Pacific/Auckland');
}
updateClocks();
setInterval(updateClocks, 1000);

// --- WINDOW RESIZE ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  calculateCardScreenSizes();
});

// --- TICK LOOP ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  if (!activeCard) {
    if (currentLayout === 'sphere') {
      if (!isDragging) {
        targetRotationY += 0.012 * delta;
      }
      currentRotationX += (targetRotationX - currentRotationX) * 0.07;
      currentRotationY += (targetRotationY - currentRotationY) * 0.07;
      
      galleryGroup.rotation.x = currentRotationX;
      galleryGroup.rotation.y = currentRotationY;
    } else {
      currentGridPanX += (targetGridPanX - currentGridPanX) * 0.07;
      currentGridPanY += (targetGridPanY - currentGridPanY) * 0.07;

      cardMeshes.forEach(mesh => {
        mesh.position.x = mesh.userData.gridPosition.x + currentGridPanX;
        mesh.position.y = mesh.userData.gridPosition.y + currentGridPanY;
        mesh.position.z = mesh.userData.gridPosition.z;
      });

      const targetParallaxX = (mouseY / window.innerHeight - 0.5) * 0.05;
      const targetParallaxY = (mouseX / window.innerWidth - 0.5) * 0.05;
      
      currentRotationX += (targetParallaxX - currentRotationX) * 0.07;
      currentRotationY += (targetParallaxY - currentRotationY) * 0.07;
      
      galleryGroup.rotation.x = currentRotationX;
      galleryGroup.rotation.y = currentRotationY;
    }
  }

  const posArr = pGeometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    posArr[i * 3] += particleDrift[i].x;
    posArr[i * 3 + 1] += particleDrift[i].y;
    posArr[i * 3 + 2] += particleDrift[i].z;

    const x = posArr[i * 3];
    const y = posArr[i * 3 + 1];
    const z = posArr[i * 3 + 2];
    const dist = Math.sqrt(x*x + y*y + z*z);
    
    if (dist > SPHERE_RADIUS - 0.5 || dist < 2.0) {
      particleDrift[i].x *= -1;
      particleDrift[i].y *= -1;
      particleDrift[i].z *= -1;
    }
  }
  pGeometry.attributes.position.needsUpdate = true;

  updateCardOverlays();

  renderer.render(scene, camera);
}

animate();
