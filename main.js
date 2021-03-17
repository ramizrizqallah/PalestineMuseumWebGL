import * as THREE from './js/three.module.js';
import { OBJLoader } from './loaders/OBJLoader.js';
import { FBXLoader } from './loaders/FBXLoader.js';
import { PointerLockControls } from './js/PointerLockControl.js';


//Global Variables
let camera, scene, renderer, controls;
const walls = [];
let raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
init();
animate();



function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.y = 32;
    camera.position.x = -220;
    camera.rotation.y = 11.7;

    //Creating Scene And Sun
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x3d3d3d);
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(50, 20, 50);
    scene.add(light);

    //global light

    //camera control and movement
    controls = new PointerLockControls(camera, document.body);
    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');
    instructions.addEventListener('click', function() {
        controls.lock();
    }, false);
    controls.addEventListener('lock', function() {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });
    controls.addEventListener('unlock', function() {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });
    scene.add(controls.getObject());
    const onKeyDown = function(event) {
        switch (event.keyCode) {
            case 38:
            case 87:
                moveForward = true;
                break;

            case 37:
            case 65:
                moveLeft = true;
                break;
            case 40:
            case 83:
                moveBackward = true;
                break;
            case 39:
            case 68:
                moveRight = true;
                break;
            case 69:
                moveUp = true;
                break;
            case 81:
                moveDown = true;
                break;
        }
    };
    const onKeyUp = function(event) {
        switch (event.keyCode) {
            case 38:
            case 87:
                moveForward = false;
                break;
            case 37:
            case 65:
                moveLeft = false;
                break;
            case 40:
            case 83:
                moveBackward = false;
                break;
            case 39:
            case 68:
                moveRight = false;
                break;
            case 69:
                moveUp = false;
                break;
            case 81:
                moveDown = false;
                break;
        }
    };
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    //Ray Caster for Collision detection
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    //Generating Floor
    let floorGeometry = new THREE.PlaneBufferGeometry(500, 500, 1, 1);
    floorGeometry.rotateX(-Math.PI / 2);

    //Adding Floor To the Scene
    let floorTexture = new THREE.TextureLoader().load('./images/carpet.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(20, 20);
    const floorMaterial = new THREE.MeshPhongMaterial({
        map: floorTexture
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.x = Math.floor(0);
    floor.position.z = Math.floor(-230);
    scene.add(floor);


    //Create Walls
    const boxGeometry1 = new THREE.BoxBufferGeometry(500, 100, 2).toNonIndexed();
    const boxGeometry2 = new THREE.BoxBufferGeometry(2, 100, 500).toNonIndexed();
    let wallTexture = new THREE.TextureLoader().load('./images/wall1.png');
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(10, 20);
    const wallMaterial = new THREE.MeshPhongMaterial({
        map: wallTexture
    });
    const wall1 = new THREE.Mesh(boxGeometry1, wallMaterial);
    wall1.position.x = Math.floor(0);
    wall1.position.y = Math.floor(10);
    wall1.position.z = Math.floor(20);
    const wall2 = new THREE.Mesh(boxGeometry1, wallMaterial);
    wall2.position.x = Math.floor(0);
    wall2.position.y = Math.floor(10);
    wall2.position.z = Math.floor(-480);
    const wall3 = new THREE.Mesh(boxGeometry2, wallMaterial);
    wall3.position.x = Math.floor(249);
    wall3.position.y = Math.floor(10);
    wall3.position.z = Math.floor(-230);
    const wall4 = new THREE.Mesh(boxGeometry2, wallMaterial);
    wall4.position.x = Math.floor(-249);
    wall4.position.y = Math.floor(10);
    wall4.position.z = Math.floor(-230);
    scene.add(wall1, wall2, wall3, wall4);
    walls.push(wall1, wall2, wall3, wall4);

    //inner walls
    const innerGeo = new THREE.BoxBufferGeometry(200, 100, 2).toNonIndexed();
    const inner1 = new THREE.Mesh(innerGeo, wallMaterial);
    inner1.position.x = Math.floor(-150);
    inner1.position.y = Math.floor(10);
    inner1.position.z = Math.floor(-270);
    const inner2 = new THREE.Mesh(innerGeo, wallMaterial);
    inner2.position.x = Math.floor(150);
    inner2.position.y = Math.floor(10);
    inner2.position.z = Math.floor(-270);
    const inner3 = new THREE.Mesh(innerGeo, wallMaterial);
    inner3.position.x = Math.floor(150);
    inner3.position.y = Math.floor(10);
    inner3.position.z = Math.floor(-120);
    const inner4 = new THREE.Mesh(innerGeo, wallMaterial);
    inner4.position.x = Math.floor(-150);
    inner4.position.y = Math.floor(10);
    inner4.position.z = Math.floor(-120);

    let temptexture = wallTexture;
    temptexture.repeat.set(5, 2);
    const tempInnerMaterial = new THREE.MeshPhongMaterial({
        map: temptexture
    });
    const innerGeo1 = new THREE.BoxBufferGeometry(2, 100, 138).toNonIndexed();
    const inner5 = new THREE.Mesh(innerGeo1, tempInnerMaterial);
    inner5.position.x = Math.floor(51);
    inner5.position.y = Math.floor(10);
    inner5.position.z = Math.floor(-50);

    scene.add(inner1, inner2, inner3, inner4, inner5);
    walls.push(inner1, inner2, inner3, inner4, inner5);

    //Create Ceiling
    let ceilTexture = new THREE.TextureLoader().load('./images/ceil.png');
    ceilTexture.wrapS = ceilTexture.wrapT = THREE.RepeatWrapping;
    ceilTexture.repeat.set(50, 50);
    const ceilMaterial = new THREE.MeshBasicMaterial({
        map: ceilTexture
    });
    const ceil = new THREE.Mesh(new THREE.BoxBufferGeometry(500, 2, 502).toNonIndexed(), ceilMaterial);
    ceil.position.x = Math.floor(0);
    ceil.position.y = Math.floor(60);
    ceil.position.z = Math.floor(-230);
    scene.add(ceil);
    walls.push(ceil);
    const sun = new THREE.DirectionalLight(0x222222, 5, 3000, 0.3);
    sun.position.set(-150, 300, -200);
    sun.target = floor;
    scene.add(sun)

    //pictures
    var picgeo = new THREE.BoxBufferGeometry(40, 30, 1);
    //inner room
    var picmat1 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/ladies.jpg") });
    var pic1 = new THREE.Mesh(picgeo, picmat1);
    pic1.position.set(-150, 30, -121)
    var picmat2 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/ladies2.jpg") });
    var pic2 = new THREE.Mesh(picgeo, picmat2);
    pic2.position.set(-90, 30, -121)
    var picmat3 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/tob1.jpg") });
    var pic3 = new THREE.Mesh(picgeo, picmat3);
    pic3.position.set(150, 30, -121)
    var picmat4 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/tob2.jpg") });
    var pic4 = new THREE.Mesh(picgeo, picmat4);
    pic4.position.set(90, 30, -121)

    var picmat5 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/oldbuilding.jpg") });
    var pic5 = new THREE.Mesh(picgeo, picmat5);
    pic5.position.set(-150, 30, -269)
    var picmat6 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/nablus.jpg") });
    var pic6 = new THREE.Mesh(picgeo, picmat6);
    pic6.position.set(-90, 30, -269)

    var picmat7 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/family.jpg") });
    var pic7 = new THREE.Mesh(picgeo, picmat7);
    pic7.position.set(150, 30, -269)
    var picmat8 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/oil.jpg") });
    var pic8 = new THREE.Mesh(picgeo, picmat8);
    pic8.position.set(90, 30, -269)
    scene.add(pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8);

    //final room
    var picmat9 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/nis1.gif") });
    var pic9 = new THREE.Mesh(picgeo, picmat9);
    pic9.position.set(-210, 30, -271)
    var picmat10 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/nis2.jpg") });
    var pic10 = new THREE.Mesh(picgeo, picmat10);
    pic10.position.set(-150, 30, -271)
    var picmat11 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/nis3.jpg") });
    var pic11 = new THREE.Mesh(picgeo, picmat11);
    pic11.position.set(-90, 30, -271)

    var picmat12 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/pot1.jpg") });
    var pic12 = new THREE.Mesh(picgeo, picmat12);
    pic12.position.set(210, 30, -271)
    var picmat13 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/pot2.jpg") });
    var pic13 = new THREE.Mesh(picgeo, picmat13);
    pic13.position.set(150, 30, -271)
    var picmat14 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/pot3.jpg") });
    var pic14 = new THREE.Mesh(picgeo, picmat14);
    pic14.position.set(90, 30, -271)

    var picmat15 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/boraq.jpg") });
    var pic15 = new THREE.Mesh(picgeo, picmat15);
    pic15.position.set(210, 30, -479)
    var picmat16 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/omar.jpg") });
    var pic16 = new THREE.Mesh(picgeo, picmat16);
    pic16.position.set(150, 30, -479)
    var picmat17 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/marwani.jpg") });
    var pic17 = new THREE.Mesh(picgeo, picmat17);
    pic17.position.set(90, 30, -479)

    var picmatcen1 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/dome.jpg") });
    var piccen1 = new THREE.Mesh(picgeo, picmatcen1);
    piccen1.position.set(30, 30, -479)
    var picmatcen2 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/nativity.jpg") });
    var piccen2 = new THREE.Mesh(picgeo, picmatcen2);
    piccen2.position.set(-30, 30, -479)

    var picmat19 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/sepulchre.jpg") });
    var pic19 = new THREE.Mesh(picgeo, picmat19);
    pic19.position.set(-210, 30, -479)
    var picmat20 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/saba.jpg") });
    var pic20 = new THREE.Mesh(picgeo, picmat20);
    pic20.position.set(-150, 30, -479)
    var picmat21 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/mary.jpg") });
    var pic21 = new THREE.Mesh(picgeo, picmat21);
    pic21.position.set(-90, 30, -479)

    var picmat22 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/hisham1.jpg") });

    //Vertical Walls
    var picgeo1 = new THREE.BoxBufferGeometry(1, 30, 40);
    var pic22 = new THREE.Mesh(picgeo1, picmat22);
    pic22.position.set(248, 30, -315)
    var picmat23 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/hisham2.jpg") });
    var pic23 = new THREE.Mesh(picgeo1, picmat23);
    pic23.position.set(248, 30, -375)
    var picmat24 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/hisham3.jpg") });
    var pic24 = new THREE.Mesh(picgeo1, picmat24);
    pic24.position.set(248, 30, -435)

    var picmat25 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/solomon1.jpg") });
    var pic25 = new THREE.Mesh(picgeo1, picmat25);
    pic25.position.set(-248, 30, -315)
    var picmat26 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/solomon2.jpg") });
    var pic26 = new THREE.Mesh(picgeo1, picmat26);
    pic26.position.set(-248, 30, -375)
    var picmat27 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/solomon3.jpg") });
    var pic27 = new THREE.Mesh(picgeo1, picmat27);
    pic27.position.set(-248, 30, -435)

    scene.add(pic9, pic10, pic11, pic12, pic13, pic14, pic15, pic16,
        pic17, piccen1, piccen2, pic19, pic20, pic21, pic22, pic23, pic24,
        pic25, pic26, pic27);

    //start room
    var picstartgeo = new THREE.BoxBufferGeometry(150, 50, 1);
    var picmat01 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./models/images/pal.png") });
    var pic01 = new THREE.Mesh(picstartgeo, picmat01);
    pic01.position.set(-150, 30, -119)
    scene.add(pic01);

    //glass outer walls
    const glassframe = new THREE.BoxBufferGeometry(1, 60, 30).toNonIndexed();
    const glassground = new THREE.BoxBufferGeometry(1, 20, 130).toNonIndexed();
    const frame1 = new THREE.Mesh(glassframe, tempInnerMaterial);
    frame1.position.x = Math.floor(-200);
    frame1.position.y = Math.floor(30);
    frame1.position.z = Math.floor(-135);
    const frame2 = new THREE.Mesh(glassframe, tempInnerMaterial);
    frame2.position.x = Math.floor(200);
    frame2.position.y = Math.floor(30);
    frame2.position.z = Math.floor(-135);
    const frame3 = new THREE.Mesh(glassframe, tempInnerMaterial);
    frame3.position.x = Math.floor(-200);
    frame3.position.y = Math.floor(30);
    frame3.position.z = Math.floor(-255);
    const frame4 = new THREE.Mesh(glassframe, tempInnerMaterial);
    frame4.position.x = Math.floor(200);
    frame4.position.y = Math.floor(30);
    frame4.position.z = Math.floor(-255);
    const frame5 = new THREE.Mesh(glassground, tempInnerMaterial);
    frame5.position.x = Math.floor(-200);
    frame5.position.y = Math.floor(10);
    frame5.position.z = Math.floor(-195);
    const frame6 = new THREE.Mesh(glassground, tempInnerMaterial);
    frame6.position.x = Math.floor(200);
    frame6.position.y = Math.floor(10);
    frame6.position.z = Math.floor(-195);
    scene.add(frame1, frame2, frame3, frame4, frame5, frame6)

    //glass container inner walls
    const glasswall = new THREE.BoxBufferGeometry(50, 40, 2).toNonIndexed();
    const gwall1 = new THREE.Mesh(glasswall, wallMaterial);
    gwall1.position.x = Math.floor(225);
    gwall1.position.y = Math.floor(40);
    gwall1.position.z = Math.floor(-149);
    const gwall2 = new THREE.Mesh(glasswall, wallMaterial);
    gwall2.position.x = Math.floor(225);
    gwall2.position.y = Math.floor(40);
    gwall2.position.z = Math.floor(-241);
    const gwall3 = new THREE.Mesh(glasswall, wallMaterial);
    gwall3.position.x = Math.floor(-225);
    gwall3.position.y = Math.floor(40);
    gwall3.position.z = Math.floor(-149);
    const gwall4 = new THREE.Mesh(glasswall, wallMaterial);
    gwall4.position.x = Math.floor(-225);
    gwall4.position.y = Math.floor(40);
    gwall4.position.z = Math.floor(-241);
    scene.add(gwall1, gwall2, gwall3, gwall4)

    //glass container floor
    const glassG = new THREE.BoxBufferGeometry(50, 2, 150).toNonIndexed();
    const glassGround1 = new THREE.Mesh(glassG, wallMaterial);
    glassGround1.position.x = Math.floor(-225);
    glassGround1.position.y = Math.floor(19);
    glassGround1.position.z = Math.floor(-195);
    const glassGround2 = new THREE.Mesh(glassG, wallMaterial);
    glassGround2.position.x = Math.floor(225);
    glassGround2.position.y = Math.floor(19);
    glassGround2.position.z = Math.floor(-195);
    scene.add(glassGround1, glassGround2)
    var glassgeo = new THREE.BoxBufferGeometry(1, 40, 90);
    var glassmat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        opacity: 0.4,
        transparent: true,

    });
    //Glasses
    var glass1 = new THREE.Mesh(glassgeo, glassmat);
    glass1.position.set(-200, 40, -195)
    scene.add(glass1);
    var glass2 = new THREE.Mesh(glassgeo, glassmat);
    glass2.position.set(200, 40, -195)
    scene.add(glass2);

    //Objects in the Museum
    var loader = new OBJLoader();
    loader.load(
        // resource URL
        './models/table/table.obj',
        // called when resource is loaded
        function(object) {
            object.position.set(120, 0, -375)
            object.scale.set(0.03, 0.03, 0.03)
            object.rotation.x = 0;
            scene.add(object);

            const spotLight3 = new THREE.SpotLight(0x222222, 5, 300, 0.5);
            spotLight3.position.set(120, 60, -375);
            spotLight3.target = object;
            scene.add(spotLight3)

            const fbx = new FBXLoader();
            fbx.load('./models/spotlight/spot.fbx', function(object) {

                object.traverse(function(child) {

                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                object.position.set(120, 48, -375)
                object.scale.set(0.5, 0.5, 0.5)
                scene.add(object);

            })

        },
        // called when loading is in progresses
        function(xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function(error) {

            console.log('An error happened');

        }
    );
    loader.load(
        // resource URL
        './models/table/table.obj',
        // called when resource is loaded
        function(object) {
            object.position.set(-120, 0, -375)
            object.scale.set(0.03, 0.03, 0.03)
            object.rotation.x = 0;
            scene.add(object);

            const spotLight4 = new THREE.SpotLight(0x222222, 5, 300, 0.5);
            spotLight4.position.set(-120, 60, -375);
            spotLight4.target = object;
            scene.add(spotLight4)

            const fbx = new FBXLoader();
            fbx.load('./models/spotlight/spot.fbx', function(object) {

                object.traverse(function(child) {

                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                object.position.set(-120, 48, -375)
                object.scale.set(0.5, 0.5, 0.5)
                scene.add(object);

            })

        },
        // called when loading is in progresses
        function(xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function(error) {

            console.log('An error happened');

        }
    );


    //scene lights
    const obj = new OBJLoader();
    const json = new THREE.ObjectLoader();
    json.load('./models/aqsa.json', function(object) {

        object.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.position.set(-225, 20, -195)
        object.scale.set(0.6, 0.6, 0.6)
        scene.add(object);

    })
    const fbx = new FBXLoader();
    // const dm = new ThreeDMLoader();
    fbx.load('./models/pot.fbx', function(object) {

        object.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.position.set(118, 20, -375)
        object.scale.set(0.6, 0.6, 0.6)
        scene.add(object);

    })
    fbx.load('./models/vase.fbx', function(object) {

        object.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.position.set(225, 20, -180)
        object.scale.set(0.09, 0.09, 0.09)
        scene.add(object);

    })

    obj.load('./models/PLANCHA_ANTIGUA.obj', function(object) {
        object.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.position.set(-121, 20, -375)
        object.scale.set(0.3, 0.3, 0.3)
        object.rotation.x = -90 * Math.PI / 180;
        object.rotation.z = -90 * Math.PI / 180;
        scene.add(object);
    })

    //Text in Start Room
    const textLoader = new THREE.FontLoader();
    textLoader.load('fonts/gentilis_bold.typeface.json', function(font) {

        const matLite = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });

        const message = "Museum Of\n Palestine";
        const shapes = font.generateShapes(message, 12);
        const geometry = new THREE.ShapeBufferGeometry(shapes);
        geometry.computeBoundingBox(); //Defining the position of the text by computing the boundaries
        const xMid = -0.01 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x); //Defining the middle point of the obj on the X axis
        geometry.translate(xMid, 0, 0); //Translating the text according to its Midpoint

        //creating the mesh of the text and giving it the geometry(Shape) and material (White color)
        const text = new THREE.Mesh(geometry, matLite);
        text.position.set(49, 35, -90);
        text.rotation.set(0, -90 * Math.PI / 180, 0)

        const message2 = "Sponsored By";
        const shapes2 = font.generateShapes(message2, 12);
        const geometry2 = new THREE.ShapeBufferGeometry(shapes2);
        geometry2.computeBoundingBox();
        const xMid2 = -0.01 * (geometry2.boundingBox.max.x - geometry2.boundingBox.min.x);
        geometry2.translate(xMid2, 0, 0);
        const text2 = new THREE.Mesh(geometry2, matLite);
        text2.position.set(-60, 40, 18);
        text2.rotation.set(0, -180 * Math.PI / 180, 0)


        const message3 = "Ramiz Rizqallah, Khader Ballout, Lara Shaheen";
        const shapes3 = font.generateShapes(message3, 8);
        const geometry3 = new THREE.ShapeBufferGeometry(shapes3);
        geometry3.computeBoundingBox();
        const xMid3 = -0.01 * (geometry3.boundingBox.max.x - geometry3.boundingBox.min.x);
        geometry3.translate(xMid3, 0, 0);
        const text3 = new THREE.Mesh(geometry3, matLite);
        text3.position.set(15, 20, 18);
        text3.rotation.set(0, -180 * Math.PI / 180, 0)
        scene.add(text, text2, text3);

    });

    //Rendering
    {


        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//Animating the scene and updating graphics information
// including trasnlations, textures, movement, and positions
function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    if (controls.isLocked === true) {

        //Checking for collision
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;
        const intersections = raycaster.intersectObjects(walls);
        const onObject = intersections.length > 0;
        const delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        //Moving Velocities
        if (moveForward || moveBackward) velocity.z -= direction.z * 700.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 700.0 * delta;

        // if (moveUp) controls.getObject().position.y += 100 * delta;
        // if (moveDown) controls.getObject().position.y -= 100 * delta;

        // setTimeout(() => {
        //     console.log("x:   ", controls.getObject().position.x)
        //     console.log("z:   ", controls.getObject().position.z)
        // }, 500);

        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }

        //moving right and jumping
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        if (controls.getObject().position.y > 50) {
            controls.getObject().position.y = 50;
        }
        if (controls.getObject().position.x > 246) {
            controls.getObject().position.x = 246;
        }
        if (controls.getObject().position.x < -246) {
            controls.getObject().position.x = -246;
        }
        if (controls.getObject().position.z < -476) {
            controls.getObject().position.z = -476;
        }
        if (controls.getObject().position.z > 16) {
            controls.getObject().position.z = 16;
        }
        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }

        if (controls.getObject().position.x > 48 && controls.getObject().position.z < 17 && controls.getObject().position.z > -120) {
            controls.getObject().position.x = 48;
        }
        if (controls.getObject().position.x > 194 && controls.getObject().position.z < -120 && controls.getObject().position.z > -270) {
            controls.getObject().position.x = 194;
        }
        if (controls.getObject().position.x < -194 && controls.getObject().position.z < -120 && controls.getObject().position.z > -270) {
            controls.getObject().position.x = -194;
        }
        if (controls.getObject().position.z < -266 && controls.getObject().position.z < -120 && controls.getObject().position.z > -270 && controls.getObject().position.x > 49 && controls.getObject().position.x < 195) {
            controls.getObject().position.z = -266;
        }
        if (controls.getObject().position.z < -266 && controls.getObject().position.z < -120 && controls.getObject().position.z > -270 && controls.getObject().position.x < -49 && controls.getObject().position.x > -195) {
            controls.getObject().position.z = -266;
        }


        if (controls.getObject().position.z > -125 && controls.getObject().position.x > 49 && controls.getObject().position.x < 195 && controls.getObject().position.z < -120 && controls.getObject().position.z > -270) {
            controls.getObject().position.z = -125;
        }
        if (controls.getObject().position.z > -125 && controls.getObject().position.x < -49 && controls.getObject().position.x > -195 && controls.getObject().position.z < -120 && controls.getObject().position.z > -270) {
            controls.getObject().position.z = -125;
        }
        if (controls.getObject().position.z < -114 && controls.getObject().position.x < -49 && controls.getObject().position.x > -247 && controls.getObject().position.z < 17 && controls.getObject().position.z > -120) {
            controls.getObject().position.z = -114;
        }
        if (controls.getObject().position.z > -276 && controls.getObject().position.z < -270 && controls.getObject().position.z > -477 && controls.getObject().position.x < -49 && controls.getObject().position.x > -247) {
            controls.getObject().position.z = -276;
        }
        if (controls.getObject().position.z > -276 && controls.getObject().position.z < -270 && controls.getObject().position.z > -477 && controls.getObject().position.x > 49 && controls.getObject().position.x < 247) {
            controls.getObject().position.z = -276;
        }

    }
    prevTime = time;
    renderer.render(scene, camera);
}