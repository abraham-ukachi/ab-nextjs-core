import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('ab-nextjs-core package smoke', () => {
  it('targets Next 16.3.4 peers and package metadata', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    expect(pkg.name).toBe('ab-nextjs-core')
    expect(pkg.version).toBe('0.1.0')
    expect(pkg.peerDependencies.next).toBe('16.3.4')
    expect(pkg.peerDependencies.react).toBe('^19')
    expect(pkg.peerDependencies['react-dom']).toBe('^19')
  })

  it('exports supportedCore catalog (8 pending)', async () => {
    const mod = await import('../index')
    expect(Array.isArray(mod.supportedCore)).toBe(true)
    expect(mod.supportedCore).toHaveLength(8)
    expect(mod.supportedCore.every((item) => item.status === 'Pending')).toBe(true)
    expect(mod.default.supportedCore).toHaveLength(8)
  })

  it('splits catalog into 4 server and 4 client entries', async () => {
    const mod = await import('../index')
    expect(mod.supportedCore.filter((item) => item.kind === 'server')).toHaveLength(4)
    expect(mod.supportedCore.filter((item) => item.kind === 'client')).toHaveLength(4)
  })
})
