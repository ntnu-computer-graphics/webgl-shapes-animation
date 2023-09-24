//  Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_Rotation;
void main() {
    gl_Position = u_Rotation * a_Position;
}`;

// Fragment Shader program
var FSHADER_SOURCE = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Set the color
}`;

function main () {
    // 1. Retrieve the canvas element
    var canvas = document.getElementById('webgl');

    // 2. Get the webGL rendering context
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get rendering context for WebGL.');
        return;
    }

    // 3. Initialise shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialise shaders.');
        return;
    }

    // 4. Set positions of vertices
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices.');
        return;
    }

    var u_Rotation = gl.getUniformLocation(gl.program, 'u_Rotation')
    if(!u_Rotation) {
        console.log('Failed to find location of u_Rotation')
    }

    const angle = Math.PI * 90 / 180
    const cosb = Math.cos(angle)
    const sinb = Math.sin(angle)

    var rotation = new Float32Array([
        cosb,sinb,0.0,0.0,
        -sinb,cosb,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.0,0.0,0.0,1.0])

    gl.uniformMatrix4fv(u_Rotation, false, rotation)

    // 7. Set colour for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 8. Clear <canvas> 
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw three points
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    // 4.1. Define vertices
    var vertices = new Float32Array([
        0.0, 0.5, 
        -0.5, -0.5, 
        0.5, -0.5
    ]);
    var n = 3; // The number of vertices

    // 4.2. Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }

    // 4.3. Bind buffer object to a target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 4.4. Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 4.5. Get storage locations for shader attributes
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get storage location of a_Position');
        return;
    }

    // 4.6. Assign buffer object to a_Position (attribute) variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 4.7. Enable assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}


