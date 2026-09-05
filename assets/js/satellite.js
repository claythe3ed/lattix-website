(function() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // استخدام المسار الأساسي للموقع (لضمان عمل الروابط من أي صفحة)
    const base = 'https://claythe3ed.github.io/lattix-website/';

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.5, 8);

    // إضاءة
    scene.add(new THREE.AmbientLight(0x404060, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.6);
    rimLight.position.set(-3, -1, -2);
    scene.add(rimLight);

    // مجموعة القمر الصناعي
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);
    const satelliteParts = [];

    // تحميل GLB
    const loader = new THREE.GLTFLoader();
    loader.load(
        base + 'assets/models/satellite.glb',
        function(gltf) {
            const model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5);
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            satelliteGroup.add(model);
            model.traverse(function(child) {
                if (child.isMesh) {
                    satelliteParts.push({
                        mesh: child,
                        origPos: child.position.clone()
                    });
                }
            });
        },
        undefined,
        function(error) {
            console.error('GLB load error:', error);
        }
    );

    // خلفية الأرض
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    const earthGeometry = new THREE.SphereGeometry(3.5, 64, 64);
    const earthTexture = new THREE.TextureLoader().load(base + 'assets/images/earth_blue_marble.jpg');
    earthTexture.encoding = THREE.sRGBEncoding;
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, -1, -8);
    earthGroup.add(earth);

    // نجوم
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 500;
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
        starsPositions[i] = (Math.random() - 0.5) * 40;
        starsPositions[i+1] = (Math.random() - 0.5) * 40;
        starsPositions[i+2] = (Math.random() - 0.5) * 40 - 10;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.7 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // تفاعل التمرير
    let currentDisintegration = 0;
    let targetDisintegration = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        targetDisintegration = maxScroll > 0 ? Math.min(scrollY / (maxScroll * 0.4), 1) : 0;
    });

    function animate() {
        requestAnimationFrame(animate);

        currentDisintegration += (targetDisintegration - currentDisintegration) * 0.08;

        // دوران القمر الصناعي
        satelliteGroup.rotation.y += 0.003;
        satelliteGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;

        // تفكك الأجزاء
        satelliteParts.forEach(part => {
            const orig = part.origPos;
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            part.mesh.position.lerpVectors(orig, orig.clone().add(offset), currentDisintegration);
        });

        // دوران الأرض والنجوم
        earth.rotation.y += 0.0008;
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
