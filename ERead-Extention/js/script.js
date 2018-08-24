(() => {

	let output_element = document.querySelector('.main-contents__text'),
	    copyButton_element = document.querySelector('.main-contents__button--copy'),
	    translateButton_element = document.querySelector('.main-contents__button--translate')
	
	let useText = ""
	
	let isEReadUse = true,	// 機能を使用していいか管理するフラグ
	    isTranslate = true	// 翻訳が行われているか管理するフラグ

    const Alert = {
		alert_element: null,

		show: msg => {
			alert_element = document.createElement('div')
			alert_element.classList.add('alert-mask')
			alert_element.innerHTML = `<p class="not-translate-alert__text">${msg}</p>`

			output_element.parentNode.insertBefore(alert_element, output_element.nextSibling)
		},

		hide: () => {
			alert_element.parentNode.removeChild(alert_element)
		}
	}

	// 拡張機能が使用されたとき、表示している URL を取得
	chrome.tabs.query({ active: true }, tab => {
		chrome.tabs.sendMessage(tab[0].id, { targetUrl: tab[0].url },
		response => {
			// 機能の使用できないようにする
			if (typeof response === 'undefined') {
				//isEReadUse = false
				useText = '機能を使用できるページではありません。'
			}

			else {
				// 英文を表示
				useText = response
			}
			
			output_element.innerText = useText
		})
	})

	// ボタンをクリックしたときコピーを実行
	copyButton_element.addEventListener('click', () => {
		if ( isEReadUse ) {
			let range = document.createRange(),
			    selection = window.getSelection()

			range.selectNode(output_element)
			selection.addRange(range)

			let isCopy = document.execCommand('copy')

			// コピー完了のアラート表示
			if ( isCopy ) {
				Alert.show('コピーしました。')

				setTimeout(() => {
					Alert.hide()
				}, 2800)
			}

			selection.removeAllRanges()
		}
	})

	// 翻訳
	translateButton_element.addEventListener('click', () => {
		if ( isEReadUse ) {
			if ( isTranslate ) {
				Alert.show('翻訳中です。')

				// 自作の API (Google Apps Script 使用) で翻訳
				fetch(`https://script.google.com/macros/s/AKfycbwZXp47ezz0y_uAmNxsBVLoYAoaGp6VTgD4X8dJ6Gwf-aXotGA1/exec?text=${useText}`)
				.then(res => res.text())
				.then(translatedText => {
					// 改行を入れる
					translatedText = translatedText.replace(/。/g, '。\n')
					                               .replace(/？/g, '？\n')
					
					output_element.innerText = translatedText
					Alert.hide()
					isTranslate = false
				})
			}

			else {
				Alert.show('すでに翻訳しています。')

				setTimeout(() => {
					Alert.hide()
				}, 2800)
			}
		}
	})
})()
