document.addEventListener("DOMContentLoaded", function () {
    setupHamburgerMenu();

    const form = document.getElementById("formulario-de-contacto");

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            await enviarCorreo();
        });
    }
});

async function enviarCorreo() {
    const loader = document.getElementById("loader");
    const successCheck = document.getElementById("success-check");
    const submitBtn = document.querySelector("button[type='submit']");

    const ip = await obtenerIP();
    const url = window.location.href;

    const emailData = {
        nombre: document.getElementById("nombre").value,
        remitente: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value || "No proporcionado",
        categoria: document.getElementById("categoria").value,
        contenido: document.getElementById("mensaje").value,
        ip: ip,
        url: url
    };

    console.log("Datos enviados al backend:", emailData);

    loader.classList.remove("hidden");
    submitBtn.classList.add("loading");
    submitBtn.innerText = "Enviando...";
    submitBtn.disabled = true;

    try {
        const respuesta = await fetch("https://portafolio-back-end.fly.dev/correo/enviar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailData)
        });

        const textoRespuesta = await respuesta.text();
        console.log("Respuesta del servidor:", textoRespuesta);

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: ${textoRespuesta}`);
        }

        loader.classList.add("hidden");
        successCheck.classList.remove("hidden");

        submitBtn.classList.remove("loading");
        submitBtn.classList.add("success");
        submitBtn.innerText = "Enviado correctamente";

        document.getElementById("formulario-de-contacto").reset();

        setTimeout(() => {
            successCheck.classList.add("hidden");
            submitBtn.classList.remove("success");
            submitBtn.innerText = "Enviar mensaje";
            submitBtn.disabled = false;
        }, 3000);

    } catch (err) {
        console.error("Error al enviar formulario:", err);

        loader.classList.add("hidden");
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
        submitBtn.innerText = "Error al enviar";

        alert("Hubo un error al enviar el formulario.");

        setTimeout(() => {
            submitBtn.innerText = "Enviar mensaje";
        }, 2500);
    }
}

async function obtenerIP() {
    try {
        const r = await fetch("https://api.ipify.org?format=json");
        const data = await r.json();
        return data.ip;
    } catch (error) {
        console.error("Error obteniendo IP:", error);
        return "No disponible";
    }
}

function setupHamburgerMenu() {
    const hamButton = document.querySelector("#hamburger");
    const navigation = document.querySelector("#nav-menu");

    if (hamButton && navigation) {
        hamButton.addEventListener("click", () => {
            navigation.classList.toggle("open");
            hamButton.classList.toggle("open");
        });

        document.addEventListener("click", (event) => {
            if (!navigation.contains(event.target) && !hamButton.contains(event.target)) {
                navigation.classList.remove("open");
                hamButton.classList.remove("open");
            }
        });
    }
}