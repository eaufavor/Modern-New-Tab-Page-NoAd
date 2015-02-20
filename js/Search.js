var tiles = new Array();
var apps = new Array();
var history = new Array();
var bookmarks = new Array();

$(document).ready(function () {
    $("#txtSearch").keydown(function () {
        setTimeout(function () {
            var query = $("#txtSearch").val();

            if (query == "") {
                results.html("");
                results.hide();
            } else {
                pesquisa(query);
            }
        }, 0);
    });
});

function pesquisa(query) {
    var results = $(".results");

    chrome.history.search({ text: query, startTime: 0, maxResults: 50 }, function (lista) {

        console.log(lista);

        if (lista.length > 0) {
            results.html("");
            results.show();
        } 

        lista.forEach(function (tab) {
            var p = $("<p></p>");
            var img = $("<img height='16' width='16'></img>");
            var span = $("<span></span>");
            var a = $("<a></a>");

            img.attr("src", "chrome://favicon/size/16@1x/" + tab.url);
            span.html(tab.title);
            a.attr("href", tab.url);
            a.html(tab.url);

            p.attr("title", tab.title);

            p.append(img);
            p.append(span);
            p.append(a);

            p.click(function () {
                var url = $(this).find("a").attr("href");

                chrome.tabs.getCurrent(function (tab) {
                    chrome.tabs.update(tab.id, { url: url });
                });
            });

            results.append(p);
        });

        console.log("buscado");
    })
}

function pesquisaTiles() { }

function pesquisaApps() { }

function pesquisaHistorico() { }

function pesquisaBookmarks() { }