chrome.contextMenus.create({
    "title": "校正チェック",
    "type": "normal",
    "contexts": ["selection"],
    "onclick": function(info) {
        var url = 'http://proofreadingchecker.herokuapp.com/sentence/check?sentence=' + encodeURIComponent(info.selectionText);
        chrome.tabs.create({
            url: url
        });
    }
});
