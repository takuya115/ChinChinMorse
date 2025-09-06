<script lang="ts">
  import { onMount } from "svelte";
  import Compressor from "./lib/compressor";
  import Translator from "./lib/translator";
  import TweetBtn from "./lib/TweetBtn.svelte";
  import { buildUiEncoding } from "./lib/uiEncoding";

  const compressor = new Compressor();
  const translator = new Translator();
  let inputText: string = "";
  let outputText: string = "";
  let shareLink: string = "";
  let tweetText: string = ""; // 共有時の本文はPretty短縮版を使用

  function encodeText() {
    const { pretty, prettyShort, payload } = buildUiEncoding(inputText);
    outputText = pretty; // 表示は従来どおりの「ちん◯」表現
    shareLink = createLinkWithPayload(payload); // 共有はコンパクト由来
    tweetText = prettyShort; // Tweet本文はPrettyの先頭50文字程度
  }

  function decodeText() {
    const decoded = translator.decode(inputText);
    outputText = decoded;
  }

  function createLinkWithPayload(payload: string) {
    const currentURL = location.href.split("?")[0];
    return currentURL + `?morse=${payload}`;
  }

  // クエリ文字列取得
  function getParam(name: string) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  // ページ開始時
  onMount(() => {
    const morse = getParam("morse");
    if (morse) {
      inputText = compressor.decompress(decodeURIComponent(morse));
    }
  })

</script>


<header style="text-align:center;">
  <h1>ちんちんもーるす(v2)</h1>
</header>
<main>
  <div>
    <h4>文章を"ちんちん"に変えるよ！</h4>
    <p>エンコード: 俺のちんちん → ちんちん...</p>
    <p>デコード: ちんちん... → 俺のちんちん</p>
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
  <div>
    <TweetBtn bind:tweetText={tweetText} bind:shareLink={shareLink} />
  </div>
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
