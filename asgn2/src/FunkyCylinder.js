class FunkyCylinder{
    constructor(segments){
        this.segments = segments;
        this.type = 'funkyCylinder';
        this.previousLayer = null;
        this.height = 0;
        this.vertices = [];
        this.numLayers = 0;
        this.color = [0.75, 0.75, 0.75, 1];
        this.normals = [];
    }

    addLayer(center, height_increase, size){
        this.numLayers++;
        let currentLayer = [];
        this.height += height_increase;

        var d = size/400.0;
        var xz = center;

        let angleStep = 360/this.segments;
        for(var angle = 0; angle < 360; angle = angle+angleStep){
            let centerPt = [xz[0], xz[1]];
            let angle1=angle;
            let angle2=angle+angleStep;
            let vec1=[Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
            let vec2=[Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
            let pt1 = [centerPt[0]+vec1[0], this.height, centerPt[1]+vec1[1]];
            let pt2 = [centerPt[0]+vec2[0], this.height, centerPt[1]+vec2[1]];
            currentLayer.push([pt1, pt2]);
        }
        if(this.previousLayer != null){
            //Was a point
            if(this.previousLayer.length == 1){
                for(let i = 0; i < this.previousLayer.length; ++i){
                    this.vertices.push(...this.previousLayer[0], ...currentLayer[i][0], ...currentLayer[i][1]);
                }
            }
            else{
                for(let i = 0; i < this.previousLayer.length; ++i){
                    /*|\
                      |_\ */
                    this.vertices.push( ...currentLayer[i][0], ...this.previousLayer[i][0], ...this.previousLayer[i][1]);
                    /* __
                       \ | 
                        \| */
                    this.vertices.push(...this.previousLayer[i][1], ...currentLayer[i][1], ...currentLayer[i][0]);
                }
            }

        }
        this.previousLayer = currentLayer;
    }

    addPoint(loc, height_increase){
        this.height += height_increase;
        let pos = [loc[0], this.height, loc[1]];
        if(this.numLayers != 0){
            for(let i = 0; i < this.previousLayer.length; ++i){
                this.vertices.push(...pos, ...this.previousLayer[i][0], ...this.previousLayer[i][1]);
            }
        }
        this.numLayers++;
        this.previousLayer = [pos];
    }

    initNormals(){
        for (let i = 0; i < this.vertices.length;i+=9){
            let v0 = [this.vertices[i], this.vertices[i+1], this.vertices[i+2]];
            let v1 = [this.vertices[i+3], this.vertices[i+4], this.vertices[i+5]];
            let v2 = [this.vertices[i+6], this.vertices[i+7], this.vertices[i+8]];

            const edge1 = [
                v1[0] - v0[0],
                v1[1] - v0[1],
                v1[2] - v0[2]
            ];
            const edge2 = [
                v2[0] - v0[0],
                v2[1] - v0[1],
                v2[2] - v0[2]
            ];

            let normal = [
                edge1[1] * edge2[2] - edge1[2] * edge2[1],
                edge1[2] * edge2[0] - edge1[0] * edge2[2],
                edge1[0] * edge2[1] - edge1[1] * edge2[0]
            ];

            const length = Math.hypot(normal[0], normal[1], normal[2]);
            normal[0] /= length;
            normal[1] /= length;
            normal[2] /= length;
            this.normals.push(...normal, ...normal, ...normal);
        }
    }

    getVertices(){
        return this.vertices;
    }

    getColors(){
        return this.color;
    }
}