import morse from 'morse-decoder';

export default class Translator {
    private priority: number
    private dot: string;
    private dash: string;
    private separator: string;
    private setting: Object;
    private split: string;
    
    constructor() {
        this.priority = 2
        this.dot = "ちんちん";
        this.dash = "ちんこ";
        this.separator = "ちんぽ";
        this.setting = {
            priority: this.priority,
            dot: this.dot,
            dash: this.dash,
            separator: this.separator
        }
        // 区切り文字は空白ではなくA(モールス信号で短いから)
        this.split = "A"
        
    }

    // エンコード
    public encode(plainText: string):string {
        // 平文 -> uint8array -> モールス
        const array: Uint8Array = new TextEncoder().encode(plainText);
        return morse.encode(array.join(this.split), this.setting);
    }

    // デコード
    public decode(morseText: string): string {
        // モールス -> uint8array -> 平文
        const decoded = morse.decode(morseText, this.setting);
        const array: Uint8Array = Uint8Array.from(decoded);
        return new TextDecoder().decode(array)
    }
}