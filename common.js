// ===== Společný skript pro celý web =====

(function () {
    document.documentElement.classList.add("js");

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hover = window.matchMedia("(hover: hover)").matches;

    // --- Barevné skvrny na pozadí ---
    var blobs = document.createElement("div");
    blobs.className = "blobs";
    blobs.innerHTML = '<span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span>';
    document.body.prepend(blobs);

    // --- Objevení prvků při scrollování ---
    var prvky = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

    function ukaz(el) {
        el.classList.add("in");
        setTimeout(function () {
            el.classList.add("done");
        }, 1100);
    }

    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (zaznamy) {
            zaznamy.forEach(function (z) {
                if (z.isIntersecting) {
                    ukaz(z.target);
                    io.unobserve(z.target);
                }
            });
        }, { threshold: 0.12 });
        prvky.forEach(function (el) { io.observe(el); });
    } else {
        prvky.forEach(ukaz);
    }

    // --- Světelný efekt za kurzorem a naklánění karet ---
    document.querySelectorAll(".card").forEach(function (card) {
        card.addEventListener("pointermove", function (e) {
            var r = card.getBoundingClientRect();
            card.style.setProperty("--mx", (e.clientX - r.left) + "px");
            card.style.setProperty("--my", (e.clientY - r.top) + "px");

            if (hover && !reduce && card.classList.contains("tilt")) {
                var px = (e.clientX - r.left) / r.width - 0.5;
                var py = (e.clientY - r.top) / r.height - 0.5;
                card.style.setProperty("--rx", (-py * 8) + "deg");
                card.style.setProperty("--ry", (px * 10) + "deg");
            }
        });

        card.addEventListener("pointerleave", function () {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
        });
    });

    // --- Vlnka po kliknutí na tlačítko ---
    document.addEventListener("pointerdown", function (e) {
        var b = e.target.closest("button, .btn");
        if (!b || b.disabled) return;
        var r = b.getBoundingClientRect();
        var velikost = Math.max(r.width, r.height);
        var v = document.createElement("span");
        v.className = "ripple";
        v.style.width = v.style.height = velikost + "px";
        v.style.left = (e.clientX - r.left - velikost / 2) + "px";
        v.style.top = (e.clientY - r.top - velikost / 2) + "px";
        b.appendChild(v);
        setTimeout(function () { v.remove(); }, 650);
    });

    // --- Plynulý přechod mezi stránkami ---
    document.addEventListener("click", function (e) {
        var a = e.target.closest("a");
        if (!a || e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (a.target === "_blank") return;

        var href = a.getAttribute("href");
        if (!href || href.charAt(0) === "#") return;
        if (a.origin !== location.origin) return;

        e.preventDefault();
        document.body.classList.add("leaving");
        setTimeout(function () { location.href = a.href; }, 280);
    });

    // Při návratu tlačítkem Zpět se stránka zase ukáže
    window.addEventListener("pageshow", function () {
        document.body.classList.remove("leaving");
    });

    // --- Konfety (použijí je hry) ---
    window.confetti = function () {
        if (reduce) return;

        var canvas = document.createElement("canvas");
        canvas.id = "confetti";
        document.body.appendChild(canvas);
        var ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var barvy = ["#2A7B9B", "#57C785", "#EDDD53", "#ffffff", "#1f2937"];
        var kousky = [];
        for (var i = 0; i < 140; i++) {
            kousky.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 120,
                y: canvas.height * 0.55,
                vx: (Math.random() - 0.5) * 16,
                vy: -Math.random() * 16 - 4,
                w: 6 + Math.random() * 6,
                h: 8 + Math.random() * 8,
                rot: Math.random() * Math.PI,
                vr: (Math.random() - 0.5) * 0.4,
                barva: barvy[Math.floor(Math.random() * barvy.length)]
            });
        }

        var start = performance.now();

        function snimek(ted) {
            var t = ted - start;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            kousky.forEach(function (k) {
                k.vy += 0.35;
                k.vx *= 0.99;
                k.x += k.vx;
                k.y += k.vy;
                k.rot += k.vr;
                ctx.save();
                ctx.globalAlpha = Math.max(0, 1 - t / 2600);
                ctx.translate(k.x, k.y);
                ctx.rotate(k.rot);
                ctx.fillStyle = k.barva;
                ctx.fillRect(-k.w / 2, -k.h / 2, k.w, k.h);
                ctx.restore();
            });

            if (t < 2600) {
                requestAnimationFrame(snimek);
            } else {
                canvas.remove();
            }
        }

        requestAnimationFrame(snimek);
    };

    // --- Pomocná funkce: znovu spustí CSS animaci na prvku ---
    window.animuj = function (el, trida) {
        if (typeof el === "string") el = document.getElementById(el);
        if (!el) return;
        el.classList.remove(trida);
        void el.offsetWidth;
        el.classList.add(trida);
    };
})();
