
export function evalFormula(formula: string, values: Record<string, any>) {
  try {
    const fns: string[] = []
    const sandbox = { fields: values } as any
    const keys = Object.keys(values)
    const params = keys.map((k) => `f_${k}`)
    const args = keys.map((k) => values[k])
    const fn = new Function(...['fields', ...params], `return (${formula});`)
    return fn(sandbox.fields, ...args)
  } catch (e) {
    return undefined
  }
}