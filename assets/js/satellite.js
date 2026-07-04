(function() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 10);
    camera.lookAt(0, 0, 0);

    // إضاءة متطورة
    const ambientLight = new THREE.AmbientLight(0x404066);
    scene.add(ambientLight);
    const dirLight1 = new THREE.DirectionalLight(0x0ECCED, 1.2);
    dirLight1.position.set(1, 1, 2);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0xd4af37, 0.8);
    dirLight2.position.set(-1, -0.5, -1);
    scene.add(dirLight2);

    const group = new THREE.Group();
    scene.add(group);

    // --- بناء قمر صناعي احترافي ---
    const matBody = new THREE.MeshStandardMaterial({ color: 0x0ECCED, roughness: 0.4, metalness: 0.7, emissive: new THREE.Color(0x001122) });
    const matPanel = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8, emissive: new THREE.Color(0x221100) });
    const matAntenna = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.2, metalness: 0.9 });

    // الجسم الرئيسي (اسطوانة)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16), matBody);
    body.position.y = 0;
    group.add(body);

    // الألواح الشمسية (أجنحة)
    const panelGeo = new THREE.BoxGeometry(0.2, 0.8, 1.5);
    const panelLeft = new THREE.Mesh(panelGeo, matPanel);
    panelLeft.position.set(-0.8, 0, 0);
    group.add(panelLeft);
    const panelRight = new THREE.Mesh(panelGeo, matPanel);
    panelRight.position.set(0.8, 0, 0);
    group.add(panelRight);

    // هوائيات
    const antennaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8), matAntenna);
    antennaBase.position.set(0, 1.1, 0);
    group.add(antennaBase);
    const dish = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 8), matAntenna);
    dish.position.set(0, 1.5, 0);
    group.add(dish);

    // إضافة حلقات للزينة
    const ringGeo = new THREE.TorusGeometry(0.6, 0.05, 8, 32);
    const ring = new THREE.Mesh(ringGeo, matAntenna);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.2;
    group.add(ring);

    // تأثير جسيمات حول القمر الصناعي (اختياري)
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 5;
        posArray[i+1] = (Math.random() - 0.5) * 5;
        posArray[i+2] = (Math.random() - 0.5) * 5;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({ size: 0.02, color: 0x0ECCED, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles); // الجسيمات تدور بشكل مستقل

    // حركة الماوس للتحكم بالكاميرا
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    // حلقة الرسوم المتحركة
    function animate() {
        requestAnimationFrame(animate);

        // دوران المجموعة الرئيسية ببطء
        group.rotation.y += 0.002;
        group.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;

        // الجسيمات تدور بشكل أسرع
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;

        // تحريك الكاميرا استجابة للماوس (تأثير parallax خفيف)
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
