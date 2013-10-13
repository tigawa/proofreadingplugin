chrome.contextMenus.create({
    "title": "校正チェック",
    "type": "normal",
    "contexts": ["selection"],
    "onclick": function(info) {
     	//var url = 'http://proofreadingchecker.herokuapp.com/sentence/check?sentence=' + encodeURIComponent(info.selectionText);
     	
  		//Ajax通信して校正チェックする。
		$.ajax({
			type: "GET",
			url: "http://localhost:3000/sentence/makeup.text",
			data: "sentence=" + encodeURIComponent(info.selectionText),
			success: function(msg){
				//チェック結果をダイアログに表示する。
				//alert( "Data Saved: " + msg );
				sendProofreading(msg);
			}
		 });
    }
});


/**
 * メッセージをcontentscriptに送信する。
 *@parm メッセージ
 */
function sendProofreading(msg){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {message: msg}, function(response) {});
	});
}
