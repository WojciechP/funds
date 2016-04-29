import { autobind } from 'core-decorators'

import { Functor } from '../core/typeclass'

export interface Maybe<A> extends Functor<A> {
  map<B>(f: (a: A) => B): Maybe<B>
  isJust: boolean
  run?: A
}

export const maybe = <A>(a: A) => new MaybeImpl(a) as Maybe<A>

export const just = <A>(a: A) => {
  if (a == null) {
    throw new TypeError(`Cannot construct a 'just' out of '${a}'`)
  }
  return new MaybeImpl(a) as Maybe<A>
}

export const nothing = <A>() => new MaybeImpl<A>() as Maybe<A>


@autobind
class MaybeImpl<A> implements Maybe<A> {
  constructor(private a?: A) {}
  public get run() {
    return this.a
  }
  public map<B>(f: (a: A) => B): Maybe<B> {
    if (this.a == null) {
      return this as any as Maybe<B>
    }
    return new MaybeImpl(f(this.a))
  }
  public get isJust() {
    return this.a == null
  }
}

