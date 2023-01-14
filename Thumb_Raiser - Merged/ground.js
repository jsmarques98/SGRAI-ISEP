import * as THREE from "three";
import TexturedMaterial from "./material.js";

/*
 * parameters = {
 *  size: Vector3,
 *  segments: Vector3,
 *  materialParameters: {
 *   color: Color,
 *   mapUrl: String,
 *   aoMapUrl: String,
 *   aoMapIntensity: Float,
 *   displacementMapUrl: String,
 *   displacementScale: Float,
 *   displacementBias: Float,
 *   normalMapUrl: String,
 *   normalMapType: Integer,
 *   normalScale: Vector2,
 *   bumpMapUrl: String,
 *   bumpScale: Float,
 *   roughnessMapUrl: String,
 *   roughness: Float,
 *   wrapS: Integer,
 *   wrapT: Integer,
 *   repeat: Vector2,
 *   magFilter: Integer,
 *   minFilter: Integer
 *  },
 *  secondaryColor: Color
 * }
 */

export default class Ground extends THREE.Mesh {
    constructor(parameters) {
        super();

        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        // Create the materials
        const primaryMaterial = new TexturedMaterial(this.materialParameters);
        const secondaryMaterial = new THREE.MeshStandardMaterial({ color: this.secondaryColor });

        // Create a ground box that receives shadows but does not cast them
        this.geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z, this.segments.x, this.segments.y, this.segments.z);
        this.geometry.attributes.uv2 = this.geometry.attributes.uv; // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap
        this.material = [
            secondaryMaterial, // Positive X
            secondaryMaterial, // Negative X
            primaryMaterial, // Positive Y
            secondaryMaterial, // Negative Y
            secondaryMaterial, // Positive Z
            secondaryMaterial // Negative Z
        ];
        this.position.set(0.0, -this.size.y / 2.0, 0.0);
        this.castShadow = false;
        this.receiveShadow = true;
    }
}