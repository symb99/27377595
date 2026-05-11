document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ciEstudiante = urlParams.get('ci');

    const perfil = document.createElement('script');
    perfil.src = `${ciEstudiante}/profile.json`;

    perfil.onload = () => {
        llenarDatos(profile, config);     
    };

    document.head.appendChild(perfil);
});

function llenarDatos(datos, texto) {
    const imagen = document.querySelector('.imagen');
    imagen.src = `${datos.ci}/${datos.ci}Small${datos.image_ext}`;
    
    document.querySelector('.nombre').innerText = datos.name;
    document.getElementById('bio').innerText = datos.description || "";

    const fila = (index, valor, dato) => {
        const row = document.querySelectorAll('table tr')[index];
        const labelCell = row.cells[0];
        const celda = row.cells[1];

        const plural = Array.isArray(valor) && valor.length > 1;
        
        if (Array.isArray(texto[dato])) {
            labelCell.innerText = plural ? texto[dato][1] : texto[dato][0];
        } else {
            labelCell.innerText = texto[dato];
        }

        celda.innerText = Array.isArray(valor) ? valor.join(', ') : valor;
    };

    fila(0, datos.color, 'color');
    fila(1, datos.book, 'book');
    fila(2, datos.music, 'music');
    fila(3, datos.video_game, 'video_game');

    const lenguajes = document.querySelectorAll('table tr')[4];
    lenguajes.cells[0].innerHTML = `<strong>${texto.language}:</strong>`;
    lenguajes.cells[1].innerHTML = `<strong>${datos.language.join(', ')}</strong>`;

    const containerCorreo = document.getElementById('contacto');
    const fraseCorreo = texto.email.replace('[email]', '');
    containerCorreo.innerHTML = `${fraseCorreo} <br> <a class="correo" href="mailto:${datos.email}"><strong>${datos.email}</strong></a>`;
}