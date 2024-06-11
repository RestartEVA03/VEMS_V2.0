var webglspins = new WebGLSpins(document.getElementById("webgl-canvas"));
webglspins.updateOptions({
    colormapImplementation: WebGLSpins.colormapImplementations['bluewhitered'],
    levelOfDetail: 10,
    backgroundColor: [0.1, 0.11, 0.13],
    renderers: [
        WebGLSpins.renderers.ARROWS,
        [WebGLSpins.renderers.COORDINATESYSTEM, [0.0, 0.1, 0.1, 0.1]]
    ]
    });
event_listener = new VEMSListener();
console.log(event_listener);