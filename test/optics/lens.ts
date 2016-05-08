import { expect } from 'chai'

import { Labelled, lab4, stringed } from './hierarchy-seed'
import { mkLens, mkGetter, mkSetter, Lens, PLens } from 'funds/optics'
import { Employee, Paycheck, painterPat, chefChuck, waitressWendy, patPaycheck } from '../seed/data-seed'
import { just } from 'funds/data'

describe('Lens', () => {
  describe('Simple', () => {
    const name = mkLens((e: Employee) => e.name, (name: string) => (e: Employee) => Object.assign({}, e, { name }))
    const recipient = mkLens((p: Paycheck) => p.recipient, (r: Employee) => (p: Paycheck) => { return { amount: p.amount, recipient: r }})

    it('Modifies props', () => {
      expect(name.modify(name => name + '!', waitressWendy)).to.eql({
        name: 'Wendy White!',
        manager: just(chefChuck),
        salary: 3000,
        monthsWorked: 2
      })
      expect(painterPat).to.eql(painterPat)
    })
    it('Composes with simple lens', () => {
      const recName: Lens<Paycheck, string> = recipient.compose(name)
      expect(recName.get(patPaycheck)).to.eql('Pat Peterson')
    })
    it('Composes with poly-lens', () => {
      const strlensuf = mkLens((s: string) => s.length, (suf: string) => (s: string) => s + suf)
      const nameStrlensuf: PLens<Employee, Employee, number, string> = name.compose(strlensuf)
      expect(nameStrlensuf.modify(n => ` of length ${n}`, waitressWendy)).to.have.property('name', 'Wendy White of length 11')
    })


  })
  describe('Polymorphic', () => {
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


})

interface Counted<A> {
  oldCount: number
  modified: A
}
