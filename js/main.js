// main.js
document.addEventListener("DOMContentLoaded", () => {
  // set year
  document.getElementById("year").textContent = new Date().getFullYear();

  // mobile menu
  const menuBtn = document.getElementById("menuBtn");
  menuBtn?.addEventListener("click", () => {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    nav.style.display = nav.style.display === "flex" ? "" : "flex";
    nav.style.flexDirection = "column";
    nav.style.gap = "12px";
    nav.style.padding = "12px";
  });

  // GSAP intro animation (if available)
  if (window.gsap) {
    gsap.from(".hero-left h1", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
    });
    gsap.from(".hero-right", { y: 20, opacity: 0, duration: 0.9, delay: 0.35 });
    gsap.from(".card", {
      y: 12,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      delay: 0.6,
    });
  }

  // Simple Three.js scene
   // --- Three.js block (replace existing block) ---
const loader = new THREE.GLTFLoader();
const modelPath = "assets/models/rahman.glb"; // put your model here
let modelRoot = null; // store loaded model

loader.load(
  modelPath,
  (gltf) => {
    modelRoot = gltf.scene;
    // center & scale the model to fit the view
    modelRoot.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    // scale and center
    const box = new THREE.Box3().setFromObject(modelRoot);
    const size = box.getSize(new THREE.Vector3()).length();
    const scale = (1.6 / (size || 1));
    modelRoot.scale.setScalar(scale);
    box.setFromObject(modelRoot);
    const center = box.getCenter(new THREE.Vector3());
    modelRoot.position.x += modelRoot.position.x - center.x;
    modelRoot.position.y += modelRoot.position.y - center.y;

    scene.add(modelRoot);

    // subtle rotation animation via gsap if available
    if (window.gsap) {
      gsap.to(modelRoot.rotation, {
        y: Math.PI * 2,
        duration: 22,
        repeat: -1,
        ease: "none",
      });
    }
  },
  (xhr) => {
    // optional: progress indicator
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
  (err) => {
    console.error("GLTF load error", err);
  }
);

// controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;

// responsive
window.addEventListener("resize", () => {
  const W = container.clientWidth;
  const H = container.clientHeight;
  renderer.setSize(W, H);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
});

// animate
function animate() {
  requestAnimationFrame(animate);
  // only update rotation of the loaded model (no undefined `mesh`)
  if (modelRoot) {
    // small manual rotation in case gsap is not available
    modelRoot.rotation.y += 0.002;
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

});


 