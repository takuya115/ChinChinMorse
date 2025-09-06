// sum.test.js
import { expect, test, describe } from 'vitest'
import Translator from '../src/lib/translator'
import morse from 'morse-decoder'

const base_txt = "こんにちは"
const translator = new Translator()

test("OK: エンコード", () => {
    let encoded = translator.encode(base_txt)
    // 正規表現を使って文字列を検証
    const pattern = /^[ちんこぽ]+$/;
    expect(pattern.test(encoded)).toBe(true)
})

test("OK: デコード", () => {
    const encoded = translator.encode(base_txt)
    const decoded = translator.decode(encoded)
    expect(decoded).toEqual(base_txt)
})

// 旧方式（UTF-8 -> 10進数列 'A' 連結 -> morse.encode）
function legacyEncode(input: string): string {
    const array: Uint8Array = new TextEncoder().encode(input)
    const split = 'A'
    const setting = {
        priority: 2,
        dot: 'ちんちん',
        dash: 'ちんこ',
        separator: 'ちんぽ',
    }
    return morse.encode(array.join(split), setting)
}

describe('新方式は旧方式より短いこと', () => {
    const cases = [
        'こんにちは',
        'The quick brown fox jumps over the lazy dog 12345',
        '私は今日、図書館で本を借りました。',
    ]

    for (const text of cases) {
        test(`短縮比較: ${text.slice(0, 10)}...`, () => {
            const legacy = legacyEncode(text)
            const modern = translator.encode(text)
            // 新方式（後で実装）は旧方式より短い想定
            expect(modern.length).toBeLessThan(legacy.length)
        })
    }
})

describe('コンパクト表現（.-/）をサポートすること', () => {
    const translator2 = new Translator()
    const cases = [
        'こんにちは',
        'The quick brown fox jumps over the lazy dog 12345',
        '私は今日、図書館で本を借りました。',
    ]

    test('encodeCompactは .-/ だけで構成される', () => {
        const compact = translator2.encodeCompact('こんにちは')
        expect(/^[.\-\/]+$/.test(compact)).toBe(true)
    })

    test('encodeCompactはencode(=pretty)より短い', () => {
        const pretty = translator2.encode('こんにちは')
        const compact = translator2.encodeCompact('こんにちは')
        expect(compact.length).toBeLessThan(pretty.length)
    })

    test('compactからdecodeできる', () => {
        for (const text of cases) {
            const compact = translator2.encodeCompact(text)
            const decoded = translator2.decode(compact)
            expect(decoded).toEqual(text)
        }
    })
})
