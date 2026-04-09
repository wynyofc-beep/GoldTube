// 1. LISTA DE CHAVES (Adicione seus novos projetos aqui)
const KEYS = [
    'AIzaSyC1iHNt2fwoDWbs0_LSoPeRc50JzIjSemk', // Sua Chave Atual
    'AIzaSyBTSd9fODd9i8Zx1Y6NVeWj4RB8sEvmWFk',           // Nova Chave
    'AIzaSyDnT97Gp1idegtlilmIa3gvXX4ph3hLg7w',           // Outra Chave
    'AIzaSyC7A9c9xlAXzdkPz1cB8RQ-e-abmgdjLiA',
    'AIzaSyD8ohtxU99k7nFlpwlS274uTOgkSy-MgvU',
    'AIzaSyCT13LHYUQ-0lEHyRa1iUV-qpfvqIdLwuw',
    'API_KEY_7',
    'API_KEY_8',
    'API_KEY_9',
    'API_KEY_10',
    'API_KEY_11',
    'API_KEY_12'
];

let currentKeyIndex = 0;

// 2. FUNÇÃO PRINCIPAL DE BUSCA
async function executarBusca() {
    const termoBusca = document.getElementById('yt-input').value;
    const gridBusca = document.getElementById('search-results');
    const hero = document.querySelector('.hero-search');

    if (!termoBusca) {
        alert("Digite algo para buscar!");
        return;
    }

    // Estética Snaptube: Sobe a barra e mostra o grid
    if(hero) hero.style.minHeight = "20vh"; 
    gridBusca.style.display = 'grid';
    gridBusca.innerHTML = "<p style='color:white; padding:20px;'>Buscando no YouTube...</p>";

    // Tenta realizar a busca
    await realizarChamadaAPI(termoBusca);
}

// 3. LOGICA DE CHAMADA COM RODÍZIO DE CHAVES
async function realizarChamadaAPI(termo) {
    const gridBusca = document.getElementById('search-results');
    const API_KEY = KEYS[currentKeyIndex];
    
    // Custo: 100 unidades
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(termo)}&type=video&key=${API_KEY}`;

    try {
        const response = await fetch(url);

        // Se a cota estourou (Erro 403)
        if (response.status === 403) {
            if (currentKeyIndex < KEYS.length - 1) {
                console.warn(`Cota esgotada na Chave ${currentKeyIndex + 1}. Mudando para a próxima...`);
                currentKeyIndex++;
                return realizarChamadaAPI(termo); // Tenta de novo com a nova chave
            } else {
                gridBusca.innerHTML = "<p style='color:red;'>Cota diária esgotada em todas as chaves!</p>";
                return;
            }
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            renderizarVideos(data.items);
        } else {
            gridBusca.innerHTML = "<p style='color:white;'>Nenhum vídeo encontrado.</p>";
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        gridBusca.innerHTML = "<p style='color:white;'>Erro de conexão.</p>";
    }
}

// 4. RENDERIZAÇÃO DOS CARDS NO GRID
function renderizarVideos(items) {
    const grid = document.getElementById('search-results');
    let htmlFinal = "";

    items.forEach(video => {
        const id = video.id.videoId;
        const snippet = video.snippet;
        
        htmlFinal += `
            <div class="video-card">
                <img src="${snippet.thumbnails.high.url}" onclick="prepararDownload('${id}')">
                <div class="video-info">
                    <h3>${snippet.title}</h3>
                    <p>${snippet.channelTitle}</p>
                    <button class="btn-dl" onclick="prepararDownload('${id}')">BAIXAR</button>
                </div>
            </div>
        `;
    });
    grid.innerHTML = htmlFinal;
}

// 5. SISTEMA DE DOWNLOAD (COBALT)
function prepararDownload(id) {
    const urlVideo = `https://www.youtube.com/watch?v=${id}`;
    // Abre o Cobalt Tools para processar o download
    window.open(`https://cobalt.tools/?url=${encodeURIComponent(urlVideo)}`, '_blank');
}

// 6. ATALHO TECLADO (ENTER NO MOBILE)
document.getElementById('yt-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executarBusca();
});
                
