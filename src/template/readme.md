# template の改善点

- sound を default で off にしているが、いちいち設定を変更するのが面倒。template で汎用的な sound を on にしておく。

# 作業メモ

- 汎用的な sound とは？
  - defalut の gui を操作した際に音がなればいい。
  - play で on にしたとき、off にしたときにそれぞれ異なる音を鳴らす。
    - どの音にするか？ -> toggle_on/off
    - フォルダはどこにするか？ -> sound フォルダを作成した。
- 実装
  - synth.ts で読み込むコードを書いてる

# 完了後

- 過去の sketch の setGui を修正する。
