<script lang="ts">
  import Translator from "./lib/translator";
  const translator = new Translator();
  let inputText: string = "";
  let outputText: string = "";

  function encodeText() {
    const encoded = translator.encode(inputText);
    outputText = encoded;
    // console.log(encoded);
  }

  function decodeText() {
    const decoded = translator.decode(inputText);
    outputText = decoded;
    // console.log(decoded);
  }
</script>


<header style="text-align:center;">
  <h1>ちんちんもーるす</h1>
</header>
<main>
  <div>
    <h4>ひらがなとカタカナをモールス信号に変えるよ！</h4>
    <p>えんこーど: ぶんしょう → ちんちん...</p>
    <p>でこーど: ちんちん... → ぶんしょう</p>
  </div>

  <div>
    <h3>にゅうりょく</h3>
    <div>文字数: {inputText.length}</div>
    <textarea
      name="input-kana"
      id="input-kana"
      cols="30"
      rows="10"
      bind:value={inputText}
    />
  </div>

  <div style="display:flex; justify-content:center;">
    <button on:click={() => encodeText()}>エンコード</button>
    <button on:click={() => decodeText()}>デコード</button>
  </div>

  <div>
    <h3>しゅつりょく</h3>
    <div>文字数: {outputText.length}</div>
    <textarea
      name="output-chin"
      id="output-chin"
      cols="30"
      rows="10"
      bind:value={outputText}
      readonly
    />
  </div>
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

  button {
    width: 100px;
    margin: 1rem;
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
