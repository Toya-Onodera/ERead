(() => {

	let output_element = document.querySelector('.main-contents__text'),
	    copyButton_element = document.querySelector('.main-contents__button--copy'),
	    translateButton_element = document.querySelector('.main-contents__button--translate'),
	    useText = "",
	    isTranslate = true

	// 拡張機能が使用されたとき、表示している URL を取得
	chrome.tabs.query({ active: true }, tab => {

		chrome.tabs.sendMessage(tab[0].id, { targetUrl: tab[0].url },
		response => {
			useText = response
			output_element.innerText = useText
		})

	})

	// コピー
	copyButton_element.addEventListener('click', () => {
		let range = document.createRange(),
		    selection = window.getSelection()

		range.selectNode(output_element)
		selection.addRange(range)

		let isCopy = document.execCommand('copy')

		// コピー完了のアラート表示
		if ( isCopy ) {
			let alert_element = document.createElement('div')
			alert_element.classList.add('alert-mask');
			alert_element.innerHTML = '<p class="copy-alert__text">コピーしました。</p>'

			output_element.parentNode.insertBefore(alert_element, output_element.nextSibling)

			setTimeout(() => {
				alert_element.parentNode.removeChild(alert_element)
			}, 2800)
		}

		selection.removeAllRanges();
	})

	// 翻訳
	translateButton_element.addEventListener('click', () => {
		if ( isTranslate ) {
			let alert_element = document.createElement('div')
			alert_element.classList.add('alert-mask');
			alert_element.innerHTML = '<p class="translate-alert__text">翻訳中です。</p>'

			output_element.parentNode.insertBefore(alert_element, output_element.nextSibling)

			// 自作の API (Google Apps Script 使用) で翻訳
			fetch('https://script.google.com/macros/s/AKfycbwZXp47ezz0y_uAmNxsBVLoYAoaGp6VTgD4X8dJ6Gwf-aXotGA1/exec?text=' + useText)
			.then(res => res.text())
			.then(translatedText => {
				// 改行を入れる
				translatedText = translatedText.replace(/。/g, '。\n')
				                               .replace(/？/g, '？\n')
				
				output_element.innerText = translatedText
				alert_element.parentNode.removeChild(alert_element)

				isTranslate = false
			})
		}

		else {
			let alert_element = document.createElement('div')
			alert_element.classList.add('alert-mask');
			alert_element.innerHTML = '<p class="not-translate-alert__text">すでに翻訳しています。</p>'

			output_element.parentNode.insertBefore(alert_element, output_element.nextSibling)

			setTimeout(() => {
				alert_element.parentNode.removeChild(alert_element)
			}, 2800)
		}
	})

})()