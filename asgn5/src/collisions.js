import * as THREE from 'three';

//center = three.vector3
export class SphereCollider{
    constructor(center, radius){
        this.center = center;
        this.radius = radius;
    }
}

//Note: ellipse will never collide with another ellipse
export class EllipseCollider{
    constructor(center, radiusX, radiusY, radiusZ){
        this.center = center;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.radiusZ = radiusZ;
    }
}

//box will only collide with sphere or ellipse
export class BoxCollider{
    constructor(center, lengthX, lengthY, lengthZ){
        this.center = center;
        this.lengthX = lengthX;
        this.lengthY = lengthY;
        this.lengthZ = lengthZ;
    }
}

export function checkCollision(a, b) {
    if (a instanceof SphereCollider && b instanceof SphereCollider) {
        return checkSphereSphereCollision(a, b);
    } else if (a instanceof SphereCollider && b instanceof EllipseCollider) {
        return checkSphereEllipseCollision(a, b);
    } else if (b instanceof SphereCollider && a instanceof EllipseCollider) {
        return checkSphereEllipseCollision(b, a);
    } else if (a instanceof SphereCollider && b instanceof BoxCollider) {
        return checkSphereBoxCollision(a, b);
    } else if (b instanceof SphereCollider && a instanceof BoxCollider) {
        return checkSphereBoxCollision(b, a);
    } else if (a instanceof BoxCollider && b instanceof EllipseCollider) {
        return checkBoxEllipseCollision(a, b);
    } else if (b instanceof BoxCollider && a instanceof EllipseCollider) {
        return checkBoxEllipseCollision(b, a);
    } else {
        return false;
    }
}

function checkSphereSphereCollision(a, b) {
    const distSq = a.center.distanceToSquared(b.center);
    const radiusSum = a.radius + b.radius;
    return distSq <= radiusSum * radiusSum;
}

function checkSphereEllipseCollision(sphere, ellipse) {
    const delta = sphere.center.clone().sub(ellipse.center);
    const dx = delta.x / ellipse.radiusX;
    const dy = delta.y / ellipse.radiusY;
    const dz = delta.z / ellipse.radiusZ;

    const distSq = dx * dx + dy * dy + dz * dz;
    const normalizedRadius = sphere.radius / Math.max(ellipse.radiusX, ellipse.radiusY, ellipse.radiusZ);
    return distSq <= (1 + normalizedRadius) ** 2;
}

function checkSphereBoxCollision(sphere, box) {
    const halfX = box.lengthX / 2;
    const halfY = box.lengthY / 2;
    const halfZ = box.lengthZ / 2;

    const min = new THREE.Vector3(
        box.center.x - halfX,
        box.center.y - halfY,
        box.center.z - halfZ
    );
    const max = new THREE.Vector3(
        box.center.x + halfX,
        box.center.y + halfY,
        box.center.z + halfZ
    );

    const clamped = sphere.center.clone().clamp(min, max);
    const distSq = sphere.center.distanceToSquared(clamped);

    return distSq <= sphere.radius * sphere.radius;
}

function checkBoxEllipseCollision(box, ellipse) {
    const delta = box.center.clone().sub(ellipse.center);
    const dx = delta.x / ellipse.radiusX;
    const dy = delta.y / ellipse.radiusY;
    const dz = delta.z / ellipse.radiusZ;

    const boxMaxRadius = Math.sqrt(
        (box.lengthX / 2) ** 2 +
        (box.lengthY / 2) ** 2 +
        (box.lengthZ / 2) ** 2
    );

    const distSq = dx * dx + dy * dy + dz * dz;
    const normalizedRadius = boxMaxRadius / Math.max(ellipse.radiusX, ellipse.radiusY, ellipse.radiusZ);
    return distSq <= (1 + normalizedRadius) ** 2;
}
