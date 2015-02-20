var _temaPadrao,
    _backgroundPadrao,
    _backgroundImage,
    _background,
    _versao,
    _tilesSize, //(tiles_PCT)
    _tiles,
    _animacaoInicialTiles,
    _velocidadeAnimacaoInicialTiles,
    _hideAddButton,
    _rowNumber,
    _columnNumber,
    _showClosedTabs,
    _showBookmarks,
    _showAppsSeparatePage,
    _footerPosition;


MNTPStorage = {
    get temaPadrao() {
        if (!_temaPadrao && localStorage.temaPadrao)
            _temaPadrao = JSON.parse(localStorage.temaPadrao);

        return _temaPadrao;
    },

    set temaPadrao(value) {
        if (value) {
            _temaPadrao = value;
            localStorage.temaPadrao = JSON.stringify(value);
        }
    },

    get backgroundPadrao() {
        if (!_backgroundPadrao && localStorage.backgroundPadrao)
            _backgroundPadrao = localStorage.backgroundPadrao;

        return _backgroundPadrao;
    },

    set backgroundPadrao(value) {
        if (value) {
            _backgroundPadrao = value;
            localStorage.backgroundPadrao = value;
        }
    },

    get backgroundImage() {
        if (!_backgroundImage && localStorage.backgroundImage)
            _backgroundImage = localStorage.backgroundImage;

        return _backgroundImage;
    },

    set backgroundImage(value) {
        //if (value) {
            //saveDataToFile(value, function (url) {
            //    _backgroundImage = url;
            //    localStorage.backgroundImage = url;
            //});

            _backgroundImage = value;
            localStorage.backgroundImage = value;
        //}
    },

    get background() {
        if (!_background && localStorage.background)
            _background = JSON.parse(localStorage.background);

        return _background;
    },

    set background(value) {
        //if (value) {
            _background = value;
            localStorage.background = JSON.stringify(value);
        //}
    },

    get versao() {
        if (!_versao && localStorage.versao)
            _versao = localStorage.versao;

        return _versao;
    },

    set versao(value) {
        if (value) {
            _versao = value;
            localStorage.versao = value;
        }
    },

    get tilesSize() {
        if (!_tilesSize && localStorage.tilesSize)
            _tilesSize = localStorage.tilesSize;

        return _tilesSize;
    },

    set tilesSize(value) {
        if (value) {
            _tilesSize = value;
            localStorage.tilesSize = value;
        }
    },

    get tiles() {
        if (!_tiles && localStorage.tiles)
            _tiles = JSON.parse(localStorage.tiles);

        return _tiles;
    },

    set tiles(value) {
        if (value) {
            _tiles = value;
            localStorage.tiles = JSON.stringify(value);
        }
    },

    get animacaoInicialTiles() {
        if (!_animacaoInicialTiles && localStorage.animacaoInicialTiles)
            _animacaoInicialTiles = parseInt(localStorage.animacaoInicialTiles);

        return _animacaoInicialTiles;
    },

    set animacaoInicialTiles(value) {
        //if (value) {
            _animacaoInicialTiles = value;
            localStorage.animacaoInicialTiles = value;
        //}
    },

    get velocidadeAnimacaoInicialTiles() {
        if (!_velocidadeAnimacaoInicialTiles && localStorage.velocidadeAnimacaoInicialTiles)
            _velocidadeAnimacaoInicialTiles = localStorage.velocidadeAnimacaoInicialTiles;

        return _velocidadeAnimacaoInicialTiles;
    },

    set velocidadeAnimacaoInicialTiles(value) {
        if (value) {
            _velocidadeAnimacaoInicialTiles = value;
            localStorage.velocidadeAnimacaoInicialTiles = value;
        }
    },

    get hideAddButton() {
        if (!_hideAddButton && localStorage.hideAddButton)
            _hideAddButton = localStorage.hideAddButton;

        return _hideAddButton;
    },

    set hideAddButton(value) {
        //if (value) {
            _hideAddButton = value;
            localStorage.hideAddButton = value;
        //}
    },

    get rowNumber() {
        if (!_rowNumber && localStorage.rowNumber)
            _rowNumber = localStorage.rowNumber;

        return _rowNumber;
    },

    set rowNumber(value) {
        if (value) {
            _rowNumber = value;
            localStorage.rowNumber = value;
        }
    },

    get columnNumber() {
        if (!_columnNumber && localStorage.columnNumber)
            _columnNumber = localStorage.columnNumber;

        return _columnNumber;
    },

    set columnNumber(value) {
        if (value) {
            _columnNumber = value;
            localStorage.columnNumber = value;
        }
    },

    get showClosedTabs() {
        if (!_showClosedTabs && localStorage.showClosedTabs)
            _showClosedTabs = localStorage.showClosedTabs;

        return _showClosedTabs;
    },

    set showClosedTabs(value) {
        //if (value) {
            _showClosedTabs = value;
            localStorage.showClosedTabs = value;
        //}
    },

    get showBookmarks() {
        if (!_showBookmarks && localStorage.showBookmarks)
            _showBookmarks = localStorage.showBookmarks;

        return _showBookmarks;
    },

    set showBookmarks(value) {
        //if (value) {
            _showBookmarks = value;
            localStorage.showBookmarks = value;
        //}
    },

    get showAppsSeparatePage() {
        if (!_showAppsSeparatePage && localStorage.showAppsSeparatePage)
            _showAppsSeparatePage = localStorage.showAppsSeparatePage;

        return _showAppsSeparatePage;
    },

    set showAppsSeparatePage(value) {
        //if (value) {
        _showAppsSeparatePage = value;
        localStorage.showAppsSeparatePage = value;
        //}
    },

    get footerPosition() {
        if (!_footerPosition && localStorage.footerPosition)
            _footerPosition = localStorage.footerPosition;

        return _footerPosition;
    },

    set footerPosition(value) {
        if (value) {
            _footerPosition = value;
            localStorage.footerPosition = value;
        }
    }
}

MNTPStorage.Clear = function () {
    localStorage.clear();

    _temaPadrao = null;
    _backgroundImage = null;
    _background = null;
    _versao = null;
    _tilesSize = null;
    _tiles = null;
    _animacaoInicialTiles = null;
    _velocidadeAnimacaoInicialTiles = null;
    _hideAddButton = null;
    _rowNumber = null;
    _columnNumber = null;
    _showClosedTabs = null;
    _showBookmarks = null;
    _footerPosition = null;

}

MNTPStorage.Load = function (data) {
    var s = JSON.parse(data);

    if (s) {
        if (s.temaPadrao)
            MNTPStorage.temaPadrao = JSON.parse(s.temaPadrao);

        MNTPStorage.backgroundPadrao = s.backgroundPadrao;
        MNTPStorage.backgroundImage = s.backgroundImage;

        if (s.background)
            MNTPStorage.background = JSON.parse(s.background);

        MNTPStorage.versao = s.versao;
        MNTPStorage.tilesSize = s.tilesSize;

        if (s.tiles)
            MNTPStorage.tiles = JSON.parse(s.tiles);

        MNTPStorage.animacaoInicialTiles = s.animacaoInicialTiles;
        MNTPStorage.velocidadeAnimacaoInicialTiles = s.velocidadeAnimacaoInicialTiles;
        MNTPStorage.hideAddButton = s.hideAddButton;
        MNTPStorage.rowNumber = s.rowNumber;
        MNTPStorage.columnNumber = s.columnNumber;
        MNTPStorage.showClosedTabs = s.showClosedTabs;
        MNTPStorage.showBookmarks = s.showBookmarks;
        MNTPStorage.footerPosition = s.footerPosition;
    }
}

function saveDataToFile(data, fileName, callback) {
    window.webkitRequestFileSystem(window.TEMPORARY, data.length, function (fs) {

        fs.root.getFile(fileName, { create: true }, function (fileEntry) {
            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function (e) {
                    console.log('Write completed.');

                    var url = fileEntry.toURL();

                    callback(url);
                };

                fileWriter.onerror = function (e) {
                    console.log('Write failed: ' + e.toString());
                };

                fileWriter.write(new Blob([data], { type: 'text/plain' }));

            }, errorHandler);

        }, errorHandler);

    }, errorHandler);
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    //var bb = new window.WebKitBlobBuilder(); // or just BlobBuilder() if not using Chrome
    //bb.append(ab);
    //return bb.getBlob(mimeString);
    return new Blob([ab]);
};

function errorHandler(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    };

    console.log('Error: ' + msg);
}


// update gmail atom feed
var tiles = MNTPStorage.tiles;
if (tiles && !localStorage.updatedGmailFeed) {
    localStorage.updatedGmailFeed = true;
    for (var i = 0; i < tiles.length; i++) {
        if (/gmail\.com|mail\.google\.com/i.test(tiles[i].Url)) {
            tiles[i].RssUrl = 'https://mail.google.com/mail/feed/atom';
        }
    }
    MNTPStorage.tiles = tiles;
}


// temporary fix for preventing auth popup when logged out
// https://code.google.com/p/chromium/issues/detail?id=31582
chrome.webRequest.onAuthRequired.addListener(
    function (status) {  return {cancel: true}; }, 
    {urls: ["*://mail.google.com/*"]}, 
    ["blocking"]
);