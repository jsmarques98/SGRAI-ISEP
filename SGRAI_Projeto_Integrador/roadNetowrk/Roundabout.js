import * as THREE from 'three';
import { DoubleSide } from 'three';


export default class Roundabout {
    constructor(roundabout,Ri, INFINITESIMO) {
        
        this.conections = roundabout.conections;

        //this.radius = 0.2;
        
        this.object = new THREE.Group();

        this.coordenadas = this.transformarCoordenadas(roundabout);



        
        let roundaboutGeometry = new THREE.CircleGeometry(Ri, 40);
        let roundaboutMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF , side:DoubleSide });
        var loader = new THREE.TextureLoader();
        loader.load( 'textures/roundabout.png', 
        function ( texture ) {   
            texture.wrapS = THREE.RepeatWrapping;
            texture.rotation = Math.PI/2;
            texture.repeat.set(1,1)
            texture.wrapT = THREE.RepeatWrapping;  
            roundaboutMaterial.map = texture;
            roundaboutMaterial.needsUpdate = true;
        });
        let roundaboutMesh = new THREE.Mesh(roundaboutGeometry, roundaboutMaterial);
        roundaboutMesh.castShadow = true;
        roundaboutMesh.receiveShadow = true;
        
        this.object.add(roundaboutMesh);
        this.object.position.set(this.coordenadas.x, this.coordenadas.y + INFINITESIMO, this.coordenadas.z);
        this.object.rotation.y = Math.PI;
        this.object.rotation.set(-Math.PI/2, 0, 0);

    }


    transformarCoordenadas(warehouse) {
        return {
            x: (100 / (8.7613 - 8.2451)) * (warehouse.lon - 8.2451) - 50,
            z: (100 / (42.1115 - 40.8387)) * (warehouse.lat - 40.8387) - 50, 
            y: ((50 / 800) * warehouse.alt)/10
        };


    }
}

