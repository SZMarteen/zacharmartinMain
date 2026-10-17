let tajneCislo = Math.floor(Math.random() * 100) + 1;
let pokusy = 0;
let konec = false;
let dolni = 1;
let horni = 100;

// Ukazatel, ve kterém rozmezí číslo ještě může být
function aktualizujRozsah() {
    let fill = document.getElementById("rozsahFill");
    fill.style.left = ((dolni - 1) / 99) * 100 + "%";
    fill.style.width = Math.max(((horni - dolni) / 99) * 100, 2) + "%";
    document.getElementById("rozsahText").textContent = "Možné rozmezí: " + dolni + " – " + horni;
}

// Přidá tip do historie
function pridejDoHistorie(tip, znak, trida) {
    let chip = document.createElement("span");
    chip.className = "tip " + trida;
    chip.textContent = tip + " " + znak;
    document.getElementById("historie").appendChild(chip);
}

function hadej() {
    // Po výhře tlačítko spustí novou hru
    if (konec) {
        novaHra();
        return;
    }

    let pole = document.getElementById("tip");
    let tip = Number(pole.value);

    // Kontrola, jestli je číslo v pořádku
    if (pole.value === "" || !Number.isInteger(tip) || tip < 1 || tip > 100) {
        document.getElementById("zprava").textContent = "Napiš celé číslo od 1 do 100.";
        animuj("vstup", "shake");
        return;
    }

    pokusy = pokusy + 1;
    document.getElementById("pokusy").textContent = pokusy;

    // Uprostřed stránky se ukáže číslo, které uživatel napsal
    document.getElementById("cislo").textContent = tip;
    animuj("cislo", "pop");

    if (tip === tajneCislo) {
        document.getElementById("sipka").textContent = "✔";
        document.getElementById("zprava").textContent = "Správně! Trvalo ti to " + pokusy + " pokusů.";
        document.getElementById("tlacitko").textContent = "Nová hra";
        document.getElementById("vysledek").classList.add("vyhra");
        dolni = tip;
        horni = tip;
        aktualizujRozsah();
        pridejDoHistorie(tip, "✔", "ok");
        animuj("sipka", "pop");
        confetti();
        konec = true;
    } else if (tip > tajneCislo) {
        document.getElementById("sipka").textContent = "↓";
        document.getElementById("zprava").textContent = "Moc mnoho, hádej menší číslo.";
        horni = Math.min(horni, tip - 1);
        aktualizujRozsah();
        pridejDoHistorie(tip, "↓", "dolu");
        animuj("sipka", "bounce");
    } else {
        document.getElementById("sipka").textContent = "↑";
        document.getElementById("zprava").textContent = "Moc málo, hádej větší číslo.";
        dolni = Math.max(dolni, tip + 1);
        aktualizujRozsah();
        pridejDoHistorie(tip, "↑", "nahoru");
        animuj("sipka", "bounce");
    }

    pole.value = "";
    pole.focus();
}

function novaHra() {
    tajneCislo = Math.floor(Math.random() * 100) + 1;
    pokusy = 0;
    konec = false;
    dolni = 1;
    horni = 100;
    aktualizujRozsah();
    document.getElementById("historie").textContent = "";
    document.getElementById("vysledek").classList.remove("vyhra");
    document.getElementById("pokusy").textContent = 0;
    document.getElementById("cislo").textContent = "?";
    document.getElementById("sipka").textContent = "";
    document.getElementById("zprava").textContent = "Napiš svůj první tip.";
    document.getElementById("tlacitko").textContent = "Hádej";
    document.getElementById("tip").focus();
}

// Enter funguje stejně jako kliknutí na tlačítko
document.getElementById("tip").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        hadej();
    }
});
