import { writeFileSync } from 'fs'
import { join } from 'path'
import template, { SchemeName } from './template'

const cwd = process.cwd()

for (const variant of ['light', 'dark', 'mirage'] as SchemeName[]) {
  const name = `Ayu ${variant.charAt(0).toUpperCase() + variant.slice(1)}`
  writeFileSync(join(cwd, `${name}.xccolortheme`), template(variant))
  console.log(`Updated ${name}`)
}
