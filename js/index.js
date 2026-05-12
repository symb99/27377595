function logo(dato) {
    const logoH1 = document.querySelector('.logo h1');
    if (logoH1 && dato.site) {
        logoH1.innerHTML = ''; 
        
        const ati = document.createTextNode(dato.site[0]);
        
        const ucv = document.createElement('span');
        ucv.className = 'UCV';
        ucv.innerText = dato.site[1];
        
        const log = document.createTextNode(dato.site[2]);
        
        logoH1.appendChild(ati);
        logoH1.appendChild(ucv);
        logoH1.appendChild(log);
    }

    const busqueda = document.querySelector('.busqueda button');
    if (busqueda) busqueda.innerText = dato.search;

    const input = document.querySelector('.busqueda input');
    if (input) input.placeholder = `${dato.name}...`;

    const footer = document.querySelector('.footer p');
    if (footer) footer.innerText = dato.copyRight;
}


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'ES'; 

    const idioma = document.createElement('script');
    idioma.src = `conf/config${lang.toUpperCase()}.json`;
    document.head.appendChild(idioma);
    
    logo(config);
    
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