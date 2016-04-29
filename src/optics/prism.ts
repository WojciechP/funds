import { Fun, Fun2 } from '../core'
import { Either } from '../data'

import { Optic } from './internal'
import { Setter } from './setter'
import { Getter } from './getter'

export interface Prism<S, T, A, B> extends Setter<S, T, A, B> {
  re: Getter<B, T>
  preview: Fun<S, Either<T, A>>
  compose<X, Y>(next: Prism<A, B, X, Y>): Prism<S, T, X, Y>
  compose<X, Y>(next: Setter<A, B, X, Y>): Setter<S, T, X, Y>
}

export const mkPrism = <S, T, A, B>(preview: (s: S) => Either<T, A>, re: (b: B) => T) => {
  return new Optic({ preview, re }) as Prism<S, T, A, B>
}


