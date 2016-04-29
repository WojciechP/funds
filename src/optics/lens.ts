import { Fun, Fun2 } from '../core'
import { Optic } from './internal'
import { Getter, GetterNoApply } from './getter'
import { Setter } from './setter'

export interface LensNoApply<S, T, A, B> extends GetterNoApply<S, A>, Setter<S, T, A, B> {
  compose<X, Y>(next: Lens<A, B, X, Y>): Lens<S, T, X, Y>
  compose<X, Y>(next: Setter<A, B, X, Y>): Setter<S, T, X, Y>
  compose<AA>(next: (a: A) => B): Getter<S, AA>
}
export interface Lens<S, T, A, B> extends LensNoApply<S, T, A, B>, Getter<S, A> {
  compose<X, Y>(next: Lens<A, B, X, Y>): Lens<S, T, X, Y>
  compose<X, Y>(next: Setter<A, B, X, Y>): Setter<S, T, X, Y>
  compose<AA>(next: (a: A) => B): Getter<S, AA>
}

export const mkLens = <S, T, A, B>(get: (s: S) => A, set: (b: B) => (s: S) => T) => {
  return new Optic({ get, set }).withCall() as Lens<S, T, A, B>
}
  
