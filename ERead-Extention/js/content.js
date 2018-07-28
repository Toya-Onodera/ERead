chrome.runtime.onMessage.addListener( function ( message, sender, sendResponse ) {
	let returnText = ''
	
	if ( message.targetUrl ) {
		let url = message.targetUrl
		returnText = '文章を取得することができませんでした。'

		// 念の為、URLをチェックしておく
		if ( url.indexOf('yaruzo.gyuto-e.jp/iwate-pu/lesson/reading.do') !== -1) {
			// 本文を取得
			let beforeText = document.querySelector('#honbun').innerHTML

			// 邪魔な文字を消す
			const eraseChar = 'abcdefghijklmnopqrstuvwxyz'.split('')
			eraseChar.forEach(c => {
				const replaceText = '<span class="prevent">' + c + ' <\/span>'
				beforeText = beforeText.replace(new RegExp(replaceText, 'g'), ' ')
			})


			// 改行を入れて読みやすくする
			returnText = beforeText.replace(/<br>/g, '\n')
			                       .replace(/\./g, '.\n')
			                       .replace(/\?/g, '?\n')
		}
	
		else {
			returnText = '使用できるページではありません。'
		}
	}

	// 拡張機能側に返す
	sendResponse( returnText )
})