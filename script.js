const canvas2 = document.querySelector("canvas.webgl2");

// Scene
const scene2 = new THREE.Scene();

var tuniform = {
  iTime: { type: "f", value: 1 },
  iMouse: { value: new THREE.Vector4() },
  iChannel0: { type: "t", value: THREE.ImageUtils.loadTexture("images/a.png") },
  iChannel1: {
    type: "t",
    value: THREE.ImageUtils.loadTexture("images/b.png"),
  },
};

tuniform.iChannel0.value.wrapS = tuniform.iChannel0.value.wrapT =
  THREE.RepeatWrapping;
tuniform.iChannel1.value.wrapS = tuniform.iChannel1.value.wrapT =
  THREE.RepeatWrapping;

const planebg = new THREE.PlaneGeometry(25, 15);
const planebgmat = new THREE.ShaderMaterial({
  uniforms: tuniform,
  vertexShader: document.getElementById("vertexshadera").textContent,
  fragmentShader: document.getElementById("fragmentshadera").textContent,
  //blending: THREE.AdditiveBlending,
  depthTest: true,
  transparent: false,
  vertexColors: false,
  side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planebg, planebgmat);
scene2.add(planeMesh);
planeMesh.position.set(0, 0, -10);
planeMesh.rotation.set(0, 0, 0);

const sizes2 = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes2.width = window.innerWidth;
  sizes2.height = window.innerHeight;

  // Update camera
  camera2.aspect = sizes2.width / sizes2.height;
  camera2.updateProjectionMatrix();

  // Update renderer
  renderer2.setSize(sizes2.width, sizes2.height);
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera2 = new THREE.PerspectiveCamera(
  45,
  sizes2.width / sizes2.height,
  0.1,
  1000
);
camera2.position.x = 0;
camera2.position.y = 0;
camera2.position.z = 3;
scene2.add(camera2);

/**
 * Renderer
 */
const renderer2 = new THREE.WebGLRenderer({
  canvas: canvas2,
  alpha: true,
  antialias: true,
});
renderer2.setSize(sizes2.width, sizes2.height);
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock2 = new THREE.Clock();

const tick2 = () => {
  window.requestAnimationFrame(tick2);
  const deltaTime2 = clock2.getDelta();

  tuniform.iTime.value += deltaTime2;

  renderer2.render(scene2, camera2);
};

tick2();

// const gui = new dat.GUI({ closed: false, width: 240 });
// const bigWavesFolder = gui.addFolder("Large Waves");
// const smallWavesFolder = gui.addFolder("Small Waves");
// const colorFolder = gui.addFolder("Colors");
const debugObject = {
  waveDepthColor: "#000000",
  waveSurfaceColor: "#4d9aaa", // cyan
  waveSurfaceColor1: "#FFAC00", // orange
  waveSurfaceColor2: "#FF59F5", //purple
  waveSurfaceColor3: "#FFFF48", //yellow
  waveSurfaceColor4: "#0CFF00", //green
  waveSurfaceColor5: "#FF2626", //red
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// GLTF Loader

var loader = new THREE.GLTFLoader();
var obj;
loader.load(
  // resource URL
  "untitled.glb",
  // called when the resource is loaded
  function (gltf) {
    obj = gltf.scene;
    scene.add(obj);
    obj.scale.set(0.508, 0.508, 0.508);
    obj.position.set(0, 0, 0);
    obj.rotation.set(0, Math.PI / 4, 0);

    // mixer1 = new THREE.AnimationMixer(obj);
    // console.log(gltf.animations)
    // mixer1.clipAction( gltf.animations[0]).play();
  }
);

//// Ray caster /////

// // const pointer = new THREE.Vector2();
// // const raycaster = new THREE.Raycaster();

// // const onMouseMove = (event) => {
// //   // calculate pointer position in normalized device coordinates
// //   // (-1 to +1) for both components
// //   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
// //   pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

// //   raycaster.setFromCamera(pointer, camera);
// //   const intersects = raycaster.intersectObjects(scene.children);

// //   // for (let i = 0; i < intersects.length; i++) {
// //   //   console.log(intersects);
// //   // }

// //   // change color of objects intersecting the raycaster
// //   // for (let i = 0; i < intersects.length; i++) {
// //   //   intersects[i].object.material.color.set(0xff0000);
// //   // }

// //   // change color of the closest object intersecting the raycaster
// //   // if (intersects.length > 0) {
// //   //   intersects[0].object.scale.set(2, 2, 2);
// //   // }
// // };

// window.addEventListener("mousemove", onMouseMove);
const waterMaterial2 = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader2").textContent,
  fragmentShader: document.getElementById("fragmentShader2").textContent,
  transparent: false,
  side: THREE.DoubleSide,
  fog: true,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uBigWavesElevation: { value: 0 },
    uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
    uBigWaveSpeed: { value: 0 },
    // Small Waves
    uSmallWavesElevation: { value: 0.022 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },
    // Color
    uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor2) },
    uColorOffset: { value: 0.0984 },
    uColorMultiplier: { value: 10 },
  },
});
const waterMaterial3 = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader2").textContent,
  fragmentShader: document.getElementById("fragmentShader2").textContent,
  transparent: false,
  side: THREE.DoubleSide,
  fog: true,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uBigWavesElevation: { value: 0 },
    uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
    uBigWaveSpeed: { value: 0 },
    // Small Waves
    uSmallWavesElevation: { value: 0.022 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },
    // Color
    uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor3) },
    uColorOffset: { value: 0.0984 },
    uColorMultiplier: { value: 10 },
  },
});
const waterMaterial4 = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader4").textContent,
  fragmentShader: document.getElementById("fragmentShader4").textContent,
  transparent: false,
  side: THREE.DoubleSide,
  fog: true,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uBigWavesElevation: { value: 0 },
    uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
    uBigWaveSpeed: { value: 0 },
    // Small Waves
    uSmallWavesElevation: { value: 0.022 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },
    // Color
    uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor4) }, // green
    uColorOffset: { value: 0.0984 },
    uColorMultiplier: { value: 10 },
  },
});
const waterMaterial6 = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader4").textContent,
  fragmentShader: document.getElementById("fragmentShader4").textContent,
  transparent: false,
  side: THREE.DoubleSide,
  fog: true,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uBigWavesElevation: { value: 0 },
    uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
    uBigWaveSpeed: { value: 0 },
    // Small Waves
    uSmallWavesElevation: { value: 0.022 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },
    // Color
    uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor5) },
    uColorOffset: { value: 0.0984 },
    uColorMultiplier: { value: 10 },
  },
});
const waterMaterial5 = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
  transparent: false,
  side: THREE.DoubleSide,
  fog: true,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uBigWavesElevation: { value: 0 },
    uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
    uBigWaveSpeed: { value: 0 },
    // Small Waves
    uSmallWavesElevation: { value: 0.022 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },
    // Color
    uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor1) },
    uColorOffset: { value: 0.0984 },
    uColorMultiplier: { value: 10 },
  },
});
//////// Plane 1 /////////

const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
  transparent: false,
  side: THREE.DoubleSide,
  fog: true,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uBigWavesElevation: { value: 0 },
    uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
    uBigWaveSpeed: { value: 0 },
    // Small Waves
    uSmallWavesElevation: { value: 0.022 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },
    // Color
    uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor) },
    uColorOffset: { value: 0.0984 },
    uColorMultiplier: { value: 10 },
  },
});
const plane = new THREE.Mesh(geometry, waterMaterial); //cyan
scene.add(plane);
plane.position.set(0, 0, -0.488);
plane.scale.set(1, 1, 1);
//plane.rotation.x = -Math.PI * 0.5;
plane.name = "plane";

//////// Plane 2 /////////

const geometry2 = new THREE.PlaneGeometry(1, 1, 100, 100);
const material2 = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
});
const plane2 = new THREE.Mesh(geometry2, waterMaterial5);
scene.add(plane2);
plane2.position.set(0, 0, 0.5);
plane2.name = "plane2";

//////// Plane 3 /////////

const geometry3 = new THREE.PlaneGeometry(1, 1, 100, 100);
const material3 = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const plane3 = new THREE.Mesh(geometry3, waterMaterial6); //red
scene.add(plane3);
plane3.position.set(0.5, 0, 0);
plane3.rotation.set(0, Math.PI / 2, 0);
plane3.name = "plane3";

//////// Plane 4 /////////

const geometry4 = new THREE.PlaneGeometry(1, 1, 100, 100);
const material4 = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide,
});
const plane4 = new THREE.Mesh(geometry4, waterMaterial4); //green
scene.add(plane4);
plane4.position.set(-0.488, 0, 0);
plane4.rotation.set(0, Math.PI / 2, 0);
plane4.name = "plane4";

//////// Plane 5 /////////

const geometry5 = new THREE.PlaneGeometry(1, 1, 100, 100); // purple
const material5 = new THREE.MeshBasicMaterial({
  color: 0xff9900,
  side: THREE.DoubleSide,
});
const plane5 = new THREE.Mesh(geometry5, waterMaterial2);
scene.add(plane5);
plane5.position.set(0, 0.508, 0);
plane5.rotation.set(Math.PI / 2, 0, 0);
plane5.name = "plane5";

//////// Plane 6 /////////

const geometry6 = new THREE.PlaneGeometry(1, 1, 100, 100); // yellow
const material6 = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  side: THREE.DoubleSide,
});
const plane6 = new THREE.Mesh(geometry6, waterMaterial3);
scene.add(plane6);
plane6.position.set(0, -0.485, 0);
plane6.rotation.set(Math.PI / 2, 0, 0);
plane6.name = "plane6";

const group = new THREE.Group();
group.add(plane);
group.add(plane2);
group.add(plane3);
group.add(plane4);
group.add(plane5);
group.add(plane6);

scene.add(group);
group.rotation.set(0, Math.PI / 4, 0);

// Lights
const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
scene.add(light);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
camera.layers.enable(1);
scene.add(camera);

//Controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enabled = true;
controls.enableDamping = true;
controls.enableZoom = false;
controls.keys = {
  LEFT: "ArrowLeft", //left arrow
  UP: "ArrowUp", // up arrow
  RIGHT: "ArrowRight", // right arrow
  BOTTOM: "ArrowDown", // down arrow
};

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//// mmi /////
gsap.registerPlugin();
const time = gsap.timeline();
const time2 = gsap.timeline();
const time3 = gsap.timeline();
const time4 = gsap.timeline();
const time5 = gsap.timeline();
const time6 = gsap.timeline();
const time7 = gsap.timeline();
const time8 = gsap.timeline();
const time9 = gsap.timeline();

const mmi = new MouseMeshInteraction(scene, camera);
mmi.addHandler("plane", "click", function (mesh) {
  console.log("cyan");
  time.to(plane2.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time2.to(plane3.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time3.to(plane4.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time4.to(plane5.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time5.to(plane6.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time6.to(obj.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time7.to(camera.position, { x: 0, y: 0, z: 1, duration: 2 });
  time8.to(plane.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 2 });
  time9.to(plane.scale, { x: 4, y: 4, z: 0, duration: 2 });
});
mmi.addHandler("plane2", "click", function (mesh) {
  console.log(" orange");
  time.to(plane.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time2.to(plane3.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time3.to(plane4.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time4.to(plane5.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time5.to(plane6.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time6.to(obj.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time7.to(camera.position, { x: 0, y: 0, z: 1, duration: 2 });
  time8.to(plane2.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 2 });
  time9.to(plane2.scale, { x: 4, y: 4, z: 0, duration: 2 });
});
mmi.addHandler("plane3", "click", function (mesh) {
  console.log("red");
  time.to(plane.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time2.to(plane2.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time3.to(plane4.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time4.to(plane5.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time5.to(plane6.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time6.to(obj.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time7.to(camera.position, { x: 0, y: 0, z: 1, duration: 2 });
  time8.to(plane3.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 2 });
  time9.to(plane3.scale, { x: 4, y: 4, z: 0, duration: 2 });
});
mmi.addHandler("plane4", "click", function (mesh) {
  console.log("green");
  time.to(plane.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time2.to(plane2.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time3.to(plane3.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time4.to(plane5.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time5.to(plane6.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time6.to(obj.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time7.to(camera.position, { x: 0, y: 0, z: 1, duration: 1 });
  time8.to(plane4.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 1 });
  time9.to(plane4.scale, { x: 4, y: 4, z: 0, duration: 1 });
});
mmi.addHandler("plane5", "click", function (mesh) {
  console.log("purple");
  time.to(plane.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time2.to(plane2.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time3.to(plane3.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time4.to(plane4.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time5.to(plane6.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time6.to(obj.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time7.to(camera.position, { x: 0, y: 0, z: 1, duration: 3 });
  time8.to(plane5.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 3 });
  time9.to(plane5.scale, { x: 2, y: 2, z: 0, duration: 3 });
});
mmi.addHandler("plane6", "click", function (mesh) {
  console.log("yellow");
  time.to(plane.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time2.to(plane2.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time3.to(plane3.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time4.to(plane4.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time5.to(plane5.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time6.to(obj.scale, { x: 0, y: 0, z: 0, duration: 1 });
  time7.to(camera.position, { x: 0, y: 0, z: 1, duration: 3 });
  time8.to(plane6.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 3 });
  time9.to(plane6.scale, { x: 2, y: 2, z: 0, duration: 3 });
});

const clock = new THREE.Clock();

const tick = () => {
  window.requestAnimationFrame(tick);
  const deltaTime = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();
  //if ( mixer1 ) mixer1.update( deltaTime);

  // targetX = mouseX * .001
  // targetY = mouseY * .001
  // Update time
  waterMaterial.uniforms.uTime.value = elapsedTime;
  waterMaterial2.uniforms.uTime.value = elapsedTime;
  waterMaterial3.uniforms.uTime.value = elapsedTime;
  waterMaterial4.uniforms.uTime.value = elapsedTime;
  waterMaterial5.uniforms.uTime.value = elapsedTime;
  waterMaterial6.uniforms.uTime.value = elapsedTime;
  tuniform.iTime.value += deltaTime;

  // Update objects
  //obj.rotation.y += .5 * (targetX - obj.rotation.y)
  //obj.rotation.x += .05 * (targetY - obj.rotation.x)
  //obj.rotation.z += -0.05 * (targetY - obj.rotation.x)
  mmi.update();

  // Update Orbital Controls
  controls.update();
  renderer.render(scene, camera);

  // Call tick again on the next frame
};

tick();

// GSAP //

var tl = gsap.timeline();
var tl2 = gsap.timeline();
var tl3 = gsap.timeline();
var tl4 = gsap.timeline();
var tl5 = gsap.timeline();
var tl6 = gsap.timeline();
tl.from(plane.position, { z: -2.48, duration: 2 }); // cyan
tl2.from(plane2.position, { z: 2.5, duration: 2 }); // orange
tl3.from(plane3.position, { x: 2.5, z: 0.0, duration: 2 }); //red
tl4.from(plane4.position, { x: -2.48, z: 0.0, duration: 2 }); //green
tl5.from(plane5.position, { y: 2.507, z: 0.0, duration: 2 }); //purple
tl6.from(plane6.position, { y: -2.48, z: 0.0, duration: 2 }); // yellow
