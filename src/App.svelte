<script>
	import morsify from 'morsify';

	let inputWord = '';
	let encodeWord = '';
	const moresProps =  { priority: 10, dash: 'ち', dot: 'ん', separator: 'ぽ　' }

	function encode() {
		if(detectKanji()) return alert('漢字が含まれています。');
		const inputList = inputWord.split('\n');
		const encodeList = [];
		inputList.forEach((str) => {
			encodeList.push(morsify.encode(hiraToKana(str), moresProps));
		})
		encodeWord = encodeList.join('\n');
	}

	// ひらがな -> カタカナ
	function hiraToKana(str) {
		return str.replace(/[\u3041-\u3096]/g, function(match) {
			const chr = match.charCodeAt(0) + 0x60;
			return String.fromCharCode(chr);
		});
	}

	// 漢字の検出
	function detectKanji() {
		const regexp = new RegExp(/([\u{3005}\u{3007}\u{303b}\u{3400}-\u{9FFF}\u{F900}-\u{FAFF}\u{20000}-\u{2FFFF}][\u{E0100}-\u{E01EF}\u{FE00}-\u{FE02}]?)/mu);
		return regexp.test(inputWord);
	}
	
</script>


<div class="container">
	<header>
		<h1>ちんちんもーるす</h1>
	</header>
	<main>
		<div>
			ひらがなとカタカナをモールス信号に変えるよ<br>
			ただし、長点(-)は'ち'、短点(・)は'ん'、区切り文字は'ぽ'になってるよ<br>
			要するに全部ちんぽになるよ<br>
			気が向いたらデコードも実装するよ<br>
		</div>
		<div>
			<h3>にゅうりょく</h3>
			<textarea name="input-kana" id="input-kana" cols="30" rows="10" bind:value={inputWord}></textarea>
		</div>
		
		<button on:click={encode}>えんこーど</button>

		<div>
			<h3>けっか</h3>
			<textarea name="output-chin" id="output-chin" cols="30" rows="10" bind:value={encodeWord} readonly></textarea>
		</div>		
	</main>
</div>

<style>
	.container {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	textarea {
		resize: none;
		width: 500px;
	}

	@media (min-width: 640px) {
		.container {
			max-width: none;
		}
	}
</style>