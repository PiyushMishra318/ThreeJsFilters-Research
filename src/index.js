
import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";

//composer
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
//renderpass to render the image
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

// inbuilt passes
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';
import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass.js';

class App extends Component {
  componentDidMount() {
    var scene = new THREE.Scene();
    var fieldOfView = 75;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var nearPlane = 0.1;
    var farPlane = 1000;
    var camera = new THREE.PerspectiveCamera(
    fieldOfView, aspectRatio, nearPlane, farPlane
    );
    camera.position.z = 5;
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('canvas').appendChild( renderer.domElement );
    var loader = new THREE.TextureLoader();
    var material = new THREE.MeshLambertMaterial({
    map: loader.load('https://s3.amazonaws.com/duhaime/blog/tsne-webgl/assets/cat.jpg')
    });
    var geometry = new THREE.PlaneGeometry(10, 10*.75);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0,0,0)
    scene.add(mesh);
    var light = new THREE.PointLight( 0xffffff, 1, 0 );
    light.position.set(1, 1, 100 );
    scene.add(light)
    var rtParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: true
    };
    var composer = new EffectComposer( renderer,new THREE.WebGLRenderTarget( window.innerWidth * 2, window.innerHeight * 2, rtParameters ) );
    var renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );
    // var luminosityPass = new ShaderPass( LuminosityShader );
    // composer.addPass( luminosityPass );
    var adaptiveToneMappingPass = new AdaptiveToneMappingPass(
      true,window.innerWidth
    );
    composer.addPass(adaptiveToneMappingPass)

    function animate() {
        requestAnimationFrame( animate );
        composer.render();
    }
    animate()
  }
  render() {
    return (
      <div id="canvas" />
    )
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);