import { expect, test } from 'vitest'
import Translator from '../src/lib/translator'
import Compressor from '../src/lib/compressor'
// 先に失敗させる: utilは未実装
import { buildUiEncoding } from '../src/lib/uiEncoding'

test('UI用エンコード: pretty/compactと共有ペイロードの整合', () => {
  const input = 'The quick brown 狐 jumped over 13 lazy 犬。こんにちは！'
  const t = new Translator()
  const c = new Compressor()

  const res = buildUiEncoding(input)

  // pretty/compactが既存APIと一致
  expect(res.pretty).toEqual(t.encodePretty(input))
  expect(res.compact).toEqual(t.encodeCompact(input))

  // 共有ペイロード（URLに載せる値）はcompact由来で、伸長するとcompactそのものに戻る
  const compactFromPayload = c.decompress(decodeURIComponent(res.payload))
  expect(compactFromPayload).toEqual(res.compact)
})

