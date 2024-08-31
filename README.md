# node-doc-test-ts

node:test で documentaion test をする

## js

```sh
$ node --test --import ./src/loader.js "./src/*.js"
✔ src/loader.js (436.079851ms)
▶ toTestTitle
  ✔ 空文字ならデフォルトタイトル (0.692692ms)
  ✔ 空白文字のみならデフォルトタイトル (0.130063ms)
  ✔ 文字列があればタイトルにする (0.152205ms)
▶ toTestTitle (1.938659ms)
ℹ tests 4
ℹ suites 1
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1423.111676
```

## ts

### tsx を使う

esbuild の変換後にコメントが消えるので、あとからロードする

```sh
$ node --test --import ./src/loader.js --import tsx "./src/*.ts"
▶ add
  ✔ 正の数の足し算 (0.796768ms)
  ✔ タイトルなし (0.134021ms)
▶ add (1.823283ms)
▶ mul
  ✔ 正の数の掛け算 (0.683015ms)
▶ mul (1.557848ms)
ℹ tests 3
ℹ suites 2
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1057.953312
```