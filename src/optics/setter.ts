import { Fun, Fun2 } from '../core'
import { Optic } from './internal'

export interface PSetter<S, T, A, B> {
  modify: Fun2<(a: A) => B, S, T>
  set: Fun2<B, S, T>
  compose<X, Y>(next: PSetter<A, B, X, Y>): PSetter<S, T, X, Y>
}

export interface Setter<S, A> extends PSetter<S, S, A, A> {
  compose<X>(next: PSetter<A, A, X, X>): Setter<S, X>
  compose<X, Y>(next: PSetter<A, A, X, Y>): PSetter<S, S, X, Y>
}

export const mkSetter = <S, T, A, B>(modify: (f: (a: A) => B) => (s: S) => T) => {
  return new Optic({ modify }) as PSetter<S, T, A, B>
}
