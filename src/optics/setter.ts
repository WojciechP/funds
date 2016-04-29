import { Fun, Fun2 } from '../core'
import { Optic } from './internal'

export interface Setter<S, T, A, B> {
  modify: Fun2<(a: A) => B, S, T>
  set: Fun2<B, S, T>
  compose<X, Y>(next: Setter<A, B, X, Y>): Setter<S, T, X, Y>
}

export const mkSetter = <S, T, A, B>(modify: (f: (a: A) => B) => (s: S) => T) => {
  return new Optic({ modify }) as Setter<S, T, A, B>
}
