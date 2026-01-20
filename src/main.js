import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { setupAudio } from './audioManager.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js";
import { SepiaShader } from "three/examples/jsm/shaders/SepiaShader.js";
import GUI from "lil-gui";
import { artworks, updateCameraTransitionEase, smoothGoToArtwork } from "./arts.js";



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
//help with phone screens pixel ratio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);

camera.position.set(4.53, 2.11, -9.07); 

//composer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
//black & white
const bwPass = new ShaderPass(LuminosityShader);
bwPass.enabled = false;
composer.addPass(bwPass);
//sepia
const sepiaPass = new ShaderPass(SepiaShader);
sepiaPass.enabled = false;
sepiaPass.uniforms.amount.value = 1.0;
composer.addPass(sepiaPass);

//base url for assets
const BASE = import.meta.env.BASE_URL;

//music
setupAudio(camera, `${BASE}music/gallery.mp3`);


//controls 
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0.69, 1.91, -9.05);
controls.enabled = false;
controls.update();

//environment
const exrLoader = new EXRLoader();
exrLoader.load(`${BASE}quadrangle_sunny_1k.exr`, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
});
scene.add(new THREE.AmbientLight(0xffffff, 0.25));

const artworkMeshes = new Map();
//
//  GLB from blender
//
const loader = new GLTFLoader();
const SCENE_SCALE = 0.3;

Promise.all([
  loader.loadAsync(`${BASE}1.glb`),
  loader.loadAsync(`${BASE}2.glb`),
  loader.loadAsync(`${BASE}3.glb`)
]).then(([shellGLTF, artworksGLTF, propsGLTF]) => {

  // --- GALLERY SHELL ---
  const shell = shellGLTF.scene;
  shell.scale.setScalar(SCENE_SCALE);
  scene.add(shell);

  // --- PROPS ---
  const props = propsGLTF.scene;
  props.scale.setScalar(SCENE_SCALE);
  scene.add(props);

  // --- ARTWORKS (TU CAŁA LOGIKA KLIKANIA) ---
  const artworksScene = artworksGLTF.scene;
  artworksScene.scale.setScalar(SCENE_SCALE);
  scene.add(artworksScene);

  artworksScene.traverse((obj) => {
    if (!obj.isMesh) return;

    const parent = obj.parent;
    const art = artworks.find(
      a => a.meshName === obj.name || a.groupName === parent?.name
    );

    if (art) {
      artworkMeshes.set(obj.uuid, art);
      obj.userData.artworkId = art.id;
    }
  });

  console.log("All GLBs loaded");
}).catch((err) => {
  console.error("GLB loading error", err);
});

//raycaster click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("pointerdown", (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length === 0) return;

    const hit = intersects[0].object;
    const art = artworkMeshes.get(hit.uuid);

    if (art) {
        showArtworkInfo(art);
    }
});

const panel = document.getElementById("artworkPanel");

function showArtworkInfo(art) {
    document.getElementById("artTitle").textContent = art.title;
    document.getElementById("artAuthor").textContent = art.author;
    document.getElementById("artDescription").textContent = art.description;

    panel.classList.remove("hidden");
}

document.getElementById("closeArtPanel")
    .addEventListener("click", () => {
        panel.classList.add("hidden");
    });

//
//  Buttons
//
let currentArtworkIndex = 7;

document.getElementById("nextArtworkBtn").addEventListener("click", () => {
    const nextIndex = (currentArtworkIndex + 1) % artworks.length;
    smoothGoToArtwork(artworks[nextIndex], camera, controls);
    currentArtworkIndex = nextIndex;
});

document.getElementById("prevArtworkBtn").addEventListener("click", () => {
    const prevIndex = (currentArtworkIndex - 1 + artworks.length) % artworks.length;
    smoothGoToArtwork(artworks[prevIndex], camera, controls);
    currentArtworkIndex = prevIndex;
});

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        const nextIndex = (currentArtworkIndex + 1) % artworks.length;
        smoothGoToArtwork(artworks[nextIndex], camera, controls);
        currentArtworkIndex = nextIndex;
    }
    if (e.key === "ArrowLeft") {
        const prevIndex = (currentArtworkIndex - 1 + artworks.length) % artworks.length;
        smoothGoToArtwork(artworks[prevIndex], camera, controls);
        currentArtworkIndex = prevIndex;
    }
});


//
//  GUI
//
const params = {
    wireframe: false,
    showBackground: true,
    backgroundColor: "#000000",
    exposure: 1.2,
    colorMode: "Normal",
    sepiaAmount: 1.0,
    orbitControls: false,
    cameraMode: "lock"
};


const gui = new GUI({ width: 300 });

const wireframeCtrl = gui.add(params, "wireframe").name("Wireframe");

wireframeCtrl.onChange((value) => {
    scene.traverse((obj) => {
        if (obj.isMesh && obj.material) {
            obj.material.wireframe = value;
            obj.material.needsUpdate = true;
        }
    });
});

gui.add(params, "showBackground")
    .name("Show Background")
    .onChange((value) => {
        scene.background = value ? scene.environment : null;
    });

gui.addColor(params, "backgroundColor")
    .name("Background Color")
    .onChange((value) => {
        if (!params.showBackground) {
            scene.background = new THREE.Color(value);
        }
    });


gui.add(params, "exposure", 0.1, 2.5, 0.01)
    .name("Exposure")
    .onChange((value) => {
        renderer.toneMappingExposure = value;
    });

gui.add(params, "colorMode", ["Normal", "Black & White", "Sepia"])
    .name("Color Mode")
    .onChange((mode) => {
        bwPass.enabled = false;
        sepiaPass.enabled = false;

        if (mode === "Black & White") {
            bwPass.enabled = true;
        }

        if (mode === "Sepia") {
            sepiaPass.enabled = true;
        }
    });

gui.add(params, "sepiaAmount", -1, 2, 0.01)
    .name("Sepia Strength")
    .onChange((v) => {
        sepiaPass.uniforms.amount.value = v;
    });

gui.add(params, "cameraMode", ["gallery", "free", "lock"])
    .name("Camera mode")
    .onChange((mode) => {
        params.cameraMode = mode;
        if (mode === "lock") {
            controls.enabled = false;
        } else {
            controls.enabled = true;
        }
    });


//DEBUG
// gui.add(camera.position, "x", -100, 100).name("X Position").listen();
// gui.add(camera.position, "y", -100, 100).name("Y Position").listen();
// gui.add(camera.position, "z", -100, 100).name("Z Position").listen();
// gui.add(controls.target, "x", -100, 100).name("X Position").listen();
// gui.add(controls.target, "y", -100, 100).name("Y Position").listen();
// gui.add(controls.target, "z", -100, 100).name("Z Position").listen();

//
//  ANIMATION
//
const clock = new THREE.Clock();

//boundaries
const GALLERY_BOUNDS = {
    minX: 0.9,
    maxX: 9.41,
    minY: 1.2,
    maxY: 4.57,
    minZ: -18,
    maxZ: 0.93
};

function clampCameraPosition() {
    if (params.cameraMode === "lock" || params.cameraMode === "free") return;

    const p = camera.position;

    p.x = THREE.MathUtils.clamp(p.x, GALLERY_BOUNDS.minX, GALLERY_BOUNDS.maxX);
    p.y = THREE.MathUtils.clamp(p.y, GALLERY_BOUNDS.minY, GALLERY_BOUNDS.maxY);
    p.z = THREE.MathUtils.clamp(p.z, GALLERY_BOUNDS.minZ, GALLERY_BOUNDS.maxZ);
}

function clampControlsTarget() {
     if (params.cameraMode === "lock" || params.cameraMode === "free") return;

    const t = controls.target;
    t.x = THREE.MathUtils.clamp(t.x, -4, 4);
    t.y = THREE.MathUtils.clamp(t.y, 1.2, 2.5);
    t.z = THREE.MathUtils.clamp(t.z, -12, -4);
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    updateCameraTransitionEase(delta, camera, controls);

    controls.update();
    clampCameraPosition();
    clampControlsTarget()
    composer.render();
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
