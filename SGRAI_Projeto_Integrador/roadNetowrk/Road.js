import * as THREE from 'three';

export default class Road {
    
    constructor(originWarehouseCoordinates, destinWarehouseCoordinates, connectAngle, ri, roadWidth, K_LIGACAO) {

        //ri = 0.73 ;
        let distanceWarehouses = Math.sqrt(Math.pow(destinWarehouseCoordinates.x - originWarehouseCoordinates.x, 2) + Math.pow(destinWarehouseCoordinates.z - originWarehouseCoordinates.z, 2));
        if (distanceWarehouses > 0){
            distanceWarehouses -= (ri * K_LIGACAO) * 2;
        }else{
            distanceWarehouses += (ri * K_LIGACAO) * 2;
        }
            
        let roadDecline = destinWarehouseCoordinates.y - originWarehouseCoordinates.y;
        let roadLength = Math.sqrt(Math.pow(distanceWarehouses, 2) + Math.pow(roadDecline, 2));
        let roadSlope = Math.atan(roadDecline / distanceWarehouses);

        this.object = new THREE.Group();

        let roadGeometry = new THREE.PlaneGeometry(roadLength, roadWidth);
        let roadMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        var loader = new THREE.TextureLoader();
        loader.load( 'textures/road.jpg', 
        function ( texture ) { 
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2,1)
            roadMaterial.map = texture;
            roadMaterial.needsUpdate = true;
        });
        let roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
        roadMesh.castShadow = true;
        roadMesh.receiveShadow = true;
        
        this.object.add(roadMesh);

        this.object.position.set((originWarehouseCoordinates.x + destinWarehouseCoordinates.x)/2, (originWarehouseCoordinates.y + destinWarehouseCoordinates.y)/2, (originWarehouseCoordinates.z + destinWarehouseCoordinates.z)/2);
        this.object.rotation.set( 0, -connectAngle, roadSlope);
        this.object.rotateX(Math.PI/2)
        

    }

}
