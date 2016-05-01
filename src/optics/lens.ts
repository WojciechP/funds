import { Fun, Fun2 } from '../core'
import { Optic } from './internal'
import { Getter, GetterNoApply } from './getter'
import { PSetter } from './setter'

export interface PLensNoApply<S, T, A, B> extends GetterNoApply<S, A>, PSetter<S, T, A, B> {
  compose<X, Y>(next: PLens<A, B, X, Y>): PLens<S, T, X, Y>
  compose<X, Y>(next: PSetter<A, B, X, Y>): PSetter<S, T, X, Y>
  compose<AA>(next: (a: A) => B): Getter<S, AA>
}
export interface PLens<S, T, A, B> extends PLensNoApply<S, T, A, B>, Getter<S, A> {
  compose<X, Y>(next: PLens<A, B, X, Y>): PLens<S, T, X, Y>
  compose<X, Y>(next: PSetter<A, B, X, Y>): PSetter<S, T, X, Y>
  compose<AA>(next: (a: A) => B): Getter<S, AA>
}

export const mkLens = <S, T, A, B>(get: (s: S) => A, set: (b: B) => (s: S) => T) => {
  return new Optic({ get, set }).withCall() as PLens<S, T, A, B>
}
  
