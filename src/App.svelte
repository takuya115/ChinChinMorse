<script>
  import Translate from "./translate"

  // データ
  const translate = new Translate();
  let inputWord = "";
  let outputWord = "";

  function transrateText(mode) {
    if (inputWord.length === 0) return;
    const morseMode = document.querySelector("#secret-mode").value;
    try {
      outputWord = mode === "encode" ? translate.encode(inputWord, morseMode) : translate.decode(inputWord, morseMode);
    } catch (error) {
      alert(error);
    }    
  }

</script>

<header style="text-align:center;">
  <h1>ちんちんもーるす</h1>
</header>
<main>
  <div>
    <h4>ひらがなとカタカナをモールス信号に変えるよ！</h4>
    <p>もはやモールスというか換字式暗号みたくなってるけどツッコまないでね！</p>
    <p>えんこーど: ぶんしょう → ちんちん...</p>
    <p>でこーど: ちんちん... → ぶんしょう</p>
  </div>
  <div>
    <h3>にゅうりょく</h3>
    <div>文字数: {inputWord.length}</div>
    <textarea
      name="input-kana"
      id="input-kana"
      cols="30"
      rows="10"
      bind:value={inputWord}
    />
  </div>

  <div style="display:flex; justify-content:center;">
    <button on:click={() => transrateText("encode")} style="margin:0 10px">えんこーど</button>
    <button on:click={() => transrateText("decode")} style="margin:0 10px">でこーど</button>
  </div>

  <div>
    <h3>しゅつりょく</h3>
    <div>文字数: {outputWord.length}</div>
    <textarea
      name="output-chin"
      id="output-chin"
      cols="30"
      rows="10"
      bind:value={outputWord}
      readonly
    />
  </div>
  <!-- valueにメスガキに変えるとメスガキモードになる -->
	<input id="secret-mode" type="hidden" name="secret-mode" value="ちんちん">
  <a href="https://github.com/takuya115/ChinChinMorse">コードはこちら</a>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 500px;
    margin: 0 auto;
  }

  textarea {
    resize: none;
    width: 500px;
  }

  @media (min-width: 640px) {
    main,
    header {
      max-width: none;
    }
  }

  @media (max-width: 500px) {
    textarea {
      width: 100%;
    }
  }
</style>
