/// <reference path="Storage.js" />
/// <reference path="main.js" />

function Config() { }

//Animação dos tiles qndo abre a tela
Config.setAnimacaoInicialTiles = function(animar) {
    if (animar == true)
        Storage.animacaoInicialTiles = 1;
    else
        Storage.animacaoInicialTiles = 0;
}

Config.getAnimacaoInicialTiles = function () {
    if (Storage.animacaoInicialTiles && Storage.animacaoInicialTiles == 1)
        return true;
    else
        return false;
}

//Velocidade da animacao
Config.setVelocidadeAnimacaoInicialTiles = function (n) {
    Storage.velocidadeAnimacaoInicialTiles = n;
}

Config.getVelocidadeAnimacaoInicialTiles = function () {
    if (!Storage.velocidadeAnimacaoInicialTiles)
        return 500;
    else
        return parseInt(Storage.velocidadeAnimacaoInicialTiles);
}

//Esconder botão +
Config.setHideAddButton = function (hide) {
    if (hide == true)
        Storage.hideAddButton = 1;
    else
        Storage.hideAddButton = 0;
}

Config.getHideAddButton = function () {
    if (Storage.hideAddButton && Storage.hideAddButton == 1)
        return true;
    else
        return false;
}

//Numero de linhas
Config.setRowNumber = function (n) {
    Storage.rowNumber = n;
}

Config.getRowNumber = function () {
    if (!Storage.rowNumber)
        return 0;
    else
        return parseInt(Storage.rowNumber);
}

//Numero de colunas
Config.setColumnNumber = function (n) {
    Storage.columnNumber = n;
}

Config.getColumnNumber = function () {
    if (!Storage.columnNumber)
        return 0;
    else
        return parseInt(Storage.columnNumber);
}

Config.setSmoothScroll = function (smooth) {
    if (smooth == true)
        Storage.smoothScroll = 1;
    else
        Storage.smoothScroll = 0;
}


Config.getSmoothScroll= function () {
    if (Storage.smoothScroll == undefined)
        return true;
    else if (Storage.smoothScroll == 1)
        return true;
    else
        return false;
}


//Mostrar ultimas abas fechadas
Config.setShowClosedTabs = function (show) {
    if (show == true)
        Storage.showClosedTabs = 1;
    else
        Storage.showClosedTabs = 0;
}

Config.getShowClosedTabs = function () {
    if (Storage.showClosedTabs == undefined)
        return true;
    else if (Storage.showClosedTabs == 1)
        return true;
    else
        return false;
}

//Mostrar bookmarks
Config.setShowBookmarks = function (show) {
    if (show == true)
        Storage.showBookmarks = 1;
    else
        Storage.showBookmarks = 0;
}

Config.getShowBookmarks = function () {
    if (Storage.showBookmarks == undefined)
        return true;
    else if (Storage.showBookmarks == 1)
        return true;
    else
        return false;
}

//Mostrar aplicativos em aba separada
Config.setShowAppsSeparatePage = function (show) {
    if (show == true)
        Storage.showAppsSeparatePage = 1;
    else
        Storage.showAppsSeparatePage = 0;
}

Config.getShowAppsSeparatePage = function () {
    if (Storage.showAppsSeparatePage == undefined)
        return false;
    else if (Storage.showAppsSeparatePage == 1)
        return true;
    else
        return false;
}

//Posição Footer
Config.setFooterPosition = function (p) {
    Storage.footerPosition = p;
}

Config.getFooterPosition = function () {
    if (!Storage.footerPosition)
        return "bottom right";
    else
        return Storage.footerPosition;
}

//Orientação dos tiles ("H"orizontal ou "V"ertical)
Config.getTilesOrientation = function () {
    return "H";
}
