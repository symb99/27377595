
document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.estudiantes');

    section.innerHTML = '';

    profiles.forEach(estudiante => {
        const card = document.createElement('div');
        card.className = 'card';

        const nombreImagen = `${estudiante.ci}Small${estudiante.image_ext}`;
        const rutaImagen = `${estudiante.ci}/${nombreImagen}`;

        card.innerHTML = `
            <div class="card-image">
                <a class="link" href="profile.html?ci=${estudiante.ci}">
                    <img src="${rutaImagen}" alt="${estudiante.name}">
                </a>
            </div>
            <div class="card-info">
                <p>${estudiante.name}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `profile.html?ci=${estudiante.ci}`;
        });

        section.appendChild(card);
    });
});