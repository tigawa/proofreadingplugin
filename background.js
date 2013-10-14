chrome.contextMenus.create({
    "title": "校正チェック",
    "type": "normal",
    "contexts": ["editable"],
    "onclick": function(info) {	
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {}, function(response){});
		});
    }
});
