import { expect } from 'chai'

import { Labelled, lab4, stringed } from './hierarchy-seed'
import { mkLens, mkGetter, mkSetter } from 'funds/optics'

describe('Lens', () => {
  const x = mkLens(
    (ln: Labelled<number>) => ln.x,
    (s: string) => (ln: Labelled<number>) => { return { x: s, label: ln.label }})

  it('Gets and sets', () => {
    expect(x.get(lab4)).to.eql(4)
    expect(x.set('Num is 4', lab4)).to.eql(stringed)
  })
  describe('Composes', () => {
    it('with lens', () => {
      const first = mkLens(
        (arr: Labelled<number>[]) => arr[0],
        (ls: Labelled<string>) => (arr: Labelled<number>[]) => { return { oldCount: arr.length, modified: ls } })
      const firstx = first.compose(x)
      const modify = firstx.modify
      expect(firstx([lab4, lab4])).to.eql(4)
      expect(modify((t => `Num is ${t}`), [lab4, lab4])).to.eql({ oldCount: 2, modified: stringed })
    })
    it('with getters', () => {
      const twiceString = mkGetter((t: number) => (2*t).toString())
      expect(x.compose(twiceString).get(lab4)).to.eql('8')
    })
    it('with setters', () => {
      const hex = mkSetter((f: (n: number) => number) => (n: number) => f(n).toString(16))
      const xhex = x.compose(hex)
      expect(xhex.modify(t => t+25, lab4)).to.eql({ x: '1d', label: 'Lab4' })
      expect(xhex.set(31)(lab4)).to.eql({ x: '1f', label: 'Lab4' })
    })
  })


})

interface Counted<A> {
  oldCount: number
  modified: A
}
