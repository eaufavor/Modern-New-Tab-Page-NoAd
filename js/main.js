/// <reference path="Config.js" />
/// <reference path="Storage.js" />
/// <reference path="Tile.js" />

window.console || (window.console = {});
console.profile || (console.profile = function(){});
console.profileEnd || (console.profileEnd = function(){});
var mainstart = +new Date;
var gdebug;


var Storage;

var corPrimaria = "#DDDDDD";
var corSecundaria = "#00A4A4";
var corFonte = "#FFFFFF";
var bgId = 0;
var pct = 100;

$(document).ready(function () {

    var load = function () {

        var bgPage = chrome.extension.getBackgroundPage();

        if (bgPage){
            Storage = bgPage.MNTPStorage;
            if (Storage) {
                var bgready = +new Date;

                $("#initMessage").hide();

                carregarTudo();
                verificaVersao();

                //var gend = +new Date;
                //document.body.innerHTML += 'bg ready:' + (bgready - gstart)  + '<br>' ;
                //document.body.innerHTML += 'init:' + (gend - bgready) ;
                //document.body.innerHTML += gdebug;
                return;
            }
        }

        setTimeout(load, 0);
    }
    load();
    initWithoutBackgroundPage();
    translate();
});

function initWithoutBackgroundPage() {
    configEvents();
    footerEvents();
    navigationEvents();
    windowEvents();
    $(".main").addClass("pausado");
}

function carregarTudo() {

    carregarTemaPadrao();

    Tile.CarregarTiles();

    detectBackgroundBrightness();

    resizeMain(false);

    Tile.PosicionarTilesPrimeiraVez();

    loadSliders();

    carregarBackground();

    carregarConfigs();

    setTimeout(carregarBookmarks, 100);
    setTimeout(carregarApps, 100);
    setTimeout(carregarUltimasAbas, 100);
    setTimeout(carregarTemas, 100);

    //$("*").disableSelection();
}

function carregarTemas() {

    $.ajax({
        type: "GET",
        url: "json/temas.json",
    async: false,
        success: function (data) {
            var temas = JSON.parse(data);
      var html = "";
      for (var i = 0; i < temas.length; i++) {
        var divBg = $("<div></div>");
        var divTile = $("<div></div>");

        divBg.addClass("configColor");
        divBg.attr("style", "background-color: " + temas[i].CorFundo);

        divTile.addClass("corTile");
        divTile.attr("style", "background-color: " + temas[i].CorTile);

        divBg.append(divTile);

        html += divBg[0].outerHTML;
      }

      $(".configColor").remove();
      $(".listaCores .configSelectedColorBg").after(html);

            //Tema
            $(".temas .configColor").unbind("click");
            $(".temas .configColor").click(function () {
                var rgb1 = $(this).css("background-color");
                var hex1 = rgb2hex(rgb1);
                corPrimaria = hex1;

                var rgb2 = $(this).find(".corTile").css("background-color");
                var hex2 = rgb2hex(rgb2);
                corSecundaria = hex2;

                salvarTemaPadrao(corPrimaria, corSecundaria, corFonte);
                setCores(corPrimaria, corSecundaria, corFonte);

                $(this).parent().find(".configSelectedColorBg").css("background-color", hex1);
                $(this).parent().find(".configSelectedColorTile").css("background-color", hex2);
                $("#backgroundColorPicker").ColorPickerSetColor(corPrimaria.replace("#", ""));
                $("#tileColorPicker").ColorPickerSetColor(corSecundaria.replace("#", ""));

                return false;
            });
        }
    });

}

function carregarUltimasAbas() {
    if (Config.getShowClosedTabs()) {
        chrome.history.search({ text: '', maxResults: 20 }, function (lista) {
            var ul = $("#divClosedTabs > ul");
            ul.html("");

            lista.forEach(function (tab) {
                var li = $("<li></li>");
                var img = $("<img height='16' width='16'></img>");
                var span = $("<span></span>");
                var a = $("<a></a>");

                img.attr("src", "chrome://favicon/size/16@1x/" + tab.url);
                span.html(tab.title);
                a.attr("href", tab.url);
                a.html(tab.url);

                li.attr("title", tab.title);

                li.append(img);
                li.append(span);
                li.append(a);

                li.click(function () {
                    var url = $(this).find("a").attr("href");
                    if (e.which == 1) {
                      window.location = url;
                      return false;
                    } else if (e.which == 2) {
                      chrome.tabs.create({
                        url: url,
                        active: false
                      });
                      return false;
                    }
                });

                ul.append(li);
            });
        })
    }
}

function carregarBookmarks() {
    if (Config.getShowBookmarks()) {
        chrome.bookmarks.getTree(function (e) {
            var lista = e[0].children;
            //var barraFavoritos = lista[0].children;

            var ul = $("#ulBookmarks");
            ul.html("");

            htmlListaBookmarks(lista, ul);

            ul.find("li.pasta:first-child ul").eq(0).show();
        })
    }
}

function htmlListaBookmarks(lista, ul) {
    lista.forEach(function (favorito) {
        var li = $("<li></li>");
        var img = $("<img height='16' width='16'></img>");
        var a = $("<a></a>");

        var iconSrc = favorito.url
                        ? "chrome://favicon/size/16@1x/" + favorito.url
                        : 'imgs/bookmarks/folder-mac.png';

        // bookmarks bar icons are loaded instantly
        if (favorito.parentId < 2) {
            img.attr("src", iconSrc);
        }
        // loading other icons is delayed to stay fast
        else {
            img.attr("data-src", iconSrc);
            img.attr("src", "about:blank");
        }

        a.attr("href", favorito.url);

        if (favorito.title != "") {
            a.html(favorito.title);
            a.addClass("titulo");
        } else {
            a.html(favorito.url);
        }

        li.attr("title", favorito.title);

        li.append(img);
        li.append(a);

        if (favorito.children) {

            var ulChildren = $("<ul></ul>");

            htmlListaBookmarks(favorito.children, ulChildren);

            a.addClass("nomePasta");

            li.append(ulChildren);

            li.addClass("pasta");

            li.click(function (e) {
                //e.preventDefault();
                //if (this != e.target) return true;
                var sublist = $(this).find("ul").eq(0);
                sublist.find('> li img').each(function () {
                    if (this.src == 'about:blank')
                        this.src = $(this).attr('data-src');
                });
                sublist.animate({ height: 'toggle' }, 200);
                return false;///
            });

        } else {

            li.click(function (e) {
                var url = $(this).find("a").attr("href");
                if (e.which == 1) {
                  window.location = url;
                  return false;
                } else if (e.which == 2) {
                  chrome.tabs.create({
                    url: url,
                    active: false
                  });
                  return false;
                }
            });
        }

        ul.append(li);
    });
}

function salvarTemaPadrao(corPrimaria, corSecundaria, corFonte) {
    var temaPadrao = new Object();
    temaPadrao.corPrimaria = corPrimaria;
    temaPadrao.corSecundaria = corSecundaria;
    temaPadrao.corFonte = corFonte;
    Storage.temaPadrao = temaPadrao;
}

function carregarTemaPadrao() {
    if (Storage.temaPadrao) {
        var temaPadrao = Storage.temaPadrao;
        corPrimaria = temaPadrao.corPrimaria;
        corSecundaria = temaPadrao.corSecundaria;
        corFonte = temaPadrao.corFonte;
    }

    setCores(corPrimaria, corSecundaria, corFonte);
}

function setCores(corPrimaria, corSecundaria, corFonte) {

    $(".BGColor").css("background-color", corPrimaria);
    $(".tileColor").css("background-color", corSecundaria);

    //$("a, span, input, h2").css("color", corFonte);
    //$("input, .configTile, .imageList, .imageUrl, .colorConfig").css("border-color", corFonte);
    //$(".selectedConfigColor").css("border", "1px solid " + corFonte);

    //configEvents();
    $(".tile").each(function(){ Tile.refreshBorder($(this)) });

    $(".temas .configSelectedColorBg").css("background-color", corPrimaria);
    $(".temas .configSelectedColorTile").css("background-color", corSecundaria);
}

function detectBackgroundBrightness() {
    if (isColorVeryBright(hex2rgb(corPrimaria))) {
        $("body").addClass('bright-bg');
    } else {
        $("body").removeClass('bright-bg');
    }

    if (isColorDark(hex2rgb(corSecundaria))) {
        $(".tileColor").addClass('dark-tile-bg');
    } else {
        $(".tileColor").removeClass('dark-tile-bg');
    }

    setCores(corPrimaria, corSecundaria, corFonte);
}

function carregarBackgroundImage() {
    if (Storage.backgroundImage) {
        $(".bg").css("background-image", "url(" + Storage.backgroundImage + ")");
    }
}

function carregarConfigs() {
    $("#txtVisibleRows").val(Config.getRowNumber());

    $("#txtVisibleColumns").val(Config.getColumnNumber());

    if (Config.getAnimacaoInicialTiles() == true) {
        $("#chkTilesAnimation").attr("checked", "checked");
        $(".pAnimationOptions").css('display', '');
    } else {
        $("#chkTilesAnimation").removeAttr("checked");
        $(".pAnimationOptions").css('display', 'none');
    }

    $("#sldAnimationSpeed").val(Config.getVelocidadeAnimacaoInicialTiles());

    if (Config.getHideAddButton() == true)
        $("#chkHideAddButton").attr("checked", "checked");
    else
        $("#chkHideAddButton").removeAttr("checked");


    if (Config.getSmoothScroll() == true) {
        $("#smoothScroll").attr("checked", "checked");
    } else {
        $("#smoothScroll").removeAttr("checked");
    }
    if (Config.getShowClosedTabs() == true) {
        $("#divClosedTabs").css('display', '');
        $("#chkShowTabs").attr("checked", "checked");
    } else {
        $("#divClosedTabs").css('display', 'none');
        $("#chkShowTabs").removeAttr("checked");
    }

    if (Config.getShowBookmarks() == true) {
        $("#divBookmarks").css('display', '');
        $("#chkShowBookmarks").attr("checked", "checked");
    } else {
        $("#divBookmarks").css('display', 'none');
        $("#chkShowBookmarks").removeAttr("checked");
    }

    carregarAppsButton();

    $(".footer").removeClass("top");
    $(".footer").removeClass("bottom");
    $(".footer").removeClass("left");
    $(".footer").removeClass("right");

    var position = Config.getFooterPosition();
    $(".footer").addClass(position);

    if (position == "top left") {
        $("#rdTopLeft").attr("checked", "checked");
    } else if (position == "top right") {
        $("#rdTopRight").attr("checked", "checked");
    } else if (position == "bottom left") {
        $("#rdBottomLeft").attr("checked", "checked");
    } else if (position == "bottom right") {
        $("#rdBottomRight").attr("checked", "checked");
    }
}

$.fn.clickOutside = function(callback) {
    var self = this;
    $("body").mousedown(function (e) {
        if (e.which != 1) return true;
        var isInside = $(e.target).closest(self)[0];
        if (!isInside) {
            callback && callback.call(self, e);
        }
    });
};
$.fn.hideOnClickOutside = function(callback) {
    var self = this;
    self.clickOutside(function () {
        self.stop().hide(200);
    });
};


function configEvents() {

    $(".btnAddTileNew").click(function () {
        ConfigTile(0);
        return false;
    });

    $("body").on('contextmenu', '.bg, #main', function(e) {

        // leave tile right click alone
        if ($(e.target).closest('.tile').length)
          return true;

        var rect = {
            left: e.clientX,
            right: '',
            top: e.clientY,
            bottom: ''
        };
        if (e.clientX > window.innerWidth - $('.config').outerWidth()) {
            rect.right = window.innerWidth - e.clientX;
            rect.left = '';
        }
        if (e.clientY > window.innerHeight - $('.config').outerHeight()) {
            rect.bottom = window.innerHeight - e.clientY;
            rect.top = 'auto';
        }
        $(".config").css(rect);
        $(".config").show(200);
        e.preventDefault();
    });


    //Abrir config
    $(".btConfig").unbind("click");
    $(".btConfig").click(function () {
        $(".config").css({
            left: '', top: '', right: '', bottom: ''
        });
        $(".config").show(200);
        return false;
    });

    //Pra fechar qndo em clica em qualquer lugar fora
    $(".footer > div").clickOutside(function (e) {
        $(".footer").css("height", "");
        $(".footer > div").removeClass("act");
        $(".footer > div").removeClass("secundario");
        $(".footer > div > ul").hide();
        $(".footer > div > div").hide();
    });

    $(".config").clickOutside(function (e) {
        if ($(e.target).is('.btConfig'))
            return true;
        $(".config").hide(200);
        $(".config .temas").hide(200);
        $(".config .backgrounds").hide(200);
        $(".config .tilesSize").hide(200);
    });

    $(".appContextMenu").hideOnClickOutside();


    //Abrir cada configuração
    $(".config p").unbind("click");
    $(".config p").click(function () {
        $(this).next().animate({ height: 'toggle' });
    });

    //Mais opções
    $(".config .cMoreOptions").unbind("click");
    $(".config .cMoreOptions").click(function () {
        $(".moreOptions").lightbox_me({ centered: true, lightboxSpeed: 200, overlaySpeed: 100 });
    });

    //Número de linhas
    $("#txtVisibleRows").unbind("change");
    $("#txtVisibleRows").change(function () {
        Config.setRowNumber($(this).val());

        windowResize();
    });

    //Número de colunas
    $("#txtVisibleColumns").unbind("change");
    $("#txtVisibleColumns").change(function () {
        Config.setColumnNumber($(this).val());

        windowResize();
    });

    $("#chkTilesAnimation").unbind("change");
    $("#chkTilesAnimation").change(function () {
        if ($(this).is(":checked")) {
            Config.setAnimacaoInicialTiles(true);
            $(".pAnimationOptions").show();
        } else {
            Config.setAnimacaoInicialTiles(false);
            $(".pAnimationOptions").hide();
        }
    });

    //Velocidade da animacao dos tiles
    $("#sldAnimationSpeed").unbind("change");
    $("#sldAnimationSpeed").change(function () {
        Config.setVelocidadeAnimacaoInicialTiles($(this).val());
    });

    //Testar animação dos tiles
    $(".pAnimationOptions .test").unbind("click");
    $(".pAnimationOptions .test").click(function () {
        Tile.PosicionarTilesPrimeiraVez();
    });

    //Hide add button
    $("#chkHideAddButton").unbind("change");
    $("#chkHideAddButton").change(function () {
        if ($(this).is(":checked")) {
            Config.setHideAddButton(true);
            $(".btnAddTile").css("opacity", "0");
        } else {
            Config.setHideAddButton(false);
            $(".btnAddTile").css("opacity", ".2");
        }
    });

    $("#smoothScroll").unbind("change");
    $("#smoothScroll").change(function () {
        if ($(this).is(":checked")) {
            Config.setSmoothScroll(true);
        } else {
            Config.setSmoothScroll(false);
        }
    });

    //Show recently closed tabs
    $("#chkShowTabs").unbind("change");
    $("#chkShowTabs").change(function () {
        if ($(this).is(":checked")) {
            Config.setShowClosedTabs(true);
            $("#divClosedTabs").show();
            carregarUltimasAbas();
        } else {
            Config.setShowClosedTabs(false);
            $("#divClosedTabs").hide();
        }
    });

    //Show bookmarks
    $("#chkShowBookmarks").unbind("change");
    $("#chkShowBookmarks").change(function () {
        if ($(this).is(":checked")) {
            Config.setShowBookmarks(true);
            $("#divBookmarks").show();
            carregarBookmarks();
        } else {
            Config.setShowBookmarks(false);
            $("#divBookmarks").hide();
        }
    });

    //Show apps on a separate page
    $("#chkShowAppsSeparatePage").unbind("change");
    $("#chkShowAppsSeparatePage").change(function () {
        if ($(this).is(":checked")) {
            Config.setShowAppsSeparatePage(true);
            carregarAppsButton();
            carregarApps();
        } else {
            Config.setShowAppsSeparatePage(false);
            $(".goLeft").trigger("click");
            carregarAppsButton();
            carregarApps();
        }
    });

    //Posições do footer
    //Top left
    $("#rdTopLeft").unbind("change");
    $("#rdTopLeft").change(function () {
        if ($(this).is(":checked")) {
            Config.setFooterPosition("top left");
            $(".footer").attr("class", "footer top left");
        }
    });

    //Top right
    $("#rdTopRight").unbind("change");
    $("#rdTopRight").change(function () {
        if ($(this).is(":checked")) {
            Config.setFooterPosition("top right");
            $(".footer").attr("class", "footer top right");
        }
    });

    //Bottom left
    $("#rdBottomLeft").unbind("change");
    $("#rdBottomLeft").change(function () {
        if ($(this).is(":checked")) {
            Config.setFooterPosition("bottom left");
            $(".footer").attr("class", "footer bottom left");
        }
    });

    //Bottom right
    $("#rdBottomRight").unbind("change");
    $("#rdBottomRight").change(function () {
        if ($(this).is(":checked")) {
            Config.setFooterPosition("bottom right");
            $(".footer").attr("class", "footer bottom right");
        }
    });

    //Resetar
    $("#btnReset").unbind("click");
    $("#btnReset").click(function () {
        confirm({
            title: chrome.i18n.getMessage("mo_reset_title"),
            message: chrome.i18n.getMessage("mo_reset_desc1") + "<br />" + chrome.i18n.getMessage("mo_reset_desc2"),
            yes: function () {
                corPrimaria = "#001940";
                corSecundaria = "#006AC1";
                corFonte = "#FFFFFF";
                Storage.Clear();
                Tile.primeiroPosicionamento = true;
                oldWidth = 0;
                carregarTudo();
            }
        });
    });

    //Exportar
    $("#btnExport").unbind("click");
    $("#btnExport").click(function () {
        var blob = new Blob([JSON.stringify(localStorage)]);
        this.href = window.URL.createObjectURL(blob);
        this.download = "data.mntp";
    });

    //Importar
    $("#btnImport").unbind("click");
    $("#btnImport").click(function () {
        $("#fileImport").trigger("click");
    });

    $("#fileImport").unbind("change");
    $("#fileImport").change(function () {
        var file = this.files[0];

        if (file) {
            var reader = new FileReader();

            reader.onload = (function (file) {
                return function (e) {
                    Storage.Load(e.target.result);
                    carregarTudo();
                };
            })(file);

            reader.readAsText(file);
        }
    });

    //Custom...
    $("#btnCustomColor").unbind("click");
    $("#btnCustomColor").click(function () {
        $(".colorConfig").lightbox_me({ centered: true, overlayCSS: {opacity:0} });
        //Custom background color
        $("#backgroundColorPicker").ColorPicker({
            color: corPrimaria,
            flat: true,
            onChange: function (hsb, hex, rgb) {
                corPrimaria = "#" + hex;

                salvarTemaPadrao(corPrimaria, corSecundaria, corFonte);
                setCores(corPrimaria, corSecundaria, corFonte);
            }
        });

        //Custom tile color
        $("#tileColorPicker").ColorPicker({
            color: corSecundaria,
            flat: true,
            onChange: function (hsb, hex, rgb) {
                corSecundaria = "#" + hex;

                salvarTemaPadrao(corPrimaria, corSecundaria, corFonte);
                setCores(corPrimaria, corSecundaria, corFonte);
            }
        });
    });

    //Fechar custom color
    $("#btnCloseColor").unbind("click");
    $("#btnCloseColor").click(function () {
        $(".colorConfig").trigger("close");
    });

    //Background
    $("#btnBackgroundImage").unbind("click");
    $("#btnBackgroundImage").click(function () {
        $("#upBackgroundImage").trigger("click");
    });

    $("#upBackgroundImage").unbind("change");
    $("#upBackgroundImage").change(function () {
        $("body").removeClass('bright-bg');

        var file = this.files[0];

        if (!file.type.match('image.*')) {
            alert("Please select an image file");
        }
        else {
            var reader = new FileReader();

            reader.onload = (function (file) {
                return function (e) {
                    salvarBackground(e.target.result);
                    carregarBackground();
                };
            })(file);

            reader.readAsDataURL(file);
        }
    });

    $("#txtOpacity").unbind("keydown");
    $("#txtOpacity").keydown(function () {
        salvarBackground();
        carregarBackground();
    });

    //No-repeat, adjust, fill, opacidade
    $("#chkNoRepeat, #chkAdjust, #chkFill, #txtOpacity").unbind("change");
    $("#chkNoRepeat, #chkAdjust, #chkFill, #txtOpacity").change(function () {
        if (this.id == "chkAdjust")
            $("#chkFill").removeAttr("checked");
        else if (this.id == "chkFill")
            $("#chkAdjust").removeAttr("checked");

        salvarBackground();
        carregarBackground();
    });

    //Remover background
    $("#btnRemoveBackground").unbind("click");
    $("#btnRemoveBackground").click(function () {
        Storage.background = '';
        Storage.backgroundImage = '';

        carregarBackground();
    });

    //Abrir APP
    $(".app").unbind("click");
    $(".app").live("click", function () {
        if ($(this).data("enabled")) {
            var url = $(this).data("url");

            chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.update(tab.id, { url: url });
            });
        }
    });

    //Click direito em um APP
    $(".app").unbind("contextmenu");
    $(".app").live("contextmenu" , function (e) {
        var id = $(this).data("id");

        if (id != "ahfgeienlihckogmohjhadlkjgocpleb") { //Web store não pode desinstalar
            $(".appContextMenu").css("top", e.pageY + "px");
            $(".appContextMenu").css("left", e.pageX + "px");
            $(".appContextMenu").show();



            $(".appContextMenu li").eq(0).unbind("click");
            $(".appContextMenu li").eq(0).click(function () {
                chrome.management.uninstall(id, { showConfirmDialog: true }, function () {
                    carregarApps();
                    $(".appContextMenu").hide();
                });
            });
        }

        return false;

    });
}

function footerEvents() {

    $(".footer p").unbind("click");
    $(".footer p").click(function () {
        var item = $(this).parent("div.item");

        $(".footer > div > ul").hide();
        $(".footer > div > div").hide();

        if (item.hasClass("act")) {
            $(".footer").css("height", "");
            $(".footer > div").removeClass("act");
            $(".footer > div").removeClass("secundario");
        } else {
            $(".footer").css("height", "395px");
            $(".footer > div").removeClass("act");
            $(".footer > div").addClass("secundario");

            item.removeClass("secundario");
            item.addClass("act");
            item.find("> ul").show();
            item.find("> div").show();
        }

        return false;
    });

    //$(".footer .item").on('webkitTransitionEnd', function () {
    //    if (!$(this).hasClass("act"))
    //        $(".footer > div[class~=secundario]").removeClass("secundario");

    //    console.log("end");
    //});
}

function salvarBackground(img) {
    var background = new Object();

    if (img)
        Storage.backgroundImage = img;

    if (Storage.background)
        background = Storage.background;

    background.Opacity = $("#txtOpacity").val();
    background.NoRepeat = $("#chkNoRepeat").is(":checked");
    background.Adjust = $("#chkAdjust").is(":checked");
    background.Fill = $("#chkFill").is(":checked");

    Storage.background = background;
}

function carregarBackground() {
    var bg = $(".bg");
    var temBg = false;

    if (Storage.backgroundImage) {
        bg.css("background-image", "url(" + Storage.backgroundImage + ")");
        temBg = true;
    } else {
        bg.css("background-image", "");
    }

    if (Storage.background) {
        var background = Storage.background;

        if (background.Opacity) {
            bg.css("opacity", background.Opacity);
            $("#txtOpacity").val(background.Opacity);
        } else {
            bg.css("opacity", 1);
            $("#txtOpacity").val(.8);
        }

        if (background.NoRepeat) {
            bg.css("background-repeat", "no-repeat");
            $("#chkNoRepeat").attr("checked", "checked");
        } else {
            bg.css("background-repeat", "repeat");
            $("#chkNoRepeat").removeAttr("checked");
        }

        if (background.Adjust) {
            bg.css("background-size", "100%");

            $("#chkAdjust").attr("checked", "checked");
            $("#chkFill").removeAttr("checked");
        } else if (background.Fill) {
            bg.css("background-size", "100% 100%");

            $("#chkFill").attr("checked", "checked");
            $("#chkAdjust").removeAttr("checked");
        } else {
            bg.css("background-size", "");

            $("#chkAdjust").removeAttr("checked");
            $("#chkFill").removeAttr("checked");
        }

        temBg = true;
    }

    if (temBg) {
        $("#btnRemoveBackground, .config .campo").css('display', '');
    } else {
        $("#btnRemoveBackground, .config .campo").css('display', 'none');
    }
}

function loadSliders() {
    //Slider de tamanho dos tiles
    addDependencyFunction('jquery-ui', function () {
        $("#sliderTilesSize").slider({
            value: Tile.getTilesPct(),
            min: 70,
            max: 130,
            step: 5,
            slide: function (event, ui) {
                Tile.setTilesPct(ui.value);
                $(".spnSlider").html(ui.value + "%");
            }
        });

        $(".spnSlider").html(Tile.getTilesPct() + "%");
    });
}

function navigationEvents() {
    $(".goRight").click(function () {
        var wJanela = $(window).width();
        var wMain = $("#main").width() + $("#main").offset().left;

        $(".main").removeClass("pausado")

        $(".goRight").hide();
        $(".goLeft").show();

        $("#main").css("-webkit-transform", "translate(-" + wMain + "px)");
        $("#mainApps").css("-webkit-transform", "");

        resizeMainApps();
    });

    $(".goLeft").click(function () {
        var wJanela = $(window).width();

        $(".main").removeClass("pausado")

        $(".goRight").show();
        $(".goLeft").hide();

        $("#main").css("-webkit-transform", "");
        $("#mainApps").css("-webkit-transform", "translate(" + wJanela + "px)");

        resizeMain();
    });
}

function carregarAppsButton() {
    if (Config.getShowAppsSeparatePage()) {
        $("#mainApps, .goRight").css("display", "");
        $(".footer #divApps").css("display", "none")

        $("#mainApps").html("");
    } else {
        $("#mainApps, .goLeft, .goRight").css("display", "none") //.hide();
        $(".footer #divApps").css("display", "");

        $(".footer #divApps .appList").html("");
    }
}


function carregarApps() {
    var addApp = function (app) {
        if (app.isApp) {
            var divApp = $("<div class='app'></div>");

            for (var x = 0; x < app.icons.length; x++) {
                if (app.icons[x].size == 128) {
                    if (app.enabled)
                        divApp.css("background-image", "url('" + app.icons[x].url + "')");
                    else
                        divApp.css("background-image", "url('" + app.icons[x].url + "?grayscale=true')");
                }
            }

            divApp.attr("title", app.name);
            divApp.data("url", app.appLaunchUrl);
            divApp.data("id", app.id);
            divApp.data("enabled", app.enabled);

            if (Config.getShowAppsSeparatePage())
                $("#mainApps").append(divApp);
            else {
                divApp.append("<span>" + app.name + "</span>");

                $(".footer #divApps .appList").append(divApp);
            }

        }
    }

    //app da chrome store
    chrome.management.get("ahfgeienlihckogmohjhadlkjgocpleb", function (app) {
        addApp(app);
    })

    //apps instalados
    var apps = chrome.management.getAll(function (apps) {
        for (var i = 0; i < apps.length; i++) {
            var app = apps[i];
            addApp(app);
        }

        resizeMainApps();
    });

}

function windowEvents() {
    //Qndo redimenciona a janela
    $(window).resize(function () {
        windowResize();
    });

    windowScroll();
}

var primeiroResize = true;
var oldWidth;
var oldHeight;
function windowResize() {
    if (primeiroResize) {
        primeiroResize = false;
    } else {
        $(".main").removeClass("pausado")
    }

    resizeMain(true);
    resizeMainApps();
}

function resizeMain(posicionar) {
    if (Config.getTilesOrientation() == "H") {
        resizeMainHorizontal(posicionar);
    } else {
        resizeMainVertical(posicionar);
    }
}

function resizeMainHorizontal(posicionar) {
    var h = window.innerHeight;
    var w = window.innerWidth;
    var columns = Tile.getColunas();
    var linhas = Tile.getLinhas();

    //-- Tratamento do Width --
    //novo width da div .main
    var w2 = 1176;
    //espaço ocupado por tile
    var tileSize = Tile.TileSize1() + 4;
    //tamanho do scroll
    var ts = 7;
    //qtd de colunas q vão caber na tela

    //espaço minimo q tem q sobrar de cada lado da div .main
    //(150px de cada seta pro lado + 80px de folga pra kda lado)
    var padding = w > 1600 ? 360 : 180;

    w2 = columns * tileSize + ts;

    padding = w - w2;
    var espacoL = Math.floor(padding / 2);

    $("#main").css("width", w2);
    $("#main").css("left", espacoL);

    if (w2 != oldWidth && posicionar) {
        Tile.PosicionarTiles();
        oldWidth = w2;
    }

    //-- Tratamento do Height --
    //novo height da div .main
    var h2 = 588;
    //qtd de linhas q vão caber na tela
    var rows = 0;
    //espaço minimo q tem q sobrar de cada lado da div .main
    //(110px pra cima e pra baixo)
    padding = 110; // 220

    rows = Math.floor((h - padding) / tileSize);
    rows = rows <= 0 ? 1 : rows;


    if (rows > linhas) {
        rows = linhas;
    }

    h2 = rows * tileSize;

    padding = h - h2;
    var espacoL = Math.floor(padding / 2);

    $("#main").css("height", h2);
    $("#main").css("top", espacoL);

    $(".config").css("max-height", (h - 80));
}

function resizeMainVertical(posicionar) {
    //espaço ocupado por tile
    var t = Tile.TileSize1() + 4;
    //Height da janela
    var h = $(window).height();

    var linhas = Tile.getLinhas();

    h2 = linhas * t;

    if (h2 != oldHeight) {
        Tile.PosicionarTiles();
        oldHeight = h2;
    }

    $("#main").css("height", h2 + "px");
    $("#main").css("top", "120px");
    $("#main").css("left", "120px");

    $(".config").css("max-height", (h - 80) + "px");
}

function resizeMainApps() {
    var w = $(window).width();
    var h = $(window).height();
    //-- Tratamento do Width --
    //novo width da div .main
    var w2 = 1176;
    //espaço ocupado por tile
    var t = 180;
    //tamanho do scroll
    var ts = 7;
    //qtd de colunas q vão caber na tela
    var qtdC = 8;
    //espaço minimo q tem q sobrar de cada lado da div .main
    //(150px de cada seta pro lado + 80px de folga pra kda lado)
    var sobra = 460;

    qtdC = Math.floor((w - sobra) / t);
    qtdC = qtdC <= 1 ? 2 : qtdC;

    w2 = qtdC * t + ts;

    sobra = w - w2;
    var espacoL = Math.floor(sobra / 2);

    $("#mainApps").css("width", w2 + "px");
    $("#mainApps").css("left", espacoL + "px");

    //-- Tratamento do Height --
    //novo height da div .main
    var h2 = 588;
    //qtd de linhas q vão caber na tela
    qtdL = 0;
    //espaço minimo q tem q sobrar de cada lado da div .main
    //(110px pra cima e pra baixo)
    sobra = 220;

    qtdL = Math.floor((h - sobra) / t);
    qtdL = qtdL <= 0 ? 1 : qtdL;

    var linhas = 1;
    var apps = $(".app");
    var coluna = 1;
    for (var i = 0; i < apps.length; i++) {
        if (coluna + 1 > qtdC + 1) {
            linhas++;
            coluna = 1;
        }
        coluna += 1;
    }

    if (qtdL > linhas) {
        qtdL = linhas;
    }

    h2 = qtdL * t;

    sobra = h - h2;
    var espacoL = Math.floor(sobra / 2);

    $("#mainApps").css("height", h2);
    $("#mainApps").css("top", espacoL);
}

function windowScroll() {
    if (Config.getSmoothScroll() == true){
        addDependencyFunction('smoothScroll', function () {
            $(".config").smoothScroll({ speed: 300 });
            $("#main").smoothScroll({ speed: 300, snap: true, delta: Tile.TileSize1() + 4 });
            $("#mainApps").smoothScroll({ snap: true, delta: 180 });
            $(".footer .item").smoothScroll({ speed: 50 });
        });
    }
}

function alert(title, message) {
    $(".alert p.title").html(title);
    $(".alert p.message").html(message);
    $(".alert").lightbox_me({ centered: true });

    $(".alert .btnOK").show();
    $(".alert .btnYes").hide();
    $(".alert .btnNo").hide();

    $(".alert .btnOK").unbind("click");
    $(".alert .btnOK").click(function () {
        $(".alert").trigger("close");
    });
}

function confirm(opts) {
    if (opts.title)
        $(".alert p.title").html(opts.title);

    if (opts.message)
        $(".alert p.message").html(opts.message);

    $(".alert").lightbox_me({ centered: true });

    $(".alert .btnOK").hide();
    $(".alert .btnYes").show();
    $(".alert .btnNo").show();

    $(".alert .btnNo").unbind("click");
    $(".alert .btnNo").click(function () {
        if (opts.no)
            opts.no();

        $(".alert").trigger("close");
    });

    $(".alert .btnYes").unbind("click");
    $(".alert .btnYes").click(function () {
        if (opts.yes)
            opts.yes();

        $(".alert").trigger("close");
    });
}

//Transforma rgb em hex
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

//Transforma hex em rgb
function hex2rgb(hex) {
    if (hex[0] == "#") hex = hex.substr(1);
    if (hex.length == 3) {
        var temp = hex; hex = '';
        temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
        for (var i = 0; i < 3; i++) hex += temp[i] + temp[i];
    }
    var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
    return {
        r: parseInt(triplets[0], 16),
        g: parseInt(triplets[1], 16),
        b: parseInt(triplets[2], 16)
    }
}

function verificaVersao() {
    if (!Storage.versao || Storage.versao < 0.52) {
        Storage.temaPadrao = null;
        Storage.backgroundPadrao = null;

        Storage.versao = 1.13;
    }

    if (!Storage.versao || Storage.versao < 1.30) {
        setTimeout(function () {
            processaImagens();
        }, 4000);

        Storage.versao = 1.30;
    }
}

function ParaTudo() {
    $(".goRight").hide();
    $(".btConfig").hide();
    $(".btnAddTile").hide();
    Tile.Animar = false;
}

function processaImagens() {
    var tiles = Storage.tiles;

    processaTile(tiles, 0);
}

function processaTile(tiles, i) {
    var tile = tiles[i];

    if (tile.Imagem && /^(http|chrome-extension|imgs\/tiles)/i.test(tile.Imagem)) {
        var img = new Image();
        img.setAttribute("tileId", tile.Id.toString());

        img.onload = function () {
            processaImagem(img, function (imgProcessada, imgAntiga) {
                var tileAux = Tile.GetTile(parseInt(imgAntiga.getAttribute("tileId")));
                tileAux.Imagem = imgProcessada.src;
                tileAux.Salvar();

                if (i + 1 < tiles.length)
                    processaTile(tiles, i + 1);
            });
        }

        img.src = tile.Imagem;
    } else if (i + 1 < tiles.length) {
        processaTile(tiles, i + 1);
    }
}

function processaImagem(img, callback) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    var MAX_WIDTH = 110;
    var MAX_HEIGHT = 110;
    var width = img.width;
    var height = img.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }

    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    var imgProcessada = new Image();

    imgProcessada.onload = function () {
        callback(imgProcessada, img);
    }

    imgProcessada.src = canvas.toDataURL("image/png");
}

function translate() {
    $("*[data-message], *[data-message-title], *[data-message-value]").each(function () {
        var elm = $(this);
        var message = elm.data("message");
        var title = elm.data("message-title");
        var value = elm.data("message-value");
        if (message)
            elm.html(chrome.i18n.getMessage(message));
        if (title)
            elm.attr("title", chrome.i18n.getMessage(title));
        if (value)
            elm.val(chrome.i18n.getMessage(value));
    });
}
