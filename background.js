chrome.contextMenus.create({
    "title": "校正チェック",
    "type": "normal",
    "contexts": ["selection"],
    "onclick": function(info) {
        var url = 'http://proofreadingchecker.herokuapp.com/sentence/check?sentence=' + encodeURIComponent(info.selectionText);

//	chrome.tabs.sendRequest(tab.id, param, function(response) {
//		console.log("highlight response");
//	});
		
		
        // chrome.tabs.create({
        //     url: url
        // });
    }
});
