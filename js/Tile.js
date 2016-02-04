/// <reference path="Config.js" />
/// <reference path="Storage.js" />
/// <reference path="jquery-1.8.2.js" />

//Método de instância usa o prototype
//Método static não usa prototype

var _tiles = new Array();
var TILES = "tiles";
var ORDEM = "ordem";
var TILES_PCT = "tilesSize";
var TILE_SIZE = 140;

//Declaração da classe e contrutor;
function Tile(tileJson) {
    if (tileJson) {
        this.Id = tileJson.Id;
        this.Nome = tileJson.Nome;
        this.Tamanho = tileJson.Tamanho;
        this.Url = tileJson.Url;
        this.Imagem = tileJson.Imagem;
        this.Cor = tileJson.Cor;
        this.CorFonte = tileJson.CorFonte;
        this.RssUrl = tileJson.RssUrl;
        this.LastSeenFeedTitle = tileJson.LastSeenFeedTitle;
        this.LastFeedTitle = tileJson.LastFeedTitle;
        this.LastFeedUrl = tileJson.LastFeedUrl;
    } else {
        this.Id = 0;
        this.Nome = "";
        this.Tamanho = 1;
        this.Url = "";
        this.Imagem = "";
        this.Cor = "";
        this.CorFonte = "";
        this.RssUrl = "";
        this.LastFeedTitle = "";
        this.LastFeedUrl = "";
    }
}

Tile.TileSize1 = function () {
    return Math.floor(TILE_SIZE * (Tile.getTilesPct() / 100));
}

Tile.TileSize2 = function () {
    return (Tile.TileSize1() * 2) + 4;
}

Tile.setTilesPct = function (pct) {
    Storage.tilesSize = pct;
    RecalcularTamanho(pct);
}

Tile.getTilesPct = function () {
    if (!Storage.tilesSize)
        Tile.setTilesPct(100);

    return Storage.tilesSize;
}

Tile.getColunas = function () {
    var i = Config.getColumnNumber();

    if (i == 0) {
        var w = window.innerWidth;
        var sobra = w > 1600 ? 360 : 180;

        i = Math.floor((w - sobra) / (Tile.TileSize1() + 4));
    }

    return i;
}

Tile.getLinhas = function () {
    var linhas = Config.getRowNumber();

    if (linhas == 0) {

        if (Config.getTilesOrientation() == "H") {

            var tiles = Tile.Listar();
            var colunas = Tile.getColunas();

            linhas = 1;
            var coluna = 1;
            for (var i = 0; i < tiles.length; i++) {
                var size = parseInt(tiles[i].Tamanho);

                if (coluna + size > colunas + 1) {
                    linhas++;
                    coluna = 1;
                }

                coluna += size;
            }

            if (coluna > colunas)
                linhas++;

        } else {
            var t = Tile.TileSize1() + 4;
            var h = window.innerHeight;
            var sobra = 50;

            //console.log(h);

            linhas = Math.floor((h - sobra) / t);
            linhas++;
        }
    }

    return linhas;
}

Tile.primeiroPosicionamento = true;
Tile.prototype.Html = function (preview) {
    //var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id magna turpis, sed adipiscing magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque neque lorem, bibendum scelerisque elementum molestie, sagittis in neque. Sed sodales lobortis lectus sed faucibus. Donec egestas rhoncus eros, ut auctor eros posuere egestas. Fusce eget nunc nec lorem vehicula sagittis nec nec ligula. Ut erat eros, lacinia at convallis a, euismod ac dui. Vivamus nibh purus, cursus eu mattis vitae, tincidunt vulputate enim.";

    var aTile = $("<a></a>");
    var divFullTile = $("<div class='fullTile'></div>");
    var divTileImg = $("<div class='tileImg'></div>");
    var pTileName = $("<p class='tileNameP'></p>");
    var divFeed = $("<div class='feed'></div>");
    var h2Feed = $("<h2></h2>");
    var pFeed = $("<p></p>");
    var divResize = $("<div class='resize' title='resize'></div>");
    var divEdit = $("<div class='edit' title='edit'></div>");

    var url = this.Url;
    if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1 && url.indexOf("chrome://") == -1){
        url = "http://" + url;
    }

    if (!preview) {
        aTile.addClass("tile");
        aTile.addClass("size" + this.Tamanho);

        aTile.attr("id", "tile-" + this.Id);
        aTile.attr("data-id", this.Id);
        if (url.indexOf("chrome://") == -1){
            aTile.attr("href", url);
        }
        else{
            aTile.attr("href", url);
            aTile.attr("chref", url);
            aTile.addClass("chromeUrl");
            //aTile.attr("onclick", 'chromeOpen(this.href);');
        }

        if (Tile.primeiroPosicionamento)
            aTile.addClass("firstLoad");
    } else {
        aTile.addClass("previewTile");
    }

    if (this.Cor) {
        aTile.css("background-color", this.Cor);
    } else if (preview) {
        aTile.addClass("tileColor");
        aTile.css("background-color", corSecundaria);
    } else {
        aTile.addClass("tileColor");
    }

    Tile.refreshBorder(aTile);

    if (this.Cor || this.CorFonte) {

        var fontColor = this.CorFonte || fontColorFromBackground(hex2rgb(this.Cor));
        pTileName.css("color", fontColor);
        divFeed.css("color", fontColor);
    }

    if (this.Imagem && this.Imagem != "null") {
        divTileImg.css("background-image", "url('" + this.Imagem + "')");
        // check external images
        // NOTE: might've become unnecessary cause of inline images
        if (this.Imagem.indexOf('http') == 0) {
            var img = new Image;
            var self = this;
            img.onerror = function () {
                var tile = $("#tile-" + self.Id);
                var error = $("<div class='errorNoImage'>image not found</div>");
                pTileName.html(self.Nome);
                tile.find('.tileImg').css("background-image", "");
                tile.find('.tileImg').append(pTileName);
                tile.find('.tileImg').append(error);
            };
            img.src = this.Imagem;
        }
    } else {
        pTileName.html(this.Nome);
        divTileImg.append(pTileName);
    }

    divFullTile.append(divTileImg);

    if (this.RssUrl) {
        h2Feed.html(this.Nome);

        if (  this.LastFeedTitle && this.LastFeedTitle.length > 0 &&
              this.LastFeedUrl && this.LastFeedUrl.length > 0) {

            pFeed.html(this.LastFeedTitle);

            pFeed.unbind("click");
            pFeed.click(function () {
                document.location = tile.LastFeedUrl;
                return false;
            });
        }

        divFeed.append(h2Feed);
        divFeed.append(pFeed);
        divFullTile.append(divFeed);
        divFullTile.append(divTileImg.clone());
    }

    aTile.append(divFullTile);

    if (!preview) {
        aTile.append(divResize);
        aTile.append(divEdit);
    }

    return aTile[0].outerHTML;
}

Tile.refreshBorder = function (aTile) {
    var pageBg = hex2rgb(corPrimaria);
    var tileBg = aTile[0].style.backgroundColor
                   ? rgb2hex(aTile[0].style.backgroundColor)
                   : corSecundaria;
    tileBg = hex2rgb(tileBg);

    // dark background
    if (isColorDark(tileBg)) {
        aTile.addClass('dark-tile-bg');
    }
    // border
    if (isColorHighLumen(pageBg))
        var border = darkBorderColorFromBackground(tileBg);
    else
        var border = brightBorderColorFromBackground(tileBg);
    border = "rgb(" + [border.r, border.g, border.b].join(',') + ')';
    aTile.css("border", "1px solid " + border);
}

Tile.Listar = function () {
    //if (_tiles.length == 0) {
    var tilesJson;

    //Se tiver no local storage pega do local storage
    if (Storage.tiles) {
        //if (false) {
        tilesJson = Storage.tiles;
    }
        //Se não, pega via ajax
    else {
        //Tratamento especifico para tiles em CH, por enquanto
        var ln = "_" + navigator.language;
        if (ln != "_zh-CN")
            ln = "";

        $.ajax({
            type: "GET",
            url: "json/tiles" + ln + ".json",
            async: false,
            success: function (data) {
                tilesJson = JSON.parse(data);
                Storage.tiles = tilesJson;
            }
        });
    }

    _tiles = new Array();
    //Transforma a lista de Json em objetos
    for (var i = 0; i < tilesJson.length; i++) {
        var tileJson = tilesJson[i];
        _tiles.push(new Tile(tileJson));
    }
    //}

    return _tiles;
}

Tile.CarregarTiles = function () {
    //Pega todos os tiles,
    var tiles = Tile.Listar();
    var html = "";

    /// NOTE: Caching is in development
    if (false && localStorage.cacheMainHtml) {
        html = localStorage.cacheMainHtml;
    } else {
        //concatena o html de cada um deles
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            html += tile.Html();
        }

        localStorage.cacheMainHtml = html;
    }

    //e joga tudo dentro da div.
    $("#main").html(html);

    //Carrega os feeds, se tiver
    setTimeout(function () {
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.RssUrl && tile.RssUrl != "") {
                tile.GetLastFeed();
            }
        }
    }, 10);


    //Evento para trocar o css qndo termina a animação do tile
    //$("#main .fullTile").on('webkitAnimationEnd', function () {
    //    $(this).removeClass("animando");
    //    $(this).addClass("pausado");
    //});

    //Ativa ordenação
    setTimeout(EnableSort, 10);

    //Anima os tiles
    // setTimeout(AnimaTiles, 1500);

    //Eventos do tiles
    setTimeout(TileEvents, 10);

    //Calcula o tamanho dos tiles
    if (Tile.getTilesPct() != 100) {
        RecalcularTamanho(Tile.getTilesPct());
    } else {
        RecalculaAnimacao();
    }
}

Tile.GetTile = function (id) {
    var lista = Tile.Listar();

    for (var i = 0; i < lista.length; i++) {
        if (lista[i].Id == id)
            return lista[i];
    }
}

Tile.SalvarOrdenacao = function () {
    var lista = Tile.Listar();
    var listaNova = new Array();
    var c = 0;

    $(".tile").each(function () {
        var tile = new Tile();

        var id = $(this).data("id");

        var tile = lista.filter(function (t) { return t.Id == id })[0];

        listaNova[c] = tile;

        c++;
    });

    Storage.tiles = listaNova;
    _tiles = new Array();
}

Tile.prototype.Salvar = function () {
    var tiles = Tile.Listar();

    var alterou = false;
    var tile = this;
    tiles.forEach(function (t) {
        if (t.Id == tile.Id) {
            t.Nome = tile.Nome;
            t.Tamanho = tile.Tamanho;
            t.Url = tile.Url;
            t.Imagem = tile.Imagem;
            t.Cor = tile.Cor;
            t.CorFonte = tile.CorFonte;
            t.RssUrl = tile.RssUrl;
            t.LastFeedTitle = tile.LastFeedTitle;
            t.LastFeedUrl = tile.LastFeedUrl;
            t.LastSeenFeedTitle = tile.LastSeenFeedTitle;

            alterou = true;
        }
    });

    if (!alterou) {
        tiles.push(tile);
    }

    Storage.tiles = tiles;
}

Tile.prototype.Remover = function () {
    var lista = Tile.Listar();
    var listaNova = new Array();
    var c = 0;

    for (var i = 0; i < lista.length; i++) {
        var tile = lista[i];
        if (tile.Id != this.Id) {
            listaNova.push(tile);
        }
    }

    Storage.tiles = listaNova;
    _tiles = new Array();
}

Tile.GetNewId = function () {
    var id = 0;
    var tiles = Tile.Listar();
    for (var i = 0; i < tiles.length; i++) {
        id = Math.max(tiles[i].Id, id);
    }

    return id + 1;
}

Tile.prototype.GetLastFeed = function () {
    var tile = this;
    var url = this.RssUrl;

    //console.log("Pegando feed de " + this.Nome + " - " + this.RssUrl);

    getFeedFromUrl({
        url: url,
        success: function (feed) {
            var noticia = new Object();

            if (feed.items.length > 0) {
                tile.LastFeedTitle = feed.items[0].title;
                tile.LastFeedUrl = feed.items[0].link;
                tile.Salvar();
            }

            //console.log("----------");
            //console.log("feed de " + tile.Nome + ":");
            //console.log(tile.LastFeedTitle);
            //console.log(tile.LastFeedUrl);
            //console.log(feed);

            var tileDom = $(".tile[data-id=" + tile.Id + "]");
            var pFeed = tileDom.find(".feed p");

            pFeed.html(tile.LastFeedTitle);

            pFeed.unbind("click");
            pFeed.click(function (e) {
                if (e.which == 1) {
                    document.location = tile.LastFeedUrl;
                    return false;
                } else if (e.which == 2) {
                    chrome.tabs.create({
                        url: tile.LastFeedUrl,
                        active: false
                    });
                    return false;
                }
            });

            if (tile.LastSeenFeedTitle != tile.LastFeedTitle) {
                AnimaTile(tile);
            }
        },
        failure: function (msg) {
            console.log("----------");
            console.log("Erro loading " + tile.Nome + " feed:");
            console.log("** Error loading feed from " + url + " - " + msg);
        }
    });
}

function getFeedFromUrl(opt) {
    //var url = "http://www.theverge.com/rss/index.xml";
    var url = opt.url;

    if (url.indexOf("feedburner" > 0) && url.indexOf("fmt=xml") < 0) {
        if (url.indexOf("?") > 0)
            url += "&fmt=xml";
        else
            url += "?fmt=xml";
    }

    addDependencyFunction('jfeed', function () {
        jQuery.getFeed({
            url: url,
            success: opt.success,
            failure: opt.failure
        });
    });

}

Tile.PosicionarTilesPrimeiraVez = function () {
    //espaço ocupado por tile
    var t = Tile.TileSize1() + 4;

    var colunas = Tile.getColunas();

    var coluna = 1;
    var linha = 1;

    var velocidadeAnimacao = Config.getVelocidadeAnimacaoInicialTiles();

    if (Config.getAnimacaoInicialTiles()) {
        $(".tile, .btnAddTile").css("-webkit-transition", "none");

        $(".tile, .btnAddTile").each(function () {
            var size = 1

            if ($(this).hasClass("size2"))
                size = 2;

            if (coluna + size - 1 > colunas) {
                linha++;
                coluna = 1;
            }

            var top = (linha - 1) * t;

            $(this).css("top", top);
            $(this).css("left", 0);

            coluna += size;
        });

        setTimeout(function () {
            $(".tile, .btnAddTile").css("-webkit-transition", velocidadeAnimacao + "ms, background-color 1s");
            Tile.PosicionarTiles();

            setTimeout(function () {
                $(".tile, .btnAddTile").css("-webkit-transition", "");
            }, 0);
        }, 0);

    } else {
        $(".tile").css("-webkit-transition", "none");

        Tile.PosicionarTiles();

        setTimeout(function () {
            $(".tile, .btnAddTile").css("-webkit-transition", "");
        }, 0);
    }
}

Tile.PosicionarTiles = function (linhaBase, colunaBase, colunas) {
    if (Config.getTilesOrientation() == "H") {
        Tile.PosicionarTilesHorizontal(linhaBase, colunaBase, colunas);
    } else {
        Tile.PosicionarTilesVertical(linhaBase, colunaBase, colunas);
    }
}

Tile.PosicionarTilesHorizontal = function (linhaBase, colunaBase, colunas) {
    //espaço ocupado por tile
    var t = Tile.TileSize1() + 4;

    if (!colunas) {
        colunas = Tile.getColunas();
    }

    var coluna = 1;
    var linha = 1;
    var sizeAnterior = 0;

    $(".tile[dragging!=1], .btnAddTile").each(function () {
        var size = 1

        if ($(this).hasClass("size2"))
            size = 2;

        if (coluna + size - 1 > colunas) {
            linha++;
            coluna = 1;
        }

        if (coluna == colunaBase && linha == linhaBase) {
            tileAfter = $(this);
            coluna += dragSize;
        } else if (size == 2 && coluna + 1 == colunaBase && linha == linhaBase) {
            tileAfter = $(this);
            coluna += dragSize;
            colunaDrag--;
        } else if (size == 2 && coluna == 1 && colunaBase == colunas && linha - 1 == linhaBase && dragSize == 1) {
            tileAfter = $(this);
            coluna = colunas;
            linha--;
        }

        if (coluna + size - 1 > colunas) {
            linha++;
            coluna = 1;
        }

        var left = (coluna - 1) * t;
        var top = (linha - 1) * t;

        $(this).css("left", left);
        $(this).css("top", top);

        coluna += size;
    });

    $(".tile").removeClass("firstLoad");
}

Tile.PosicionarTilesVertical = function (linhaBase, colunaBase, colunas) {
    //espaço ocupado por tile
    var t = Tile.TileSize1() + 4;

    var linhas = Tile.getLinhas();

    var coluna = 1;
    var linha = 1;
    var sizeAnterior = 0;

    var width = 0;

    //console.log("LinhaBase: " + linhaBase);
    //console.log("ColunaBase: " + colunaBase);

    var lista = $(".tile[dragging!=1], .btnAddTile");

    console.log(lista);

    var eof = false;
    var c = 0;
    while (!eof) {
        var tile = lista.eq(c);
        var size = tile.hasClass("size2") ? 2 : 1;

        if (c + 1 < lista.length) {
            var nTile = lista.eq(c + 1);

            if (sizeAnterior == 2 || (size == 2 && sizeAnterior > 0)) {
                coluna += coluna % 2 == 0 ? -1 : 0;
                linha++;
            } else if (sizeAnterior == 1 && size == 1) {
                coluna += coluna % 2 == 0 ? -1 : 1;
            }


            if ((size == 1 && dragSize == 1 && coluna == colunaBase && linha == linhaBase) ||
                (size == 2 && dragSize == 1 && coluna + 1 == colunaBase && linhaBase == linhaBase) ||
                (dragSize == 2 && (coluna + 1 == colunaBase || coluna + 1 == colunaBase + 1) && linha == linhaBase)) {

                tileAfter = tile;

                var fakeTile = $(tileDrag).clone();
                fakeTile.addClass("fake");
                fakeTile.removeAttr("dragging");
                fakeTile.insertBefore(tileAfter);

                Tile.PosicionarTilesVertical();

                break;
            }


            if (linha + 2 > linhas) {
                coluna += coluna % 2 == 0 ? 1 : 2;
                linha = 1;
            }

        } else {
            eof = true;
        }

        sizeAnterior = size;

        var top = (linha - 1) * t;
        var left = (coluna - 1) * t;

        tile.css("top", top);
        tile.css("left", left);

        c++;
    }

    $("#main").css("width", (coluna + 2) * t);
    $(".tile").removeClass("firstLoad");
}

function RecalcularTamanho(pct) {
    $(".tile .fullTile").css("-webkit-animation-name", "none");

    Resize(".tile .fullTile .tileImg", "height", "px", pct*0.7);
    //Resize(".tileImg", "height", "px", pct*0.7);
    //Resize(".tileImg", "width", "px", pct*0.8);
    //Resize(".tile .fullTile .tileImg", "background-size", "px", pct);
    Resize(".tile .fullTile .feed", "height", "px", pct);
    Resize(".tile .fullTile .feed h2", "font-size", "px", pct);
    Resize(".tile .fullTile .feed h2", "height", "px", pct);
    Resize(".tile.size1 .fullTile .feed", "font-size", "px", pct);
    Resize(".tile.size2 .fullTile .feed", "font-size", "px", pct);

    Resize(".btnAddTile", "height", "px", pct);
    Resize(".btnAddTile", "width", "px", pct);
    Resize(".tile p.tileNameP", "font-size", "px", pct);

    $(".tile.size1").css("width", Tile.TileSize1() + "px");
    $(".tile.size2").css("width", Tile.TileSize2() + "px");
    $(".tile").css("height", Tile.TileSize1() + "px");
    //$(".tile").css("zoom", pct/100);

    //$(".tile p.tileNameP").css("line-height", 140*pct/100 + 'px');
    //$(".tile p.tileNameP").css("top", Math.floor((Tile.TileSize1() - 37 * pct / 100)) + "px");

    RecalculaAnimacao();

    windowResize();
    windowScroll();

    EnableSort();
}

function EnableSort() {
    addDependencyFunction('jquery-ui', function () {
        $(".tile").draggable({
            distance: 15,
            scroll: false,
            opacity: .9,
            zIndex: 100,
            start: dragStart,
            drag:  drag,
            stop:  dragStop
        });
    });
}

var dragSize = 1;
var tileAfter;
var linhaDrag = 0;
var colunaDrag = 0;
var tileDrag;
var draggableOffset;
var draggableScrollTop;
var onDraggableScroll;

function dragStart(e, ui) {
    var tileDOM = e.target;
    var $tileDom = $(tileDOM);
    $tileDom.css("position", "fixed");
    $tileDom.css("-webkit-transition", "none");
    $tileDom.attr("dragging", "1");

    var left = ui.position.left;
    var top  = ui.position.top;

    draggableOffset = $tileDom.parent().offset();
    draggableScrollTop = $tileDom.parent().scrollTop();

    onDraggableScroll = function () {
        draggableScrollTop = $tileDom.parent().scrollTop();
    }
    $("#main").on('scroll', onDraggableScroll);

    var t = Tile.TileSize1() + 4;
    left = left + (t / 2);
    top = top + (t / 2);

    var linhaDrag = Math.floor(top / t) + 1;
    var colunaDrag = Math.floor(left / t) + 1;

    linhaDrag = linhaDrag == 0 ? 1 : linhaDrag;
    colunaDrag = colunaDrag == 0 ? 1 : colunaDrag;

    tileDrag = tileDOM;
}

function drag(e, ui) {
    var tileDOM = e.target;
    var $tileDom = $(tileDOM);

    var t = Tile.TileSize1() + 4;
    var left = ui.position.left + (t / 2);
    var top  = ui.position.top  + (t / 2);

    var _linhaDrag = Math.floor(top / t) + 1;
    var _colunaDrag = Math.floor(left / t) + 1;

    _linhaDrag = _linhaDrag == 0 ? 1 : _linhaDrag;
    _colunaDrag = _colunaDrag == 0 ? 1 : _colunaDrag;

    var tile = Tile.GetTile($tileDom.data("id"));
    dragSize = tile.Tamanho;

    if (_linhaDrag != linhaDrag || _colunaDrag != colunaDrag) {
        linhaDrag = _linhaDrag;
        colunaDrag = _colunaDrag;

        Tile.PosicionarTiles(linhaDrag, colunaDrag, null);
    }

    // adjust for position fixed
    ui.position.left += draggableOffset.left;
    ui.position.top  += draggableOffset.top - draggableScrollTop;
}

function dragStop(e, ui) {
    var tileDOM = e.target;
    $(tileDOM).removeAttr("dragging");

    $(".tile.fake").remove();

    if (tileAfter) {
        $(tileDOM).insertBefore(tileAfter);
    }

    $("#main").off('scroll', onDraggableScroll);

    ui.position.left -= draggableOffset.left;
    ui.position.top  -= draggableOffset.top - draggableScrollTop;

    var t = Tile.TileSize1() + 4;
    var left = ui.position.left + (t / 2);
    var top  = ui.position.top  + (t / 2);

    var _linhaDrag = Math.floor(top / t) + 1;
    var _colunaDrag = Math.floor(left / t) + 1;

    _linhaDrag = _linhaDrag == 0 ? 1 : _linhaDrag;
    _colunaDrag = _colunaDrag == 0 ? 1 : _colunaDrag;

    //Tile.PosicionarTiles(linhaDrag, colunaDrag, null);
    Tile.PosicionarTiles();

    left = parseInt(ui.helper.css('left'), 10);
    top  = parseInt(ui.helper.css('top'), 10);

    ui.helper.css('left', ui.position.left + draggableOffset.left);
    ui.helper.css('top',  ui.position.top + draggableOffset.top - draggableScrollTop);

    // revert animation start
    setTimeout(function () {
        ui.helper.css("-webkit-transition", "");
        ui.helper.css('left', left + draggableOffset.left);
        ui.helper.css('top',  top  + draggableOffset.top - draggableScrollTop);
    }, 1)

    // revert animation end
    ui.helper.on('webkitTransitionEnd', function callback() {
        ui.helper.off('webkitTransitionEnd', callback);
        ui.helper.css("-webkit-transition", "none");
        ui.helper.css("position", "");
        ui.helper.css('left', left);
        ui.helper.css('top',  top);
        setTimeout(function () {
            ui.helper.css("-webkit-transition", "");
        }, 1);
    });

    Tile.SalvarOrdenacao();
}

function AnimaTiles() {
    var listaIds = $(".tile").toArray().map(function (tile) {
        return $(tile).data("id");
    });

    var ordemAnimacao = new Array();
    var indexRepetidos = new Array();
    var qtdTiles = listaIds.length;

    //Define uma ordem aleatória
    for (var i = 0; i < qtdTiles; i++) {
        var index = Math.floor(Math.random() * qtdTiles);

        while (indexRepetidos.indexOf(index) > -1) {
            index = Math.floor(Math.random() * qtdTiles);
        }

        indexRepetidos.push(index);

        var id = listaIds[index];
        var tile = $(".tile[data-id=" + id + "]");
        if (tile.find(".feed").length > 0)
            ordemAnimacao.push(id);
    }

    //e começa a partir do primeiro
    AnimaTile(ordemAnimacao, 0);
}

Tile.Animar = true;

var tileAnimationQueue = [];

function AnimaTile(tile) {
    if (Tile.Animar && tile.Id) {
        tileAnimationQueue.push(function () {
            tileAnimationQueue.shift(); // removes itself
            var $tile = $(".tile[data-id=" + tile.Id + "] .fullTile");
            $tile.css("-webkit-animation-name", "none");
            setTimeout(function () {
                $tile.css("-webkit-animation-name", "animaTileNew");
            }, 1);
            // save 'seen' state
            setTimeout(function () {
                tile.LastSeenFeedTitle = tile.LastFeedTitle;
                tile.Salvar();
            }, 3000);
            // queue next tile animation
            if (tileAnimationQueue[0]) {
                setTimeout(tileAnimationQueue[0], 3000);
            }
        });
        // kick things off
        if (tileAnimationQueue.length == 1) {
            setTimeout(tileAnimationQueue[0], 500);
        }
    }
}

function TileEvents() {
    /*
    // tile permanent active state
    $(".tile").mouseup(function (e) {
        if (e.which != 1) return true; // only left click
        if ($(e.target).is('.resize, .edit') || $(this).is('.ui-draggable-dragging'))
            $(this).removeClass('hover').removeClass('active');
    });
    $(".tile").mousedown(function (e) {
        if (e.which != 1) return true; // only left click
        if (!$(e.target).is('.resize, .edit'))
            $(this).addClass('hover').addClass('active');
    });
    */

    $('.chromeUrl').each(function(i, obj) {
        return;
        obj.addEventListener("click", function(event) {
            if ('edit' == event.target.className || 'resize' == event.target.className){
                return;
            }
            chrome.tabs.update(null, {url: obj.getAttribute("chref")});
        }, false);
    });
    $(".main").on("click", ".chromeUrl", function (e) {
        //alert(e.target.className);
        if ('edit' == e.target.className || 'resize' == e.target.className){
            return;
        }
        var aDom = $(e.target).closest('.chromeUrl');
        console.log(aDom[0].href);
        chrome.tabs.update(null, {url: aDom[0].href});
    });
    $(".main").on("click", ".tile .resize", function (e) {
        try {
            var tileDom = $(e.target).closest('.tile');

            var id = tileDom.data("id");
            var tile = Tile.GetTile(id);

            var tamanhoNovo = tile.Tamanho == 1 ? 2 : 1;

            tile.Tamanho = tamanhoNovo;
            tile.Salvar();

            tileDom.toggleClass("size1").toggleClass("size2");

            if (tileDom.hasClass("size1")) {
                tileDom.css("width", Tile.TileSize1() + "px");
            } else {
                tileDom.css("width", Tile.TileSize2() + "px");
            }

            Tile.PosicionarTiles(0, 0);

            resizeMain(true);
        }
        catch (e) {
            console.log(e);
        }
        return false;
    });

    $(".main").on("click", ".tile .edit", function (e) {
        ConfigTile($(e.target).closest('.tile').data("id"));
        return false;
    });
    $(".configTile .tile .resize").click(function (e) {
        var tileDom = $(this).parent();

        tileDom.toggleClass("size1").toggleClass("size2");

        if (tileDom.hasClass("size1")) {
            tileDom.css("width", "98px");
        } else {
            tileDom.css("width", "200px");
        }

        return false;
    });
}

var tileAtual = new Tile();
function ConfigTile(id) {
    if (id > 0) {
        tileAtual = Tile.GetTile(id);

        $(".btnRemove").show();
    } else {
        tileAtual = new Tile();
        tileAtual.Id = Tile.GetNewId();
        tileAtual.Tamanho = 2;

        $(".btnRemove").hide();
    }

    CarregaInfoTile();

    $("#txtImageUrl").val("");

    //Carregar informações do site!
    var urlAtual = $("#txtUrl").val();
    $("#txtUrl").unbind("blur");
    $("#txtUrl").blur(function () {

        var val = $(this).val()
        if (val != urlAtual) {
            tileAtual.Imagem = null;
            tileAtual.Url = val;
            tileAtual.Nome = "";
            tileAtual.RssUrl = "";
            tileAtual.Cor = "";
            tileAtual.CorFonte = "";
            tileAtual.LastFeedTitle = "";
            tileAtual.LastFeedUrl = "";

            urlAtual = val;
            var urlOriginal = val;
            var url = urlOriginal;

            if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1 && url.indexOf("chrome://") == -1)
                url = "http://" + url;

            var loader = $(".loader");

            $.ajax({
                url: url,
                beforeSend: function () {
                    loader.show();
                },
                success: function (result, textStatus, jqXHR) {
                    try {
                        if ($("#txtUrl").val() == urlOriginal) {
                            var carregouImagem = false, carregouFeed = false;

                            var r = $(result);

                            //Nome do site
                            var tagsNome = ['name', 'og:title',
                                            'og:site_name', 'application-name'];
                            var nomes = getMetaTags(r, tagsNome);
                            var menorNome = nomes.sort(function (a, b) { return a.length - b.length; })[0];
                            tileAtual.Nome = menorNome;

                            //RSS
                            var tagsRss = ['application/rss+xml', 'application/atom+xml'];
                            var rss = getMetaTags(r, tagsRss)[0];

                            if (rss) {
                                if (rss.indexOf("//") == 0) {
                                    rss = rss.replace("//", "http://");
                                } else if (rss.indexOf("http://") == -1 && rss.indexOf("https://") == -1) {
                                    rss = urlOriginal.replace("http://", "").replace("https://", "") + "/" + rss;
                                    rss = rss.replace("//", "/");
                                    rss = "http://" + rss;
                                }

                                getFeedFromUrl({
                                    url: rss,
                                    success: function (feed) {
                                        tileAtual.RssUrl = rss;

                                        if (feed.items.length > 0) {
                                            tileAtual.LastFeedTitle = feed.items[0].title;
                                            tileAtual.LastFeedUrl = feed.items[0].link;
                                        }

                                        carregouFeed = true;
                                        if (carregouImagem)
                                            CarregaInfoTile();
                                    },
                                    failure: function () {
                                        carregouFeed = true;
                                        if (carregouImagem)
                                            CarregaInfoTile();
                                    }
                                });
                            } else {
                                carregouFeed = true;
                            }

                            //Imagem
                            var tagImagemMS = ['msapplication-tileimage'];
                            var imgs = getMetaTags(r, tagImagemMS);

                            if (!imgs.length) {
                                var tagsImagem = ['og:image', 'apple-touch-icon', 'image', 'image_src', 'shortcut icon', 'icon'];
                                imgs = getMetaTags(r, tagsImagem);
                            }

                            var tagCor = ['msapplication-tilecolor',
                                          'msapplication-navbutton-color'];
                            var cor = getMetaTags(r, tagCor);
                            if (cor.length > 0) {
                                var corTile = cor[0];
                            }

                            if (imgs.length > 0) {
                                var img = document.createElement("img");

                                img.onload = function () {
                                    processaImagem(img, function (imagemProcessada) {
                                        setTileImagem(imagemProcessada, corTile);

                                        carregouImagem = true;
                                        if (carregouFeed)
                                            CarregaInfoTile();
                                    });
                                };

                                var urlImg = imgs[0];
                                if (urlImg.indexOf("//") == 0) {
                                    urlImg = urlImg.replace("//", "http://");
                                } else if (urlImg.indexOf("http://") == -1 && urlImg.indexOf("https://") == -1) {
                                    urlImg = urlOriginal.replace("http://", "").replace("https://", "") + "/" + urlImg;
                                    urlImg = urlImg.replace("//", "/");
                                    urlImg = "http://" + urlImg;
                                }

                                img.src = urlImg;

                            } else {
                                carregouImagem = true;
                                if (carregouFeed)
                                    CarregaInfoTile();
                            }
                        }
                    } catch (ex) {
                        loader.hide();
                    }
                },
                error: function () {
                    loader.hide();
                    CarregaInfoTile();
                }
            });
        }
    });

    //nome do site
    $("#txtNome").unbind("keydown");
    $("#txtNome").keydown(function () {
        setTimeout(function () {
            var nome = $("#txtNome").val();
            tileAtual.Nome = nome;

            $(".previewTile .feed h2").html(nome);
            if (!tileAtual.Imagem) {
                $(".previewTile .tileNameP").html(nome);
            }
        }, 0);
    });

    //rss
    $("#txtRss").unbind("blur");
    $("#txtRss").blur(function () {
        var rss = $(this).val();
        if (rss != tileAtual.RssUrl) {
            $(".loader").show();

            tileAtual.RssUrl = rss;

            if (rss.indexOf("//") == 0) {
                rss = rss.replace("//", "http://");
            } else if (rss.indexOf("http://") == -1 && rss.indexOf("https://") == -1) {
                rss = urlOriginal.replace("http://", "").replace("https://", "") + "/" + rss;
                rss = rss.replace("//", "/");
                rss = "http://" + rss;
            }

            getFeedFromUrl({
                url: rss,
                success: function (feed) {
                    if (feed.items.length > 0) {
                        tileAtual.LastFeedTitle = feed.items[0].title;
                        tileAtual.LastFeedUrl = feed.items[0].link;
                    }

                    CarregaInfoTile();
                },
                failure: function () {
                    CarregaInfoTile();
                }
            });
        }
    });

    //Alterar cor do tile
    $("#divTileColor").ColorPicker({
        onChange: function (hsb, hex, rgb) {
            $("#divTileColor").css("background-color", "#" + hex);
            $(".previewTile").css("background-color", "#" + hex);
            var fontColor = fontColorFromBackground(hex2rgb(hex));
            $("#divFontColor").ColorPickerSetColor(fontColor.replace("#", ""));
            $("#divFontColor").ColorPickerTriggerChange();
            Tile.refreshBorder($(".previewTile"));
            tileAtual.Cor = "#" + hex;
        }
    });

    if (tileAtual.Cor) {
        $("#divTileColor").ColorPickerSetColor(tileAtual.Cor.replace("#", ""));
        $("#divTileColor").css("background-color", tileAtual.Cor);
    } else {
        $("#divTileColor").ColorPickerSetColor("");
        $("#divTileColor").css("background-color", "");
    }

    //Alterar cor da fonte
    $("#divFontColor").ColorPicker({
        onChange: function (hsb, hex, rgb) {
            $("#divFontColor").css("background-color", "#" + hex);
            $(".previewTile").css("color", "#" + hex);
            tileAtual.CorFonte = "#" + hex;
        }
    });

    if (tileAtual.CorFonte) {
        $("#divFontColor").ColorPickerSetColor(tileAtual.CorFonte.replace("#", ""));
        $("#divFontColor").css("background-color", tileAtual.CorFonte);
    } else {
        $("#divFontColor").ColorPickerSetColor("");
        $("#divFontColor").css("background-color", "");
    }

    //Upload de imagem
    $("#btnUploadImage").unbind("click");
    $("#btnUploadImage").click(function () {
        $("#upImage").trigger("click");
    });

    $("#upImage").unbind("change");
    $("#upImage").change(function () {
        var file = this.files[0];

        if (file) {
            if (!file.type.match('image.*')) {
                alert(chrome.i18n.getMessage("tileConfigurations"), chrome.i18n.getMessage("tc_alert_invalidImage"));
            }
            else {
                var reader = new FileReader();

                reader.onload = (function (file) {
                    return function (e) {
                        var img = new Image();

                        img.onload = function () {
                            processaImagem(img, function (imagemProcessada) {
                                setTileImagem(imagemProcessada);
                                CarregaInfoTile();
                            });
                        }

                        img.src = e.target.result;
                    };
                })(file);

                reader.readAsDataURL(file);
            }
        }
    });

    //Imagem de url
    $("#btnUrlImage").unbind("click");
    $("#btnUrlImage").click(function () {
        $(".imageUrl .btnOk").click(function () {
            var img = new Image();

            img.onload = function () {
                processaImagem(img, function (imagemProcessada) {
                    setTileImagem(imagemProcessada);
                    CarregaInfoTile();
                });
            }

            img.src = $("#txtImageUrl").val();

            $(".imageUrl").trigger("close");
        });

        $(".imageUrl").lightbox_me({
            centered: true,
            lightboxSpeed: 100,
            // overlayCSS: {opacity:0},
            onLoad: function () {
                $("#txtImageUrl").focus();
            }
        });
    });

    //Selecionar imagem da lista
    $("#btnListImage").unbind("click");
    $("#btnListImage").click(function () {
        $(".imageList .list img").each(function () {
            this.src = this.getAttribute('data-src');
        });

        $(".imageList .list img").click(function () {

            var img = new Image();
            img.onload = function () {
                processaImagem(img, function (imagemProcessada) {
                    setTileImagem(imagemProcessada);
                    CarregaInfoTile();
                });
            }
            img.src = this.src;

            $(".imageList").trigger("close");
        });

        $(".imageList").lightbox_me({ centered: true, lightboxSpeed: 100 });
        /*
        $(".imageList").lightbox_me({
                    centered: true,
                    lightboxSpeed: 100,
                    overlayCSS: {opacity:0}
        });
        */
    });

    //Remover imagem
    //if (tileAtual.Imagem) {
    //  $("#btnRemoveImage").show();
        $("#btnRemoveImage").unbind("click");
        $("#btnRemoveImage").click(function () {
            tileAtual.Imagem = null;

            CarregaInfoTile();
        });
    //} else {
    //    $("#btnRemoveImage").hide();
    //}

    //Remover tile
    $(".btnRemove").unbind("click");
    $(".btnRemove").click(function () {

        // new tile animation
        var tileElem = $("#tile-" + tileAtual.Id);
        tileElem.css('-webkit-transform', 'scale(0.3)');
        tileElem.css('opacity', '0');
        tileElem.on('webkitTransitionEnd', function () {
            tileElem.remove();
            Tile.PosicionarTiles();
            resizeMain(true);
        });

        tileAtual.Remover();
        $(".configTile").trigger('close');
    });

    //Salvar
    $(".btnSave").unbind("click");
    $(".btnSave").click(function () {
        var msg = "";

        if ($("#txtNome").val() == "" && $("#txtUrl").val() == "") {
            msg += chrome.i18n.getMessage("tc_alert_url_name");
        }
        else if ($("#txtNome").val() == "") {
            msg += chrome.i18n.getMessage("tc_alert_name")
        }
        else if ($("#txtUrl").val() == "") {
            msg += chrome.i18n.getMessage("tc_alert_url")
        }

        if (msg != "") {
            alert(chrome.i18n.getMessage("tileConfigurations"), msg);
            return;
        }

        tileAtual.Nome = $("#txtNome").val();
        tileAtual.Url = $("#txtUrl").val();
        tileAtual.RssUrl = $("#txtRss").val();

        tileAtual.Salvar();

        var tileAntigo = $(".tile[data-id=" + tileAtual.Id + "]");

        if (tileAntigo.length > 0) {
            tileAntigo.after(tileAtual.Html());
            tileAntigo.remove();
        }
        else {
            $("#main").append(tileAtual.Html());

            // new tile animation
            var tileElem = $("#tile-" + tileAtual.Id);
            tileElem.css('-webkit-transition', 'none');
            tileElem.css('-webkit-transform', 'scale(.5)');
            tileElem.css('opacity', '.5');
            setTimeout(function () {
                tileElem.css('-webkit-transition', '');
                tileElem.css('-webkit-transform', '');
                tileElem.css('opacity', '');
            }, 10);
        }

        EnableSort();
        Tile.PosicionarTiles();
        carregarTemaPadrao();

        resizeMain(true);

        if (tileAtual.RssUrl && tileAtual.RssUrl != "")
            tileAtual.GetLastFeed();

        if (Tile.getTilesPct() != 100) {
            RecalcularTamanho(Tile.getTilesPct());
        } else {
            RecalculaAnimacao();
        }


        $(".configTile").trigger("close");
    });

    $(".configTile").lightbox_me({
        centered: true,
        lightboxSpeed: 200,
        overlaySpeed: 100,
        onLoad: function () {
            $("#txtUrl").focus();
        }
    });

}

function CarregaInfoTile() {
    $("#txtNome").val(tileAtual.Nome);
    $("#txtUrl").val(tileAtual.Url);
    $("#txtRss").val(tileAtual.RssUrl);

    $(".preview").html("");
    $(".preview").append(tileAtual.Html(true));

    if (tileAtual.Cor && tileAtual.Cor.length > 0) {
        $("#divTileColor").ColorPickerSetColor(tileAtual.Cor.replace("#", ""));
        $("#divTileColor").css("background-color", tileAtual.Cor);
        $(".previewTile").css("background-color", tileAtual.Cor);
    }
    else {
        $("#divTileColor").ColorPickerSetColor("");
        $("#divTileColor").css("background-color", "");
        $(".previewTile").css("background-color", corSecundaria);
    }

    if (tileAtual.CorFonte && tileAtual.CorFonte.length > 0) {
        $("#divFontColor").ColorPickerSetColor(tileAtual.CorFonte.replace("#", ""));
        $("#divFontColor").css("background-color", tileAtual.CorFonte);
        $(".previewTile").css("color", tileAtual.CorFonte);
    } else {
        $("#divFontColor").ColorPickerSetColor("");
        $("#divFontColor").css("background-color", "");
        $(".previewTile").css("color", "");
    }

    $(".previewTile").find(".feed p").html(tileAtual.LastFeedTitle);

    if ($(".previewTile .tileImg").length > 1) {
        $(".previewTile .fullTile").removeClass("pausado");
    } else {
        $(".previewTile .fullTile").addClass("pausado");
    }

    $(".loader").hide();
}

function setTileImagem(img, cor) {
    tileAtual.Imagem = img.src;

    var corBg = "";
    var corFonte = "";

    var rgb;

    if (cor) {
        rgb = hex2rgb(cor);
        corBg = cor.indexOf("#") > -1 ? cor : "#" + cor;
    } else {
        rgb = getAverageRGB(img);
        if (rgb) {
            var hex = rgb2hex("rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")");
            corBg = hex;
        } else {
            corBg = corSecundaria;
        }
    }

    if (rgb) {
        corFonte = fontColorFromBackground(rgb);
    }

    tileAtual.Cor = corBg;
    tileAtual.CorFonte = corFonte;
}

function Resize(seletor, propriedade, medida, pct) {
    //tira a propriedade do "style" pra pegar a original do css
    $(seletor).css(propriedade, "");

    var valor = $(seletor).css(propriedade);
    //document.querySelector(seletor).style.removeAttribute(propriedade);
    if (valor) {
        valor = valor.replace(medida, "");

        var novoValor = Math.floor(valor * (pct / 100));
        $(seletor).css(propriedade, novoValor + medida);
    }
}

function RecalculaAnimacao() {
    var lastSheet = document.styleSheets[document.styleSheets.length - 1];
    var newName = "animaTileNew" //+ Tile.TileSize1();

    if (findKeyframesRule(newName) == null) {
        var css = "@-webkit-keyframes " + newName + " { " +
                      "0% { -webkit-transform: translateY(0px); } " +
                      "16.6%, 66.6% { -webkit-transform: translateY(-" + Tile.TileSize1() + "px); } " +
                      "83.26%, 100% { -webkit-transform: translateY(-" + (Tile.TileSize1() * 2) + "px); } " +
                  "}";

        lastSheet.insertRule(css, lastSheet.cssRules.length);
    }


    /*$(".tile .fullTile").each(function(){
        if ($(this).find('.feed').length)
            $(this).css("-webkit-animation-name", newName);
    });*/

}

// search the CSSOM for a specific -webkit-keyframe rule
function findKeyframesRule(rule) {
    var ss = document.styleSheets;

    for (var i = 0; i < ss.length; ++i) {
        for (var j = 0; j < ss[i].cssRules.length; ++j) {
            if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule)
                return ss[i].cssRules[j];
        }
    }

    return null;
}

function getMetaTags(html, tags) {
    var values = new Array();

    for (var i = 0; i < html.length; i++) {
        var tag = $(html[i]);
        var tagName = tag[0].tagName;

        if (tagName == 'META' || tagName == 'LINK') {
            var props = [ tag.attr("name"), tag.attr("property"), tag.attr("itemprop"),
                         tag.attr("http-equiv"), tag.attr("type"), tag.attr("rel") ];

            for (var p = 0; p < props.length; p++) {
                if (!props[p]) continue;
                var prop = props[p].toLowerCase();
                if (tags.indexOf(prop) > -1) {
                    values.push(tag.attr("content") || tag.attr("href"));
                    break;
                }
            }
        }
    }

    return values;
}

function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        cores = new Array(),
        rgb = { r: 0, g: 0, b: 0 },
        count = 0,
        transparentes = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        ///* security error, img on diff domain */alert('x');
        return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
        count++;
        if (data.data[i + 3] == 255) {
            cores.push(data.data[i] + "," + data.data[i + 1] + "," + data.data[i + 2]);
        } else {
            transparentes++;
        }
    }

    //Se mais de 50% da imagem for transparente não pega cor nenhuma
    if (transparentes > (count * 0.5)) {
        return false;
    } else {
        var corVendedora = mode(cores);
        var split = corVendedora.split(",");

        rgb.r = split[0];
        rgb.g = split[1];
        rgb.b = split[2];

        return rgb;
    }


}

//Pega o elemento mais repetido dentro do array
function mode(array) {
    if (array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}


//http://www.w3.org/TR/AERT#color-contrast
function fontColorFromBackground(rgb) {
    return isColorBright(rgb) ? "#333333" : "#f1f1f1";
}
function brightBorderColorFromBackground(rgb) {
    rgb.r += rgb.r > 0 ? 10 : 26;
    rgb.g += rgb.g > 0 ? 10 : 26;
    rgb.b += rgb.b > 0 ? 10 : 26;
    return rgb;
}
function darkBorderColorFromBackground(rgb) {
    rgb.r -= 20;
    rgb.g -= 20;
    rgb.b -= 20;
    return rgb;
}
function isColorBright(rgb) {
    var o = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return (o > 125); // (getLuma(rgb) > 40)
}
function isColorDark(rgb) {
    var o = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    if (rgbToHsl(rgb).s < 0.12) { // grayish
        return (o < 120);
    } else {
        return (o < 60);
    }
}
function isColorVeryDark(rgb) {
    var o = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return (o < 60);
}
function isColorVeryBright(rgb) {
    var o = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return (o > 150);
}
function isColorHighLumen(rgb) {
    return (rgbToHsl(rgb).l > 0.4);
}

// old implementation
function getLuma(rgb) {
    return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

function rgbToHsl(rgb) {
    var r = rgb.r, g = rgb.g, b = rgb.b;
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {h: h, s: s, l: l};
}
