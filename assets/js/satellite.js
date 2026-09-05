(function() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const base = 'https://claythe3ed.github.io/lattix-website/';

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.3, 10);
    camera.lookAt(0, 0, 0);

    // إضاءة
    scene.add(new THREE.AmbientLight(0x404060, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // مجموعة الأرض
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    const earthGeometry = new THREE.SphereGeometry(3.5, 64, 64);
    const earthTexture = new THREE.TextureLoader().load(base + 'assets/images/earth_blue_marble.jpg');
    earthTexture.encoding = THREE.sRGBEncoding;
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, -0.5, -12);
    earthGroup.add(earth);

    // محور مداري للقمر الصناعي
    const satellitePivot = new THREE.Group();
    satellitePivot.rotation.z = THREE.MathUtils.degToRad(10); // ميلان مداري خفيف
    scene.add(satellitePivot);

    let satelliteModel = null;
    const satelliteParts = [];

    const loader = new THREE.GLTFLoader();
    loader.load(
        base + 'assets/models/satellite.glb',
        function(gltf) {
            satelliteModel = gltf.scene;
            satelliteModel.scale.set(0.08, 0.08, 0.08);
            const box = new THREE.Box3().setFromObject(satelliteModel);
            const center = box.getCenter(new THREE.Vector3());
            satelliteModel.position.sub(center);
            satelliteModel.position.set(5, 0, 0); // مسافة مدارية أفقية
            satellitePivot.add(satelliteModel);

            satelliteModel.traverse(function(child) {
                if (child.isMesh) {
                    satelliteParts.push({ mesh: child, origPos: child.position.clone() });
                }
            });
        },
        undefined,
        function(error) { console.error('GLB load error:', error); }
    );

    // نجوم
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 500;
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
        starsPos[i] = (Math.random() - 0.5) * 50;
        starsPos[i+1] = (Math.random() - 0.5) * 50;
        starsPos[i+2] = (Math.random() - 0.5) * 50 - 15;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.7 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // تفكك عند التمرير
    let currentDisintegration = 0;
    let targetDisintegration = 0;
    window.addEventListener('scroll', () => {
        const max = document.body.scrollHeight - window.innerHeight;
        targetDisintegration = max > 0 ? Math.min(window.scrollY / (max * 0.4), 1) : 0;
    });

    function animate() {
        requestAnimationFrame(animate);

        currentDisintegration += (targetDisintegration - currentDisintegration) * 0.08;

        // دوران الأرض
        earth.rotation.y += 0.0012;

        // دوران مداري للقمر الصناعي حول المحور Y
        satellitePivot.rotation.y += 0.004;

        // تفكك الأجزاء (إزاحة خفيفة جداً)
        satelliteParts.forEach(part => {
            const orig = part.origPos;
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.3
            );
            part.mesh.position.lerpVectors(orig, orig.clone().add(offset), currentDisintegration);
        });

        stars.rotation.y += 0.0003;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
