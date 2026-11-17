import * as THREE from 'three';
import { createDoorModel } from './art/models';
import { DOOR_IDS } from './catalog';
import { entryFrame, ENTER_DURATION, REDUCED_ENTER_DURATION } from './transition';
import type { DoorId, DoorMood } from './types';

interface SceneOptions {
  canvas: HTMLCanvasElement;
  container: HTMLDivElement;
  labels: Map<DoorId, HTMLButtonElement>;
  ids: readonly DoorId[];
  veil: HTMLDivElement;
  mood: DoorMood;
  reducedMotion: boolean;
  maxPixelRatio: number;
  onSelect: (id: DoorId) => void;
  onHover: (id: DoorId | null) => void;
  onError: (error: Error) => void;
}

export function createDoorScene(options: SceneOptions) {
  const { canvas, container, labels, ids, veil } = options;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.max(1, Math.min(window.devicePixelRatio, options.maxPixelRatio)));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color();
  const camera = new THREE.OrthographicCamera(-8, 8, 4, -4, .1, 60);
  const sun = new THREE.DirectionalLight('#fff1d8', 3.2);
  sun.position.set(-4, 9, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 12, bottom: -10, near: .5, far: 35 });
  sun.shadow.normalBias = .035;
  sun.shadow.bias = -.0001;
  sun.shadow.radius = 3;
  const hemisphere = new THREE.HemisphereLight('#fff6e5', '#b7a68b', 2.1);
  const fill = new THREE.DirectionalLight('#d9e7dc', .7);
  fill.position.set(6, 4, 4);
  scene.add(sun, hemisphere, fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ color: '#85724d', opacity: .17 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.012;
  floor.receiveShadow = true;
  scene.add(floor);

  // Artwork resources are owned by this scene, never shared across mounts.
  const models = ids.map(id => {
    const model = createDoorModel(DOOR_IDS.indexOf(id));
    scene.add(model.root);
    return { id, model };
  });
  let disposed = false;
  let reduced = options.reducedMotion;
  let elapsed = 0;
  let last = performance.now();
  let baseHeight = 6.6;
  const baseTarget = new THREE.Vector3();
  const aim = new THREE.Vector3();
  let entry: { id: DoorId; elapsed: number; duration: number; reduced: boolean; resolve: () => void; reject: (reason: Error) => void } | null = null;
  let locked = false;
  let visible = true;

  function setMood(mood: DoorMood) {
    const night = mood === 'night';
    (scene.background as THREE.Color).set(night ? '#18232f' : '#f4efe5');
    sun.color.set(night ? '#b4ceff' : '#fff1d8');
    sun.intensity = night ? .85 : 3.2;
    hemisphere.color.set(night ? '#a6bce3' : '#fff6e5');
    hemisphere.groundColor.set(night ? '#273144' : '#b7a68b');
    hemisphere.intensity = night ? .65 : 2.1;
    fill.color.set(night ? '#ffd29a' : '#d9e7dc');
    fill.intensity = night ? .9 : .7;
    floor.material.color.set(night ? '#050b15' : '#85724d');
    floor.material.opacity = night ? .35 : .17;
    for (const { model } of models) model.root.traverse(object => {
      if (object instanceof THREE.PointLight) {
        object.userData.dayIntensity ??= object.intensity;
        object.intensity = Number(object.userData.dayIntensity) * (night ? 1.6 : 1);
      }
    });
  }

  function positionLabels() {
    const point = new THREE.Vector3();
    for (const { id, model } of models) {
      point.set(model.root.position.x, model.root.position.y - .12, .35).project(camera);
      const label = labels.get(id);
      if (label) { label.style.left = `${(point.x * .5 + .5) * container.clientWidth}px`; label.style.top = `${(-point.y * .5 + .5) * container.clientHeight}px`; }
    }
  }

  function fit() {
    const width = Math.max(container.clientWidth, 1), height = Math.max(container.clientHeight, 1);
    const grid = width <= 760 && ids.length > 2;
    const columns = grid ? 2 : ids.length;
    const aspect = width / height;
    baseHeight = Math.max(grid ? 11.9 : 6.6, (columns === 2 ? 7.1 : columns * 3.35 + 1.1) / aspect);
    camera.left = -baseHeight * aspect / 2; camera.right = baseHeight * aspect / 2;
    camera.top = baseHeight / 2; camera.bottom = -baseHeight / 2;
    baseTarget.set(0, grid ? 4.4 : 1.6, 0);
    models.forEach(({ model }, i) => model.root.position.set(grid ? (i % 2 ? 1.68 : -1.68) : (i - (ids.length - 1) / 2) * 3.35, grid && i < 2 ? 5.9 : 0, 0));
    if (!locked) {
      camera.position.copy(baseTarget).add(new THREE.Vector3(0, 3.7, 26));
      camera.lookAt(baseTarget); camera.zoom = 1;
    }
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    renderer.setSize(width, height, false);
    positionLabels();
  }

  function hover(id: DoorId | null) {
    if (locked) return;
    models.forEach(item => item.model.hover = item.id === id ? 1 : 0);
    canvas.style.cursor = id ? 'pointer' : 'default';
  }
  function preview(id: DoorId | null) {
    if (locked) return;
    models.forEach(item => item.model.target = item.id === id ? 1.22 : 0);
  }
  function reset() {
    if (entry) entry.reject(new DOMException('Door entry cancelled', 'AbortError'));
    entry = null; locked = false;
    veil.style.opacity = '0';
    models.forEach(({ model }) => { model.target = 0; model.angle = 0; model.hover = 0; model.pivot.rotation.y = 0; });
    labels.forEach(label => label.style.opacity = '1');
    fit();
  }
  function enter(id: DoorId): Promise<void> {
    if (locked || disposed) return Promise.reject(new Error('A doorway transition is already running.'));
    locked = true;
    models.forEach(item => { item.model.hover = 0; item.model.target = item.id === id ? 1.48 : 0; });
    return new Promise((resolve, reject) => { entry = { id, elapsed: 0, duration: reduced ? REDUCED_ENTER_DURATION : ENTER_DURATION, reduced, resolve, reject }; });
  }

  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  let down: { x: number; y: number } | null = null;
  function hit(event: PointerEvent): DoorId | null {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const index = raycaster.intersectObjects(models.map(item => item.model.root), true)[0]?.object.userData.door as number | undefined;
    return index === undefined ? null : DOOR_IDS[index];
  }
  const events = new AbortController();
  canvas.addEventListener('pointermove', e => { if (e.pointerType !== 'touch' && !locked) { const id = hit(e); hover(id); options.onHover(id); } }, { signal: events.signal });
  canvas.addEventListener('pointerleave', () => { hover(null); options.onHover(null); }, { signal: events.signal });
  canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; }, { signal: events.signal });
  canvas.addEventListener('pointerup', e => { if (!down || locked) return; const distance = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null; if (distance <= 8) { const id = hit(e); if (id) options.onSelect(id); } }, { signal: events.signal });
  canvas.addEventListener('pointercancel', () => { down = null; }, { signal: events.signal });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); const error = new Error('The 3D scene paused. You can still enter using the door labels.'); entry?.reject(error); entry = null; options.onError(error); }, { signal: events.signal });
  const resize = new ResizeObserver(fit);
  resize.observe(container);
  const visibility = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; });
  visibility.observe(container);
  setMood(options.mood); fit();

  renderer.setAnimationLoop(now => {
    const dt = Math.min((now - last) / 1000, .04); last = now;
    if (disposed || document.hidden || (!visible && !entry)) return;
    elapsed += dt;
    for (const { model } of models) model.update(dt, elapsed, reduced);
    if (entry) {
      entry.elapsed += dt;
      const progress = Math.min(1, entry.elapsed / entry.duration);
      const frame = entryFrame(progress, entry.reduced);
      const selected = models.find(item => item.id === entry!.id)!.model;
      aim.set(selected.root.position.x, selected.root.position.y + 1.9, -.55).lerp(baseTarget, 1 - frame.travel);
      camera.position.copy(aim).add(new THREE.Vector3(0, 3.7 * (1 - frame.travel), 26 - 23 * frame.travel));
      camera.lookAt(aim);
      camera.zoom = THREE.MathUtils.lerp(1, baseHeight / 1.35, frame.travel);
      camera.updateProjectionMatrix();
      veil.style.opacity = String(frame.veil);
      labels.forEach(label => { label.style.opacity = String(frame.labels); });
      if (progress === 1) { const resolve = entry.resolve; entry = null; resolve(); }
    }
    renderer.render(scene, camera);
  });
  renderer.render(scene, camera);

  function dispose() {
    if (disposed) return;
    disposed = true;
    renderer.setAnimationLoop(null); events.abort(); resize.disconnect(); visibility.disconnect();
    entry?.reject(new DOMException('Door scene unmounted', 'AbortError')); entry = null;
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        geometries.add(object.geometry);
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          materials.add(material);
          for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
        }
      }
      if (object instanceof THREE.Light && 'shadow' in object) (object.shadow as THREE.LightShadow | undefined)?.dispose();
    });
    textures.forEach(texture => texture.dispose()); materials.forEach(material => material.dispose()); geometries.forEach(geometry => geometry.dispose());
    // Keep the canvas context reusable for prop changes and React Fast Refresh.
    scene.clear(); renderer.dispose();
  }
  return { hover, preview, enter, reset, setMood, setReducedMotion(value: boolean) { reduced = value; if (entry && value) { entry.reduced = true; entry.duration = REDUCED_ENTER_DURATION; entry.elapsed = 0; } }, dispose };
}
export type DoorScene = ReturnType<typeof createDoorScene>;
