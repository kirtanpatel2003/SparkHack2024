
// Scene setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeContainer').appendChild(renderer.domElement);

// Earth texture
var textureLoader = new THREE.TextureLoader();
var earthTexture = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/textures/planets/earth_atmos_2048.jpg');
var earthGeometry = new THREE.SphereGeometry(10, 32, 32);
var earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
var earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Lighting
var ambientLight = new THREE.AmbientLight(0xCCCCCC);
scene.add(ambientLight);

var sunlight = new THREE.DirectionalLight(0xffffff, 1.0);
sunlight.position.set(-5, 3, 5);
scene.add(sunlight);

camera.position.z = 20;

// Animation loop

function createRocket() {
    const rocketGeometry = new THREE.CylinderGeometry(0.05, 0.2, 1, 32);
    const rocketMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });
    const rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);

    // Position the rocket above the Earth
    rocket.position.set(0, 5, 0);
    // Rotate the rocket so it points upwards
    rocket.rotation.x = Math.PI / 2;

    return rocket;
}

const rocket = createRocket();
scene.add(rocket);

let angle = 70; // Define an angle variable outside of your animate function


function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.003;
    // Update the rocket's position to orbit around the Earth
    const orbitRadius = 15; // Adjust as needed for your scene's scale
    angle += 0.01; // This determines the speed of the orbit
    rocket.position.x = orbitRadius * Math.sin(angle);
    rocket.position.z = orbitRadius * Math.cos(angle);
    rocket.rotation.y= -angle; // This orients the rocket to face the Earth
    renderer.render(scene, camera);
}

function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const starsVertices = [];

    for (let i = 0; i < 9000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(stars);
}

createStars();


animate();



// Responsive adjustments
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});