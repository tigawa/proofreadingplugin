/**
 *右クリックメニューから呼び出される。
 */
chrome.extension.onRequest.addListener(
  function(ignores, sender, sendResponse) {
	// ダイアログを生成する。
	var c = createDialog();
  
	//Ajax通信して校正チェックする。
	$.ajax({
		type: "GET",
		// url: "http://localhost:3000/sentence/makeup.json",
		url: "http://proofreadingchecker.herokuapp.com/sentence/makeup.json",
		data: "sentence=" + encodeURIComponent($.selection()),
		dataType: "json",
		success: function(data){
			// ダイアログを表示する。
			if(data.proofreading.count == 0){
				success($(dialog), data);
			} else {
				error($(dialog), data);				
			}
		}});
	
	// レスポンスを返す。
    sendResponse({});    
  }
);

/**
 *ダイアログを表示する。
 */
function createDialog(){
	dialog = document.createElement('div');
	dialog.style.textAlign='center';
	dialog.style.verticalAlign='middle';
	document.body.appendChild(dialog);
	
	$(dialog).html(createImg('arrow45-001.gif'));
	$(dialog).dialog({
		title: "処理中",
		autoOpen: true, // ここで起動する。
		height: "auto",
		minWidth: 200,
		minHeight: 230,
		modal: false, // モーダルとして機能しない。
		closeOnEscape: true, // ESCでダイアログを閉じる
		closeText: "閉じる", //close 「×」ボタンのツールチップ。
		show: "fold",
		hide: "fold",
		// ダイアログのイベント処理
		open: function(event, ui) {},
		close: function() {$(dialog).remove();}
	});
	
	return dialog;
}

/**
 *成功 -> 指摘なし
 */
function success($dialog, data){
	var $divImg = createDiv( createImg("stump01-002.gif") ).hide();

	$dialog.html($divImg);
	$dialog.dialog({title  : data.proofreading.summary,
					buttons: {"閉じる": function(){$dialog.dialog("close");}}});

	$divImg.show("bounce", { times: 3 }, 1000);
}

/**
 *失敗 -> 指摘あり
 */
function error($dialog, data){
	$dialog.html(data.proofreading.disp_answer);
	$dialog.css("text-align","left");
	$dialog.dialog({title  : data.proofreading.summary,
				    buttons: {"置き換える": function(){
												setTimeout(function(){replase(data.proofreading.answer)}, 5);
												$dialog.dialog("close");},
								"閉じる": function(){ $dialog.dialog("close");}}});
}

/**
 *本文を置き換える
 */
function replase(answer){
	$(':focus').selection('replace',{text:answer, caret:'start'});
}

/**
 *imageファイルを読み込む
 */
function createImg(file){
	return $("<img />",{"src": chrome.extension.getURL('images/' + file)});
}

/**
 *imageファイルを読み込む
 */
function createDiv($innerHtml){
	return $("<div'></div>").html($innerHtml);
}
