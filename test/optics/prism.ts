import { expect } from 'chai'

import { identity } from 'funds/core'
import { Either, left, right } from 'funds/data'
import { Labelled, lab4, stringed } from './hierarchy-seed'
import { Prism, mkPrism, mkLens, mkSetter } from 'funds/optics'

describe('Prisms', () => {
  const lp: Prism<Either<number, Labelled<number>>, string, Labelled<number>, number> =
    mkPrism(
      (eln: Either<number, Labelled<number>>) => eln.leftMap(n => `Extraction failed: ${n}`),
      (n: number) => `Upcasted ${n}`)
  describe('perform', () => {
    it('extraction', () => {
      expect(lp.preview(left(4))).to.eql(left('Extraction failed: 4'))
      expect(lp.preview(right(lab4))).to.eql(right(lab4))
    })
    it('upcasting', () => {
      expect(lp.re(4)).to.eql('Upcasted 4')
    })
  })
  describe('compose', () => {
    it('with prisms', () => {
      const zero: Prism<Labelled<number>, number, string, number> =
        mkPrism<Labelled<number>, number, string, number>(
          (ln: Labelled<number>) => ln.x === 0 ? right(ln.label) : left(ln.x),
          identity as (n: number) => number
      )
      const comp = lp.compose(zero)
      const preview = comp.preview
      expect(preview(right(lab4))).to.eql(left('Upcasted 4'))
      expect(preview(right({ x: 0, label: 'fake' }))).to.eql(right('fake'))
      expect(preview(left(7))).to.eql(left('Extraction failed: 7'))
    })
    it('with setters', () => {
      const labelledToNum = mkSetter(
        (f: (label: string) => number) => (ln: Labelled<number>) => f(ln.label) + ln.x)
      const comp = lp.compose(labelledToNum)
      const strlen = (s: string) => s.length
      expect(comp.modify(strlen, left(7))).to.eql('Extraction failed: 7')
      expect(comp.modify(strlen, right(lab4))).to.eql('Upcasted 8')
      expect(comp.set(7, left(5))).to.eql('Extraction failed: 5')
      expect(comp.set(7, right(lab4))).to.eql('Upcasted 11')
    })

  })
})

