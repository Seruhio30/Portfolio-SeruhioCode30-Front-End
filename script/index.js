document.addEventListener("DOMContentLoaded", function () {
    // Espera a que el HTML esté completamente cargado antes de buscar elementos del DOM
    setupHamburgerMenu();

    // Intercepta el envío del formulario para manejarlo con JavaScript
    document
        .getElementById("formulario-de-contacto")
        .addEventListener("submit", async function (event) {
            event.preventDefault(); // Evita el envío tradicional del formulario

            // Ejecuta el envío al backend y muestra el resultado en pantalla
            const resultado = await enviarCorreo();
            document.getElementById("resultado").innerText = resultado;

            // Limpia el mensaje visual después de unos segundos
            setTimeout(() => {
                const resultadoEl = document.getElementById("resultado");
                if (resultadoEl) resultadoEl.innerText = "";
            }, 5000);
        });
});

async function enviarCorreo() {
    // Elementos visuales usados para feedback al usuario
    const loader = document.getElementById("loader");
    const successCheck = document.getElementById("success-check");
    const submitBtn = document.querySelector("button[type='submit']");

    // Datos extra que acompañan el formulario
    const ip = await obtenerIP();
    const url = window.location.href;

    // Construye el objeto que se enviará al backend
    const emailData = {
        nombre: document.getElementById("nombre").value,
        remitente: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value || "No proporcionado",
        categoria: document.getElementById("categoria").value,
        contenido: document.getElementById("mensaje").value,
        ip: ip,
        url: url
    };

    // Útil para depuración: permite verificar exactamente qué datos salen del front
    console.log("Datos enviados al backend:", emailData);

    // Estado visual mientras la petición está en proceso
    loader.classList.remove("hidden");
    submitBtn.classList.add("loading");
    submitBtn.innerText = "Enviando...";
    submitBtn.disabled = true;

    try {
        // Envía el formulario al backend como JSON
        const respuesta = await fetch("https://portafolio-back-end.fly.dev/correo/enviar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailData)
        });

        // Lee la respuesta del servidor para depuración o confirmación
        const textoRespuesta = await respuesta.text();
        console.log("Respuesta del servidor:", textoRespuesta);

        // Si el servidor responde con error, se fuerza la salida al catch
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: ${textoRespuesta}`);
        }

        // Actualiza la interfaz cuando el envío fue exitoso
        loader.classList.add("hidden");
        successCheck.classList.remove("hidden");

        submitBtn.classList.remove("loading");
        submitBtn.classList.add("success");
        submitBtn.innerText = "Enviado correctamente";

        // Limpia el formulario solo si el envío realmente funcionó
        document.getElementById("formulario-de-contacto").reset();

        // Restaura el botón a su estado normal
        setTimeout(() => {
            successCheck.classList.add("hidden");
            submitBtn.classList.remove("success");
            submitBtn.innerText = "Enviar mensaje";
            submitBtn.disabled = false;
        }, 3000);

        return textoRespuesta;

    } catch (err) {
        // Muestra en consola el detalle del error para facilitar depuración
        console.error("Error al enviar formulario:", err);

        // Estado visual en caso de fallo
        loader.classList.add("hidden");
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
        submitBtn.innerText = "Error al enviar";

        alert("Hubo un error al enviar el formulario.");

        // Restaura el texto del botón después del error
        setTimeout(() => {
            submitBtn.innerText = "Enviar mensaje";
        }, 2500);

        return "Error al enviar el formulario";
    }
}

async function obtenerIP() {
    try {
        // Consulta un servicio externo para obtener la IP pública del usuario
        const r = await fetch("https://api.ipify.org?format=json");
        const data = await r.json();
        return data.ip;
    } catch (error) {
        // Si falla, no bloquea el envío del formulario
        console.error("Error obteniendo IP:", error);
        return "No disponible";
    }
}

function setupHamburgerMenu() {
    const hamButton = document.querySelector("#hamburger");
    const navigation = document.querySelector("#nav-menu");

    // Solo agrega funcionalidad si ambos elementos existen en el DOM
    if (hamButton && navigation) {
        // Abre o cierra el menú al tocar el botón hamburguesa
        hamButton.addEventListener("click", () => {
            navigation.classList.toggle("open");
            hamButton.classList.toggle("open");
        });

        // Cierra el menú si el usuario hace click fuera de él
        document.addEventListener("click", (event) => {
            if (!navigation.contains(event.target) && !hamButton.contains(event.target)) {
                navigation.classList.remove("open");
                hamButton.classList.remove("open");
            }
        });
    }
}