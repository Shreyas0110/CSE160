class ExplicitTriangle extends Shape{
    constructor(position, color){
        super(position, color, 1.0);
        this.type = 'explicit triangle';
    }

    render(){
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        var coords = this.position;
        drawTriangle([coords[0][0], coords[0][1], coords[1][0], coords[1][1], coords[2][0], coords[2][1]]);
    }
}

let brown = [54/255.0, 54/255.0, 54/255.0, 1.0];
let lightbrown = [99/255.0, 99/255.0, 99/255.0, 1.0];
let black = [0,0,0,1.0];
let red = [1.0,0,0,1.0];

var drawingArray = [
    //body
    new ExplicitTriangle([[-.1,.4],[0,.5],[.1,.4]], lightbrown),
    new ExplicitTriangle([[-.1,.4],[0,-.3],[.1,.4]], lightbrown),

    //wings
    new ExplicitTriangle([[.3,0],[0,-.3],[.1,.4]], brown),
    new ExplicitTriangle([[.3,0],[.5,.5],[.1,.4]], brown),
    new ExplicitTriangle([[.9,0],[.5,.5],[.3,.0]], brown),
    new ExplicitTriangle([[.3,0],[.45,-.2],[.65,.0]], brown),
    new ExplicitTriangle([[.65,0],[.75,-.1],[.9,.0]], brown),

    new ExplicitTriangle([[-.3,0],[0,-.3],[-.1,.4]], brown),
    new ExplicitTriangle([[-.3,0],[-.5,.5],[-.1,.4]], brown),
    new ExplicitTriangle([[-.9,0],[-.5,.5],[-.3,.0]], brown),
    new ExplicitTriangle([[-.3,0],[-.45,-.2],[-.65,.0]], brown),
    new ExplicitTriangle([[-.65,0],[-.75,-.1],[-.9,.0]], brown),

    //eyes
    new ExplicitTriangle([[-.05,.4],[-.03,.4],[-.04,.33]], red),
    new ExplicitTriangle([[.05,.4],[.03,.4],[.04,.33]], red),

    //wing thingies
    new ExplicitTriangle([[-.1,.35],[-.2,.2],[-.2,.28]], black),
    new ExplicitTriangle([[-.5,.5],[-.2,.2],[-.2,.28]], black),
    new ExplicitTriangle([[-.5,.5],[-.52,.1],[-.48,.1]], black),
    new ExplicitTriangle([[-.45,-.2],[-.52,.1],[-.48,.1]], black),
    new ExplicitTriangle([[-.5,.5],[-.7,.1],[-.74,.1]], black),
    new ExplicitTriangle([[-.75,-.1],[-.7,.1],[-.74,.1]], black),

    new ExplicitTriangle([[.1,.35],[.2,.2],[.2,.28]], black),
    new ExplicitTriangle([[.5,.5],[.2,.2],[.2,.28]], black),
    new ExplicitTriangle([[.5,.5],[.52,.1],[.48,.1]], black),
    new ExplicitTriangle([[.45,-.2],[.52,.1],[.48,.1]], black),
    new ExplicitTriangle([[.5,.5],[.7,.1],[.74,.1]], black),
    new ExplicitTriangle([[.75,-.1],[.7,.1],[.74,.1]], black),
];