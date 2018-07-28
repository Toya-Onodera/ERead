chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
	let url = message.targetUrl
	let returnText = "文章を取得することができませんでした。"

	console.log(url)
	if ( url.indexOf("yaruzo.gyuto-e.jp/iwate-pu/lesson/reading.do") !== -1) {
		// 邪魔な文字の部分を取得
		let eraseTexts = document.querySelectorAll(".prevent")

		// 小さい文字を消す
		eraseTexts.forEach(item => {
			item.outerHTML = " "
		})

		// 本文を取得
		returnText = document.querySelector("#honbun")
	}
	
	// 拡張機能側に返す
	callback(returnText)
	console.log(returnText)
})