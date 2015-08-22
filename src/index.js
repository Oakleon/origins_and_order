
require('es6-promise').polyfill();
let fetch = require('isomorphic-fetch');

// async function myAsync() {
//
//     try {
//         let result  = await fetch('https://api.npmjs.org/downloads/point/last-day/assert');
//         let stories = await result.text();
//         console.log(stories);
//     } catch (e) {
//
//     }
//
// }
//
// myAsync();
console.log("foo");


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x22ffff } );
var cube = new THREE.Mesh( geometry, material );

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

scene.add( cube );

camera.position.z = 100;
camera.position.x = 50;
camera.position.y = 50;


var isAnyDate = function(m,d,y, dates) {
    if(m < 1 || m > 12) return false;
    if(d < 1 || d > 31) return false;
    dates[[m,d,y].join("/")] = 1;
}

var checkDate = function(x,y,z) {

    var dates = {};
    if(isAnyDate(x,y,z, dates));
    if(isAnyDate(x,z,y, dates));
    if(isAnyDate(y,x,z, dates));
    if(isAnyDate(y,z,x, dates));
    if(isAnyDate(z,y,x, dates));
    if(isAnyDate(z,x,y, dates));

    if(Object.keys(dates).length > 1)
        return false;
    if(Object.keys(dates).length < 1)
        return false;

    return true;
}


var answer = function(x, y, z) {

    if(!checkDate(x, y, z)) return false;

    var month_days = {1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31};

    var p = [x, y, z].sort();

    //if a value is zero then it must be a year
    if (p[0] === 0) {
        p = [p[1], p[2], p[0]];
    }

    //p_m = [mapx for x in p if x > 0 and x < 13]

    var p_m = p.filter((i) => { return i > 0 && i < 13 });

    if (p[0] !== p[1] && p_m.length > 1) {
        return false;
    }

    //p_d = [x for x in p if x > 0 and x < month_days[p_m[0]]]
    var p_d = p.filter((i) => { return i > 0 && i < month_days[p_m[0]]});
    if (p[1] !== p[2] && p_d.length > 2) {
        return false;
    }

    return true;
};

var makeParticles = function() {

	for (var x = 0; x < 99; x++ ) {
        var geometry1 = new THREE.Geometry();
        var material1 = new THREE.PointCloudMaterial( { size: 1, color: 0xff0000} );
        var r = x + 51 / 150;
        var g = x + 51 / 150;
        var b = x / 99;
        material1.color.setRGB(r, g, b);
        for (var y = 0; y < 99; y++ ) {
            for (var z = 0; z < 99; z++ ) {
                var vertex = new THREE.Vector3();
        		vertex.x = x;
        		vertex.y = y;
        		vertex.z = z;

                if(answer(x,y,z)) geometry1.vertices.push( vertex );
                //else geometry2.vertices.push( vertex );
            }
        }
        scene.add(new THREE.PointCloud( geometry1, material1 ) );
	}
}

var setup = function() {
    makeParticles();
}

var render = function () {
    requestAnimationFrame( render );

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;

    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
    camera.lookAt( scene.position );

    renderer.render(scene, camera);
};

function onDocumentMouseMove( event ) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

setup();
render();



//
// fetch('https://api.npmjs.org/downloads/point/last-day/assert')
// .then(function(response) {
//     if (response.status >= 400) {
//         throw new Error("Bad response from server");
//     }
//     return response.json();
// })
// .then(function(stories) {
//     console.log(stories);
// });
