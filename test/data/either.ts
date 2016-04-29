import { expect } from 'chai'

import { left, right } from 'funds/data'
import { identity } from 'funds/core'

describe('Either', () => {
  const r5 = right(5)
  const l5 = left(5)
  it('gets mapped', () => {
    expect(r5.map(t => t+1)).to.eql(right(6))
    expect(l5.map(t => t.toString())).to.eql(left(5))
  })
  it('flatmaps', () => {
    expect(r5.flatMap(t => left(t+1))).to.eql(left(6))
    expect(l5.flatMap(t => right(t.toString()))).to.eql(left(5))
  })
  it('cats', () => {
    expect(r5.cata(null, identity)).to.eql(5)
    expect(l5.cata(identity, null)).to.eql(5)
  })
})
