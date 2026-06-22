let currentLang = 'ES';
let configData = {};
let allProfiles = [];

let vistaActual = { tipo: 'listado', ci: null };

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentLang = urlParams.get('lang') || 'ES';

    inicializarSPA();

    document.addEventListener('click', (e) => {
        if (e.target.id === 'btn-lang-es' && currentLang !== 'ES') {
            currentLang = 'ES';
            inicializarSPA();
        }
        if (e.target.id === 'btn-lang-en' && currentLang !== 'EN') {
            currentLang = 'EN';
            inicializarSPA();
        }
    });

    document.getElementById('btn-inicio').addEventListener('click', (e) => {
        e.preventDefault();
        const input = document.getElementById('input-buscar');
        if (input) input.value = '';
        mostrarListado(allProfiles);
    });

    const menu = document.querySelector('.menu-icon');
    const header = document.querySelector('.header');
    if (menu && header) {
        menu.addEventListener('click', () => header.classList.toggle('open'));
    }
});

function inicializarSPA() {
    fetch(`index.py?action=get_config&lang=${currentLang}`)
        .then(res => res.json())
        .then(config => {
            configData = config;
            aplicarTextosGlobales();
            
            return fetch('index.py?action=get_index');
        })
        .then(res => res.json())
        .then(profiles => {
            allProfiles = profiles;
            
            if (vistaActual.tipo === 'perfil' && vistaActual.ci) {
                cargarPerfilEstudiante(vistaActual.ci);
            } else {
                mostrarListado(allProfiles);
            }
            configurarBusqueda();
        })
        .catch(err => console.error("Error:", err));
}

function aplicarTextosGlobales() {
    const h1 = document.querySelector('.logo h1');
    if (h1 && configData.site) {
        h1.innerHTML = `${configData.site[0]}<span class="UCV">${configData.site[1]}</span>${configData.site[2]}`;
    }
    if (configData.search) document.getElementById('btn-buscar').innerText = configData.search;
    if (configData.name) document.getElementById('input-buscar').placeholder = `${configData.name}...`;
    if (configData.copyRight) document.querySelector('.footer p').innerText = configData.copyRight;
    
    const textoPerfil = document.querySelector('.texto-perfil');
    if (textoPerfil) {
        textoPerfil.innerText = currentLang === 'EN' ? 'My Profile' : 'Mi Perfil';
    }
}

function mostrarListado(estudiantes) {
    vistaActual = { tipo: 'listado', ci: null };
    const contenedor = document.getElementById('spa-content');
    
    const tituloSemestre = configData.semester || "Semestre 2026-1";

    let html = `
        <div class="contenedor">
            <div class="sub-header-container">
                <h2 class="titulo">${tituloSemestre}</h2>
                <div class="idiomas-content">
                    <span id="btn-lang-es" class="lang-btn ${currentLang === 'ES' ? 'active' : ''}">ES</span>
                    <span class="lang-divider">|</span>
                    <span id="btn-lang-en" class="lang-btn ${currentLang === 'EN' ? 'active' : ''}">EN</span>
                </div>
            </div>
            
            <section class="estudiantes">
    `;

    if (estudiantes.length === 0) {
        const query = document.getElementById('input-buscar').value;
        html += `<p class="mensaje-error" style="padding: 20px; width: 100%; text-align: center;">${configData.no_results || 'No hay resultados para'} <strong>${query}</strong></p>`;
    } else {
        estudiantes.forEach(est => {
            const rutaImagen = `${est.ci}/${est.ci}Small${est.image_ext}`;
            html += `
                <div class="card" data-ci="${est.ci}">
                    <div class="card-image">
                        <img src="${rutaImagen}" alt="${est.name}">
                    </div>
                    <div class="card-info">
                        <p>${est.name}</p>
                    </div>
                </div>
            `;
        });
    }

    html += `</section></div>`;
    contenedor.innerHTML = html;

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const ci = card.getAttribute('data-ci');
            cargarPerfilEstudiante(ci);
        });
    });
}

function cargarPerfilEstudiante(ci) {
    vistaActual = { tipo: 'perfil', ci: ci };
    fetch(`index.py?action=get_profile&ci=${ci}`)
        .then(res => res.json())
        .then(profile => {
            mostrarPerfil(profile);
        })
        .catch(err => console.error("Error al cargar perfil:", err));
}

function mostrarPerfil(datos) {
    const contenedor = document.getElementById('spa-content');
    const rutaImagen = `${datos.ci}/${datos.ci}Small${datos.image_ext}`;
    
    const extraerLabel = (key, valor) => {
        const plural = Array.isArray(valor) && valor.length > 1;
        if (Array.isArray(configData[key])) {
            return plural ? configData[key][1] : configData[key][0];
        }
        return configData[key] || key;
    };

    const fraseCorreo = (configData.email || "").replace('[email]', '');

    contenedor.innerHTML = `
        <div class="sub-header-container" style="margin-bottom: 10px;">
            <h2 class="titulo" style="visibility: hidden; height: 0; margin: 0;"></h2> <div class="idiomas-content">
                <span id="btn-lang-es" class="lang-btn ${currentLang === 'ES' ? 'active' : ''}">ES</span>
                <span class="lang-divider">|</span>
                <span id="btn-lang-en" class="lang-btn ${currentLang === 'EN' ? 'active' : ''}">EN</span>
            </div>
        </div>

        <section>
            <div class="contenido">
                <div class="contenido-imagen">
                    <img src="${rutaImagen}" class="imagen">
                </div>
                <div class="contenido-texto">
                    <h1 class="nombre">${datos.name}</h1>
                    <p id="bio" class="texto-principal">${datos.description || ""}</p>
                    
                    <table class="texto-principal">
                        <tr><td class="label">${extraerLabel('color', datos.color)}</td><td class="value">${Array.isArray(datos.color) ? datos.color.join(', ') : datos.color}</td></tr>
                        <tr><td class="label">${extraerLabel('book', datos.book)}</td><td class="value">${Array.isArray(datos.book) ? datos.book.join(', ') : datos.book}</td></tr>
                        <tr><td class="label">${extraerLabel('music', datos.music)}</td><td class="value">${Array.isArray(datos.music) ? datos.music.join(', ') : datos.music}</td></tr>
                        <tr><td class="label">${extraerLabel('video_game', datos.video_game)}</td><td class="value">${Array.isArray(datos.video_game) ? datos.video_game.join(', ') : datos.video_game}</td></tr>
                        <tr>
                            <td class="label">${configData.language || 'Idiomas'}:</td>
                            <td class="value"><strong>${datos.language.join(', ')}</strong></td>
                        </tr>
                    </table>
                    
                    <p class="texto-principal" id="contacto">
                        ${fraseCorreo} <br> 
                        <a class="correo" href="mailto:${datos.email}"><strong>${datos.email}</strong></a>
                    </p>
                </div>
            </div>
        </section>
    `;
}

function configurarBusqueda() {
    const input = document.getElementById('input-buscar');
    if (!input) return;

    input.addEventListener('input', () => {
        if (vistaActual.tipo === 'listado') {
            const texto = input.value.toLowerCase();
            const filtrados = allProfiles.filter(est => est.name.toLowerCase().includes(texto));
            mostrarListado(filtrados);
        }
    });
}