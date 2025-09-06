import Translator from './translator'
import Compressor from './compressor'

export type UiEncoding = {
  pretty: string
  prettyShort: string
  compact: string
  payload: string // URLに載せる値（さらに`?morse=${payload}`として利用）
}

// UIで利用するエンコード結果をまとめて生成
export function buildUiEncoding(plainText: string): UiEncoding {
  const t = new Translator()
  const c = new Compressor()
  const pretty = t.encodePretty(plainText)
  const compact = t.encodeCompact(plainText)
  // 既存の挙動に合わせて、compress後にencodeURIComponentをもう一度噛ませる
  const payload = encodeURIComponent(c.compress(compact))
  const prettyShort = shortenPretty(pretty, 50)
  return { pretty, prettyShort, compact, payload }
}

function shortenPretty(pretty: string, limit: number): string {
  if (pretty.length <= limit) return pretty
  return pretty.slice(0, limit) + '...'
}
