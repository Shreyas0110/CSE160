let dirt = "../textures/dirt.jpg";
let sky = "../textures/sky.png";

function loadTexture(url) {
  const texture = gl.createTexture();
  const image = new Image();

  image.onload = function () {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image vertically
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                  gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // Bind the texture to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Pass the texture unit to the sampler
    gl.uniform1i(u_Sampler, 0);
  };

  image.src = url; // e.g., 'assets/brick.png'
}