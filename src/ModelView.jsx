import { asset } from "./assets";
import { ArrowCounterClockwise, ArrowClockwise } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const NOOP = () => {};
export function ModelView({
  model = "science",
  paused = false,
  onInspect = NOOP,
  onSubject = NOOP,
  large = false,
  explode = false,
  wireframe = false,
  world = false,
}) {
  const host = useRef(null),
    config = useRef({ paused, onInspect, onSubject, explode, wireframe });
  const [status, setStatus] = useState("Loading your 3D world…"),
    [failed, setFailed] = useState(false),
    [retry, setRetry] = useState(0);
  const actions = useRef(null);
  useEffect(() => {
    config.current = { paused, onInspect, onSubject, explode, wireframe };
  }, [paused, onInspect, onSubject, explode, wireframe]);
  useEffect(() => {
    let renderer,
      object,
      raf,
      alive = true,
      visible = true;
    const el = host.current;
    setStatus("Loading your 3D world…");
    setFailed(false);
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(world ? 32 : 35, 1, 0.1, 300),
      center = new THREE.Vector3();
    camera.position.set(3, 2.4, 5.5);
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      setStatus(
        "3D is unavailable. All subjects and lessons are accessible through the buttons.",
      );
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, world ? 1.4 : 1.7));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = world ? 1.08 : 1.3;
    el.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = !world;
    controls.enableRotate = !world;
    controls.target.set(0, -0.1, 0);
    controls.minDistance = 3;
    controls.maxDistance = 12;
    scene.add(new THREE.HemisphereLight(0xfff0d5, 0x314e3a, 2.1));
    const sun = new THREE.DirectionalLight(0xffe3b1, 4.2);
    sun.position.set(8, 14, 10);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0xc6c4ff, 2);
    rim.position.set(-8, 4, -5);
    scene.add(rim);
    let fitDistance = 6,
      meshes = [],
      pulse = 0;
    const bases = new Map();
    function reset() {
      camera.position
        .copy(center)
        .add(
          world
            ? new THREE.Vector3(
                fitDistance * 0.35,
                fitDistance * 0.65,
                fitDistance,
              )
            : new THREE.Vector3(
                fitDistance * 0.5,
                fitDistance * 0.38,
                fitDistance,
              ),
        );
      controls.target.copy(center);
      controls.update();
    }
    actions.current = {
      left: () => object && (object.rotation.y -= 0.3),
      right: () => object && (object.rotation.y += 0.3),
      reset,
    };
    new GLTFLoader().load(
      asset("/models/" + model + ".glb"),
      (g) => {
        if (!alive) {
          g.scene.traverse((o) => {
            o.geometry?.dispose();
            o.material?.dispose?.();
          });
          return;
        }
        object = g.scene;
        scene.add(object);
        object.traverse((o) => {
          if (o.isMesh) {
            meshes.push(o);
            bases.set(o, o.position.clone());
            o.material = o.material.clone();
          }
        });
        const box = new THREE.Box3().setFromObject(object);
        box.getCenter(center);
        let size = box.getSize(new THREE.Vector3());
        fitDistance =
          Math.max(size.x / (camera.aspect || 1), size.y, size.z) *
          (world ? 1.65 : 1.3);
        if (!world) fitDistance = 4.8;
        controls.maxDistance = fitDistance * 2;
        controls.minDistance = fitDistance * 0.55;
        reset();
        setStatus("");
      },
      (e) => {
        if (alive && e.total)
          setStatus(
            "Loading 3D · " + Math.round((e.loaded / e.total) * 100) + "%",
          );
      },
      () => {
        if (alive) {
          setStatus(
            "This 3D model could not load. Use the subject buttons and lesson text.",
          );
          setFailed(true);
        }
      },
    );
    const resize = new ResizeObserver(() => {
      const w = Math.max(el.clientWidth, 1),
        h = Math.max(el.clientHeight, 1);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (world && object) {
        const size = new THREE.Box3()
          .setFromObject(object)
          .getSize(new THREE.Vector3());
        fitDistance = Math.max(size.x / camera.aspect, size.y) * 1.75;
        reset();
      }
    });
    resize.observe(el);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(el);
    const ray = new THREE.Raycaster(),
      pointer = new THREE.Vector2();
    let down, hover;
    const hitAt = (e) => {
      let b = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((e.clientX - b.left) / b.width) * 2 - 1,
        (-(e.clientY - b.top) / b.height) * 2 + 1,
      );
      ray.setFromCamera(pointer, camera);
      return object && ray.intersectObject(object, true)[0]?.object;
    };
    const start = (e) => {
      down = [e.clientX, e.clientY];
    };
    const move = (e) => {
      hover = hitAt(e);
      renderer.domElement.style.cursor = hover
        ? "pointer"
        : world
          ? "default"
          : "grab";
    };
    const pick = (e) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 7)
        return;
      let hit = hitAt(e);
      if (hit) {
        pulse = 1;
        config.current.onInspect(hit.name.replaceAll("_", " "));
        if (world) {
          const id = [
            "mathematics",
            "science",
            "english",
            "social",
            "logic",
          ].find((id) => hit.name.startsWith(id + "_"));
          if (id) config.current.onSubject(id);
        }
      }
    };
    renderer.domElement.addEventListener("pointerdown", start);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", pick);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let last = performance.now(),
      scroll = 0;
    const onScroll = () => {
      scroll = Math.min(window.scrollY / 900, 1);
    };
    if (world) window.addEventListener("scroll", onScroll, { passive: true });
    function animate(now) {
      raf = requestAnimationFrame(animate);
      let dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;
      const c = config.current;
      if (object) {
        if (!world && !c.paused && !reduced.matches)
          object.rotation.y += dt * 0.12;
        const t = c.explode ? 1.35 : 1;
        for (const mesh of meshes) {
          if (!world) {
            mesh.position.lerp(bases.get(mesh).clone().multiplyScalar(t), 0.1);
            mesh.material.wireframe = c.wireframe;
          }
          if (mesh.material.emissive) {
            mesh.material.emissive.setHex(mesh === hover ? 0x986b23 : 0x000000);
            mesh.material.emissiveIntensity = 0.22;
          }
        }
        if (world && !c.paused && !reduced.matches) {
          object.rotation.y = THREE.MathUtils.lerp(
            object.rotation.y,
            Math.sin(now * 0.0001) * 0.025 + scroll * 0.07,
            0.03,
          );
          object.position.y = Math.sin(now * 0.0005) * 0.035;
        }
        if (pulse > 0 && !reduced.matches) {
          pulse = Math.max(0, pulse - dt * 2);
          if (!world)
            object.scale.setScalar(1 + Math.sin(pulse * Math.PI) * 0.035);
        }
      }
      controls.update();
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(animate);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resize.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      controls.dispose();
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material)
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            m.dispose(),
          );
      });
      renderer.dispose();
      renderer.domElement.remove();
      actions.current = null;
    };
  }, [model, retry, world]);
  return (
    <div className={"model-shell " + (world ? "world-shell" : "")}>
      <div
        className={"model-view " + (large ? "large" : "")}
        ref={host}
        role="group"
        aria-label={
          world
            ? "Interactive Blender floating learning islands"
            : "Interactive " + model + " model"
        }
      >
        {failed && (
          <img
            className="model-fallback"
            src={asset("/previews/" + model + ".png")}
            alt={world ? "Floating learning islands" : model + " preview"}
          />
        )}{" "}
        {status && (
          <span className="model-status" role="status">
            {status}
            {failed && (
              <button onClick={() => setRetry((r) => r + 1)}>Retry 3D</button>
            )}
          </span>
        )}
      </div>
      {!world && !failed && (
        <div className="model-actions" aria-label="Model controls">
          <button
            aria-label="Rotate model left"
            onClick={() => actions.current?.left()}
          >
            <ArrowCounterClockwise size={15} />
          </button>
          <button
            aria-label="Reset model view"
            onClick={() => actions.current?.reset()}
          >
            Reset view
          </button>
          <button
            aria-label="Rotate model right"
            onClick={() => actions.current?.right()}
          >
            <ArrowClockwise size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
