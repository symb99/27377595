function logo(dato) {
    const h1 = document.querySelector('.logo h1');
    if (h1 && dato.site) {
        h1.innerHTML = ''; 
        
        const ati = document.createTextNode(dato.site[0]);
        
        const ucv = document.createElement('span');
        ucv.className = 'UCV';
        ucv.innerText = dato.site[1];
        
        const log = document.createTextNode(dato.site[2]);
        
        h1.appendChild(ati);
        h1.appendChild(ucv);
        h1.appendChild(log);
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

    const busquedasHechas = urlParams.get('search');

    const idioma = document.createElement('script');
    idioma.src = `conf/config${lang.toUpperCase()}.json`;
    document.head.appendChild(idioma);
    
    logo(config);


    const busqueda = document.querySelector('.busqueda input');
    const section = document.querySelector('.estudiantes');

    const cargarEstudiantes = (filtrado) => {
        section.innerHTML = '';

        if (filtrado.length === 0) { 
            const query = busqueda.value;
            
            const error = document.createElement('p');
            error.className = 'mensaje-error';
      
            error.innerHTML = `${config.no_results} <strong>${query}</strong>`;
            
            section.appendChild(error);
            return;
        }

        filtrado.forEach(estudiante => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const rutaImagen = `${estudiante.ci}/${estudiante.ci}Small${estudiante.image_ext}`;

            card.innerHTML = `
                <div class="card-image">
                    <a class="link" href="profile.html?ci=${estudiante.ci}&lang=${lang}">
                        <img src="${rutaImagen}" alt="${estudiante.name}">
                    </a>
                </div>
                <div class="card-info">
                    <p>${estudiante.name}</p>
                </div>
            `;

            card.addEventListener('click', () => {
                window.location.href = `profile.html?ci=${estudiante.ci}&lang=${lang}`;
            });

            section.appendChild(card);
        });
    };

    busqueda.addEventListener('input', (e) => {
        const textoBusqueda = e.target.value.toLowerCase();

        const resultados = profiles.filter(estudiante => 
            estudiante.name.toLowerCase().includes(textoBusqueda)
        );

        cargarEstudiantes(resultados);
    });

    cargarEstudiantes(profiles);

    if (busquedasHechas) {
        busqueda.value = busquedasHechas;
        
        const resultados = profiles.filter(estudiante => 
            estudiante.name.toLowerCase().includes(busquedasHechas.toLowerCase())
        );
        
        cargarEstudiantes(resultados);
    } else {
        cargarEstudiantes(profiles);
    }

    busqueda.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase();
        const resultados = profiles.filter(estudiante => 
            estudiante.name.toLowerCase().includes(texto)
        );
        cargarEstudiantes(resultados);
    });
});