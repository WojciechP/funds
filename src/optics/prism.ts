import { Fun, Fun2 } from '../core'
import { Either } from '../data'

import { Optic } from './internal'
import { PSetter } from './setter'
import { Getter } from './getter'

export interface PPrism<S, T, A, B> extends PSetter<S, T, A, B> {
  re: Getter<B, T>
  preview: Fun<S, Either<T, A>>
  compose<X, Y>(next: PPrism<A, B, X, Y>): PPrism<S, T, X, Y>
  compose<X, Y>(next: PSetter<A, B, X, Y>): PSetter<S, T, X, Y>
}

export const mkPrism = <S, T, A, B>(preview: (s: S) => Either<T, A>, re: (b: B) => T) => {
  return new Optic({ preview, re }) as PPrism<S, T, A, B>
}


