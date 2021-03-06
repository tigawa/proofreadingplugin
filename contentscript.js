/**
 *右クリックメニューから呼び出される。
 */
chrome.extension.onRequest.addListener(
  function(ignores, sender, sendResponse) {
  	$inputArea = $(':focus');
  
  
	// ダイアログを生成する。
	var dialog = createDialog();
  
	//Ajax通信して校正チェックする。
	$.ajax({
		type: "POST",
//		url: "http://localhost:3000/sentence/makeup.json",
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
		},
      	error: function(XMLHttpRequest, textStatus, errorThrown) {
            $("#XMLHttpRequest").html("XMLHttpRequest : " + XMLHttpRequest.status);
            $("#textStatus").html("textStatus : " + textStatus);
            $("#errorThrown").html("errorThrown : " + errorThrown.message);
        }
   });
	
	// レスポンスを返す。
    sendResponse({});    
  }
);

/**
 *ダイアログを表示する。
 */
function createDialog(){
	var dialog = document.createElement('div');
	dialog.style.textAlign='center';
	dialog.style.verticalAlign='middle';
	document.body.appendChild(dialog);
	
	$(dialog).html(createImg('arrow45-001.gif'));
	$(dialog).css('font-size','small');
	
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
	var $img = createImg("stump01-002.gif");
	var $divImg = createDiv($img);
	
	// 画像をロードしたらバウンドする。
	$img.load(function(){$divImg.hide().show("bounce", { times: 3 }, 1000);})
	
	$dialog.html($divImg);
	$dialog.dialog({title  : data.proofreading.summary,
					buttons: {"閉じる": function(){$dialog.dialog("close");}}});
}

/**
 *失敗 -> 指摘あり
 */
function error($dialog, data){
	var $contents = createDiv(data.proofreading.disp_answer);
	$dialog.html($contents);
	$dialog.css("text-align","left");

	$dialog.dialog({
		title  : data.proofreading.summary,
		width  : $inputArea.css('width'),
		buttons: {"置き換える":
					function(){
						$dialog.dialog("close");
						replase(data.proofreading.answer);},
						
				  "閉じる": 
					function(){
						$dialog.dialog("close");}}});
						
	$contents.hide().show("drop", { direction: "up" }, 1000);
}

/**
 *本文を置き換える
 */
function replase(answer){
//	$('#gt-src-wrap').hide().show('shake', { times: 3 }, 1000, function(){$inputArea.selection('replace',{text:answer, caret:'start'})});
	if( shake($inputArea) == false ){
		$inputArea.parents().each(
			function(){
				if( shake($(this)) ){
					return false;
				}
			}
		);
	}
	
	$inputArea.selection('replace',{text:answer, caret:'start'});
	
//	$(':focus').css("color","red");
	
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
	return $("<div></div>").html($innerHtml);
}

/**
 * pxを取り除いて数値で返す。
 * 1px -> 1
 */
function px_to_i(px){
	if(!px){
		return 0;
	}	
	return Number(px.replace("px", "")); 
}

function shake($self){
	var s = px_to_i($self.css("border-width"));
	if(s > 0){
		//$self.hide().show('bounce', { times: 1 }, 500, function(){});
		$self.hide().show("drop", { direction: "up" }, 1000);
		return true;
	}	
	return false;
}
