import { add } from "./example.js"
/**
 * 
 * @example
 * ```ts:[test] 正の数の掛け算
 * assert.strictEqual(mul(2, 3), 6)
 * ```
 */
export function mul(a: number, b:number) {
    let o = 0
    for (let i = 0; i < b; i++) {
        o = add(o, a)      
    }
    return o
}