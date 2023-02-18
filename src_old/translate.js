import morse from "morse-decoder";

export default class Translate {
  constructor() {
    this.defaultProp = {
      priority: 10,
      dash: "ちんちん",
      dot: "ちんこ",
      separator: "ちんぽ",
    };

    this.mesugaki = {
      priority: 10,
      dash: "ざぁこ",
      dot: "♥",
      separator: "♡",
    };
  }
  /** エンコード
   * @param {String} baseText 
   * @param {String} mode モールスのプロパティ
   * @returns {String}
   */
  encode(baseText, mode) {
    if (this.includeKanji(baseText)) {
      throw Error("漢字はつかえないよ！　めっ！！")
    }
    // if (detectKanji()) return alert();
    const inputList = baseText.split("\n");
    const encodeList = inputList.map((t) => {
      // ひらがなをカタカナにする
      let text = this.hiragana2katakana(t);
      // 濁音を「元文字+゛」の形にする
      text = this.splitDakuon(text);
      // 半濁音を「元文字+゜」の形にする
      text = this.splitHandakuon(text);
      // 拗音(小さいヤユヨ)を元の文字にする
      text = this.convertSutegana(text);

      // モールス信号にする
      const props = mode === "メスガキ" ? this.mesugaki : this.defaultProp;
      return  morse.encode(text, props)
    });
    return encodeList.join("\n");
  }

  /** デコード
   * @param {String} baseText 元のモールス信号文
   * @param {String} mode モールス信号モード
   */
  decode(baseText, mode) {
    const inputList = baseText.split("\n");
    const props = mode === "メスガキ" ? this.mesugaki : this.defaultProp;
    const decodeList = inputList.map((t) => {
        return morse.decode(t, props)
    });
    return decodeList.join("\n");
  }

  /** ひらがな -> カタカナ
   * @param {String} text ひらがなの文字列
   * @returns {String}
   */
  hiragana2katakana(text) {
    return text.replace(/[\u3041-\u3096]/g, (match) => {
      const chr = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(chr);
    });
  }
  
  /** 濁音を元の文字 + 濁点記号に分離(ガ -> カ゛)
   * @param {String} text 
   * @returns {String}
   */
  splitDakuon(text) {
    // unicodeでは「は、ば、ぱ」の並びになっているので-1すれば元の文字が得られる
    return text.replace(
      /[ガギグゲゴザジズゼゾダヂヅデドバビブベボ]/g,
      (match) => {
        const chr = match.charCodeAt(0) - 0x1;
        return `${String.fromCharCode(chr)}゛`;
      }
    );
  }

  /** 半濁音をもとの文字 + 半濁音記号に分離(パ -> ハ゜)
   * @param {String} text 
   * @returns {String}
   */
  splitHandakuon(text) {
    return text.replace(/[パピプペポ]/g, (match) => {
      const chr = match.charCodeAt(0) - 0x2;
      return `${String.fromCharCode(chr)}゜`;
    });
  }
  
  /** 捨て仮名を大きくする
   * @param {String} text 
   * @returns {String}
   */
  convertSutegana(text) {
    return text.replace(/[ァィゥェォャュョッ]/g, (match) => {
      const chr = match.charCodeAt(0) + 0x1;
      return String.fromCharCode(chr);
    });
  }

  /** 漢字を含んでいるか
   * @param {String} text 
   * @returns 
   */
  includeKanji(text) {
    const regexp = new RegExp(
      /([\u{3005}\u{3007}\u{303b}\u{3400}-\u{9FFF}\u{F900}-\u{FAFF}\u{20000}-\u{2FFFF}][\u{E0100}-\u{E01EF}\u{FE00}-\u{FE02}]?)/mu
    );
    return regexp.test(text);
  }
}
