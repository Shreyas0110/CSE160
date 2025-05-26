class Cube {
    constructor() {
        this.vertices = [];
        this.normals = [];
        this.uvs = [];
        this.initCube();
    }

    initCube() {
        // Vertices, normals, and UVs for each triangle face of the cube

        // Front face (two triangles)
        this.addFace(
            [-1.0, -1.0,  1.0], [0.0, 0.0,  1.0], [0.0, 0.0],
            [ 1.0, -1.0,  1.0], [0.0, 0.0,  1.0], [1.0, 0.0],
            [ 1.0,  1.0,  1.0], [0.0, 0.0,  1.0], [1.0, 1.0],
            [-1.0,  1.0,  1.0], [0.0, 0.0,  1.0], [0.0, 1.0]
        );

        // Back face (two triangles)
        this.addFace(
            [-1.0, -1.0, -1.0], [0.0, 0.0, -1.0], [0.0, 0.0],
            [-1.0,  1.0, -1.0], [0.0, 0.0, -1.0], [1.0, 0.0],
            [ 1.0,  1.0, -1.0], [0.0, 0.0, -1.0], [1.0, 1.0],
            [ 1.0, -1.0, -1.0], [0.0, 0.0, -1.0], [0.0, 1.0]
        );

        // Top face (two triangles)
        this.addFace(
            [-1.0,  1.0, -1.0], [0.0,  1.0,  0.0], [0.0, 0.0],
            [-1.0,  1.0,  1.0], [0.0,  1.0,  0.0], [1.0, 0.0],
            [ 1.0,  1.0,  1.0], [0.0,  1.0,  0.0], [1.0, 1.0],
            [ 1.0,  1.0, -1.0], [0.0,  1.0,  0.0], [0.0, 1.0]
        );

        // Bottom face (two triangles)
        this.addFace(
            [-1.0, -1.0, -1.0], [0.0, -1.0,  0.0], [0.0, 0.0],
            [ 1.0, -1.0, -1.0], [0.0, -1.0,  0.0], [1.0, 0.0],
            [ 1.0, -1.0,  1.0], [0.0, -1.0,  0.0], [1.0, 1.0],
            [-1.0, -1.0,  1.0], [0.0, -1.0,  0.0], [0.0, 1.0]
        );

        // Right face (two triangles)
        this.addFace(
            [ 1.0, -1.0, -1.0], [1.0,  0.0,  0.0], [0.0, 0.0],
            [ 1.0,  1.0, -1.0], [1.0,  0.0,  0.0], [1.0, 0.0],
            [ 1.0,  1.0,  1.0], [1.0,  0.0,  0.0], [1.0, 1.0],
            [ 1.0, -1.0,  1.0], [1.0,  0.0,  0.0], [0.0, 1.0]
        );

        // Left face (two triangles)
        this.addFace(
            [-1.0, -1.0, -1.0], [-1.0, 0.0,  0.0], [0.0, 0.0],
            [-1.0, -1.0,  1.0], [-1.0, 0.0,  0.0], [1.0, 0.0],
            [-1.0,  1.0,  1.0], [-1.0, 0.0,  0.0], [1.0, 1.0],
            [-1.0,  1.0, -1.0], [-1.0, 0.0,  0.0], [0.0, 1.0]
        );
    }

    addFace(v1, n1, uv1, v2, n2, uv2, v3, n3, uv3, v4, n4, uv4) {
        // Add first triangle
        this.vertices.push(...v1, ...v2, ...v3);
        this.normals.push(...n1, ...n2, ...n3);
        this.uvs.push(...uv1, ...uv2, ...uv3);

        // Add second triangle
        this.vertices.push(...v1, ...v3, ...v4);
        this.normals.push(...n1, ...n3, ...n4);
        this.uvs.push(...uv1, ...uv3, ...uv4);
    }

    getVertices(){
        return this.vertices;
    }
}

class Sphere{
    constructor() {
        this.vertices = [];
        this.normals = [];
        this.uvs = [];
        this.initSphere();
    }

    initSphere(radius = 10, latBands = 30, longBands = 30) {

        for (let lat = 0; lat < latBands; ++lat) {
            const theta1 = lat * Math.PI / latBands;
            const theta2 = (lat + 1) * Math.PI / latBands;

            for (let lon = 0; lon < longBands; ++lon) {
            const phi1 = lon * 2 * Math.PI / longBands;
            const phi2 = (lon + 1) * 2 * Math.PI / longBands;

            // Vertex positions
            const p1 = this.getSpherePoint(theta1, phi1, radius);
            const p2 = this.getSpherePoint(theta2, phi1, radius);
            const p3 = this.getSpherePoint(theta2, phi2, radius);
            const p4 = this.getSpherePoint(theta1, phi2, radius);

            // Push two triangles: (p1, p2, p3) and (p1, p3, p4)
            this.vertices.push(...p1, ...p2, ...p3);
            this.vertices.push(...p1, ...p3, ...p4);

            this.normals.push(...this.normalize(p1), ...this.normalize(p2), ...this.normalize(p3));
            this.normals.push(...this.normalize(p1), ...this.normalize(p3), ...this.normalize(p4));

            this.uvs.push(0,0, 0,0, 0,0, 0,0, 0,0, 0,0);

            }
        }
    }

    getSpherePoint(theta, phi, radius) {
        const x = Math.sin(theta) * Math.cos(phi);
        const y = Math.cos(theta);
        const z = Math.sin(theta) * Math.sin(phi);
        return [x * radius, y * radius, z * radius];
        }

    normalize(v) {
        const len = Math.hypot(...v);
        return len > 0.0001 ? v.map(x => x / len) : [0, 0, 0];
        }

    getVertices(){
        return this.vertices;
    }

}

class reverseCube extends Cube{
    initCube() {
        // Front face (two triangles)
        this.addFace(
            [-1.0, -1.0,  1.0], [ 0.0,  0.0, -1.0], [0.0, 0.0],
            [ 1.0, -1.0,  1.0], [ 0.0,  0.0, -1.0], [1.0, 0.0],
            [ 1.0,  1.0,  1.0], [ 0.0,  0.0, -1.0], [1.0, 1.0],
            [-1.0,  1.0,  1.0], [ 0.0,  0.0, -1.0], [0.0, 1.0]
        );

        // Back face
        this.addFace(
            [-1.0, -1.0, -1.0], [ 0.0,  0.0,  1.0], [0.0, 0.0],
            [-1.0,  1.0, -1.0], [ 0.0,  0.0,  1.0], [1.0, 0.0],
            [ 1.0,  1.0, -1.0], [ 0.0,  0.0,  1.0], [1.0, 1.0],
            [ 1.0, -1.0, -1.0], [ 0.0,  0.0,  1.0], [0.0, 1.0]
        );

        // Top face
        this.addFace(
            [-1.0,  1.0, -1.0], [ 0.0, -1.0,  0.0], [0.0, 0.0],
            [-1.0,  1.0,  1.0], [ 0.0, -1.0,  0.0], [1.0, 0.0],
            [ 1.0,  1.0,  1.0], [ 0.0, -1.0,  0.0], [1.0, 1.0],
            [ 1.0,  1.0, -1.0], [ 0.0, -1.0,  0.0], [0.0, 1.0]
        );

        // Bottom face
        this.addFace(
            [-1.0, -1.0, -1.0], [ 0.0,  1.0,  0.0], [0.0, 0.0],
            [ 1.0, -1.0, -1.0], [ 0.0,  1.0,  0.0], [1.0, 0.0],
            [ 1.0, -1.0,  1.0], [ 0.0,  1.0,  0.0], [1.0, 1.0],
            [-1.0, -1.0,  1.0], [ 0.0,  1.0,  0.0], [0.0, 1.0]
        );

        // Right face
        this.addFace(
            [ 1.0, -1.0, -1.0], [-1.0,  0.0,  0.0], [0.0, 0.0],
            [ 1.0,  1.0, -1.0], [-1.0,  0.0,  0.0], [1.0, 0.0],
            [ 1.0,  1.0,  1.0], [-1.0,  0.0,  0.0], [1.0, 1.0],
            [ 1.0, -1.0,  1.0], [-1.0,  0.0,  0.0], [0.0, 1.0]
        );

        // Left face
        this.addFace(
            [-1.0, -1.0, -1.0], [1.0, 0.0,  0.0], [0.0, 0.0],
            [-1.0, -1.0,  1.0], [1.0, 0.0,  0.0], [1.0, 0.0],
            [-1.0,  1.0,  1.0], [1.0, 0.0,  0.0], [1.0, 1.0],
            [-1.0,  1.0, -1.0], [1.0, 0.0,  0.0], [0.0, 1.0]
        );
    }
}