<script>
	import morsify from 'morsify';

	let inputWord = '';
	let encodeWord = '';
	const moresProps =  { priority: 10, dash: 'ち', dot: 'ん', separator: 'ぽ　' }

	function encode() {
		encodeWord = morsify.encode(hiraToKana(inputWord), moresProps);
	}

	// ひらがな -> カタカナ
	function hiraToKana(str) {
		return str.replace(/[\u3041-\u3096]/g, function(match) {
			const chr = match.charCodeAt(0) + 0x60;
			return String.fromCharCode(chr);
    });
}
	
</script>


<div class="container">
	<header>
		<h1>ちんちんもーるす</h1>
	</header>
	<main>
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