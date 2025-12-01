// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const MUSIC_DIR = path.join(__dirname, 'music');

// Variáveis de Estado Global
let currentPlaylist = [];
let currentTrackIndex = -1;
let currentCategory = ''; // Armazena a categoria atual

/**
 * Embaralha um array de forma aleatória (Algoritmo de Fisher-Yates).
 * @param {Array<any>} array - O array a ser embaralhado.
 * @returns {Array<any>} O novo array embaralhado.
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Lê a pasta de músicas e retorna uma lista de arquivos MP3 na categoria especificada.
 * @param {string} category - Nome da subpasta de categoria.
 * @returns {Array<string>} Lista de caminhos de arquivos MP3.
 */
function getCategoryTracks(category) {
    const categoryPath = path.join(MUSIC_DIR, category);
    if (!fs.existsSync(categoryPath) || !fs.statSync(categoryPath).isDirectory()) {
        console.error(`Categoria "${category}" não encontrada.`);
        return [];
    }

    const files = fs.readdirSync(categoryPath);
    return files
        .filter(file => path.extname(file).toLowerCase() === '.mp3')
        .map(file => path.join(category, file));
}

/**
 * Inicializa a playlist com uma categoria e envia a primeira faixa.
 * @param {string} category - A categoria de música a ser usada.
 */
function startPlaylist(category) {
    const allTracks = getCategoryTracks(category);
    if (allTracks.length === 0) {
        currentPlaylist = [];
        currentTrackIndex = -1;
        currentCategory = '';
        console.log(`Não há músicas em ${category}.`);
        return;
    }

    currentCategory = category;
    currentPlaylist = shuffleArray(allTracks);
    currentTrackIndex = 0;

    console.log(`Playlist inicializada com ${currentPlaylist.length} músicas da categoria "${category}".`);
    sendCurrentTrackInfo();
}

/**
 * Avança para a próxima faixa da playlist, reembaralhando se necessário.
 */
function nextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex >= currentPlaylist.length) {
        console.log("Fim da playlist. Reembaralhando e reiniciando...");
        currentPlaylist = shuffleArray(currentPlaylist);
        currentTrackIndex = 0;
    }
    sendCurrentTrackInfo();
}

/**
 * Envia as informações da faixa atual (nome e URL) para todos os clientes via Socket.IO.
 */
function sendCurrentTrackInfo() {
    const trackPath = currentPlaylist[currentTrackIndex];
    if (!trackPath) {
        io.emit('trackUpdate', { name: "Nenhuma música", url: "" });
        return;
    }

    const trackName = path.basename(trackPath, '.mp3');
    const trackUrl = `/music/${trackPath.replace(/\\/g, '/')}`; // URL para o cliente (web)

    console.log(`Enviando faixa: ${trackName} (${trackUrl})`);

    io.emit('trackUpdate', { name: trackName, url: trackUrl });
}

/**
 * Analisa a pasta 'music' e retorna as categorias disponíveis.
 * @returns {Array<string>} Lista de nomes de subpastas.
 */
function getAvailableCategories() {
    if (!fs.existsSync(MUSIC_DIR)) {
        fs.mkdirSync(MUSIC_DIR);
        return [];
    }

    return fs.readdirSync(MUSIC_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

// ------------------------------------------------------------------
// CONFIGURAÇÕES DO EXPRESS
// ------------------------------------------------------------------

// 1. Serve o arquivo HTML principal na rota '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Serve os arquivos estáticos (músicas)
// Isso permite que o browser acesse as músicas em /music/categoria/faixa.mp3
app.use('/music', express.static(MUSIC_DIR));

// 3. Rota de API para obter categorias disponíveis
app.get('/api/categories', (req, res) => {
    res.json({ categories: getAvailableCategories(), current: currentCategory });
});

// ------------------------------------------------------------------
// SOCKET.IO (COMUNICAÇÃO EM TEMPO REAL)
// ------------------------------------------------------------------
io.on('connection', (socket) => {
    console.log('Cliente conectado.');

    // Envia o estado atual da música imediatamente para o novo cliente
    sendCurrentTrackInfo();

    // O cliente solicita a próxima faixa
    socket.on('nextTrack', () => {
        nextTrack();
    });

    // O cliente solicita uma nova categoria para a playlist
    socket.on('changeCategory', (category) => {
        startPlaylist(category);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
    });
});

// ------------------------------------------------------------------
// INICIALIZAÇÃO
// ------------------------------------------------------------------
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log('Disponível para stream (OBS) em:', `http://SUA_IP:${PORT}`);
    console.log('Aguardando o cliente (starting.html) enviar a categoria de música...');
});