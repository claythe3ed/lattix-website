// Blueprint Satellite + VES Geological Scan Lines
(function() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let angle = 0;
    let dashOffset = 0;
    let vesOffset = 0; // حركة عمودية لخطوط المسح الجيولوجي
    let time = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        draw();
    }

    window.addEventListener('resize', resize);

    // رسم القمر الصناعي بتصميم Blueprint
    function drawSatellite(scale) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 - 30);
        ctx.rotate(angle);

        ctx.strokeStyle = "rgba(0, 238, 205, 0.85)";
        ctx.lineWidth = 1.8;
        ctx.fillStyle = "rgba(10, 25, 50, 0.5)";

        // الهيكل المركزي
        ctx.beginPath();
        ctx.rect(-30, -30, 60, 60);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(-20, -20, 40, 40);
        ctx.stroke();

        // الألواح الشمسية – الجناح الأيمن
        ctx.beginPath();
        ctx.moveTo(30, -5);
        ctx.lineTo(50, -5);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(50, -20, 60, 40);
        ctx.fill();
        ctx.stroke();
        for (let i = 65; i < 110; i += 15) {
            ctx.beginPath();
            ctx.moveTo(i, -20);
            ctx.lineTo(i, 20);
            ctx.stroke();
        }
        // الجناح الأيسر
        ctx.beginPath();
        ctx.moveTo(-30, -5);
        ctx.lineTo(-50, -5);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(-110, -20, 60, 40);
        ctx.fill();
        ctx.stroke();
        for (let i = -95; i > -50; i += 15) {
            ctx.beginPath();
            ctx.moveTo(i, -20);
            ctx.lineTo(i, 20);
            ctx.stroke();
        }

        // هوائي المسح
        ctx.beginPath();
        ctx.moveTo(0, 30);
        ctx.lineTo(0, 45);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 50, 20, Math.PI, 0, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 45);
        ctx.lineTo(0, 58);
        ctx.stroke();

        // خطوط مسح نبضية
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -dashOffset;
        ctx.strokeStyle = "rgba(0, 238, 205, 0.25)";
        ctx.beginPath();
        ctx.moveTo(-15, 55);
        ctx.lineTo(-40, 150);
        ctx.moveTo(15, 55);
        ctx.lineTo(40, 150);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 50, 25, Math.PI * 0.8, Math.PI * 1.2, false);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.restore();
    }

    // رسم طبقات المياه الجيولوجية (VES Scan Lines)
    function drawVESLayers() {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 + 50);

        const numberOfLayers = 8;
        const layerHeight = 40;
        const maxOpacity = 0.12;

        for (let i = 0; i < numberOfLayers; i++) {
            let y = i * layerHeight + vesOffset;
            // إعادة التدوير: عندما تخرج الطبقة من الأسفل تعود للأعلى
            while (y > canvas.height / 2 + 200) y -= numberOfLayers * layerHeight;
            while (y < -200) y += numberOfLayers * layerHeight;

            const opacity = maxOpacity * (1 - Math.abs(i - numberOfLayers/2) / (numberOfLayers/2));
            ctx.strokeStyle = `rgba(0, 238, 205, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([8, 12]);
            ctx.lineDashOffset = -dashOffset * 0.5;

            ctx.beginPath();
            // رسم خط متموج بسيط
            for (let x = -canvas.width; x < canvas.width; x += 20) {
                const waveY = y + Math.sin(x * 0.005 + time * 0.01) * 8;
                if (x === -canvas.width) ctx.moveTo(x, waveY);
                else ctx.lineTo(x, waveY);
            }
            ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.restore();

        // طبقة إضافية: خطوط كنتور (contour) متقطعة
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 + 80);
        ctx.strokeStyle = "rgba(0, 238, 205, 0.06)";
        ctx.lineWidth = 0.5;
        for (let r = 60; r < 300; r += 40) {
            ctx.beginPath();
            ctx.ellipse(0, 0, r, r * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // أولاً: طبقات VES (تكون خلف القمر الصناعي)
        drawVESLayers();
        // ثانياً: القمر الصناعي (فوق الطبقات)
        drawSatellite(1);
    }

    function animate() {
        angle += 0.0015;
        dashOffset += 0.4;
        vesOffset += 0.3; // حركة بطيئة للأعلى
        time++;
        draw();
        requestAnimationFrame(animate);
    }

    resize();
    animate();
})();
