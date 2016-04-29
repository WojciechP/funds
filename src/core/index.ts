export interface Fun<A, B> {
  (a: A):  B
  andThen: <C>(g: (b: B) => C) => Fun<A, C>
}

export interface Fun2<A1, A2, B> {
  (a1: A1, a2: A2): B
  (a1: A1): Fun<A2, B>
  andThen<C>(f: (partial: (a2: A2) => B) => C): Fun<A1, C>
}

export function mkFun<A, B>(f: (a: A) => B) {
  const baseFunc = ((a: A) => f(a)) as Fun<A, B>
  baseFunc.andThen = <C>(g: (b: B) => C) => mkFun((a: A) => g(f(a)))
  return baseFunc
}

export function mkFun2<A1, A2, B>(f: (a1: A1, a2: A2) => B) {
  const baseFunc = function(a1: A1, a2?: A2): B | Fun<A2, B> {
    if (a2 == null) {
      return mkFun((a2: A2) => f(a1, a2))
    } else {
      return f(a1, a2)
    }
  } as Fun2<A1, A2, B>
  function andThen<C>(f: (partial: (a2: A2) => B) => C): Fun<A1, C> {
    return mkFun((a1: A1) => f(baseFunc(a1) as Fun<A2, B> as (a2: A2) => B))
  }
  baseFunc.andThen = andThen
  return baseFunc
}

export function identity<A>(a: A) { return a }
