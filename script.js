const canvas2 = document.querySelector("canvas.webgl2");

// Scene
const scene2 = new THREE.Scene();
scene2.fog = new THREE.FogExp2(0xefd1b5, 0.0025);

//Grid Helper
var division = 30;
var limit = 100;
var grid = new THREE.GridHelper(limit * 2, division, "#69CCDF", "#69CCDF");
var grid2 = new THREE.GridHelper(limit * 2, division, "#69CCDF", "#69CCDF");

var moveable = [];
for (let i = 0; i <= division; i++) {
  moveable.push(1, 1, 0, 0); // move horizontal lines only (1 - point is moveable)
}
grid.geometry.addAttribute(
  "moveable",
  new THREE.BufferAttribute(new Uint8Array(moveable), 1)
);
grid.material = new THREE.ShaderMaterial({
  uniforms: {
    time: {
      value: 0,
    },
    limits: {
      value: new THREE.Vector2(-limit, limit),
    },
    speed: {
      value: 5,
    },
  },
  vertexShader: `
    uniform float time;
    uniform vec2 limits;
    uniform float speed;

    attribute float moveable;

    varying vec3 vColor;

    void main() {
      vColor = color;
      float limLen = limits.y - limits.x;
      vec3 pos = position;

      if (floor(moveable + 0.5) > 0.5){
        // if a point has "moveable" attribute = 1
        float dist = speed * time;
        float currPos = mod((pos.z + dist) - limits.x, limLen) + limits.x;
        pos.z = currPos;
      }

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1);
    }
  `,
  vertexColors: THREE.VertexColors,
});
grid2.geometry.addAttribute(
  "moveable",
  new THREE.BufferAttribute(new Uint8Array(moveable), 1)
);
grid2.material = new THREE.ShaderMaterial({
  uniforms: {
    time: {
      value: 0,
    },
    limits: {
      value: new THREE.Vector2(-limit, limit),
    },
    speed: {
      value: 5,
    },
  },
  vertexShader: `
    uniform float time;
    uniform vec2 limits;
    uniform float speed;

    attribute float moveable;

    varying vec3 vColor;

    void main() {
      vColor = color;
      float limLen = limits.y - limits.x;
      vec3 pos = position;

      if (floor(moveable + 0.5) > 0.5){
        // if a point has "moveable" attribute = 1
        float dist = speed * time;
        float currPos = mod((pos.z + dist) - limits.x, limLen) + limits.x;
        pos.z = currPos;
      }

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1);
    }
  `,
  vertexColors: THREE.VertexColors,
});
grid.position.set(0, -4, 0);
grid.rotation.set(0, 0, 0);
grid.scale.set(0.4, 1, 1);
scene2.add(grid);
grid2.position.set(0, 4, 0);
grid2.rotation.set(0, 0, 0);
grid2.scale.set(0.4, 1, 1);
scene2.add(grid2);

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
  50,
  sizes2.width / sizes2.height,
  0.1,
  100
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
  alpha: false,
  antialias: false,
});
renderer2.autoClear = false;
renderer2.setSize(sizes2.width, sizes2.height);
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//renderer.toneMapping = THREE.ReinhardToneMapping;

const renderScene = new THREE.RenderPass(scene2, camera2);
const effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
effectFXAA.uniforms.resolution.value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);

const params = {
  exposure: 0,
  bloomStrength: 1.2,
  bloomThreshold: 0,
  bloomRadius: 1,
};
let composer, mixer;

const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;
//bloomPass.renderToScreen = true;
// let gui3 = new dat.GUI();

// gui3.add(bloomPass, "strength", 0, 10, 0.2).name("bloom Strength");
// gui3.add(bloomPass, "threshold", 0, 0.5, 0.1).name("bloom Threshold");
// gui3.add(bloomPass, "radius", 0, 10, 0.2).name("bloom Radius");

composer = new THREE.EffectComposer(renderer2);
composer.addPass(renderScene);
composer.addPass(effectFXAA);
composer.addPass(bloomPass);

renderer2.gammaInput = true;
//renderer.gammaOutput = true;
//renderer2.toneMappingExposure = Math.pow(0.9, 4.0);

const clock2 = new THREE.Clock();
var time = 0;

const tick2 = () => {
  window.requestAnimationFrame(tick2);
  //const deltaTime2 = clock2.getDelta();

  time -= clock2.getDelta();
  grid.material.uniforms.time.value = time;
  grid2.material.uniforms.time.value = time;
  renderer2.clear();

  // Update Orbital Controls

  composer.render();
  renderer2.clearDepth();
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
    //scene.add(obj);
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
// const waterMaterial2 = new THREE.ShaderMaterial({
//   vertexShader: document.getElementById("vertexShader2").textContent,
//   fragmentShader: document.getElementById("fragmentShader2").textContent,
//   transparent: false,
//   side: THREE.DoubleSide,
//   fog: true,
//   uniforms: {
//     uTime: { value: 0 },
//     uMouse: { value: new THREE.Vector2() },
//     uBigWavesElevation: { value: 0 },
//     uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
//     uBigWaveSpeed: { value: 0 },
//     // Small Waves
//     uSmallWavesElevation: { value: 0.022 },
//     uSmallWavesFrequency: { value: 3 },
//     uSmallWavesSpeed: { value: 0.2 },
//     uSmallWavesIterations: { value: 4 },
//     // Color
//     uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
//     uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor2) },
//     uColorOffset: { value: 0.0984 },
//     uColorMultiplier: { value: 10 },
//   },
// });
// const waterMaterial3 = new THREE.ShaderMaterial({
//   vertexShader: document.getElementById("vertexShader2").textContent,
//   fragmentShader: document.getElementById("fragmentShader2").textContent,
//   transparent: false,
//   side: THREE.DoubleSide,
//   fog: true,
//   uniforms: {
//     uTime: { value: 0 },
//     uMouse: { value: new THREE.Vector2() },
//     uBigWavesElevation: { value: 0 },
//     uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
//     uBigWaveSpeed: { value: 0 },
//     // Small Waves
//     uSmallWavesElevation: { value: 0.022 },
//     uSmallWavesFrequency: { value: 3 },
//     uSmallWavesSpeed: { value: 0.2 },
//     uSmallWavesIterations: { value: 4 },
//     // Color
//     uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
//     uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor3) },
//     uColorOffset: { value: 0.0984 },
//     uColorMultiplier: { value: 10 },
//   },
// });
// const waterMaterial4 = new THREE.ShaderMaterial({
//   vertexShader: document.getElementById("vertexShader4").textContent,
//   fragmentShader: document.getElementById("fragmentShader4").textContent,
//   transparent: false,
//   side: THREE.DoubleSide,
//   fog: true,
//   uniforms: {
//     uTime: { value: 0 },
//     uMouse: { value: new THREE.Vector2() },
//     uBigWavesElevation: { value: 0 },
//     uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
//     uBigWaveSpeed: { value: 0 },
//     // Small Waves
//     uSmallWavesElevation: { value: 0.022 },
//     uSmallWavesFrequency: { value: 3 },
//     uSmallWavesSpeed: { value: 0.2 },
//     uSmallWavesIterations: { value: 4 },
//     // Color
//     uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
//     uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor4) }, // green
//     uColorOffset: { value: 0.0984 },
//     uColorMultiplier: { value: 10 },
//   },
// });
// const waterMaterial6 = new THREE.ShaderMaterial({
//   vertexShader: document.getElementById("vertexShader4").textContent,
//   fragmentShader: document.getElementById("fragmentShader4").textContent,
//   transparent: false,
//   side: THREE.DoubleSide,
//   fog: true,
//   uniforms: {
//     uTime: { value: 0 },
//     uMouse: { value: new THREE.Vector2() },
//     uBigWavesElevation: { value: 0 },
//     uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
//     uBigWaveSpeed: { value: 0 },
//     // Small Waves
//     uSmallWavesElevation: { value: 0.022 },
//     uSmallWavesFrequency: { value: 3 },
//     uSmallWavesSpeed: { value: 0.2 },
//     uSmallWavesIterations: { value: 4 },
//     // Color
//     uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
//     uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor5) },
//     uColorOffset: { value: 0.0984 },
//     uColorMultiplier: { value: 10 },
//   },
// });
// const waterMaterial5 = new THREE.ShaderMaterial({
//   vertexShader: document.getElementById("vertexShader").textContent,
//   fragmentShader: document.getElementById("fragmentShader").textContent,
//   transparent: false,
//   side: THREE.DoubleSide,
//   fog: true,
//   uniforms: {
//     uTime: { value: 0 },
//     uMouse: { value: new THREE.Vector2() },
//     uBigWavesElevation: { value: 0 },
//     uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
//     uBigWaveSpeed: { value: 0 },
//     // Small Waves
//     uSmallWavesElevation: { value: 0.022 },
//     uSmallWavesFrequency: { value: 3 },
//     uSmallWavesSpeed: { value: 0.2 },
//     uSmallWavesIterations: { value: 4 },
//     // Color
//     uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
//     uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor1) },
//     uColorOffset: { value: 0.0984 },
//     uColorMultiplier: { value: 10 },
//   },
// });
//////// Plane 1 /////////

const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
// const waterMaterial = new THREE.ShaderMaterial({
//   vertexShader: document.getElementById("vertexShader").textContent,
//   fragmentShader: document.getElementById("fragmentShader").textContent,
//   transparent: false,
//   side: THREE.DoubleSide,
//   fog: true,
//   uniforms: {
//     uTime: { value: 0 },
//     uMouse: { value: new THREE.Vector2() },
//     uBigWavesElevation: { value: 0 },
//     uBigWavesFrequency: { value: new THREE.Vector2(0, 0) },
//     uBigWaveSpeed: { value: 0 },
//     // Small Waves
//     uSmallWavesElevation: { value: 0.022 },
//     uSmallWavesFrequency: { value: 3 },
//     uSmallWavesSpeed: { value: 0.2 },
//     uSmallWavesIterations: { value: 4 },
//     // Color
//     uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
//     uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor) },
//     uColorOffset: { value: 0.0984 },
//     uColorMultiplier: { value: 10 },
//   },
// });
const texture1 = new THREE.TextureLoader().load("textures/delivery-orange.jpg");
const material1 = new THREE.MeshStandardMaterial({
  map: texture1,
  color: 0xff781f,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, material1); //orange
scene.add(plane);
plane.position.set(0, 0, -0.25);
plane.scale.set(0.5, 0.5, 0.5);
plane.rotation.set(0, -Math.PI, 0);
plane.name = "plane";

//////// Plane 2 /////////

const geometry2 = new THREE.PlaneGeometry(1, 1, 100, 100);
const texture2 = new THREE.TextureLoader().load("textures/contacts-red.jpg");
const material2 = new THREE.MeshStandardMaterial({
  map: texture2,
  color: 0xe90052,
  side: THREE.DoubleSide,
});
const plane2 = new THREE.Mesh(geometry2, material2); //waterMaterial5
scene.add(plane2);
plane2.position.set(0, 0, 0.25);
plane2.scale.set(0.5, 0.5, 0.5);
plane2.name = "plane2";

//////// Plane 3 /////////

const geometry3 = new THREE.PlaneGeometry(1, 1, 100, 100);
const texture3 = new THREE.TextureLoader().load("textures/About-blue.jpg");
const material3 = new THREE.MeshStandardMaterial({
  map: texture3,
  color: 0x398ad7,
  side: THREE.DoubleSide,
});
const plane3 = new THREE.Mesh(geometry3, material3); //blue //waterMaterial6
scene.add(plane3);
plane3.position.set(0.25, 0, 0);
plane3.rotation.set(0, Math.PI / 2, 0);
plane3.scale.set(0.5, 0.5, 0.5);
plane3.name = "plane3";

//////// Plane 4 /////////

const geometry4 = new THREE.PlaneGeometry(1, 1, 100, 100);
const texture4 = new THREE.TextureLoader().load(
  "textures/club dark page - green.jpg"
);
const material4 = new THREE.MeshStandardMaterial({
  map: texture4,
  color: 0x00ff85,
  side: THREE.DoubleSide,
});
const plane4 = new THREE.Mesh(geometry4, material4); //green waterMaterial4
scene.add(plane4);
plane4.position.set(-0.25, 0, 0);
plane4.scale.set(0.5, 0.5, 0.5);
plane4.rotation.set(0, -Math.PI / 2, 0);
plane4.name = "plane4";

//////// Plane 5 /////////

const geometry5 = new THREE.PlaneGeometry(1, 1, 100, 100); // purple
const texture5 = new THREE.TextureLoader().load(
  "textures/Privacy policy - purple.jpg"
);
const material5 = new THREE.MeshStandardMaterial({
  map: texture5,
  color: 0xe257ff,
  side: THREE.DoubleSide,
});
const plane5 = new THREE.Mesh(geometry5, material5); //waterMaterial2
scene.add(plane5);
plane5.position.set(0, 0.25, 0);
plane5.rotation.set(-Math.PI / 2, 0, 0);
plane5.scale.set(0.5, 0.5, 0.5);
plane5.name = "plane5";

//////// Plane 6 /////////

const geometry6 = new THREE.PlaneGeometry(1, 1, 100, 100); // yellow
const texture6 = new THREE.TextureLoader().load("textures/club - yellow.jpg");
const material6 = new THREE.MeshStandardMaterial({
  map: texture6,
  color: 0xeaff02,
  side: THREE.DoubleSide,
});

const plane6 = new THREE.Mesh(geometry6, material6); //waterMaterial3
scene.add(plane6);
plane6.position.set(0, -0.25, 0);
plane6.rotation.set(Math.PI / 2, 0, 0);
plane6.scale.set(0.5, 0.5, 0.5);
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
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
directionalLight.position.set(1, -1, 1);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight2);
directionalLight2.position.set(-1, 1, 1);
const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight3);
directionalLight3.position.set(-1, 1, -1);
const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight4);
directionalLight4.position.set(1, -1, -1);
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

controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN,
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
const time1 = gsap.timeline();
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
  console.log("cyan"); // Delivery //page4
  time1.to(plane2.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane3.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane4.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane5.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane6.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(obj.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(camera.position, { x: 0, y: 0, z: 1, duration: 1 });
  time1.to(plane.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 1 });
  time1.to(plane.scale, { x: 4, y: 4, z: 0, duration: 1 });
  time1.to("#page4", { display: "flex", duration: 2 });
});
mmi.addHandler("plane2", "click", function (mesh) {
  console.log(" orange"); // contacts // page1
  time1.to(plane.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane3.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane4.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane5.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane6.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(obj.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(camera.position, { x: 0, y: 0, z: 1, duration: 1 });
  time1.to(plane2.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 1 });
  time1.to(plane2.scale, { x: 4, y: 4, z: 0, duration: 1 });
  time1.to("#page1", { display: "flex", duration: 2 });
});
mmi.addHandler("plane3", "click", function (mesh) {
  console.log("red"); // About // page5
  time1.to(plane.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane2.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane4.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane5.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane6.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(obj.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(camera.position, { x: 0, y: 0, z: 1, duration: 1 });
  time1.to(plane3.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 1 });
  time1.to(plane3.scale, { x: 4, y: 4, z: 0, duration: 1 });
  time1.to("#page5", { display: "flex", duration: 2 });
});
mmi.addHandler("plane4", "click", function (mesh) {
  console.log("green"); //club dark house// page2
  time1.to(plane.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane2.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane3.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane5.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane6.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(obj.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(camera.position, { x: 0, y: 0, z: 1, duration: 1 });
  time1.to(plane4.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 1 });
  time1.to(plane4.scale, { x: 4, y: 4, z: 0, duration: 1 });
  time1.to("#page2", { display: "flex", duration: 2 });
});
mmi.addHandler("plane5", "click", function (mesh) {
  console.log("purple"); // privacy policy // page3
  time1.to(plane.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane2.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane3.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane4.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane6.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(obj.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(camera.position, { x: 0, y: 0, z: 1, duration: 1 });
  time1.to(plane5.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 1 });
  time1.to(plane5.scale, { x: 2, y: 2, z: 0, duration: 1 });
  time1.to("#page3", { display: "flex", duration: 2 });
});
mmi.addHandler("plane6", "click", function (mesh) {
  console.log("yellow"); // club // page6
  time1.to(plane.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane2.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane3.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane4.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(plane5.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(obj.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
  time1.to(camera.position, { x: 0, y: 0, z: 1, duration: 1 });
  time1.to(plane6.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 1 });
  time1.to(plane6.scale, { x: 2, y: 2, z: 0, duration: 1 });
  time1.to("#page6", { display: "flex", duration: 2 });
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
  // waterMaterial.uniforms.uTime.value = elapsedTime;
  // waterMaterial2.uniforms.uTime.value = elapsedTime;
  // waterMaterial3.uniforms.uTime.value = elapsedTime;
  // waterMaterial4.uniforms.uTime.value = elapsedTime;
  // waterMaterial5.uniforms.uTime.value = elapsedTime;
  // waterMaterial6.uniforms.uTime.value = elapsedTime;
  //tuniform.iTime.value += deltaTime;

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
tl.from(plane.position, { z: -2.5, duration: 2 }); // cyan
tl2.from(plane2.position, { z: 2.5, duration: 2 }); // orange
tl3.from(plane3.position, { x: 2.5, z: 0.0, duration: 2 }); //red
tl4.from(plane4.position, { x: -2.5, z: 0.0, duration: 2 }); //green
tl5.from(plane5.position, { y: 2.5, z: 0.0, duration: 2 }); //purple
tl6.from(plane6.position, { y: -2.5, z: 0.0, duration: 2 }); // yellow
