



/*
Credit - https://codepen.io/boytchev/pen/ExdmvxE
*/
function createFakeBloom(baseGeometry, {
  layers = 5,
  maxScale = 2,
  baseColor = 0xffaa00,
  opacityFalloff = 0.2
} = {}) {
  const bloom = new THREE.Group();

  for (let i = 0; i < 1; i += 1 / layers) {
    const scale = 1 + i * (maxScale - 1);
    const color =  baseColor;

    const mat = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: 1 - Math.pow(i, opacityFalloff),
      emissive: color,
      emissiveIntensity: 1
    });

    const glowMesh = new THREE.Mesh(baseGeometry.clone(), mat);
    glowMesh.scale.setScalar(scale, scale, scale);
    bloom.add(glowMesh);
  }

  return bloom;
}
