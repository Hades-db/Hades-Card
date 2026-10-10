const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
let planets = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initSpace();
}

function initSpace() {
    stars = [];
    planets = [];

    const starCount = Math.floor(canvas.width / 4);
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            twinkleSpeed: 0.005 + Math.random() * 0.01, 
            opacity: Math.random(),
            speedX: (Math.random() - 0.5) * 0.05,
            speedY: (Math.random() - 0.5) * 0.05
        });
    }

    planets = [
        {
            x: canvas.width * 0.2,
            y: canvas.height * 0.3,
            radius: 35,
            baseColor: '#2b446c',
            stripeColor: '#1d2e4a',
            glowColor: 'rgba(43, 68, 108, 0.4)',
            dx: 0.04, dy: -0.02,
            hasRings: true,
            ringColor: 'rgba(180, 200, 240, 0.15)',
            rotation: 0.3
        },
        {
            x: canvas.width * 0.7,
            y: canvas.height * 0.2,
            radius: 50,
            baseColor: '#8a5237',
            stripeColor: '#5c3521',
            glowColor: 'rgba(138, 82, 55, 0.3)',
            dx: -0.03, dy: 0.03,
            hasRings: false,
            rotation: -0.2
        },
        {
            x: canvas.width * 0.5,
            y: canvas.height * 0.7,
            radius: 25,
            baseColor: '#416653',
            stripeColor: '#273d32',
            glowColor: 'rgba(65, 102, 83, 0.5)',
            dx: 0.02, dy: 0.04,
            hasRings: false,
            rotation: 0.5
        }
    ];
}

function animate() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#030308');
    gradient.addColorStop(0.5, '#060613');
    gradient.addColorStop(1, '#0a0a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0) star.twinkleSpeed = -star.twinkleSpeed;
        
        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });

    planets.forEach(planet => {
        planet.x += planet.dx;
        planet.y += planet.dy;

        if (planet.x - planet.radius < 0 || planet.x + planet.radius > canvas.width) planet.dx = -planet.dx;
        if (planet.y - planet.radius < 0 || planet.y + planet.radius > canvas.height) planet.dy = -planet.dy;

        ctx.save();

        const glow = ctx.createRadialGradient(planet.x, planet.y, planet.radius * 0.8, planet.x, planet.y, planet.radius * 1.8);
        glow.addColorStop(0, planet.glowColor);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = planet.baseColor;
        ctx.fillRect(planet.x - planet.radius, planet.y - planet.radius, planet.radius * 2, planet.radius * 2);

        ctx.fillStyle = planet.stripeColor;
        ctx.save();
        ctx.translate(planet.x, planet.y);
        ctx.rotate(planet.rotation);
        
        const stripeWidths = [0.15, 0.1, 0.25, 0.08];
        const stripePositions = [-0.5, -0.2, 0.1, 0.4];
        
        stripePositions.forEach((pos, idx) => {
            ctx.fillRect(
                -planet.radius * 1.5, 
                planet.radius * pos, 
                planet.radius * 3, 
                planet.radius * stripeWidths[idx]
            );
        });
        ctx.restore();

        const shadowGrad = ctx.createRadialGradient(
            planet.x - planet.radius * 0.3, planet.y - planet.radius * 0.3, planet.radius * 0.2,
            planet.x, planet.y, planet.radius
        );
        shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
        shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        if (planet.hasRings) {
            ctx.save();
            ctx.translate(planet.x, planet.y);
            ctx.rotate(planet.rotation + 0.2);
            ctx.scale(2.2, 0.4);
            
            ctx.strokeStyle = planet.ringColor;
            ctx.lineWidth = planet.radius * 0.2;
            ctx.beginPath();
            ctx.arc(0, 0, planet.radius * 1.1, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.restore();
        }
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animate();