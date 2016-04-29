import { expect } from 'chai'

import { Getter, mkGetter } from 'funds/optics/getter'
import { Either, left, right } from 'funds/data'

import { painterPat, patPaycheck, Paycheck, Employee } from '../seed/data-seed'

describe('Getters', () => {
  const recipient = mkGetter((pc: Paycheck) => pc.recipient)

  it('get attributes', () => {
    expect(recipient.get(patPaycheck)).to.eql(painterPat)
    expect(recipient(patPaycheck)).to.eql(painterPat)
  })
  it('have the methods bound', () => {
    const get = recipient.get
    expect(get(patPaycheck)).to.eql(painterPat)
  })
  it('compose with other getters', () => {
    const recipientName = recipient.compose((e: Employee) => e.name)
    expect(recipientName(patPaycheck)).to.eql('Pat Peterson')
  })

})
