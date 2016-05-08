import { Fun, Fun2 } from '../core'
import { Either } from '../data'

import { Optic } from './internal'
import { PSetter, Setter } from './setter'
import { Getter } from './getter'

export interface PPrism<S, T, A, B> extends PSetter<S, T, A, B> {
  re: Getter<B, T>
  preview: Fun<S, Either<T, A>>
  compose<X, Y>(next: PPrism<A, B, X, Y>): PPrism<S, T, X, Y>
  compose<X, Y>(next: PSetter<A, B, X, Y>): PSetter<S, T, X, Y>
}

export interface Prism<S, A> extends PPrism<S, S, A, A> {
  compose<X>(next: PPrism<A, A, X, X>): Prism<S, X>
  compose<X>(next: PSetter<A, A, X, X>): Setter<S, X>
  compose<X, Y>(next: PPrism<A, A, X, Y>): PPrism<S, S, X, Y>
  compose<X, Y>(next: PSetter<A, A, X, Y>): PSetter<S, S, X, Y>
}

export interface MkPrism {
  <S, A>(preview: (s: S) => Either<S, A>, re: (a: A) => S): Prism<S, A>
  <S, T, A, B>(preview: (s: S) => Either<T, A>, re: (b: B) => T): PPrism<S, T, A, B>

}
const mkPrism_ = <S, T, A, B>(preview: (s: S) => Either<T, A>, re: (b: B) => T) => {
  return new Optic({ preview, re }) as PPrism<S, T, A, B>
}

export const mkPrism: MkPrism = mkPrism_


