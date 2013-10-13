chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    // ダイアログを表示する。
    showDialog(request.message);
    // レスポンスを返す。
    sendResponse({});
  }
);

/**
 *ダイアログを表示する。
 *@parm message ダイアログに表示するメッセージ
 */
function showDialog( message ){
	var div = document.createElement('div');
	div.id = 'MSG_DIALOG_20131012152901111';
	div.innerHTML = message;
	document.body.appendChild(div);

	$('#MSG_DIALOG_20131012152901111').dialog({
		autoOpen: true, // ここで起動する。
		height: "auto",
		width: "auto",
		modal: false, // モーダルとして機能しない。
		closeOnEscape: true, // ESCでダイアログを閉じる
		closeText: "閉じる", //close 「×」ボタンのツールチップ。
		buttons: {  	// ダイアログに表示するボタンと処理
//			"保存": function(){},
			"閉じる": function(){
				$('#MSG_DIALOG_20131012152901111').dialog("close");
			}
		},	
		// ダイアログのイベント処理
		open: function(event, ui) {},
		close: function() {$('#MSG_DIALOG_20131012152901111').remove();}
       	 });
       	 
       	 //$('#MSG_DIALOG_20131012152901111').dialog("open");
       	 //$('#MSG_DIALOG_20131012152901111').dialog("moveToTop");
}
