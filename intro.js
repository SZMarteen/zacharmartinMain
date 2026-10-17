// Každé písmeno nadpisu se objeví zvlášť
let nadpis = document.querySelector("h1");
let text = nadpis.textContent.trim();
let slova = text.split(" ");
let poradi = 0;

nadpis.setAttribute("aria-label", text);
nadpis.textContent = "";

slova.forEach(function (slovo, i) {
    let obal = document.createElement("span");
    obal.className = "word";
    obal.setAttribute("aria-hidden", "true");

    for (let znak of slovo) {
        let s = document.createElement("span");
        s.className = "ch";
        s.textContent = znak;
        s.style.setProperty("--i", poradi);
        poradi = poradi + 1;
        obal.appendChild(s);
    }

    nadpis.appendChild(obal);

    if (i < slova.length - 1) {
        nadpis.appendChild(document.createTextNode(" "));
        poradi = poradi + 1;
    }
});

// Enter funguje stejně jako kliknutí na Vstoupit
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        document.querySelector(".btn").click();
    }
});
