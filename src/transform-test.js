import { Project, SyntaxKind } from 'ts-morph';

const re = /```.*?\[test\](.*?)\n([\s\S]*?)```/

/**
 * テストタイトル
 * 
 * @example
 * ```js:[test] 空文字ならデフォルトタイトル
 * assert.strictEqual(toTestTitle(""), "タイトルなし")
 * ```
 * 
 * @example
 * ```js:[test] 空白文字のみならデフォルトタイトル
 * assert.strictEqual(toTestTitle(""), "タイトルなし")
 * ```
 * 
 * @example
 * ```js:[test] 文字列があればタイトルにする
 * assert.strictEqual(toTestTitle(" title "), "title")
 * ```
 */
const toTestTitle = (str) => {
    const title = str?.trim() ?? ""
    return title === "" ? "タイトルなし" : title
}

const toTestCode = (stmt) => (stmt.getJsDocs?.() ?? [])
    .flatMap(doc => doc.getTags().filter(tag => tag.getTagName() === 'example'))
    .flatMap(example => {
        const exampleCodeMatch = example.getComment()?.match(re);
        if (!exampleCodeMatch) return []
        return `
test('${toTestTitle(exampleCodeMatch[1])}', async () => {
${exampleCodeMatch[2].trim()};
});`;
    }).join("\n")

const extractName = (stmt) => (stmt.isKind(SyntaxKind.VariableStatement) ? 
stmt.getFirstDescendantByKind(SyntaxKind.VariableDeclaration)?.getName() : 
stmt.getName?.()) ?? "No title"

const transform = (source) => {
  const project = new Project();
  const sourceFile = project.createSourceFile("tmp.ts", source);
  const testCode = sourceFile
    .getStatements()
    .map((stmt) => ({
        name: extractName(stmt),
        test: toTestCode(stmt) 
    }))
    .filter(({ test }) => test !== "")
    .map(({name, test})=> `
describe(\`${name}\`, ()=> {
    ${test}
})
    `).join("\n")
  return`
${source.toString()}

// Auto-generated tests from JSDoc @example
import { describe, test } from 'node:test';
import assert from 'node:assert';

${testCode}
`;
}

let isFirst = true
const isTransformTarget = (url) => isFirst && url.startsWith("file://") && !url.includes("/node_modules/")

/** @type {import('node:module').LoadHook} */
export async function load(url, context, nextLoad) {
    const { source, format } = await nextLoad(url, context)
    if(!isTransformTarget(url)) return { source, format }
    isFirst = false
    return {
        format,
        source: transform(source.toString()),
    };
}


