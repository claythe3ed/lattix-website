// Blueprint Satellite - 2D Canvas, lightweight, no Three.js
(function() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let angle = 0;
    let dashOffset = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        draw();
    }

    window.addEventListener('resize', resize);

    // رسم القمر الصناعي بتصميم Blueprint متطور
    function drawSatellite(scale) {
        ctx.save();
        // التمركز حول منتصف الشاشة
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);

        // ضبط استايل الخطوط (نمط مخططات الـ Blueprint)
        ctx.strokeStyle = "rgba(0, 238, 205, 0.85)"; // لون سيان مضيء
        ctx.lineWidth = 1.8;
        ctx.fillStyle = "rgba(10, 25, 50, 0.5)";

        // 1. الهيكل المركزي
        ctx.beginPath();
        ctx.rect(-30, -30, 60, 60);
        ctx.fill();
        ctx.stroke();
        // إطار داخلي
        ctx.beginPath();
        ctx.rect(-20, -20, 40, 40);
        ctx.stroke();

        // 2. الألواح الشمسية
        // الجناح الأيمن
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

        // 3. هوائي المسح (طبق مخروطي)
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

        // 4. خطوط مسح نبضية (تأثير المسح الجيوفيزيائي)
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -dashOffset; // تحريك الخطوط
        ctx.strokeStyle = "rgba(0, 238, 205, 0.3)";
        ctx.beginPath();
        ctx.moveTo(-15, 55);
        ctx.lineTo(-40, 150);
        ctx.moveTo(15, 55);
        ctx.lineTo(40, 150);
        ctx.stroke();

        // خط مسح أفقي للطبق
        ctx.beginPath();
        ctx.arc(0, 50, 25, Math.PI * 0.8, Math.PI * 1.2, false);
        ctx.stroke();

        // إعادة تعيين الخطوط الصلبة
        ctx.setLineDash([]);
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSatellite(1);
    }

    // حلقة الأنيميشن: دوران بطيء + تحريك خطوط المسح
    function animate() {
        angle += 0.002; // دوران بطيء جداً
        dashOffset += 0.3; // تحريك الخطوط المتقطعة
        draw();
        requestAnimationFrame(animate);
    }

    resize();
    animate();
})();
