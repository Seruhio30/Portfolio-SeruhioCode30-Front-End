document.addEventListener("DOMContentLoaded", function () {

    setupHamburgerMenu();

    document.getElementById("formulario-de-contacto").addEventListener("submit", async function (event) {
        event.preventDefault(); // ✅ Evita que la página se recargue

        const resultado = await enviarCorreo(); // ✅ Espera el resultado de `enviarCorreo()`
        document.getElementById("resultado").innerText = resultado; // ✅ Muestra el mensaje en pantalla

        setTimeout(() => {
            document.getElementById("resultado").innerText = ""; // ✅ Borra el mensaje después de 5 segundos
        }, 5000); // Tiempo en milisegundos (5000 = 5 segundos)

        this.reset(); //
        // 
        setupHamburgerMenu();
    });
});

async function enviarCorreo() {

    const loader = document.getElementById("loader");
    const successCheck = document.getElementById("success-check");
    const submitBtn = document.querySelector("button[type='submit']");

    // ✅ Obtener IP y URL
    const ip = await obtenerIP();
    const url = window.location.href;

    // ✅ Datos formulario
    const emailData = {
        nombre: document.getElementById("nombre").value,
        remitente: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value || "No proporcionado",
        categoria: document.getElementById("categoria").value,
        contenido: document.getElementById("mensaje").value,
        ip,
        url
    };

    // ✅ Mostrar cargando
    loader.classList.remove("hidden");
    submitBtn.classList.add("loading");
    submitBtn.innerText = "Enviando...";
    submitBtn.disabled = true;

    try {
        const respuesta = await fetch("https://portafolio-back-end.fly.dev/correo/enviar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailData)
        });

        if (!respuesta.ok) throw new Error();

        // ✅ Ocultar loader
        loader.classList.add("hidden");

        // ✅ Mostrar check ✔
        successCheck.classList.remove("hidden");

        // ✅ Cambiar botón a exitoso
        submitBtn.classList.remove("loading");
        submitBtn.classList.add("success");
        submitBtn.innerText = "¡Enviado! ✔";

        // ✅ ✅ LIMPIAR FORM
        document.getElementById("formulario-de-contacto").reset();

        setTimeout(() => {
            // ocultar ✔
            successCheck.classList.add("hidden");

            // Botón vuelve a la normalidad
            submitBtn.classList.remove("success");
            submitBtn.innerText = "Enviar mensaje";
            submitBtn.disabled = false;
        }, 3000);

        return await respuesta.text();

    } catch (err) {

        // ✅ Ocultar loader
        loader.classList.add("hidden");

        // Botón indica error
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
        submitBtn.innerText = "Error ❌";

        alert("❌ Hubo un error al enviar el formulario.");

        setTimeout(() => {
            submitBtn.innerText = "Enviar mensaje";
        }, 2500);

        return "Error";
    }
}
async function obtenerIP() {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const data = await r.json();
    return data.ip;
  } catch {
    return "No disponible";
  }
}



function setupHamburgerMenu() {
    const hamButton = document.querySelector('#hamburger');
    const navigation = document.querySelector('#nav-menu');

    if (hamButton && navigation) {
        hamButton.addEventListener('click', () => {
            navigation.classList.toggle('open');
            hamButton.classList.toggle('open');
        });

        document.addEventListener('click', (event) => {
            if (!navigation.contains(event.target) && !hamButton.contains(event.target)) {
                navigation.classList.remove('open');
                hamButton.classList.remove('open');
            }
        });
    }
}