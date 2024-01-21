var lastTimestamp = 0;
var spieler = document.querySelector(".player"),
    spielfeld = document.querySelector(".playground");
(spieler.style.left = "0px"), (spieler.style.top = "0px");
var start_spawn = !1,
    timer_enemy = new Timer(30),
    highScore = localStorage.getItem("highScore") || 0,
    initialEnemySpawnInterval = 30,
    enemySpawnInterval = initialEnemySpawnInterval,
    enemySpawnThreshold = 300,
    enemySpawnThreshold2 = 1e3,
    enemySpawnThreshold3 = 3e3,
    enemySpawnReduction = 10,
    
    healthbar = document.getElementById("healthbar"),
    lives = 6,
    heart_1 = document.getElementById("heart_1"),
    heart_2 = document.getElementById("heart_2"),
    heart_3 = document.getElementById("heart_3"),
    heart_4 = document.getElementById("heart_4"),
    heart_5 = document.getElementById("heart_5"),
    heart_6 = document.getElementById("heart_6"),
    mainSound = new Audio("sound/main.mp3"),
    hurtSound = new Audio("sound/hurt.ogg"),
    shotSound = new Audio("sound/shot.wav"),
    walkSound = new Audio("sound/walk.wav"),
    dangerSound = new Audio("sound/danger.wav"),
    laugtherSound = new Audio("sound/laughter.mp3"),
    enemySound = new Audio("sound/enemy.wav");
function angle(e, t, l, a) {
    var s = Math.atan2(a - t, l - e) * (180 / Math.PI);
    return s < 0 && (s += 360), s;
}
var playerX = parseInt(spieler.style.left),
    playerY = parseInt(spieler.style.top),
    mouseX = mousePositionX(spielfeld),
    mouseY = mousePositionY(spielfeld),
    a = angle(playerX, playerY, mouseX, mouseY),
    punkte = 0,
    punkteanzeige = document.getElementById("points"),
    titlescreen = document.getElementById("title"),
    startButton = document.getElementById("start");
function start_game() {
    (titlescreen.style.display = "none"), (start_spawn = !0), mainSound.play(), laugtherSound.play();
}
startButton.addEventListener("click", start_game);
var punkte_safe = 15,
    canGo = !0,
    delay = 300;
function loop(timestamp) {
    var deltaTime = timestamp - lastTimestamp;
    punkteanzeige.innerHTML = "Punkte : " + punkte;
    var e = document.querySelectorAll(".enemy"),
        t = document.querySelectorAll(".enemy");
    for (var l of t) {
        var a = parseInt(l.style.left),
            s = parseInt(l.style.top),
            r = angle(a, s, parseInt(spieler.style.left), parseInt(spieler.style.top));
        (a += 1.5 * Math.cos((r * Math.PI) / 180)), (s += 1.5 * Math.sin((r * Math.PI) / 180)), (l.style.left = a + "px"), (l.style.top = s + "px"), (l.style.transform = "rotate(" + r + "deg)");
    }
    if (
        (lives > 6 && (lives = 6),
        6 == lives && (heart_6.style.filter = "grayscale(0%)"),
        5 == lives && ((heart_6.style.filter = "grayscale(100%)"), (heart_5.style.filter = "grayscale(0%)")),
        4 == lives && ((heart_5.style.filter = "grayscale(100%)"), (heart_4.style.filter = "grayscale(0%)"), (spielfeld.style.filter = "grayscale(30%)")),
        3 == lives && ((heart_4.style.filter = "grayscale(100%)"), (heart_3.style.filter = "grayscale(0%)"), (spielfeld.style.filter = "grayscale(40%)"), (healthbar.style.backgroundColor = "#d8d8d8")),
        2 == lives && ((heart_3.style.filter = "grayscale(100%)"), (heart_2.style.filter = "grayscale(0%)"), (healthbar.style.backgroundColor = " #570f0f"), (spielfeld.style.filter = "grayscale(77%)")),
        1 == lives && ((heart_2.style.filter = "grayscale(100%)"), (heart_1.style.filter = "grayscale(0%)"), (healthbar.style.backgroundColor = " #b10000"), (spielfeld.style.filter = "grayscale(90%)")),
        0 == lives)
    )
        return (
            (heart_1.style.filter = "grayscale(100%)"),
            (healthbar.style.backgroundColor = " #b10000"),
            (spielfeld.style.filter = "grayscale(100%)"),
            (spielfeld.style.filter = "contrast(150%)"),
            alert("GAME OVER: Du hast " + punkte + " erreicht."),
            void location.reload()
        );
    var n = allCollisions(spieler, e);
    for (var p of n) p.parentNode.removeChild(p), hurtSound.play(), (lives -= 1);
    punkte > highScore && ((highScore = punkte), localStorage.setItem("highScore", highScore)),
        (document.getElementById("highScore").innerHTML = "High Score: " + highScore),
        lives < 6 && punkte == punkte_safe && ((lives += 1), (punkte_safe += 30)),
        keyboard(39) && parseInt(spieler.style.left) < spielfeld.clientWidth - spieler.clientWidth && ((spieler.style.left = parseInt(spieler.style.left) + 6 + "px"), (spieler.style.transform = "scaleX(-1)"), walkSound.play()),
        keyboard(37) && parseInt(spieler.style.left) > 0 && ((spieler.style.left = parseInt(spieler.style.left) - 6 + "px"), (spieler.style.transform = "scaleX(1)"), walkSound.play()),
        keyboard(40) && parseInt(spieler.style.top) < spielfeld.clientHeight - spieler.clientWidth && ((spieler.style.top = parseInt(spieler.style.top) + 6 + "px"), walkSound.play()),
        keyboard(38) && parseInt(spieler.style.top) > 0 && ((spieler.style.top = parseInt(spieler.style.top) - 6 + "px"), walkSound.play()),
        keyboard(68) && parseInt(spieler.style.left) < spielfeld.clientWidth - spieler.clientWidth && ((spieler.style.left = parseInt(spieler.style.left) + 6 + "px"), (spieler.style.transform = "scaleX(-1)"), walkSound.play()),
        keyboard(65) && parseInt(spieler.style.left) > 0 && ((spieler.style.left = parseInt(spieler.style.left) - 6 + "px"), (spieler.style.transform = "scaleX(1)"), walkSound.play()),
        keyboard(83) && parseInt(spieler.style.top) < spielfeld.clientHeight - spieler.clientWidth && ((spieler.style.top = parseInt(spieler.style.top) + 6 + "px"), walkSound.play()),
        keyboard(87) && parseInt(spieler.style.top) > 0 && ((spieler.style.top = parseInt(spieler.style.top) - 6 + "px"), walkSound.play()),
        timer_enemy.ready() &&
            1 == start_spawn &&
            (spawn_enemies(),
            punkte >= enemySpawnThreshold && (enemySpawnInterval -= enemySpawnReduction) < 8 && (enemySpawnInterval = 8),
            punkte >= enemySpawnThreshold2 && (enemySpawnInterval -= enemySpawnReduction) < 1.5 && (enemySpawnInterval = 1.5),
            punkte >= enemySpawnThreshold3 && (enemySpawnInterval -= enemySpawnReduction) < 0.2 && (enemySpawnInterval = 0.2),
            (timer_enemy = new Timer(enemySpawnInterval)));
    mouseClick() &&
        (function () {
            if (canGo) {
                (canGo = !1), shotSound.play();
                var e = angle(parseInt(spieler.style.left), parseInt(spieler.style.top), mousePositionX(spielfeld), mousePositionY(spielfeld)),
                    t = document.createElement("div");
                t.classList.add("shot"),
                    (t.style.left = spieler.style.left),
                    (t.style.top = spieler.style.top),
                    t.setAttribute("data-angle", ((90 - e) * Math.PI) / 180),
                    spielfeld.appendChild(t),
                    setTimeout(function () {
                        canGo = !0;
                    }, delay);
            }
        })();
    var i = document.querySelectorAll(".shot");
    for (var o of i) {
        var y = parseFloat(o.style.left),
            d = parseFloat(o.style.top),
            u = o.getAttribute("data-angle");
        (o.style.left = 12 * Math.sin(u) + y + "px"), (o.style.top = 12 * Math.cos(u) + d + "px");
        var h = allCollisions(o, e);
        for (var p of h) {
            enemySound.play();
            var c = document.createElement("div");
            c.classList.add("explosion"),
                (c.style.left = p.style.left),
                (c.style.top = p.style.top),
                spielfeld.appendChild(c),
                setTimeout(
                    function (e, t, l) {
                        e && e.parentNode && e.parentNode.removeChild(e), t && t.parentNode && t.parentNode.removeChild(t);
                    },
                    100,
                    p,
                    c,
                    o
                ),
                (punkte += 1);
        }
        (parseInt(o.style.left) < 0 || parseInt(o.style.left) > spielfeld.clientWidth - o.clientWidth || parseInt(o.style.top) < 0 || parseInt(o.style.top) > spielfeld.clientHeight - o.clientHeight) && o.parentNode.removeChild(o);
    }
    window.requestAnimationFrame(loop);
}
function spawn_enemies() {
    var e = document.createElement("div");
    (e.classList = "enemy"), spielfeld.appendChild(e);
    var t = document.createElement("img");
    (t.src = "img/drone.png"), e.appendChild(t);
    do {
        (e.style.width = "64px"), (e.style.height = "64px"), (e.style.left = Math.floor(Math.random() * spielfeld.clientWidth - 20) + "px"), (e.style.top = Math.floor(Math.random() * spielfeld.clientHeight - 20) + "px");
    } while (calculateDistance(spieler, e) < 200);
    var l = angle(parseInt(e.style.left), parseInt(e.style.top), parseInt(spieler.style.left), parseInt(spieler.style.top));
    e.setAttribute("data-angle", ((180 - l) * Math.PI) / 180);
}
function calculateDistance(e, t) {
    var l = parseInt(e.style.left),
        a = parseInt(e.style.top),
        s = parseInt(t.style.left),
        r = parseInt(t.style.top);
    return Math.sqrt(Math.pow(s - l, 2) + Math.pow(r - a, 2));
}
window.requestAnimationFrame(loop);
