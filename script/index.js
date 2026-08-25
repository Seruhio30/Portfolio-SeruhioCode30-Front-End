document.addEventListener("DOMContentLoaded", function () {
    setupHamburgerMenu();
    setupAnalyticsClicks();
    setupProjectViewAnalytics();

    const form = document.getElementById("formulario-de-contacto");

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            await enviarCorreo();
        });
    }
});

function trackClarityEvent(eventName) {
    if (!eventName || typeof window.clarity !== "function") {
        return;
    }

    try {
        window.clarity("event", eventName);
    } catch (error) {
        console.warn("Analytics event could not be recorded.");
    }
}

function setupAnalyticsClicks() {
    document.querySelectorAll("[data-analytics-event]").forEach((element) => {
        element.addEventListener("click", () => {
            trackClarityEvent(element.dataset.analyticsEvent);
        });
    });
}

function setupProjectViewAnalytics() {
    const projectElements = document.querySelectorAll("[data-analytics-project-view]");

    if (!projectElements.length || !("IntersectionObserver" in window)) {
        return;
    }

    const viewedProjects = new Set();

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.25) {
                    return;
                }

                const project = entry.target.dataset.analyticsProjectView;

                if (!project || viewedProjects.has(project)) {
                    return;
                }

                viewedProjects.add(project);
                trackClarityEvent(`view_project_${project}`);
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.25
        }
    );

    projectElements.forEach((element) => observer.observe(element));
}

async function enviarCorreo() {
    const loader = document.getElementById("loader");
    const successCheck = document.getElementById("success-check");
    const submitBtn = document.querySelector("button[type='submit']");

    const url = window.location.href;

    const emailData = {
        nombre: document.getElementById("nombre").value,
        remitente: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value || "No proporcionado",
        categoria: document.getElementById("categoria").value,
        contenido: document.getElementById("mensaje").value,
        url: url
    };

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

        await respuesta.text();

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}`);
        }

        trackClarityEvent("contact_success");

        loader.classList.add("hidden");
        successCheck.classList.remove("hidden");

        submitBtn.classList.remove("loading");
        submitBtn.classList.add("success");
        submitBtn.innerText = "Enviado correctamente";

        document.getElementById("formulario-de-contacto").reset();

        setTimeout(() => {
            successCheck.classList.add("hidden");
            submitBtn.classList.remove("success");
            submitBtn.innerText = "Solicitar información";
            submitBtn.disabled = false;
        }, 3000);

    } catch (err) {
        console.error("Error al enviar formulario.");

        loader.classList.add("hidden");
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
        submitBtn.innerText = "Error al enviar";

        alert("Hubo un error al enviar el formulario.");

        setTimeout(() => {
            submitBtn.innerText = "Solicitar información";
        }, 2500);
    }
}

function setupHamburgerMenu() {
    const hamButton = document.querySelector("#hamburger");
    const navigation = document.querySelector("#nav-menu");

    if (!hamButton || !navigation) {
        return;
    }

    function setMenuState(isOpen) {
        navigation.classList.toggle("open", isOpen);
        hamButton.classList.toggle("open", isOpen);
        hamButton.setAttribute("aria-expanded", String(isOpen));
        hamButton.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
        );
    }

    hamButton.addEventListener("click", () => {
        const isOpen = hamButton.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("click", (event) => {
        if (!navigation.contains(event.target) && !hamButton.contains(event.target)) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
            hamButton.focus();
        }
    });
}
