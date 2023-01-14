import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.146.0/examples/jsm/loaders/GLTFLoader.js';


export default class Truck {
aux =0;
lastTime;
truckCamera;
  constructor(scene, x, y, z) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.z = z;
    this.rotation = { y: 0 ,x:0};


    this.truckCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);

    this.speed = 0.5; // Speed of the truck in units per second

    this.loadModel();


    

  }

  loadModel() {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("warehouse3DGLB/truck.gltf", (gltf) => {
    gltf.scene.scale.multiplyScalar(1/5);
    this.model = gltf.scene;
    
    
    this.model.position.set(this.x, this.y, this.z);
    this.scene.add(this.model);
    this.aux=1;
    });
  }

update(timestamp) {
    if(this.aux!=0){
      const euler = new THREE.Euler(this.rotation.x, this.rotation.y, 0, 'YXZ');
      this.model.setRotationFromEuler(euler);
      this.model.position.set(this.x, this.y, this.z);
      const cameraOffset = new THREE.Vector3(0, 0, -5); 
      const rotatedOffset = cameraOffset.applyEuler(euler); 
      const cameraX = this.model.position.x + rotatedOffset.x;
      const cameraY = this.model.position.y + rotatedOffset.y+1;
      const cameraZ = this.model.position.z + rotatedOffset.z;
      this.truckCamera.position.set(cameraX, cameraY, cameraZ);
      this.truckCamera.lookAt(this.model.position);
  
}
}
}