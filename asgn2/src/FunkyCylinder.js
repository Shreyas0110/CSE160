class FunkyCylinder{
    constructor(segments){
        this.segments = segments;
        this.type = 'funkyCylinder';
        this.previousLayer = null;
        this.height = 0;
        this.vertices = [];
        this.numLayers = 0;
        this.color = [];
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
                    this.vertices.push(...this.previousLayer[i][0], ...this.previousLayer[i][1], ...currentLayer[i][0]);
                    /* __
                       \ | 
                        \| */
                    this.vertices.push(...this.previousLayer[i][1], ...currentLayer[i][0], ...currentLayer[i][1]);
                    let r = Math.random();
                    let g = Math.random();
                    let b = Math.random();
                    for (let j = 0; j < 3; ++j){
                        this.color.push(r, g, b, 1);
                    }
                    r = Math.random();
                    g = Math.random();
                    b = Math.random();
                    for (let j = 0; j < 3; ++j){
                        this.color.push(r, g, b, 1);
                    }
                }
            }

        }
        this.previousLayer = currentLayer;
    }

    addPoint(loc, height_increase){
        this.numLayers++;
        this.height += height_increase;
        let pos = [loc[0], this.height, loc[1]];
        for(let i = 0; i < this.previousLayer.length; ++i){
            this.vertices.push(...pos, ...this.previousLayer[i][0], ...this.previousLayer[i][1]);
            let r = Math.random();
            let g = Math.random();
            let b = Math.random();
            for (let j = 0; j < 3; ++j){
                this.color.push(r, g, b, 1);
            }
        }
        this.previousLayer = [pos];
    }

    getVertices(){
        return this.vertices;
    }

    getColors(){
        return this.color;
    }
}