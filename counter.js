let pocet = 0;
let best = 0;
let hraj = false;
let konec = false;
let casovac;
let konecCasu;
let zamek = 0;

// Nejlepší výsledek se pamatuje i po zavření stránky
try {
    best = Number(localStorage.getItem("klikaniBest")) || 0;
} catch (e) {
    best = 0;
}
document.getElementById("nejlepsi").textContent = best;

function klik() {
    // Hned po konci hry se chvíli nic neděje, ať hru omylem nerestartuješ
    if (Date.now() < zamek) {
        return;
    }

    if (konec) {
        novaHra();
        return;
    }

    if (!hraj) {
        hraj = true;
        konecCasu = Date.now() + 10000;
        casovac = setInterval(tik, 100);
        document.getElementById("zprava").textContent = "Klikej, ať stihneš co nejvíc!";
    }

    pocet = pocet + 1;
    document.getElementById("cislo").textContent = pocet;
    animuj("cislo", "pop");
}

function tik() {
    let zbyva = (konecCasu - Date.now()) / 1000;

    if (zbyva <= 0) {
        koncihry();
    } else {
        document.getElementById("cas").textContent = zbyva.toFixed(1) + " s";
        document.getElementById("barFill").style.width = (zbyva / 10) * 100 + "%";
        document.getElementById("cas").classList.toggle("spech", zbyva <= 3);
    }
}

function koncihry() {
    clearInterval(casovac);
    hraj = false;
    konec = true;
    zamek = Date.now() + 700;

    document.getElementById("cas").textContent = "0.0 s";
    document.getElementById("cas").classList.remove("spech");
    document.getElementById("barFill").style.width = "0%";
    document.getElementById("barFill").classList.add("konec");
    document.getElementById("tlacitko").textContent = "Hrát znovu";

    let zprava = "Čas vypršel! Naklikal jsi " + pocet + " kliků (" + pocet / 10 + " za sekundu).";

    if (pocet > best) {
        best = pocet;
        document.getElementById("nejlepsi").textContent = best;
        animuj("nejlepsi", "pop");
        try {
            localStorage.setItem("klikaniBest", best);
        } catch (e) {}
        if (pocet > 0) {
            zprava = zprava + " Nový rekord! 🎉";
            confetti();
        }
    }

    document.getElementById("zprava").textContent = zprava;
    animuj("zprava", "pop");
}

function novaHra() {
    pocet = 0;
    konec = false;
    document.getElementById("cislo").textContent = 0;
    document.getElementById("cas").textContent = "10.0 s";
    document.getElementById("barFill").style.width = "100%";
    document.getElementById("barFill").classList.remove("konec");
    document.getElementById("zprava").textContent = "Klikni na tlačítko a hra začne.";
    document.getElementById("tlacitko").textContent = "Klikej!";
}
