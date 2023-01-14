import * as THREE from "three";
import Orientation from "./orientation.js";

/*
 * parameters = {
 *  visible: Boolean,
 *  color: Color,
 *  intensity: Float,
 *  intensityMin: Float,
 *  intensityMax: Float,
 *  intensityStep: Float
 * }
 */

export class AmbientLight extends THREE.AmbientLight {
    constructor(parameters) {
        super();

        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }
    }
}

/*
 * parameters = {
 *  visible: Boolean,
 *  color: Color,
 *  intensity: Float,
 *  intensityMin: Float,
 *  intensityMax: Float,
 *  intensityStep: Float,
 *  distance: Float,
 *  orientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  orientationStep: Orientation
 * }
 */

export class DirectionalLight extends THREE.DirectionalLight {
    constructor(parameters) {
        super();

        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        // Turn on shadows for this light
        const position = this.orientationToPosition(this.distance, this.orientation);
        this.position.set(position.x, position.y, position.z);
        this.castShadow = true;

        // Set up shadow properties for this light
        this.shadow.mapSize.width = 2048;
        this.shadow.mapSize.height = 2048;
        this.shadow.camera.left = -20.0;
        this.shadow.camera.right = 20.0;
        this.shadow.camera.top = 20.0;
        this.shadow.camera.bottom = -20.0;
        this.shadow.camera.near = 0.0;
        this.shadow.camera.far = 40.0;
    }

    orientationToPosition(distance, orientation) {
        const cosH = Math.cos(THREE.MathUtils.degToRad(orientation.h));
        const sinH = Math.sin(THREE.MathUtils.degToRad(orientation.h));
        const cosV = Math.cos(THREE.MathUtils.degToRad(orientation.v));
        const sinV = Math.sin(THREE.MathUtils.degToRad(orientation.v));
        const positionX = distance * sinH * cosV;
        const positionY = distance * sinV;
        const positionZ = distance * cosH * cosV;
        return new THREE.Vector3(positionX, positionY, positionZ);
    }
}

/*
 * parameters = {
 *  visible: Boolean,
 *  color: Color,
 *  intensity: Float,
 *  intensityMin: Float,
 *  intensityMax: Float,
 *  intensityStep: Float,
 *  distance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  distanceStep: Float,
 *  angle: Float,
 *  angleMin: Float,
 *  angleMax: Float,
 *  angleStep: Float,
 *  penumbra: Float,
 *  penumbraMin: Float,
 *  penumbraMax: Float,
 *  penumbraStep: Float,
 *  position: Vector3,
 *  positionMin: Vector3,
 *  positionMax: Vector3,
 *  positionStep: Vector3
 * }
 */

export class SpotLight extends THREE.SpotLight {
    constructor(parameters) {
        super();

        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        // Convert this light's angle from degrees to radians
        this.angle = THREE.MathUtils.degToRad(this.angle);

        // Turn on shadows for this light
        this.castShadow = true;

        // Set up shadow properties for this light
        this.shadow.mapSize.width = 512;
        this.shadow.mapSize.height = 512;
        this.shadow.camera.near = 5.0;
        this.shadow.camera.far = 30.0;
        this.shadow.camera.focus = 1.0;
    }
}

/*
 * parameters = {
 *  visible: Boolean,
 *  color: Color,
 *  intensity: Float,
 *  intensityMin: Float,
 *  intensityMax: Float,
 *  intensityStep: Float,
 *  distance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  distanceStep: Float,
 *  angle: Float,
 *  angleMin: Float,
 *  angleMax: Float,
 *  angleStep: Float,
 *  penumbra: Float,
 *  penumbraMin: Float,
 *  penumbraMax: Float,
 *  penumbraStep: Float,
 *  orientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  orientationStep: Orientation
 * }
 */

export class FlashLight extends THREE.SpotLight {
    constructor(parameters) {
        super();

        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        // Convert this light's angle from degrees to radians
        this.angle = THREE.MathUtils.degToRad(this.angle);

        // The player radius is needed to compute the position of this light
        this.playerRadius = 0.0;

        // The player orientation is needed to compute the orientation of this light
        this.playerOrientation = new THREE.Quaternion().identity();

        // Turn on shadows for this light
        this.castShadow = true;

        // Set up shadow properties for this light
        this.shadow.mapSize.width = 512;
        this.shadow.mapSize.height = 512;
        this.shadow.camera.near = 0.01;
        this.shadow.camera.far = 10.0;
        this.shadow.camera.focus = 1.0;
    }

    orientationToPosition(distance, orientation) {
        const cosH = Math.cos(THREE.MathUtils.degToRad(orientation.h));
        const sinH = Math.sin(THREE.MathUtils.degToRad(orientation.h));
        const cosV = Math.cos(THREE.MathUtils.degToRad(orientation.v));
        const sinV = Math.sin(THREE.MathUtils.degToRad(orientation.v));
        const positionX = distance * sinH * cosV;
        const positionY = distance * sinV;
        const positionZ = distance * cosH * cosV;
        return new THREE.Vector3(positionX, positionY, positionZ);
    }

    // Set this light's position, orientation and target (positive Y-semiaxis up)
    setLightingParameters() {
        const playerOrientation = new THREE.Euler().setFromQuaternion(this.playerOrientation, "YXZ"); // Order: yaw, pitch and roll
        playerOrientation.x = THREE.MathUtils.radToDeg(-playerOrientation.x) + this.orientation.v;
        playerOrientation.y = THREE.MathUtils.radToDeg(playerOrientation.y) + this.orientation.h;
        playerOrientation.z = THREE.MathUtils.radToDeg(-playerOrientation.z);
        const target = this.orientationToPosition(this.distance, new Orientation(playerOrientation.y, playerOrientation.x));
        this.target.translateX(target.x);
        this.target.translateY(target.y);
        this.target.translateZ(target.z);
    }

    setTarget(target) {
        this.position.set(target.x, target.y, target.z);
        this.target.position.set(target.x, target.y, target.z);
        this.setLightingParameters();
    }
}