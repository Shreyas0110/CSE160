let dirt = "../textures/dirt.jpg";
let sky = "../textures/sky.png";

let tex1;
let tex2;

function loadTexture(url) {
  tex1 = gl.createTexture();
  const image = new Image();

  image.onload = function () {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image vertically
    gl.bindTexture(gl.TEXTURE_2D, tex1);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                  gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // Bind the texture to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex1);

    // Pass the texture unit to the sampler
    gl.uniform1i(u_Sampler, 0);
  };

  image.src = url; // e.g., 'assets/brick.png'
}

function loadTexture2(url) {
  tex2 = gl.createTexture();
  const image = new Image();

  image.onload = function () {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, tex2);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                  gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // Bind the texture to texture unit 0
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tex2);

    // Pass the texture unit to the sampler
    gl.uniform1i(u_Sampler2, 1);
  };

  image.src = url; // e.g., 'assets/brick.png'
}