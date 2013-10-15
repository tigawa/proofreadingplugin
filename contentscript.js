chrome.extension.onRequest.addListener(
  function(ignores, sender, sendResponse) {
    //Ajax通信して校正チェックする。
	$.ajax({
		type: "GET",
		// url: "http://localhost:3000/sentence/makeup.json",
		url: "http://proofreadingchecker.herokuapp.com/sentence/makeup.json",
		data: "sentence=" + encodeURIComponent($.selection()),
		dataType: "json",
		success: function(data){
			// ダイアログを表示する。
			showDialog(data.proofreading);
		}
	});
	
	// レスポンスを返す。
    sendResponse({});    
  }
);

/**
 *ダイアログを表示する。
 *@parm message ダイアログに表示するメッセージ
 */
function showDialog(proofreading){
	var div = document.createElement('div');
	div.id = 'MSG_DIALOG_20131012152901111';
	document.body.appendChild(div);
	
	if(proofreading.count == 0){
		$('#MSG_DIALOG_20131012152901111').css('text-align','center');
		var image_url = chrome.extension.getURL('images/stump01-002.gif');
		$('#MSG_DIALOG_20131012152901111').html('<img id="stumpXXXXXXXXXX1" src="' + image_url + '" />');
	} else {
		$('#MSG_DIALOG_20131012152901111').html(proofreading.disp_answer);
	}
	
	$('#MSG_DIALOG_20131012152901111').dialog({
		title: proofreading.summary,
		autoOpen: true, // ここで起動する。
		height: "auto",
		minWidth: 200,
		modal: false, // モーダルとして機能しない。
		closeOnEscape: true, // ESCでダイアログを閉じる
		closeText: "閉じる", //close 「×」ボタンのツールチップ。
		show: "fold",
		hide: "fold",
		buttons: {  	// ダイアログに表示するボタンと処理
			"置き換える": function(){
				setTimeout(function(){replase(proofreading.answer)}, 5);
				$('#MSG_DIALOG_20131012152901111').dialog("close");
			},
			"閉じる": function(){
				$('#MSG_DIALOG_20131012152901111').dialog("close");
			}
		},	
		// ダイアログのイベント処理
		open: function(event, ui) {
			$('#MSG_DIALOG_20131012152901111').children("button").each(function() {
				$("#" + this).css('outline',0);
			});
			 /*$('#stumpXXXXXXXXXX1').effect( 'drop', { direction : 'up' }, 1000 );*/
			},
		close: function() {$('#MSG_DIALOG_20131012152901111').remove();}
       	 });
       	 
       	 //$('#MSG_DIALOG_20131012152901111').dialog("open");
       	 //$('#MSG_DIALOG_20131012152901111').dialog("moveToTop");
}

function replase(answer){
	$(':focus').selection('replace',{text:answer, caret:'start'});
}


