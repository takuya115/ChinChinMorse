// sum.test.js
import { expect, test } from 'vitest'
import Translator from '../src/lib/translator'

const base_txt = "こんにちは"
const translator = new Translator()

test("OK: エンコード", () => {
    let encoded = translator.encode(base_txt)
    // 正規表現を使って文字列を検証
    const pattern = /^[ちんこぽ]+$/;
    expect(pattern.test(encoded)).toBe(true)
    console.log(encoded.length)
})

test("OK: デコード", () => {
    const encoded = translator.encode(base_txt)
    const decoded = translator.decode(encoded)
    expect(decoded).toEqual(base_txt)
})