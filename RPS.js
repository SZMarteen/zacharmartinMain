let obrazky = {
    kamen: "✊",
    nuzky: "✌️",
    papir: "✋"
};

let nazvy = {
    kamen: "kámen",
    nuzky: "nůžky",
    papir: "papír"
};

let moznosti = ["kamen", "nuzky", "papir"];

// Skóre
let skoreTy = 0;
let skorePc = 0;
let skoreRemiza = 0;

// Aby šlo hrát jen jedno kolo najednou
let bezi = false;

function nastavTlacitka(vypnout) {
    document.querySelectorAll("#vstup .row button").forEach(function (b) {
        b.disabled = vypnout;
    });
}

function hraj(tvojeVolba) {
    if (bezi) {
        return;
    }
    bezi = true;
    nastavTlacitka(true);

    // Vyčistí zvýraznění z minulého kola
    document.getElementById("tvujBox").classList.remove("vyhra", "prohra");
    document.getElementById("pocitacBox").classList.remove("vyhra", "prohra");

    // Tvoje volba se ukáže hned
    document.getElementById("tvuj").textContent = obrazky[tvojeVolba];
    animuj("tvuj", "pop");

    document.getElementById("zprava").textContent = "Počítač přemýšlí…";
    document.getElementById("pocitac").classList.add("mixuje");

    // Počítač chvíli střídá obrázky a pak ukáže svou volbu
    let kolo = 0;
    let michani = setInterval(function () {
        document.getElementById("pocitac").textContent = obrazky[moznosti[kolo % 3]];
        kolo = kolo + 1;

        if (kolo >= 9) {
            clearInterval(michani);
            document.getElementById("pocitac").classList.remove("mixuje");
            vyhodnot(tvojeVolba);
        }
    }, 90);
}

function vyhodnot(tvojeVolba) {
    let pocitacVolba = moznosti[Math.floor(Math.random() * 3)];

    // Ukáže obě volby
    document.getElementById("tvuj").textContent = obrazky[tvojeVolba];
    document.getElementById("pocitac").textContent = obrazky[pocitacVolba];
    animuj("pocitac", "pop");

    let zprava = document.getElementById("zprava");
    let tvujBox = document.getElementById("tvujBox");
    let pocitacBox = document.getElementById("pocitacBox");
    let zmena;

    if (tvojeVolba === pocitacVolba) {
        zprava.textContent = "Remíza, oba jste vybrali " + nazvy[tvojeVolba] + ".";
        skoreRemiza = skoreRemiza + 1;
        zmena = "skoreRemiza";
    } else if (
        (tvojeVolba === "kamen" && pocitacVolba === "nuzky") ||
        (tvojeVolba === "nuzky" && pocitacVolba === "papir") ||
        (tvojeVolba === "papir" && pocitacVolba === "kamen")
    ) {
        zprava.textContent = "Vyhrál jsi! " + nazvy[tvojeVolba] + " porazí " + nazvy[pocitacVolba] + ".";
        skoreTy = skoreTy + 1;
        zmena = "skoreTy";
        tvujBox.classList.add("vyhra");
        pocitacBox.classList.add("prohra");
        confetti();
    } else {
        zprava.textContent = "Prohrál jsi. " + nazvy[pocitacVolba] + " porazí " + nazvy[tvojeVolba] + ".";
        skorePc = skorePc + 1;
        zmena = "skorePc";
        pocitacBox.classList.add("vyhra");
        tvujBox.classList.add("prohra");
    }

    animuj("zprava", "pop");

    // Aktualizuje skóre na stránce
    zobrazSkore();
    animuj(zmena, "pop");

    bezi = false;
    nastavTlacitka(false);
}

function zobrazSkore() {
    document.getElementById("skoreTy").textContent = skoreTy;
    document.getElementById("skorePc").textContent = skorePc;
    document.getElementById("skoreRemiza").textContent = skoreRemiza;
}

function resetSkore() {
    if (bezi) {
        return;
    }
    skoreTy = 0;
    skorePc = 0;
    skoreRemiza = 0;
    zobrazSkore();
    document.getElementById("tvuj").textContent = "❔";
    document.getElementById("pocitac").textContent = "❔";
    document.getElementById("tvujBox").classList.remove("vyhra", "prohra");
    document.getElementById("pocitacBox").classList.remove("vyhra", "prohra");
    document.getElementById("zprava").textContent = "Vyber si, čím budeš hrát.";
}
