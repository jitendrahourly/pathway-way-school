import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { afterNextRender } from '@angular/core';

@Component({
  selector: 'app-educational-hero-3d',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './educational-hero-3d.html',
  styleUrl: './educational-hero-3d.scss',
})
export class EducationalHero3D implements OnDestroy {
  @ViewChild('container', { static: true }) private containerRef!: ElementRef<HTMLElement>;
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  protected readonly fallback = signal(false);
  protected readonly ready = signal(false);

  private renderer: any;
  private scene: any;
  private camera: any;
  private animationId = 0;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private isVisible = true;
  private reducedMotion = false;

  private targetRotation = { x: 0, y: 0 };
  private currentRotation = { x: 0, y: 0 };
  private timer: any;
  private startTime = 0;
  private entranceScale = 0.88;
  private baseScale = 1;
  private objects: any[] = [];
  private floats: { obj: any; baseY: number; baseRotX: number; phase: number }[] = [];
  private isSmall = false;
  private particles: any;
  private globe: any;
  private wireGlobe: any;
  private books: any[] = [];
  private booksBase: number[] = [];
  private disposed = false;

  constructor() {
    afterNextRender(() => {
      void this.init();
    });
  }

  private async init(): Promise<void> {
    const container = this.containerRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // WebGL support check
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    } catch {
      gl = null;
    }
    if (!gl) {
      this.fallback.set(true);
      return;
    }

    let THREE: any;
    try {
      THREE = await import('three');
    } catch {
      this.fallback.set(true);
      return;
    }

    if (this.disposed) return;

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    this.isSmall = width < 560;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    this.camera.position.set(0, 0.4, 6.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.isSmall ? 1.25 : 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(4, 6, 5);
    this.scene.add(dir);
    const point = new THREE.PointLight(0xe87927, 1.2, 12);
    point.position.set(-3, 2, 3);
    this.scene.add(point);
    const point2 = new THREE.PointLight(0x30205d, 0.9, 12);
    point2.position.set(3, -2, 2);
    this.scene.add(point2);

    this.timer = new THREE.Timer();

    // Root group for parallax
    const root = new THREE.Group();
    this.scene.add(root);
    this.rootGroup = root;

    const mat = (color: number, extra: Record<string, unknown> = {}) =>
      new THREE.MeshPhongMaterial({ color, shininess: 55, ...extra });

    // Globe: solid sphere, sparse latitude/longitude wire and an orbit ring.
    const globeGroup = new THREE.Group();
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.22, 48, 32),
      new THREE.MeshPhongMaterial({
        color: 0x8a76dd,
        emissive: 0x2a1f52,
        specular: 0x8f82c6,
        shininess: 42,
      }),
    );
    globeGroup.add(globe);

    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(1.245, this.isSmall ? 14 : 18, this.isSmall ? 9 : 12),
      new THREE.MeshBasicMaterial({
        color: 0xe87927,
        wireframe: true,
        transparent: true,
        opacity: 0.42,
      }),
    );
    globeGroup.add(wire);

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(1.52, 0.012, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0xf2b06a, transparent: true, opacity: 0.65 }),
    );
    orbit.rotation.set(1.15, 0.3, 0);
    globeGroup.add(orbit);

    root.add(globeGroup);
    this.globe = globeGroup;
    this.objects.push(globeGroup);
    this.wireGlobe = wire;

    // Graduation cap: mortarboard, crown, button and tassel.
    const capGroup = new THREE.Group();
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.07, 1.0),
      mat(0x7f68d4, { shininess: 60 }),
    );
    capGroup.add(board);
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.36, 0.28, 22, 1, true),
      mat(0x5b47a3, { side: THREE.DoubleSide }),
    );
    crown.position.y = -0.17;
    capGroup.add(crown);
    const button = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), mat(0xe87927));
    button.position.y = 0.06;
    capGroup.add(button);
    const tasselCord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), mat(0xe87927));
    tasselCord.position.set(0.42, -0.22, 0.22);
    tasselCord.rotation.z = 0.28;
    capGroup.add(tasselCord);
    const tasselTip = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 8), mat(0xe87927));
    tasselTip.position.set(0.49, -0.5, 0.22);
    capGroup.add(tasselTip);
    capGroup.position.set(1.68, 1.45, 0.15);
    capGroup.rotation.set(0.2, -0.4, -0.1);
    capGroup.scale.setScalar(1.15);
    root.add(capGroup);
    this.objects.push(capGroup);
    this.floats.push({ obj: capGroup, baseY: 1.5, baseRotX: 0.2, phase: 1.8 });

    // Books: stacked covers with visible page blocks.
    const makeBook = (cover: number, width: number, depth: number, thickness: number) => {
      const book = new THREE.Group();
      const backCover = new THREE.Mesh(new THREE.BoxGeometry(width, thickness * 0.25, depth), mat(cover));
      const pages = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.94, thickness, depth * 0.94),
        mat(0xf6f1e4, { shininess: 8 }),
      );
      pages.position.y = thickness * 0.6;
      const frontCover = new THREE.Mesh(new THREE.BoxGeometry(width, thickness * 0.25, depth), mat(cover));
      frontCover.position.y = thickness * 1.35;
      book.add(backCover, pages, frontCover);
      return book;
    };

    const bookLayout = [
      { cover: 0xe87927, pos: [-2.0, -0.72, 0.35], rotY: 0.5, rotZ: 0.06, size: [0.78, 1.02, 0.16] },
      { cover: 0x8c7bd8, pos: [-1.95, -0.4, 0.3], rotY: 0.32, rotZ: -0.05, size: [0.72, 0.94, 0.14] },
      { cover: 0xf4f5f9, pos: [1.85, -1.02, 0.5], rotY: -0.6, rotZ: 0.1, size: [0.72, 0.96, 0.14] },
    ] as const;

    for (const layout of bookLayout) {
      const book = makeBook(layout.cover, layout.size[0], layout.size[1], layout.size[2]);
      book.position.set(layout.pos[0], layout.pos[1], layout.pos[2]);
      book.rotation.set(0.12, layout.rotY, layout.rotZ);
      root.add(book);
      this.books.push(book);
      this.booksBase.push(layout.pos[1]);
      this.objects.push(book);
    }

    // Pencil: yellow body, wooden tip and an eraser.
    const pencil = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.3, 8), mat(0xf2c94c));
    pencil.add(body);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 8), mat(0xd9a066));
    tip.position.y = 0.73;
    pencil.add(tip);
    const lead = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.05, 8), mat(0x2b2338));
    lead.position.y = 0.82;
    pencil.add(lead);
    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.07, 8), mat(0xb9c0cc, { shininess: 90 }));
    ferrule.position.y = -0.68;
    pencil.add(ferrule);
    const eraser = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8), mat(0xe87927));
    eraser.position.y = -0.76;
    pencil.add(eraser);
    pencil.position.set(-1.95, 1.3, 0.1);
    pencil.rotation.set(0.5, 0.3, 1.05);
    root.add(pencil);
    this.objects.push(pencil);
    this.floats.push({ obj: pencil, baseY: 1.3, baseRotX: 0.5, phase: 2.6 });

    // Small accent geometry in the background.
    const shapes = [
      { geom: new THREE.OctahedronGeometry(0.2), color: 0xffffff, pos: [2.5, 0.45, -0.6] },
      { geom: new THREE.TorusGeometry(0.16, 0.055, 10, 22), color: 0xe87927, pos: [-2.35, -0.1, -0.35] },
      { geom: new THREE.DodecahedronGeometry(0.15), color: 0xa295e0, pos: [1.55, 2.0, 0.6] },
    ].filter((_, index) => !(this.isSmall && index > 1));
    for (const s of shapes) {
      const m = new THREE.Mesh(s.geom as any, mat(s.color));
      m.position.set(s.pos[0], s.pos[1], s.pos[2]);
      root.add(m);
      this.objects.push(m);
      this.floats.push({ obj: m, baseY: s.pos[1], baseRotX: 0, phase: s.pos[0] * 1.7 });
    }

    // Particles
    const particleCount = this.isSmall ? 55 : 90;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.6 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    this.particles = new THREE.Points(pGeom, pMat);
    root.add(this.particles);
    this.objects.push(this.particles);

    this.startTime = performance.now();
    root.scale.setScalar(width < 560 ? 0.72 : 0.88);
    this.ready.set(true);

    // Mouse parallax. The canvas sits behind the page content with pointer-events
    // disabled, so the pointer is tracked on the window instead of the container.
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    document.addEventListener('mouseleave', this.onMouseLeave, { passive: true });

    // Visibility observer to pause rendering
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.isVisible = entries[0]?.isIntersecting ?? true;
        if (this.isVisible && !this.animationId && !this.reducedMotion) {
          this.startLoop();
        }
      },
      { threshold: 0.1 },
    );
    this.intersectionObserver.observe(container);

    // Resize handling
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);
    this.handleResize();

    if (!this.reducedMotion) {
      this.startLoop();
    } else {
      this.renderOnce();
    }
  }

  private rootGroup: any;

  private onMouseMove(e: MouseEvent): void {
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    this.targetRotation.y = x * 0.35;
    this.targetRotation.x = -y * 0.25;
  }

  private onMouseLeave(): void {
    this.targetRotation.x = 0;
    this.targetRotation.y = 0;
  }

  private handleResize(): void {
    if (!this.renderer || !this.camera || !this.containerRef) return;
    const container = this.containerRef.nativeElement;
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);

    // On wide hero banners the copy sits on the left, so nudge the scene to the
    // open right-hand side; small screens keep it centred behind the copy.
    if (this.rootGroup) {
      const offset = w >= 1200 ? 1.2 : w >= 900 ? 1.0 : w >= 700 ? 0.6 : 0;
      // On phones the copy fills the banner, so tuck the scene below the
      // heading where it reads as a soft background rather than clutter.
      const drop = w < 700 ? -0.55 : 0;
      this.rootGroup.position.set(offset, drop, 0);
      this.baseScale = w < 560 ? 0.72 : w < 700 ? 0.8 : 1;
      this.rootGroup.scale.setScalar(this.baseScale * this.entranceScale);
    }
  }

  private startLoop(): void {
    if (this.animationId) return;
    const loop = () => {
      if (!this.isVisible || this.disposed) {
        this.animationId = 0;
        return;
      }
      this.animationId = requestAnimationFrame(loop);
      this.tick();
    };
    this.animationId = requestAnimationFrame(loop);
  }

  private tick(): void {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.timer.update();
    const t = this.timer.getElapsed();

    // Smooth parallax lerp
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.06;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.06;
    if (this.rootGroup) {
      this.rootGroup.rotation.x = this.currentRotation.x * 0.5;
      this.rootGroup.rotation.y = this.currentRotation.y * 0.6;
      // Smooth entrance: ease the whole composition in once.
      const entrance = Math.min(1, (performance.now() - this.startTime) / 1100);
      const eased = 1 - Math.pow(1 - entrance, 3);
      this.entranceScale = 0.88 + eased * 0.12;
      this.rootGroup.scale.setScalar(this.baseScale * this.entranceScale);
    }

    // Gentle floating for cap, pencil and small shapes.
    for (const item of this.floats) {
      item.obj.position.y = item.baseY + Math.sin(t * 0.8 + item.phase) * 0.09;
    }

    // Globe rotation
    if (this.globe) {
      this.globe.rotation.y = t * 0.28;
      this.globe.rotation.x = Math.sin(t * 0.3) * 0.05;
    }
    if (this.wireGlobe) {
      this.wireGlobe.rotation.y = -t * 0.12;
    }

    // Floating books
    this.books.forEach((book, i) => {
      book.position.y = (this.booksBase[i] ?? 0) + Math.sin(t * 0.9 + i * 1.3) * 0.12;
      book.rotation.x = 0.12 + Math.sin(t * 0.7 + i) * 0.05;
    });

    // Particles drift
    if (this.particles) {
      this.particles.rotation.y = t * 0.06;
      this.particles.rotation.x = Math.sin(t * 0.2) * 0.1;
    }

    // Small geometric shapes spin slowly on their own axis.
    for (const item of this.floats) {
      if (item.obj.type === 'Mesh') {
        item.obj.rotation.y = t * 0.35 + item.phase;
        item.obj.rotation.x = item.baseRotX + Math.sin(t * 0.5 + item.phase) * 0.2;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private renderOnce(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  ngOnDestroy(): void {
    this.disposed = true;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animationId = 0;

    window.removeEventListener('mousemove', this.onMouseMove as any);
    document.removeEventListener('mouseleave', this.onMouseLeave as any);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;

    // Dispose
    if (this.scene) {
      this.scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
          else obj.material.dispose();
        }
      });
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss?.();
    }
    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }
}
