import { autobind, override } from 'core-decorators'

import { mkFun, Fun, identity } from '../core'
import { Monad } from '../core/typeclass'

export interface Either<A, B> extends Monad<B> {
  map<BB>(f: (b: B) => BB): Either<A, B>
  flatMap<BB>(f: (b: B) => Either<A, BB>): Either<A, BB>
  leftMap<AA>(f: (a: A) => AA): Either<AA, B>
  cata<C>(onLeft: (a: A) => C, onRight: (b: B) => C): C
  cata<C>(onLeft: (a: A) => C):  Fun<(b: B) => C, C>
}

export const left = <A, B>(a: A) => new Left<A, B>(a) as Either<A, B>
export const right = <A, B>(b: B) => new Right<A, B>(b) as Either<A, B>

abstract class EitherImpl<A, B> implements Either<A, B> {

  protected abstract _cata<C>(onLeft: (a: A) => C, onRight: (b: B) => C): C

  public map<BB>(f: (b: B) => BB): Either<A, BB> {
    return this.cata<Either<A, BB>>(left, b => right<A, BB>(f(b)))
  }

  public leftMap<AA>(f: (a: A) => AA): Either<AA, B> {
    return this.cata(a => left<AA, B>(f(a)), right)
  }

  public flatMap<BB>(f: (b: B) => Either<A, BB>): Either<A, BB> {
    return this.cata<Either<A, BB>>(left, f)
  }


  public cata<C>(onLeft: (a: A) => C, onRight: (b: B) => C): C
  public cata<C>(onLeft: (a: A) => C): Fun<(b: B) => C, C>
  public cata<C>(onLeft: (a: A) => C, onRight?: (b: B) => C): C | Fun<(b: B) => C, C> {
    if (onRight === undefined) {
      return mkFun((onRight: (b: B) => C) => this._cata(onLeft, onRight))
    }
    return this._cata(onLeft, onRight)
  }
}

@autobind
class Left<A, B> extends EitherImpl<A, B> {
  constructor(private left: A) {
    super()
  }

  protected _cata<C>(onLeft: (a: A) => C, onRight: (b: B) => C): C {
    return onLeft(this.left)
  }
}

@autobind
class Right<A, B> extends EitherImpl<A, B> {
  constructor(private right: B) {
    super()
  }

  protected _cata<C>(onLeft: (a: A) => C, onRight: (b: B) => C): C {
    return onRight(this.right)
  }
}
