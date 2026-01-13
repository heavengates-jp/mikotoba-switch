import { describe, it, expect } from 'vitest'
import { parseBulkInput } from './parseBulk'

describe('parseBulkInput', () => {
  it('parses valid lines with optional note/tags', () => {
    const raw = 'ヨハネの手紙 第二 1:6|愛を行う|短いヒント|愛,歩む\n詩篇 23:1|主は羊飼いです||'
    const result = parseBulkInput(raw)
    expect(result.errors.length).toBe(0)
    expect(result.entries.length).toBe(2)
    expect(result.entries[0].tags).toEqual(['愛', '歩む'])
    expect(result.entries[1].note).toBe('')
  })

  it('reports errors when required fields are missing', () => {
    const raw = '||note only\nヨハネ 3:16|'
    const result = parseBulkInput(raw)
    expect(result.entries.length).toBe(0)
    expect(result.errors.length).toBe(2)
  })
})