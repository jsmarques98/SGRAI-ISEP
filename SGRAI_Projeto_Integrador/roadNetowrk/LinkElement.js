import * as THREE from 'three';

export default class LinkElement {
    
    constructor(coordinates, ri, angle, roadWidth, K_LIGACAO) {
        
        this.linkElement = new THREE.Group();
        
        let linkElemGeometry = new THREE.PlaneGeometry(roadWidth, ri * K_LIGACAO);
        let linkElemMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
        var loader = new THREE.TextureLoader();
        loader.load( 'textures/road.jpg', 
        function ( texture ) {   
            texture.wrapS = THREE.RepeatWrapping;
            texture.rotation = Math.PI/2;
            texture.repeat.set(1,1)
            texture.wrapT = THREE.RepeatWrapping;  
            linkElemMaterial.map = texture;
            linkElemMaterial.needsUpdate = true;
        });
        let linkElemMesh = new THREE.Mesh(linkElemGeometry, linkElemMaterial);
        linkElemMesh.castShadow = true;
        linkElemMesh.receiveShadow = true;
        this.linkElement.add(linkElemMesh); 
        this.linkElement.position.set(ri * Math.cos(angle) + coordinates.x, coordinates.y, ri * Math.sin(angle) + coordinates.z);
        this.linkElement.rotation.set(Math.PI/2, 0, angle + Math.PI/2);

    }

}