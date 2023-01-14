import * as THREE from "three";

/*
 * parameters = {
 *  color: Color,
 *  mapUrl: String,
 *  aoMapUrl: String,
 *  aoMapIntensity: Float,
 *  displacementMapUrl: String,
 *  displacementScale: Float,
 *  displacementBias: Float,
 *  normalMapUrl: String,
 *  normalMapType: Integer,
 *  normalScale: Vector2,
 *  bumpMapUrl: String,
 *  bumpScale: Float,
 *  roughnessMapUrl: String,
 *  roughness: Float,
 *  wrapS: Integer,
 *  wrapT: Integer,
 *  repeat: Vector2,
 *  magFilter: Integer,
 *  minFilter: Integer
 * }
 */

export default class TexturedMaterial extends THREE.MeshStandardMaterial {
    constructor(parameters) {
        super();

        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        // Create a texture file loader
        const loader = new THREE.TextureLoader();

        // Load the textures
        if (this.mapUrl != "") {
            this.map = loader.load(this.mapUrl);
            this.map.wrapS = this.wrapS;
            this.map.wrapT = this.wrapT;
            this.map.repeat.set(this.repeat.x, this.repeat.y);
            this.map.magFilter = this.magFilter;
            this.map.minFilter = this.minFilter;
        }
        if (this.aoMapUrl != "") {
            this.aoMap = loader.load(this.aoMapUrl);
            this.aoMap.wrapS = this.wrapS;
            this.aoMap.wrapT = this.wrapT;
            this.aoMap.repeat.set(this.repeat.x, this.repeat.y);
            this.aoMap.magFilter = this.magFilter;
            this.aoMap.minFilter = this.minFilter;
        }
        if (this.displacementMapUrl != "") {
            this.displacementMap = loader.load(this.displacementMapUrl);
            this.displacementMap.wrapS = this.wrapS;
            this.displacementMap.wrapT = this.wrapT;
            this.displacementMap.repeat.set(this.repeat.x, this.repeat.y);
            this.displacementMap.magFilter = this.magFilter;
            this.displacementMap.minFilter = this.minFilter;
        }
        if (this.normalMapUrl != "") {
            this.normalMap = loader.load(this.normalMapUrl);
            this.normalMap.wrapS = this.wrapS;
            this.normalMap.wrapT = this.wrapT;
            this.normalMap.repeat.set(this.repeat.x, this.repeat.y);
            this.normalMap.magFilter = this.magFilter;
            this.normalMap.minFilter = this.minFilter;
        }
        else if (this.bumpMapUrl != "") { // If a normal map is defined, the bump map will be ignored: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.bumpMap
            this.bumpMap = loader.load(this.bumpMapUrl);
            this.bumpMap.wrapS = this.wrapS;
            this.bumpMap.wrapT = this.wrapT;
            this.bumpMap.repeat.set(this.repeat.x, this.repeat.y);
            this.bumpMap.magFilter = this.magFilter;
            this.bumpMap.minFilter = this.minFilter;
        }
        if (this.roughnessMapUrl != "") {
            this.roughnessMap = loader.load(this.roughnessMapUrl);
            this.roughnessMap.wrapS = this.wrapS;
            this.roughnessMap.wrapT = this.wrapT;
            this.roughnessMap.repeat.set(this.repeat.x, this.repeat.y);
            this.roughnessMap.magFilter = this.magFilter;
            this.roughnessMap.minFilter = this.minFilter;
        }
    }
}