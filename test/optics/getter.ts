import { expect } from 'chai'
import { Getter, mkGetter } from 'funds/optics/getter'
import { Either, left, right } from 'funds/data'

describe('Getters', () => {
  const together = mkGetter((e: Either<number, number>) => e.cata<[number, number]>(
    (n => [n, null]),
    (n => [null, n])
  ))

  it('gets attributes', () => {
    expect(together.get(right(5))).to.eql([null, 5])
  })
  it('has the methods bound', () => {
    const get = together.get
    expect(get(left(4))).to.eql([4, null])
  })
  it('composes', () => {
    const second = ([a, b]: [number, number]) => b
    const comp = together.compose
    const getright = together.compose(second)
    const getrightget = getright.get
    expect(getrightget(right(5))).to.eql(5)
    expect(getrightget(left(2))).to.eql(null)
  })

})
