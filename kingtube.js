const API_KEY = 'AIzaSyC1iHNt2fwoDWbs0_LSoPeRc50JzIjSemk'; 

// 1. Ao carregar a página, preenche a "Home" com o estilo Netflix
window.onload = function() {
    buscarParaCarrossel('Tendências Brasil', 'carousel-trends');
    buscarParaCarrossel('Clipes Musicais Novos', 'carousel-music');
};

// 2. Função de busca (YouTube Style)
async function executarBusca() {
    const termoBusca = document.getElementById('yt-input').value;
    const gridBusca = document.getElementById('search-results'); // Usando o ID correto
    const home = document.getElementById('home-content');

    if (!termoBusca) {
        alert("Digite algo para buscar!");
        return;
    }

    // Troca as telas: Esconde Netflix, mostra Busca
    home.style.display = 'none';
    gridBusca.style.display = 'grid';
    gridBusca.innerHTML = "<p style='padding:20px;'>Buscando vídeos...</p>";

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(termoBusca)}&type=video&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            mostrarResultadosBusca(data.items);
        } else {
            gridBusca.innerHTML = "<p>Nenhum vídeo encontrado.</p>";
        }
    } catch (error) {
        gridBusca.innerHTML = "<p>Erro na conexão.</p>";
    }
}

// 3. Renderiza os resultados da busca (Vertical)
function mostrarResultadosBusca(items) {
    const grid = document.getElementById('search-results');
    let htmlFinal = "";

    items.forEach(video => {
        const id = video.id.videoId;
        const snippet = video.snippet;
        htmlFinal += `
            <div class="video-card">
                <img src="${snippet.thumbnails.high.url}" onclick="prepararDownload('${id}')">
                <div class="video-info">
                    <div class="video-text">
                        <h3>${snippet.title}</h3>
                        <p>${snippet.channelTitle}</p>
                        <button class="btn-dl" onclick="prepararDownload('${id}')">BAIXAR</button>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = htmlFinal;
}

// 4. Funções para os Carroséis (Netflix Style)
async function buscarParaCarrossel(termo, idContainer) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(termo)}&type=video&key=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.items) renderizarCarrossel(data.items, idContainer);
    } catch (err) { console.error(err); }
}

function renderizarCarrossel(items, idContainer) {
    const container = document.getElementById(idContainer);
    let htmlFinal = "";
    items.forEach(video => {
        const id = video.id.videoId;
        const snippet = video.snippet;
        htmlFinal += `
            <div class="nt-card">
                <img src="${snippet.thumbnails.medium.url}" onclick="prepararDownload('${id}')">
                <h3>${snippet.title}</h3>
                <button class="nt-btn-dl" onclick="prepararDownload('${id}')">BAIXAR</button>
            </div>
        `;
    });
    container.innerHTML = htmlFinal;
}

// 5. Download e Atalhos
function prepararDownload(id) {
    const urlVideo = `https://www.youtube.com/watch?v=${id}`;
    window.open(`https://cobalt.tools/?url=${encodeURIComponent(urlVideo)}`, '_blank');
}

document.getElementById('yt-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executarBusca();
});
