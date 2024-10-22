let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let level = 1;
let points = 0;
let ammo = 10;
let isReloading = false;
let targets = [];
let gunPrice = 100;

document.getElementById('level').innerText = `Level: ${level}`;
document.getElementById('points').innerText = `Points: ${points}`;
document.getElementById('ammo').innerText = `Ammo: ${ammo}`;

document.getElementById('shoot').addEventListener('click', shoot);
document.getElementById('reload').addEventListener('click', reload);
document.getElementById('next-level').addEventListener('click', nextLevel);
document.getElementById('buy-gun').addEventListener('click', buyGun);

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTargets();
    requestAnimationFrame(gameLoop);
}

// Start the game
generateTargets();
gameLoop();

// Target creation
function generateTargets() {
    for (let i = 0; i < level * 2; i++) {
        targets.push({
            x: Math.random() * (canvas.width - 50),
            y: Math.random() * (canvas.height - 200),
            type: Math.random() > 0.5 ? 'car' : 'bottle',
            hit: false
        });
    }
}

// Draw targets on the canvas
function drawTargets() {
    targets.forEach((target) => {
        if (!target.hit) {
            if (target.type === 'car') {
                drawCar(target.x, target.y);
            } else {
                drawBottle(target.x, target.y);
            }
        }
    });
}

function drawCar(x, y) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, 80, 40);
}

function drawBottle(x, y) {
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, 30, 50);
}

// Shooting logic
function shoot() {
    if (ammo > 0 && !isReloading) {
        ammo--;
        document.getElementById('ammo').innerText = `Ammo: ${ammo}`;
        let hitTarget = checkHit();
        if (hitTarget) {
            hitTarget.hit = true;
            points += hitTarget.type === 'car' ? 20 : 10;
            document.getElementById('points').innerText = `Points: ${points}`;
        }
    } else {
        alert('Out of ammo! Reload your gun.');
    }
}

// Check if the shot hit any target
function checkHit() {
    let shotX = Math.random() * canvas.width;
    let shotY = Math.random() * canvas.height;
    return targets.find(target => {
        return !target.hit && shotX > target.x && shotX < target.x + 50 && shotY > target.y && shotY < target.y + 50;
    });
}

// Reload logic
function reload() {
    if (!isReloading) {
        isReloading = true;
        setTimeout(() => {
            ammo = 10;
            document.getElementById('ammo').innerText = `Ammo: ${ammo}`;
            isReloading = false;
        }, 2000); // Reload time
    }
}

// Move to the next level
function nextLevel() {
    if (targets.every(target => target.hit)) {
        level++;
        document.getElementById('level').innerText = `Level: ${level}`;
        targets = [];
        generateTargets();
    } else {
        alert('Clear all targets first!');
    }
}

// Buy new gun logic
function buyGun() {
    if (points >= gunPrice) {
        points -= gunPrice;
        document.getElementById('points').innerText = `Points: ${points}`;
        gunPrice += 100;
        document.getElementById('buy-gun').innerText = `Buy Gun (${gunPrice} points)`;
    } else {
        alert('Not enough points to buy a new gun!');
    }
}
