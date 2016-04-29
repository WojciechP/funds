import { Fun } from '../core'
import { Optic } from './internal'

export interface GetterNoApply<S, A> {
  get: Fun<S, A>
  compose: <B>(f: (a: A) => B) => Getter<S, B>
}

export interface Getter<S, A> extends GetterNoApply<S, A>, Fun<S, A> {
  compose: <B>(f: (a: A) => B) => Getter<S, B>
}

export const mkGetter = <S, A>(get: (s: S) => A) => {
  const opt = new Optic({ get })
  return opt.withCall() as Getter<S, A>
}
