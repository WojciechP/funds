import { expect } from 'chai'
import { Setter, mkSetter } from 'funds/optics/setter'

import { Labelled, int2str, lab4, stringed } from './hierarchy-seed'

describe('Setters', () => {
  const xsetter: Setter<Labelled<number>, Labelled<string>, number, string> = mkSetter((f: (n: number) => string) => (ln: Labelled<number>) => {
    return { label: ln.label, x: f(ln.x) }
  })

  describe('work on POJOs', () => {

    it('modify', () => {
      expect(xsetter.modify(int2str, lab4)).to.eql(stringed)
      expect(xsetter.modify(int2str)(lab4)).to.eql(stringed)
    })
    it('set', () => {
      expect(xsetter.set('blah', lab4)).to.eql({ x: 'blah', label: 'Lab4' })
    })
  })

  describe('compose', () => {
    const andHex: Setter<number, string, number, number> = mkSetter((f: (n: number) => number) => (n: number) => f(n).toString(16))
    const labelledHex: Setter<Labelled<number>, Labelled<string>, number, number> = xsetter.compose(andHex)
    it('sets deep props', () => {
      expect(labelledHex.modify((n: number) => n+10, lab4)).to.eql({ label: 'Lab4', x: 'e' })
    })
  })

})


