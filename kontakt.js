// ===== Kontakt: zpráva se otevře jako rozepsaný e-mail v Gmailu =====

let EMAIL = "zachyhovictus@gmail.com";

let formular = document.getElementById("formular");
let chyba = document.getElementById("chyba");

function ukazChybu(text) {
    chyba.classList.remove("ok");
    chyba.textContent = text;
    animuj(formular, "shake");
}

formular.addEventListener("submit", function (e) {
    e.preventDefault();

    let jmeno = document.getElementById("jmeno").value.trim();
    let email = document.getElementById("email").value.trim();
    let zprava = document.getElementById("zprava").value.trim();

    if (jmeno === "") {
        ukazChybu("Napiš prosím své jméno.");
        document.getElementById("jmeno").focus();
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        ukazChybu("Napiš prosím správný e-mail, ať se ti můžu ozvat.");
        document.getElementById("email").focus();
        return;
    }
    if (zprava === "") {
        ukazChybu("Napiš prosím zprávu.");
        document.getElementById("zprava").focus();
        return;
    }

    let predmet = "Zpráva z webu – " + jmeno;
    let telo = "Ahoj Martine,\n\n" + zprava + "\n\nJméno: " + jmeno + "\nE-mail: " + email;

    let url =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        "&to=" + encodeURIComponent(EMAIL) +
        "&su=" + encodeURIComponent(predmet) +
        "&body=" + encodeURIComponent(telo);

    window.open(url, "_blank", "noopener");

    // Zpráva s odkazem pro případ, že prohlížeč okno zablokoval
    chyba.classList.add("ok");
    chyba.textContent = "Otevřel se rozepsaný e-mail, stačí ho odeslat. Neotevřel se? ";
    let odkaz = document.createElement("a");
    odkaz.href = url;
    odkaz.target = "_blank";
    odkaz.rel = "noopener";
    odkaz.textContent = "Klikni sem.";
    chyba.appendChild(odkaz);

    confetti();
});

// Tlačítka pro kopírování kontaktů
document.querySelectorAll(".kopie").forEach(function (b) {
    b.addEventListener("click", function () {
        let text = b.dataset.copy;

        function hotovo() {
            b.classList.add("ok");
            let puvodni = b.innerHTML;
            b.textContent = "✓";
            setTimeout(function () {
                b.classList.remove("ok");
                b.innerHTML = puvodni;
            }, 1300);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(hotovo, function () {});
        } else {
            let pole = document.createElement("textarea");
            pole.value = text;
            document.body.appendChild(pole);
            pole.select();
            document.execCommand("copy");
            pole.remove();
            hotovo();
        }
    });
});
