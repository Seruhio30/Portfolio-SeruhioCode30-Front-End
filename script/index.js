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
    const emailData = {
        nombre: document.getElementById("nombre").value,
        remitente: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value || "No proporcionado",
        categoria: document.getElementById("categoria").value,
        contenido: document.getElementById("mensaje").value
    };

    console.log("📥 Datos enviados:", emailData);

    try {
        const respuesta = await fetch("http://localhost:8080/correo/enviar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailData)
        });

        if (!respuesta.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const resultado = await respuesta.text(); // ✅ Captura correctamente el texto de respuesta
        return resultado; // ✅ Retorna el resultado para `.then()`
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return "Error al enviar el correo."; // ✅ Retorna un texto en caso de error
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