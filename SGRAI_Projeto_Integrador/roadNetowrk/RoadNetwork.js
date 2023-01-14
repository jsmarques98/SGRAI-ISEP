import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.146.0/examples/jsm/loaders/GLTFLoader.js';

import Roundabout from './Roundabout.js';
import LinkElement from './LinkElement.js';
import Road from './Road.js';
import { Vector3 } from 'three';
import Truck from './Truck.js';



export default class RoadNetwork {
    warehouses = [];
    K_LIGACAO = 2 ;
    K_CIRCULO = 3;
    Wi = 1;
    Ri = this.Wi * this.K_CIRCULO /2;
    INFINITESIMO=0.01;
    rotateAmount=0.02;
    inclineAmount=0.02;
    truck;


    constructor(warehouseInformationList) {


      this.addHelpMenu();
      this.addSwitchCameraButton();
      this.addExitButton();

      

      this.audio = new Audio('truckaudio.mp3');
      this.audio.volume=0.01
      
      
        
          
        //SCENE
        this.scene = new THREE.Scene();
        const skybox = ['skybox/lf.jpg','skybox/rt.jpg','skybox/up.jpg','skybox/dn.jpg','skybox/ft.jpg','skybox/bk.jpg'];
        this.scene.background = new THREE.CubeTextureLoader().load(skybox);

    
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        //FOG
        const color = new THREE.Color();
        color.set(0xFFFFFF);  // set the color to white
        const near = 1;
        const far = 175;
        
        // create the fog and add it to the scene
        const fog = new THREE.Fog(color, near, far);
        this.scene.fog = fog;


        //LIGHT
        // Create a group of objects
        this.object = new THREE.Group();
        
        this.addTruck3DObject();

        // Create the ambient light
        let ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);

        this.object.add(ambientLight);

        // Create the first point light and turn on shadows for this light
        let pointLight1 = new THREE.SpotLight(0xFFFFFF, 1);
        pointLight1.position.set(0, 100, -0)
        pointLight1.angle = 0.9
        pointLight1.distance = 600
        pointLight1.penumbra = 1
        pointLight1.castShadow = true;
        pointLight1.shadow.mapSize.width = 1024;
        pointLight1.shadow.mapSize.height = 1024;
        pointLight1.shadow.focus = 1;
        pointLight1.shadow.camera.near = 50;
        pointLight1.shadow.camera.far = 300;
        pointLight1.shadow.camera.fov = 30;


        this.object.add(pointLight1);


        this.scene.add(this.object)


        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(0, 80, 0);
        this.currentCamera = this.camera;

        this.scene.add(this.currentCamera);
        //this.camera.add( spotLight );

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.2;
        this.orbitControls.maxPolarAngle = Math.PI / 2;
        this.orbitControls.target.set(0, 5, 0);
        this.orbitControls.update();



        


        this.initializeFloor();
        this.initializeRoundabouts(warehouseInformationList);
        this.initializeRoads();
        this.addWarehouse3DObjects(warehouseInformationList);
        this.animate();

        window.addEventListener('resize', event => this.windowResize(event));
        document.body.appendChild(this.renderer.domElement);

    }

    initializeFloor(){

        let floorGeometry = new THREE.PlaneGeometry(150, 150, 200,200);
        floorGeometry.rotateX(-Math.PI * 0.5);

        let floorMaterial = new THREE.MeshPhongMaterial({color: 0xa6a6a6,side: THREE.DoubleSide});

        var loader = new THREE.TextureLoader();
        loader.load( 'textures/grass.jpg', 
        function ( texture ) {   
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(20,20); 
            floorMaterial.map = texture;
            floorMaterial.needsUpdate = true;
        });

        let floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

        floorMesh.receiveShadow = true;
        floorMesh.castShadow=false;
        floorMesh.position.y = -3.5;
        this.scene.add(floorMesh);
    }

    initializeRoundabouts(warehouseInformationList) {
        warehouseInformationList.forEach(obj => {
            const warehouse = new Roundabout(obj,this.Ri,this.INFINITESIMO);
            this.warehouses.push(warehouse);
            this.scene.add(warehouse.object);
        });
    }

    initializeRoads() {

        for (let i = 0; i < this.warehouses.length; i++) {
            const originRoudabout = this.warehouses[i];
            const originRoudaboutCoordinates = originRoudabout.coordenadas;
            

            for (let j = 0; j < this.warehouses[i].conections.length; j++) {
                const destinRoudabout = this.warehouses[this.warehouses[i].conections[j]];
                const destinRoudaboutCoordinates = destinRoudabout.coordenadas;


                let originLinkElemAngle = Math.atan2((originRoudaboutCoordinates.z - destinRoudabout.coordenadas.z), (originRoudaboutCoordinates.x - destinRoudabout.coordenadas.x));
			    let destinLinkElemAngle = Math.atan2((destinRoudaboutCoordinates.z - originRoudaboutCoordinates.z), (destinRoudabout.coordenadas.x - originRoudaboutCoordinates.x));
			    
                
                let originLinkElement = new LinkElement(originRoudaboutCoordinates, this.Ri, destinLinkElemAngle, this.Wi, this.K_LIGACAO);
			    let destinLinkElement = new LinkElement(destinRoudaboutCoordinates, this.Ri, originLinkElemAngle, this.Wi, this.K_LIGACAO);
			    this.scene.add(originLinkElement.linkElement);
			    this.scene.add(destinLinkElement.linkElement);

                let road = new Road(originRoudaboutCoordinates, destinRoudaboutCoordinates, destinLinkElemAngle, this.Ri, this.Wi, this.K_LIGACAO);


                this.scene.add(road.object);
            }
        }
    }

    addWarehouse3DObjects(warehouseInformationList){
        const gltfLoader = new GLTFLoader();
        warehouseInformationList.forEach(obj => {
            
            const warehouse = new Roundabout(obj);
            gltfLoader.load('./warehouse3DGLB/scene.glb', (gltf) => {
                gltf.scene.scale.multiplyScalar(1 / 9000);
                let root = gltf.scene;

              
                root.position.set(warehouse.coordenadas.x, warehouse.coordenadas.y, warehouse.coordenadas.z);
                this.scene.add(root);
            });
        });
    }

    addTruck3DObject(){
        this.truck= new Truck(this.scene,37.40798140255724,2.39, -21.836409176618904)
        this.truck.lastTime = performance.now();
        this.initializeKeyboardControls();
    }

    initializeKeyboardControls() {
        document.addEventListener('keydown', (event) => {
          const keyName = event.key;
          const angleRadians = this.truck.rotation.y ;

          if (keyName === 's') {
            const horizontalDirection = Math.sin(angleRadians);
            const verticalDirection = Math.sin(this.truck.rotation.x);
          
            // Move the truck in the calculated direction
            this.truck.x -= this.truck.speed * horizontalDirection;
            this.truck.y -= this.truck.speed * -verticalDirection;
            this.truck.z -= this.truck.speed * Math.cos(angleRadians);
          } else if (keyName === 'd') {

            // Rotate the truck right
            this.truck.rotation.y -= this.rotateAmount;
          } else if (keyName === 'w') {
            const horizontalDirection = Math.sin(angleRadians);
            const verticalDirection = Math.sin(this.truck.rotation.x);
          
            // Move the truck in the calculated direction
            this.truck.x += this.truck.speed * horizontalDirection;
            this.truck.y += this.truck.speed * -verticalDirection;
            this.truck.z += this.truck.speed * Math.cos(angleRadians);
          } else if (keyName === 'a') {

            // Rotate the truck left
            this.truck.rotation.y += this.rotateAmount;
          }else if (keyName === 'g') {
            // Incline the truck vertically
            this.truck.rotation.x -= this.inclineAmount;
          } else if (keyName === 't') {
            // Decline the truck vertically
            this.truck.rotation.x += this.inclineAmount;
          }
        });
      }

      animate() {
        // Update the position and other properties of the truck here
        this.truck.update(1/120);
    
        // Render the scene
        this.renderer.render(this.scene, this.currentCamera);
    
        // Request the next animation frame
        requestAnimationFrame(this.animate.bind(this));
      }

      switchCamera() {
        if (this.currentCamera === this.camera) {
          this.currentCamera = this.truck.truckCamera;
          this.playAudio();
        } else {
          this.currentCamera = this.camera;
          this.stopAudio();
        }
      }

      stopAudio() {

          this.audio.pause();
        
      }

    playAudio() {
      this.audio.loop = true;
      this.audio.play();
    }



    windowResize() {
        this.currentCamera.aspect = window.innerWidth / window.innerHeight;
        this.currentCamera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

  addHelpMenu(){

      const helpButton = document.createElement('button');

      // Set the style of the button
      helpButton.style.position = 'absolute';
      helpButton.style.top = '0';
      helpButton.style.left = '0';
      helpButton.style.padding = '10px';
      helpButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';

      // Set the text of the button
      helpButton.textContent = 'Help';

      // Add the button to the page
      document.body.appendChild(helpButton);
            helpButton.addEventListener('click', () => {
            // Create the help menu element
            const helpMenu = document.createElement('div');
            helpMenu.style.position = 'fixed';
            helpMenu.style.top = '50%';
            helpMenu.style.left = '50%';
            helpMenu.style.transform = 'translate(-50%, -50%)';
            helpMenu.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            helpMenu.style.padding = '20px';
            helpMenu.style.zIndex = '10';
            helpMenu.innerHTML = "<h1>Help Menu</h1>"+
            "<p>Press W to move the truck forward.</p>"+
            "<p>Press S to move the truck backwards.</p>"+
            "<p>Press A to rotate the truck to the left.</p>"+
            "<p>Press D to rotate the truck to the right.</p>"+
            "<p>Press T to decline truck.</p>"+
            "<p>Press G to incline truck.</p>"+
            "<p>The switch camera button changes between 2 different cameras.</p>"+
            "<p>Use the mouse wheel to change the zoom.</p>"+
            "<p>Press the left button of your mouse and move the mouse to move the camera</p>"+
            "<p>Press the right button of your mouse and move the mouse to move the scene</p>"+
            "<button id=\"close-button\">Close</button>";

                // Add the help menu to the page
                document.body.appendChild(helpMenu);


                const closeButton = document.querySelector('#close-button');
            closeButton.addEventListener('click', () => {
              // Remove the help menu from the page
              document.body.removeChild(helpMenu);
            });
      });
  }

  addSwitchCameraButton(){

    const switchCameraButton = document.createElement('button');

    // Set the style of the button
    switchCameraButton.style.position = 'absolute';
    switchCameraButton.style.top = '40px';
    switchCameraButton.style.left = '0';
    switchCameraButton.style.padding = '10px';
    switchCameraButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';

    // Set the text of the button
    switchCameraButton.textContent = 'Switch Camera';
    document.body.appendChild(switchCameraButton);
    switchCameraButton.addEventListener('click', () => {
      this.switchCamera();
    });

  }

  addExitButton(){

    const exitButton = document.createElement('button');

    // Set the style of the button
    exitButton.style.position = 'absolute';
    exitButton.style.top = '80px';
    exitButton.style.left = '0';
    exitButton.style.padding = '10px';
    exitButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';

    // Set the text of the button
    exitButton.textContent = 'Exit';
    document.body.appendChild(exitButton);
    exitButton.addEventListener('click', () => {
      window.location.href = 'https://vs113.dei.isep.ipp.pt:4200/home';
    });

  }

}