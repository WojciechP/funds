import { Fun, Fun2 } from './index'

export interface Functor<A> {
  map<B>(f: (a: A) => B): Functor<B>
}

export interface Monad<A> extends Functor<A> {
  map<B>(f: (a: A) => B): Monad<B>
  flatMap<B>(f: (a: A) => Monad<B>): Monad<B>
}

