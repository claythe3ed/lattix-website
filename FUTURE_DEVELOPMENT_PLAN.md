# LATTIX Website – Future Development Plan

## 1. Vision

Transform the current static website into a high-end interactive 3D experience comparable to EDOLUS and Active Theory projects. The site will use WebGL/WebGPU, custom shaders, and scroll-driven cinematic camera paths while preserving LATTIX's field-first identity.

## 2. Current State

- Static HTML/CSS/JS site
- GitHub Pages deployment
- Canvas 2D satellite background
- Mobile-first, offline-capable
- Developed entirely on Android/Termux

## 3. Future Development Environment

### Hardware
- Laptop (to be purchased)
- Operating System: Ubuntu LTS (recommended 24.04)

### Required Tools
- Node.js (LTS) + npm
- Git
- VS Code or Cursor
- Blender (for 3D asset authoring/optimization)
- Chrome DevTools / Firefox Developer Edition

### Recommended Stack
- Vite + React or Svelte
- Three.js (WebGPURenderer with WebGL fallback)
- GSAP + ScrollTrigger for scroll-driven animation
- GLSL/TSL shaders (Three.js Shader Language)
- InstancedMesh / GPGPU for particle systems

## 4. Phased Roadmap

### Phase 1 – WebGL Background Upgrade (current termux-friendly)
- Replace Canvas 2D satellite with Three.js WebGL scene
- Add glow, wireframe materials, and better lighting
- Keep static site structure (no build step initially)
- Optimize for mobile GPUs

### Phase 2 – Cinematic Scroll Experience
- Implement CatmullRomCurve3 camera path
- Four scene nodes: Orbit → Surface Mesh → Compute Core → Data Lattice
- GSAP ScrollTrigger with smooth scrub
- HTML overlay cards pinned to 3D anchors

### Phase 3 – Custom Shaders & GPGPU
- Fresnel atmosphere rim shader
- Procedural noise displacement on GPU
- Particle simulations via Framebuffer Render Targets
- Screen-space effects: Bloom, Depth of Field, Chromatic Aberration

### Phase 4 – Performance & Asset Pipeline
- Draco/Meshoptimizer geometry compression (.glb)
- KTX2/Basis Universal texture compression
- Frustum culling and instanced rendering
- Pixel ratio capping (max 2x)
- Off-screen render call elimination

### Phase 5 – PWA & Offline 3D
- Service Worker for full offline capability
- Cached 3D assets in IndexedDB
- Installable PWA with splash screen

## 5. Technical Boundaries & Constraints

- Must remain offline-capable for field use in Sudan
- Target low-to-mid range Android devices
- No mandatory external CDNs at runtime
- All assets stored locally within the repository
- Graceful fallback to Canvas 2D or static image if WebGL unavailable

## 6. Ubuntu Development Workflow

1. Install Ubuntu LTS
2. Set up Node.js, npm, Git, VS Code
3. Clone repository from GitHub
4. Run local dev server (Vite)
5. Test on desktop, then remotely on Android via local network
6. Build static files and deploy to GitHub Pages or Cloudflare Pages

## 7. Migration Strategy

- Keep current static site live until new experience is stable
- Develop in branch `next-gen-3d`
- Gradual integration: background canvas first, then scroll cameras, then shaders
- Merge to main only after performance validation on real devices

## 8. Performance Budgets

- Initial load: < 2 MB total assets
- Frame rate: 30+ FPS on mid-range Android
- JS heap: < 200 MB
- GPU memory: < 100 MB for textures
- Main thread idle: < 50% during scroll

## 9. Success Metrics

- 3D scene loads without external CDN
- Scroll transitions remain smooth on 4G and offline
- User can access all content without WebGL (fallback)
- Core Web Vitals remain "Good" after migration

## 10. Reference Architecture (EDOLUS-style)

- Full-screen fixed canvas (z-index: 1)
- Semantic HTML overlay (z-index: 2)
- Dual-camera system (Perspective + Orthographic)
- Spline-based camera kinematics
- GPGPU particle field
- Post-processing pipeline (Bloom, DoF)
- Instanced geometry for grid/particles

## 11. Next Actions

- [ ] Purchase Ubuntu laptop
- [ ] Set up development environment
- [ ] Fork/clone repository locally
- [ ] Initialize Vite + Three.js project in `next-gen-3d` branch
- [ ] Replace Canvas 2D with WebGL scene
- [ ] Add scroll-driven camera test
