<script>
  import morsify from "morsify";

  let inputWord = "";
  let outputWord = "";
  let inputWordCount = 0;
  let outputWordCount = 0;
  const moresProps = {
    priority: 10,
    dash: "ちんちん",
    dot: "ちんこ",
    separator: "ちんぽ",
  };
  const mesugakiProps = {
    priority: 10,
    dash: "ざぁこ",
    dot: "♥",
    separator: "♡",
  };

  function encode() {
    if (detectKanji()) return alert("漢字はつかえないよ！　めっ！！");
    const inputList = inputWord.split("\n");
    const encodeList = [];
    // シークレットモード
    const mode = document.querySelector("#secret-mode").value;
    inputList.forEach((str) => {
      let word = str;
      // ひらがなをカタカナにする
      word = hiraToKana(word);
      // 濁音を「元文字+゛」の形にする
      word = dakuonTransrator(word);
      // 半濁音を「元文字+゜」の形にする
      word = handakuonTransrator(word);
      // 拗音(小さいヤユヨ)を元の文字にする
      word = suteganaTransrator(word);

      // モールス信号にする
      encodeList.push(
        morsify.encode(word, mode === "メスガキ" ? mesugakiProps : moresProps)
      );
    });
    outputWord = encodeList.join("\n");
	countWord(outputWord, "output")
  }

  // ひらがな -> カタカナ
  function hiraToKana(str) {
    return str.replace(/[\u3041-\u3096]/g, (match) => {
      const chr = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(chr);
    });
  }

  // 濁音（ガギグゲゴ、など）を文字と濁音記号に分離する
  function dakuonTransrator(str) {
    // unicodeでは「は、ば、ぱ」の並びになっているので-1すれば元の文字が得られる
    return str.replace(
      /[ガギグゲゴザジズゼゾダヂヅデドバビブベボ]/g,
      (match) => {
        const chr = match.charCodeAt(0) - 0x1;
        return `${String.fromCharCode(chr)}゛`;
      }
    );
  }

  // 半濁音(パピプペポ)を文字と半濁音記号に分離する
  function handakuonTransrator(str) {
    return str.replace(/[パピプペポ]/g, (match) => {
      const chr = match.charCodeAt(0) - 0x2;
      return `${String.fromCharCode(chr)}゜`;
    });
  }

  // 捨て仮名(ャュョなど小さい文字)を元の文字に戻す
  function suteganaTransrator(str) {
    return str.replace(/[ァィゥェォャュョッ]/g, (match) => {
      const chr = match.charCodeAt(0) + 0x1;
      return String.fromCharCode(chr);
    });
  }

  // 漢字の検出
  function detectKanji() {
    const regexp = new RegExp(
      /([\u{3005}\u{3007}\u{303b}\u{3400}-\u{9FFF}\u{F900}-\u{FAFF}\u{20000}-\u{2FFFF}][\u{E0100}-\u{E01EF}\u{FE00}-\u{FE02}]?)/mu
    );
    return regexp.test(inputWord);
  }

  // デコード
  function decode() {
    const inputList = inputWord.split("\n");
    const dencodeList = [];
    // シークレットモード
    const mode = document.querySelector("#secret-mode").value;
    inputList.forEach((str) => {
      dencodeList.push(
        morsify.decode(str, mode === "メスガキ" ? mesugakiProps : moresProps)
      );
    });
    outputWord = dencodeList.join("\n");
	countWord(outputWord, "output")
  }

  function countWord(word, inputFrom) {
    if (inputFrom === "input") {
      inputWordCount = word.length;
    } else {
      outputWordCount = word.length;
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
    <div>文字数: {inputWordCount}</div>
    <textarea
      name="input-kana"
      id="input-kana"
      cols="30"
      rows="10"
      on:input={(evt) => countWord(evt.target.value, "input")}
      bind:value={inputWord}
    />
  </div>

  <div style="display:flex; justify-content:center;">
    <button on:click={encode} style="margin:0 10px">えんこーど</button>
    <button on:click={decode} style="margin:0 10px">でこーど</button>
  </div>

  <div>
    <h3>しゅつりょく</h3>
    <div>文字数: {outputWordCount}</div>
    <textarea
      name="output-chin"
      id="output-chin"
      cols="30"
      rows="10"
      bind:value={outputWord}
      readonly
    />
  </div>
  <p>遊びでひみつのモード仕込んでみたよ！さがしてみてね！</p>
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
