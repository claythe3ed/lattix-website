(function() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 8; camera.position.y = 0.5;
    scene.add(new THREE.AmbientLight(0x335577));
    const dirLight = new THREE.DirectionalLight(0x0ECCED, 0.8);
    dirLight.position.set(1,1,1);
    scene.add(dirLight);
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);
    const material = new THREE.MeshBasicMaterial({ color: 0x0ECCED, wireframe: true });
    const panelMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true, transparent: true, opacity: 0.5 });
    const parts = [];
    function addPart(mesh, x, y, z, rx=0, ry=0, rz=0) {
        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, rz);
        satelliteGroup.add(mesh);
        parts.push({ mesh, origPos: mesh.position.clone(), displaced: new THREE.Vector3((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4) });
    }
    addPart(new THREE.Mesh(new THREE.BoxGeometry(1.0,0.2,0.6), material), 0,0,0);
    addPart(new THREE.Mesh(new THREE.BoxGeometry(0.7,0.05,0.4), panelMat), -0.9,0,0);
    addPart(new THREE.Mesh(new THREE.BoxGeometry(0.7,0.05,0.4), panelMat), 0.9,0,0);
    addPart(new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.25,0.3,16), material), 0,0.25,0);
    addPart(new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.2,8), material), 0,0.5,0);
    const armGeo = new THREE.CylinderGeometry(0.03,0.03,0.8,6);
    addPart(new THREE.Mesh(armGeo, material), -0.5,0.1,0.3, Math.PI/2,0,0);
    addPart(new THREE.Mesh(armGeo, material), 0.5,0.1,-0.3, Math.PI/2,0,0);
    parts.forEach(p => { p.mesh.userData.origPos = p.origPos.clone(); p.mesh.userData.displaced = p.displaced; });
    let disintegration = 0;
    const target = { val: 0 };
    window.addEventListener('scroll', () => {
        const top = window.scrollY;
        const max = document.body.scrollHeight - window.innerHeight;
        target.val = max > 0 ? Math.min(top / (max * 0.6), 1) : 0;
    });
    function animate() {
        requestAnimationFrame(animate);
        disintegration += (target.val - disintegration) * 0.05;
        parts.forEach(p => {
            const orig = p.mesh.userData.origPos;
            const d = p.mesh.userData.displaced;
            p.mesh.position.lerpVectors(orig, d.clone().add(orig), disintegration);
        });
        satelliteGroup.rotation.y += 0.002;
        satelliteGroup.rotation.x = Math.sin(Date.now()*0.001)*0.05;
        renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
