import morse from 'morse-decoder';

type MorseSetting = {
    priority: number
    dot: string
    dash: string
    separator: string
}

export default class Translator {
    private priority: number
    private dot: string
    private dash: string
    private separator: string
    private setting: MorseSetting
    private compactSetting: MorseSetting

    constructor() {
        this.priority = 2
        this.dot = "ちんちん"
        this.dash = "ちんこ"
        this.separator = "ちんぽ"
        this.setting = {
            priority: this.priority,
            dot: this.dot,
            dash: this.dash,
            separator: this.separator,
        }
        this.compactSetting = {
            priority: this.priority,
            dot: '.',
            dash: '-',
            separator: '/',
        }
    }

    // エンコード(後方互換=pretty): UTF-8 → Base32(大文字) → Morse(ちん◯表現)
    public encode(plainText: string): string {
        return this.encodePretty(plainText)
    }

    // デコード: 入力を自動判別して復号
    public decode(morseText: string): string {
        const mode = this.detectMode(morseText)
        const setting = mode === 'compact' ? this.compactSetting : this.setting
        const b32: string = morse.decode(morseText, setting)
        const bytes = this.base32ToUint8(b32)
        return new TextDecoder().decode(bytes)
    }

    // Pretty表現（ちん◯）でエンコード
    public encodePretty(plainText: string): string {
        const bytes: Uint8Array = new TextEncoder().encode(plainText)
        const b32 = this.uint8ToBase32(bytes)
        return morse.encode(b32, this.setting)
    }

    // Compact表現(.-/)でエンコード
    public encodeCompact(plainText: string): string {
        const bytes: Uint8Array = new TextEncoder().encode(plainText)
        const b32 = this.uint8ToBase32(bytes)
        return morse.encode(b32, this.compactSetting)
    }

    private detectMode(text: string): 'pretty' | 'compact' {
        // 日本語トークンが含まれていればpretty、.-/のみならcompact
        if (/[ちんぽこ]/.test(text)) return 'pretty'
        if (/^[.\-\/]+$/.test(text)) return 'compact'
        // フォールバック: pretty優先
        return 'pretty'
    }

    // ---- helpers ----
    private uint8ToBase32(u8: Uint8Array): string {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
        let bits = 0
        let value = 0
        let out = ''
        for (let i = 0; i < u8.length; i++) {
            value = (value << 8) | u8[i]
            bits += 8
            while (bits >= 5) {
                out += alphabet[(value >>> (bits - 5)) & 31]
                bits -= 5
            }
        }
        if (bits > 0) {
            out += alphabet[(value << (5 - bits)) & 31]
        }
        return out
    }

    private base32ToUint8(b32: string): Uint8Array {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
        const map: Record<string, number> = {}
        for (let i = 0; i < alphabet.length; i++) map[alphabet[i]] = i

        const s = b32.toUpperCase().replace(/=+$/g, '')
        let bits = 0
        let value = 0
        const out: number[] = []
        for (let i = 0; i < s.length; i++) {
            const ch = s[i]
            const v = map[ch]
            if (v === undefined) continue
            value = (value << 5) | v
            bits += 5
            if (bits >= 8) {
                out.push((value >>> (bits - 8)) & 0xff)
                bits -= 8
            }
        }
        return new Uint8Array(out)
    }
}
