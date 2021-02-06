# ChinChinMorse

### 概要
入力したひらがな・カタカナの文字列をモールス信号にエンコードする。

ただし、一般的なモールス信号の符号(－, ・)ではなく「ちんこ」の3文字を用いる。

### ロジック
モールス信号への変換は[morse-decoder](https://github.com/ozdemirburak/morse-decoder")を使用。
ただし、作成時に上記のパッケージ名はmorsifyだったのでpakage.jsonに書かれているものと異なるので注意。

morse-decorderに渡す文字列は事前にカタカナに変換する。
その過程で濁音・半濁音・捨て仮名(小さいヤユヨなど)も同時に変換する。
