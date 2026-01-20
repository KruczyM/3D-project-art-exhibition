import * as THREE from "three";

/*
  SCENE SCALE:
  model.scale.setScalar(0.3);
  1 unit = 1 meter
*/

export const artworks = [
  {
    id: "ostrze",
    meshName: "ostrze",
    groupName: "ostrze",
    cameraPosition: { x: 5.46, y: 2.85, z: -13.38 },
    cameraTarget:   { x: 7.64, y: 2.11, z: -15.58 },
    title: "sword",
    author: "Aleksander Kruk",
    year: "2026",
    description: "A sword created in Blender. My first object created in any creator."
  },
    {
    id: "ostrze",
    meshName: "ostrze",
    groupName: "rękojeść",
    cameraPosition: { x: 5.46, y: 2.85, z: -13.38 },
    cameraTarget:   { x: 7.64, y: 2.11, z: -15.58 },
    title: "sword",
    author: "Aleksander Kruk",
    year: "2026",
    description: "A sword created in Blender. My first object created in any creator."
  },
  {
    id: "art2",
    meshName: "art2",
    cameraPosition: { x: 4.48, y: 2.88, z: -8.16 },
    cameraTarget:   { x: 1.34, y: 6.08, z: -8.21 },
    title: "art2",
    author: "DALEE",
    year: "2026",
    description: `This large-scale panoramic painting depicts an epic cavalry battle set within a picturesque, rolling landscape. The scene is alive with movement, featuring charging riders with fluttering banners amidst rising dust and smoke. The realistic style captures rich details of armor and the drama of combat, emphasized by dynamic lighting and a vast perspective.`
  },
  {
    id: "art6",
    meshName: "art6",
    cameraPosition: { x: 6.13, y: 1.06, z: -4.96 },
    cameraTarget:   { x: 7.70, y: 1.105, z: -4.66 },
    title: "art6",
    author: "DALEE",
    year: "2026",
    description: `This image presents a dark, post-apocalyptic vision of Warsaw, where ruined tenements and the towering Palace of Culture and Science are shrouded in thick smoke and toxic mist. Spectral figures in dark cloaks haunt the streets, moving past car wreckage beneath the watchful eye of an eagle sculpture and amidst fluttering white-and-red flags. The scene's drama is heightened by saturated red glares from fires that contrast with the cold gray of the destroyed city, creating an atmosphere of national tragedy in a future world.`
  },
  {
    id: "art4",
    meshName: "art4",
    cameraPosition: { x: 7.02, y: 1.08, z: -5.60 },
    cameraTarget:   { x: 6.36, y: 1.15, z: -4.23 },
    title: "art4",
    author: "DALEE",
    year: "2026",
    description: `This image transports the viewer into a disturbing cyberpunk dystopia dominated by saturated, blood-red hues and the dark silhouettes of figures in gas masks. The city's architecture is overwhelming and dense, with tangled cables and smoking ruins suggesting a world ravaged by technology or ecological disaster. The overall composition creates a stifling, claustrophobic atmosphere where glowing spotlights and toxic mist emphasize a dramatic struggle for survival in a hostile environment.`
  },
  {
    id: "art3",
    meshName: "art3",
    cameraPosition: { x: 6.55, y: 0.93, z: -7.52 },
    cameraTarget:   { x: 5.46, y: 1.04, z: -8.26 },
    title: "art3",
    author: "DALEE",
    year: "2026",
    description: `This image presents a melancholic vision of a post-apocalyptic city where nature slowly reclaims the skeletal remains of concrete skyscrapers. The misty atmosphere and golden light piercing through smoke imbue the ruined metropolis with a dreamlike yet unsettling character. The composition leads the eye along a deserted highway, emphasizing the vast scale of destruction and the passage of time in a world devoid of human bustle.`
  },
  {
    id: "art1",
    meshName: "art1",
    cameraPosition: { x: 5.53, y: 0.99, z: -7.10 },
    cameraTarget:   { x: 6.97, y: 1.06, z: -8.16 },
    title: "art1",
    author: "DALEE",
    year: "2026",
    description: `This dynamic piece of art depicts a battlefield scene featuring cavalry and infantry, rendered in a raw, expressionistic style. The composition is filled with movement and chaos, emphasized by violent brushstrokes and paint splatter effects. The entire work radiates intense energy, capturing the drama and brutality of combat in an almost abstract manner.`
  },
  {
    id: "art5",
    meshName: "art5",
    cameraPosition: { x: 4.53, y: 2.11, z: -9.07 },
    cameraTarget:   { x: 0.69, y: 1.91, z: -9.05 },
    title: "art5",
    author: "DALEE",
    year: "2026",
    description: `This monumental battle scene depicts a medieval cavalry charge beneath a proudly fluttering banner featuring a white eagle. The dynamism of the clash is captured through the powerful movement of horses, glinting armor, and thick dust rising over the battlefield, giving the work a grand, heroic character. Rich symbolism and meticulous attention to historical gear create an evocative narrative of bravery and sacrifice in the heat of battle.`
  },
  {
    id: "koodSisu-logo-02-1024x253",
    meshName: "koodSisu-logo-02-1024x253",
    cameraPosition: { x: 4.93, y: 2.74, z: -11.61 },
    cameraTarget:   { x: 9.39, y: 2.67, z: -11.61 },
    title: "koodSisu",
    author: "Kood/Sisu",
    year: "eternal",
    description: "The sacred inscription of every student of the purple platform"
  }
];

//navigation logic
let currentArtworkIndex = 0;

export function goToArtwork(index, camera, controls) {
  if (index < 0 || index >= artworks.length) return;

  currentArtworkIndex = index;
  const art = artworks[currentArtworkIndex];

  camera.position.set(
    art.cameraPosition.x,
    art.cameraPosition.y,
    art.cameraPosition.z
  );

  controls.target.set(
    art.cameraTarget.x,
    art.cameraTarget.y,
    art.cameraTarget.z
  );

  controls.update();
}

export function nextArtwork(camera, controls) {
  const nextIndex = (currentArtworkIndex + 1) % artworks.length;
  goToArtwork(nextIndex, camera, controls);
}

export function previousArtwork(camera, controls) {
  const prevIndex =(currentArtworkIndex - 1 + artworks.length) % artworks.length;
  goToArtwork(prevIndex, camera, controls);
}

export function findArtworkByMesh(meshName) {
  return artworks.find(a => a.meshName === meshName);
}

//smooth camera transition
let transitionActive = false;
let transitionProgress = 0;
let transitionDuration = 1.2;

let startCamPos = new THREE.Vector3();
let startTarget = new THREE.Vector3();
let endCamPos = new THREE.Vector3();
let endTarget = new THREE.Vector3();

export function smoothGoToArtwork(art, camera, controls) {
  transitionActive = true;
  transitionProgress = 0;

  startCamPos.copy(camera.position);
  startTarget.copy(controls.target);

  endCamPos.set(
    art.cameraPosition.x,
    art.cameraPosition.y,
    art.cameraPosition.z
  );

  endTarget.set(
    art.cameraTarget.x,
    art.cameraTarget.y,
    art.cameraTarget.z
  );
}

// animation frame bold
export function updateCameraTransition(delta, camera, controls) {
  if (!transitionActive) return;

  transitionProgress += delta / transitionDuration;
  const t = Math.min(transitionProgress, 1);

  camera.position.lerpVectors(startCamPos, endCamPos, t);
  controls.target.lerpVectors(startTarget, endTarget, t);
  controls.update();

  if (t === 1) transitionActive = false;
}

//animation with ease 
function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function updateCameraTransitionEase(delta, camera, controls) {
  if (!transitionActive) return;

  transitionProgress += delta / transitionDuration;

  const linearT = Math.min(transitionProgress, 1);
  const easedT = easeInOutCubic(linearT);

  camera.position.lerpVectors(startCamPos, endCamPos, easedT);
  controls.target.lerpVectors(startTarget, endTarget, easedT);
  controls.update();

  if (linearT === 1) transitionActive = false;
}