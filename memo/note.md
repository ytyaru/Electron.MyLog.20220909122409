# つぶやきを保存するElectron版9

　

<!-- more -->

# ブツ

* [リポジトリ][]

[リポジトリ]:https://github.com/ytyaru/Electron.MyLog.20220909122409

## インストール＆実行

```sh
NAME='Electron.MyLog.20220909122409'
git clone https://github.com/ytyaru/$NAME
cd $NAME
npm install
npm start
```

### 準備

1. [GitHubアカウントを作成する](https://github.com/join)
1. `repo`スコープ権限をもった[アクセストークンを作成する](https://github.com/settings/tokens)
1. [インストール＆実行](#install_run)してアプリ終了する
	1. `db/setting.json`ファイルが自動作成される
1. `db/setting.json`に以下をセットしファイル保存する
	1. `username`:任意のGitHubユーザ名
	1. `email`:任意のGitHubメールアドレス
	1. `token`:`repo`スコープ権限を持ったトークン
	1. `repo`:任意リポジトリ名（`mytestrepo`等）
	1. `address`:任意モナコイン用アドレス（`MEHCqJbgiNERCH3bRAtNSSD9uxPViEX1nu`等）
1. `dst/mytestrepo/.git`が存在しないことを確認する（あれば`dst`ごと削除する）
1. GitHub上に同名リモートリポジトリが存在しないことを確認する（あれば削除する）

### 実行

1. `npm start`で起動またはアプリで<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>キーを押す（リロードする）
1. `git init`コマンドが実行される
	* `repo/リポジトリ名`ディレクトリが作成され、その配下に`.git`ディレクトリが作成される
1. [createRepo][]実行後、リモートリポジトリが作成される

### GitHub Pages デプロイ

　アップロードされたファイルからサイトを作成する。

1. アップロードしたユーザのリポジトリページにアクセスする（`https://github.com/ユーザ名/リポジトリ名`）
1. 設定ページにアクセスする（`https://github.com/ユーザ名/リポジトリ名/settings`）
1. `Pages`ページにアクセスする（`https://github.com/ユーザ名/リポジトリ名/settings/pages`）
    1. `Source`のコンボボックスが`Deploy from a branch`になっていることを確認する
    1. `Branch`を`master`にし、ディレクトリを`/(root)`にし、<kbd>Save</kbd>ボタンを押す
    1. <kbd>F5</kbd>キーでリロードし、そのページに`https://ytyaru.github.io/リポジトリ名/`のリンクが表示されるまでくりかえす（***数分かかる***）
    1. `https://ytyaru.github.io/リポジトリ名/`のリンクを参照する（デプロイ完了してないと404エラー）

　すべて完了したリポジトリとそのサイトが以下。

* [作成DEMO][]
* [作成リポジトリ][]

[作成DEMO]:https://ytyaru.github.io/Electron.MyLog.20220908121018.Site/
[作成リポジトリ]:https://github.com/ytyaru/Electron.MyLog.20220908121018.Site

# やったこと

* `text-to-html.js`
    * `static #toDeleteCheckbox(id) { return `<label><input type="checkbox" name="delete" value="${id}">❌</label>` }`
        * `</label>`閉じタグのスラッシュ忘れ
* `mylog-db.js`
    * `insert()`
        * エラー処理を真偽値でなく例外発生にした
    * `delete()`
        * 削除確認結果を真偽値で返すようにした
* `renderere.js`
    * `'#delete'`, `click`
        * 真偽値が偽なら以降の処理(`push`)を中断するようにした
    * `'#post'`, `click`
        * `new DOMParser().parseFromString()`
            * `text-to-html.js`の`insert()`の戻り値をDOMのElementに変換する
        * `innerHTML`でなく`prepend()`で挿入するようにした（画面が一瞬白くチラつくのを防止する）
        * 140字制限・15行制限
            * テキストエリア入力字に字数カウントする
            * 超過時赤字表示する
            * 上限*0.2時黄字表示する
            * エラーダイアログを表示する
* style.css
    * 赤字: `.warning { background-color:#EEEE00; font-weight:bold; }`
    * 黄字：`.error { background-color:#EE0000; font-weight:bold; }`
* index.html
    * `textarea`
        * `placeholder`を`今どうしてる？`に修正した
        * `wrap="soft"`を追加した（自動折り返し）








# `今どうしてる？`

　以前は`placeholder="つぶやく内容またはDBファイルをドラッグ＆ドロップ"`だった。が、Electron版にはDBファイルをDnDする機能がないため、その部分を削除して`つぶやく内容`に変更しようとした。

　ツイッターのそれを調べると`今どうしてる？`らしいので、それに変更した。

　すごくどうでもいいのだが、なぜ`今どうしてる？`という文にしたのか気になったので調べ考えてみた。

## [Twitter、「いまなにしてる？」から「いまどうしてる？」に変更](https://www.itmedia.co.jp/enterprise/articles/0911/20/news038.html)

　変更の理由は「なにをしているか」より「なにが起きているか」に関する発言が多いかららしい。そこで疑問に思った。それなら`いま何が起きている？`にすればいいのでは？　`なにしてる？`と`どうしてる？`に違いはないのでは？

### `今なにしてる？`と`今どうしてる？`に違いはない

　変えた意味あるのか？

* `なに`と`どう`は同じでは？　物か事かの違い？

### `いま何が起きている？`への無関心さと不穏さ

　どこの話をしているのかわからない。人は自分と関係あることにしか興味を示さない。この問いは漠然としている感がある。一体だれ目線なのか。何を求めているのか読めない。主語を省略する日本語の弊害か。

問|答
--|--
`いま何が起きている？`|`どこの話？`、`しらねーよ`
`今あなたの身に何が起きている？`|`なんもねーよ！　こえーよ！`
`今あなたの周りで何が起きている？`|`え、何か起きてるの？　怖い教えて！`
`今この日本で何が起きている？`|`俺はジャーナリストかッ！`

　`何が起きている？`と言われると、なんだか中二病のセリフに聞こえる。それに、`起きている`というのは物でなく事であり、`事件が起こった`ように聞こえる。なんぞ殺人事件でも起きたかと。

　もし日常のささいな変化を問うなら`何か変わったことあった？`だろう。でもそれを改めて発信サービスから問われると、何か面白いことを発信せねばならないように感じてしまう。かといって、それを見越して`何かあった、というほどでもないような些細なことでも構いませんよ？`とか言われるとしつこく催促されているようでヤな感じ。

### `今どうなってる？`にすべきでは？

　自分でなく他人や状況を問うなら`今どうしてる？`より`今どうなってる？`では？

* `する`でなく`なる`に変えるべきでは？

問|意味
--|----
`今どうしてる？`|自分がしていることは何か
`今どうなってる？`|自分の周りの状況はどうか

### `今どうなってる？`から感じる圧力

　パワハラ的な圧をかけられたように聞こえる。

* 暗に`今（あの案件）どうなってる？（まだ終わらないの？）`と上司に進捗を問われているようだし、何なら`（はやく終わらせろよ）`と催促され圧力をかけられているようにさえ聞こえる((((；ﾟДﾟ))))ｶﾞｸｶﾞｸﾌﾞﾙﾌﾞﾙ
* きっとこの問いに答えたら`は？　まだそこまでしか進んでないの？　使えねーな、さっさとやれよ`と言われそうで嫌な気持ちになり、答えたくなくなり、ツイートしなくなりそう

問|意味|受け手の気持ち
--|----|--------------
`今どうしてる？`|自分がしていることは何か|友人とのフランクな会話
`今どうなってる？`|自分の周りの状況はどうか|上司に仕事を催促されるパワハラ

　どうしてこうなった……

### `する`／`なる`

　`する`という自動詞でなく`なる`という他動詞の違いがある。

* `する`は自発的だから自分だけの話であり主導権をもって語れる
* `なる`は他動詞であり問うた者に自発性はなく受動的で`俺は何もしないぞ？　お前がやるんだろ？　やるよな？`という暗黙のメッセージに感じる。

　日本語では、他動詞をだれかに向けて放つと命令形の暗示になる場合があるようだ。でも`俺は海賊王になる！`は自動詞にみえる。どちらも同じ`なる`なのに不思議。日本語むずかしい。

#### 主語がない弊害

問|意味|受け手の気持ち
--|----|--------------
`今どうしてる？`|`今***あなたは***どうしてる？`|友人とのフランクな会話
`今どうなってる？`|`今***あなたが完遂すべき仕事は***どうなってる？`|上司に仕事を催促されるパワハラ

　字面ではわずかな違いにみえるが、明示されない主語の部分がまるで違う。

　主語が明示されないせいで、受け手が補完せねばならない。それが話し手の意図するものと同じかどうか保障できない。たとえば受け手が日常的に仕事で上司から`今どうなってる？`と問われていたとする。仕事中であるという文脈から主語である`あなたが完遂すべき仕事は`を脳内補完するだろう。そんなことが日々繰り返されていたら、たとえ異なる場面であっても同じ言葉`今どうなってる？`をきいたら仕事で上司に催促されるストレスフルな場面が連想される。同時にそのときの気持ちや感情も想起されてしまう。たとえ目の前の人や会話とは違っていても、受け手の中では一緒くたになってしまう。上司には逆らえないので、とてつもないストレスである。なんならフラッシュバックと言っても過言ではない。そんなものを想起させる相手や会話は、自分を追い詰める敵であり、排除すべきという答えになってしまう。かくして主語のないコミュニケーションは破綻する。

　主語を明言しないと、語弊や誤解、嫌な印象などが想起され発狂しキレることも起こりうる。とくにストレスフル社会とのアナジー効果は絶大。

### `今どうしてる？`にたどりつく

* 上記の理由で`今どうしてる？`にしたのだと勝手に推測した
* 日本語ってむずかしい。言葉でニュアンス伝えるとかムリ。受け手次第なところもある。

[createRepo]:https://docs.github.com/ja/rest/repos/repos#create-a-repository-for-the-authenticated-user

語|意味
--|----
`する`|自分が行っている様
`なる`|自分でなく他者または状況が勝手に進む様

語|疑問系|意味
--|------|---
`する`|`今どうしてる？`|友人がフランクな感じで問うてきたように聞こえる
`なる`|`今どうなってる？`|上司が仕事の完了を暗に迫るパワハラに聞こえる

　ほんのわずかな違いなのに、ここまで印象が変わる。どちらの問いのほうが答えやすいか。いうまでもなく`今どうしてる？`のほうだ。

　`今何がどうなってる？`だと、すごくバカっぽく聞こえる。`私はだれ？`みたいな質問にみえる。お前のことはお前で知っとけといいたくなる。これもやはり主語がないせいか。`今あなたやその周りはどうなってる？`だと一見よさそうだが、まるで思春期の少年少女に対して過干渉する母親みたいなうっとおしさを感じる。なぜお前に逐一報告せねばならないんだ、という気持ちになる。

　`今どうしてる？`くらいがソフトでライトで当たり障りのない質問文だと思われる。

#### 他の可能性をつぶす

　つぶやく内容はべつに自分の活動でもいいし、周囲の状況でもいい。そのどちらかに限定する必要はない。けれど、その両方を問う端的な言葉が見つからない。

　たとえば次のような質問文でもいいが、長い。スマホでも端的にわかるよう短くしたい。

* `今あなたがしていることや、身の回りで起きていることは？`
* `今してること、起きてることは？`

　あまり正確に伝えようとすると真剣に探し悩み疲れ、やがて`なんでお前にそんなこと教えなきゃならないんだよ！`とディスプレイに向かってキレるかもしれない。ストレス社会にさらされ、先進国のなかで給与もQOLも最低レベルの日本人は、ささいな言葉ひとつで爆発しかねない危機的状況にある。慎重に言葉を選ばねば破滅しうる。よって正しさよりも気持ちよさが優先される。疲れる長文より短文が好まれる。短文かつ気持ち良い言葉を考えねばならない。

　ツイートの内容は行動や状況だけでなく、感じたことや考えたことでもいいはず。だが、もし以下のような質問だったら？

* `今の気持ちは？`
* `今思ったことは？`

　日々つらいことばかりだと`ねぇねぇ今どんな気持ち？`（ニチャァ）みたいに煽られているように解釈することもできる。むしろ、そう言われているようにしか思えない。腹立だしくなり、とても答えてやろうという気になれない。なんならこの質問文を書きやがった運営に`ふざけんな！`と送信したくなる。ちがう、そうじゃない。そういうサービスじゃない。でも、受け手は今の状況・心情によって質問文の意味を解釈する。余裕がないときは状況に応じて相手の意図を推し量る余裕などない。自分の今の状況を中心に解釈することしかできなくなる。こうなるともうどんな言葉だろうがダメ。休んでください。社会が悪いと言葉ひとつで問題が起きる。選択肢が減り、ゆとりが消えてゆく。

　そうでなくとも人の頭の中など、よからぬことで満ちている。外に出したら間違いなくトラブルになる。たとえば以下のように。

* `マジあのクソ上司死ねばいいのに`
* `山田とかいうゴミ部下マジ使えねー`

　みたいなことは皆、日頃から常に思っているだろう。でも、それをそのまま発信したらマズイ。だからツイッターでは感じていることや考えていることではなく、行っていることに限定した質問文にしたのではないだろうか。

　感情や思考でなく行為に限定すれば、まさか`上司を殴りに行ったナウ♪`みたいな発言は生じないはず。生じない、よね？

　きっと`プラモ作った`とか`クッキー焼いた`みたいな平和なツイートだけになるはず。

　だがツイッターによれば自分の活動より、周囲の状況を報告することが多いらしい。そうなるとニュースのように5W1Hで事実を客観的に報告することになる。それで問題があるとすれば事実を装ったフェイクニュースが蔓延することか。もはや人間関係というより社会問題に昇華されてしまった。

　責任の所在を自分だけにすれば問題も小さい。だから`今どうしてる？`と自分の行動を報告させようとする質問文をもちいるのだろう。

1. `自分が行ったこと`
1. `自分の周りで起こったこと`

　きっとツイッター的には`なんか（面白いこと）あった？`と聞きたいのだろう。でもそれだと不躾だし下心丸出しだし、ユーザ的にもハードルが高くてツイートしづらい。そこでやむなく`今どうしてる？`にして発信しやすくしたのではないか。

　あるいは`今どうしてる？（もちろん発信するからにはバズるような面白いことしてるんだよね？　まさか「ハラヘッタ」みたいな愚にもつかない発言しないよね？）`みたいな腹づもりがあるのかもしれない。ここまでくると、もうハイコンテクストすぎて察することも忖度することもできない。人間不信になりそう。

　いっそハードルをさげるなら`いきてる？`でもいいかもしれない。超高齢化社会かつストレスフル社会に適した最高の質問文だと思う。ただ、悲しくなるのが難点。真実はいつも過酷なので、嘘により目をそらして楽になれる言葉でごまかす必要がある。



placeholder|問題
-----------|----
`今なにしてる？`|実際は起こったことを発信している人が多いためふさわしくないらしい
`今どうしてる？`|これが現状最善。
`今どうなってる？`|まるで上司に仕事の催促をされているかのような圧力を感じる
`起きている`|事故、事件性がありそうで不穏
`いま何が起きている？`|`どこの話？`
`今あなたの身に何が起きている？`|`なんもねーよ！　こえーよ！`
`今あなたの周りで何が起きている？`|`え、何か起きてるの？　怖い教えて！`
`今この日本で何が起きている？`|`俺はジャーナリストかッ！`
`何が起きている？`|中二病か？
`何か変わったことあった？`|発信サービスから問われると、何か面白いことを発信せねばならないように感じてしまう
`何かあった、というほどでもない些細なことでも構いませんよ？`|しつこく催促されているようでヤな感じ
`今何がどうなってる？`|頭大丈夫？　それとも寝起き？
`今あなたやその周りはどうなってる？`|まるで思春期の少年少女に対して過干渉する母親みたいなうっとおしさ
`今あなたがしていることや、身の回りで起きていることは？`|長い
`今してること、起きてることは？`|長いし選択肢が多い。一言つぶやくなら質問文もひとつに絞ってほしい
`今の気持ちは？`|しんどい日々が続くと`ねぇねぇ今どんな気持ち？`（ニチャァ）と煽られているように感じる
`今思ったことは？`|しんどい日々が続くと`ねぇねぇ今どんな気持ち？`（ニチャァ）と煽られているように感じる
`なんかあった？`|`は？　なにが？　友達かよ`と問い返したくなる
`なんか面白いことあった？`|発信のハードルがあがる。`なんもねーよ畜生`と鬱になる
`いきてる？`|生存することさえ希少価値である現実に目を向けさせられて絶望してしまう
`どうかした？`|`どうもしねーよ`　まるで頭おかしいと言われているようにみえる
`なにかした？`|一生懸命したことを報告しようとしたときに言われたら心が折れそう
`あれ、また君なんかやっちゃいました？`|無性にイラつく。この文法でならマウントとれていい気分になれるだろ、と思われているのかと思うとバカにされている感ハンパない

