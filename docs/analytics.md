# Portfolio analytics

El portfolio utiliza Microsoft Clarity como única herramienta de analytics.

La instrumentación se encuentra en:

- `index.html`: identifica enlaces y proyectos mediante atributos `data-*`.
- `script/index.js`: envía eventos personalizados a Clarity.

Eventos principales:

- `view_project_*`
- `project_demo_*`
- `project_repository_*`
- `professional_link_*`
- `cta_contact_hero`
- `contact_success`

Los eventos no incluyen nombre, correo electrónico, teléfono, contenido del formulario ni otra PII.

`contact_success` se registra únicamente después de una respuesta exitosa del backend.

Analytics no es una dependencia funcional del sitio: si Clarity está bloqueado o no carga, el portfolio continúa funcionando normalmente.
