import './style.css'

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

const starArr = [];

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-10);

// shapes

renderer.render( scene, camera );

const geometry = new THREE.TorusGeometry( 10, 1, 16, 100)
const material = new THREE.MeshStandardMaterial( { color: 0xe1eb34});
const torus = new THREE.Mesh( geometry, material )
const torus2 = new THREE.Mesh( new THREE.TorusGeometry( 50, 3, 16, 100), new THREE.MeshStandardMaterial( {color: 0x7a08c2}));
//const torus3 = new THREE.Mesh( new THREE.TorusGeometry( 20, 1, 16, 100), new THREE.MeshStandardMaterial( {color: 0xD8DAD3}));

scene.add(torus, torus2);

// lights

const pointLight = new THREE.PointLight(0xFFFFFF, 100);
pointLight.position.set(0,0,0);

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper);

// controls

const controls = new OrbitControls(camera, renderer.domElement);

//const winterTexture = new THREE.TextureLoader().load("winter.jpg");
const karinaTexture = new THREE.TextureLoader().load("/karina.jpeg");

function addStar() {
  const randomRadius= Math.random() * 3
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(randomRadius, 32, 32),
    new THREE.MeshStandardMaterial( {
      map: karinaTexture,
      //normalMap: normalTexture
    })
  )

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));

  star.position.set(x, y, z);
  scene.add(star);

  const randomXRotation = (Math.random() * 2 - 1) / 100;
  const randomYRotation = (Math.random() * 2 - 1) / 100;
  const randomZRotation = (Math.random() * 2 - 1) / 100;
  const starObject = { star, randomXRotation, randomYRotation, randomZRotation}
  starArr.push(starObject);
}

Array(300).fill().forEach(addStar);

const backgroundTexture = new THREE.TextureLoader().load("/a.jpeg");
scene.background = backgroundTexture;

// Karina
const karina = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: karinaTexture })
)

scene.add(karina);

// Karina Sphere

const karinaSphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( {
    map: karinaTexture,
    //normalMap: normalTexture
  })
)

scene.add(karinaSphere);

karinaSphere.position.z = 30;
karinaSphere.position.x = -10;

karina.position.z = -5;
karina.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  karinaSphere.rotation.x += 0.05;
  karinaSphere.rotation.y += 0.075;
  karinaSphere.rotation.z += 0.05

  karina.rotation.y += 0.01;
  karina.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();



function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  torus2.rotation.x -= 0.01;
  torus2.rotation.y -= 0.005;
  torus2.rotation.z -= 0.01;

  // torus3.rotation.x += 0.01;
  // torus3.rotation.y -= 0.005;
  // torus3.rotation.z += 0.01;

  controls.update();

  starArr.map((starObject) => {
    starObject.star.rotation.x += starObject.randomXRotation;
    starObject.star.rotation.y += starObject.randomYRotation;
    starObject.star.rotation.z += starObject.randomZRotation;  
  })


  renderer.render( scene, camera );
}

animate();