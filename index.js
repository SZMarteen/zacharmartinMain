// Hodiny a datum
function clock() {
    let clck = new Date();
    document.getElementById("clock").textContent = clck.toLocaleTimeString("cs-CZ");
    document.getElementById("date").textContent = clck.toLocaleDateString("cs-CZ", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

clock();
setInterval(clock, 1000);

// Psací efekt pod jménem
let psani = document.getElementById("typed");
let veta = psani.textContent;
let pismeno = 0;
psani.textContent = "";

function pis() {
    psani.textContent = veta.slice(0, pismeno);
    if (pismeno < veta.length) {
        pismeno = pismeno + 1;
        setTimeout(pis, 55);
    }
}

setTimeout(pis, 1600);

// Ukazatel scrollování nahoře
let progres = document.getElementById("progress");

function scrolluje() {
    let html = document.documentElement;
    let max = html.scrollHeight - html.clientHeight;
    progres.style.width = (max > 0 ? (html.scrollTop / max) * 100 : 0) + "%";
}

window.addEventListener("scroll", scrolluje, { passive: true });
scrolluje();

// Zvýraznění odkazu v navigaci podle toho, kde jsi
let odkazy = Array.from(document.querySelectorAll(".topnav .links a"));

if ("IntersectionObserver" in window) {
    let sledovac = new IntersectionObserver(function (zaznamy) {
        zaznamy.forEach(function (z) {
            if (z.isIntersecting) {
                odkazy.forEach(function (a) {
                    a.classList.toggle("active", a.getAttribute("href") === "#" + z.target.id);
                });
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    odkazy.forEach(function (a) {
        let sekce = document.querySelector(a.getAttribute("href"));
        if (sekce) {
            sledovac.observe(sekce);
        }
    });
}

// Tlačítko Nahoru vždy plynule odjede na začátek stránky
document.getElementById("nahoru").addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// Čísla v "O mně" se při zobrazení rozjedou od nuly
function spocitej(el) {
    let cil = Number(el.dataset.count);
    let start = performance.now();
    let doba = 1200;
    el.textContent = 0;

    function krok(ted) {
        let p = Math.min((ted - start) / doba, 1);
        el.textContent = Math.round(cil * (1 - Math.pow(1 - p, 3)));
        if (p < 1) {
            requestAnimationFrame(krok);
        }
    }

    requestAnimationFrame(krok);
}

if ("IntersectionObserver" in window) {
    let cisla = new IntersectionObserver(function (zaznamy) {
        zaznamy.forEach(function (z) {
            if (z.isIntersecting) {
                spocitej(z.target);
                cisla.unobserve(z.target);
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll("[data-count]").forEach(function (el) {
        cisla.observe(el);
    });
}
