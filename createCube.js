import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

export default function createCube({x, y, color}) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({
        "color": color
    });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(x, y, 0)

    return cube
}