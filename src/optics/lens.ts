import { Fun, Fun2 } from '../core'
import { Optic } from './internal'
import { Getter, GetterNoApply } from './getter'
import { Setter, PSetter } from './setter'

export interface PLensNoApply<S, T, A, B> extends GetterNoApply<S, A>, PSetter<S, T, A, B> {
  compose<X, Y>(next: PLens<A, B, X, Y>): PLens<S, T, X, Y>
  compose<X, Y>(next: PSetter<A, B, X, Y>): PSetter<S, T, X, Y>
  compose<AA>(next: (a: A) => B): Getter<S, AA>
}

export interface LensNoApply<S, A> extends PLensNoApply<S, S, A, A> {
  compose<X>(next: PLens<A, A, X, X>): Lens<S, X>
  compose<X>(next: PSetter<A, A, X, X>): Setter<S, X>
  compose<X, Y>(next: PLens<A, A, X, Y>): PLens<S, S, X, Y>
  compose<X, Y>(next: PSetter<A, A, X, Y>): PSetter<S, S, X, Y>
  compose<AA>(next: (a: A) => AA): Getter<S, AA>
}

export interface PLens<S, T, A, B> extends PLensNoApply<S, T, A, B>, Getter<S, A> {
  compose<X, Y>(next: PLens<A, B, X, Y>): PLens<S, T, X, Y>
  compose<X, Y>(next: PSetter<A, B, X, Y>): PSetter<S, T, X, Y>
  compose<AA>(next: (a: A) => B): Getter<S, AA>
}

export interface Lens<S, A> extends LensNoApply<S, A>, Getter<S, A> {
  compose<X>(next: PLens<A, A, X, X>): Lens<S, X>
  compose<X>(next: PSetter<A, A, X, X>): Setter<S, X>
  compose<X, Y>(next: PLens<A, A, X, Y>): PLens<S, S, X, Y>
  compose<X, Y>(next: PSetter<A, A, X, Y>): PSetter<S, S, X, Y>
  compose<AA>(next: (a: A) => AA): Getter<S, AA>
}


export interface MkLens {
  <S, A>(get: (s: S) => A, set: (a: A) => (s: S) => S): Lens<S, A>
  <S, T, A, B>(get: (s: S) => A, set: (b: B) => (s: S) => T): PLens<S, T, A, B>
}

const _mkLens = <S, T, A, B>(get: (s: S) => A, set: (b: B) => (s: S) => T) => {
  return new Optic({ get, set }).withCall() as PLens<S, T, A, B>
}
export const mkLens = _mkLens as MkLens
  
