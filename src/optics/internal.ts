import { autobind } from 'core-decorators'

import { Fun, Fun2, mkFun, mkFun2, identity } from '../core'
import { Either, left, right } from '../data'
import { Getter, mkGetter, GetterNoApply } from './getter'
import { PSetter } from './setter'
import { PLens, PLensNoApply } from './lens'
import { PPrism } from './prism'

export interface OpticProps<S, T, A, B> {
  get?: (s: S) => A
  modify?: (f: (a: A) => B) => (s: S) => T
  re?: (b: B) => T
  set?: (b: B) => (s: S) => T
  preview?: (s: S) => Either<T, A>
}

export interface OpticQuality {
  isGetter: boolean
  isSetter: boolean
  isReview: boolean
  isPrism: boolean
}

@autobind
export class Optic<S, T, A, B> implements OpticProps<S, T, A, B>,
    GetterNoApply<S, A>,
    PSetter<S, T, A, B>,
    PLensNoApply<S, T, A, B>,
    PPrism<S, T, A, B> {
  // Note: all these are optional; depending on their presence,
  // one gets different optics. They are represented only in
  // interface hierarchy (as opposed to class hierarchy)
  // because of multiple inheritance.
  get: Fun<S, A>
  modify: Fun2<(a: A) => B, S, T>
  re: Getter<B, T>
  set: Fun2<B, S, T>
  preview: Fun<S, Either<T, A>>

  public quality: OpticQuality = {
    isGetter: false,
    isSetter: false,
    isReview: false,
    isPrism: false,
  }

  constructor({ get, modify, re, set, preview }: OpticProps<S, T, A, B>) {
    if (preview) {
      this.preview = mkFun(preview)
    }
    if (re) {
      this.re = mkGetter(re)
      this.quality.isReview = true
      if (this.preview) {
        this.quality.isPrism = true
        if (!modify) {
          modify = (f: (a: A) => B) => (s: S) => preview(s).cata<T>(identity, (a: A) => re(f(a)))
        }
      }
    }
    if (get) {
      this.get = mkFun(get)
      this.quality.isGetter = true
    }
    if (!set && modify) {
      set = (b: B) => (s: S) => modify(() => b)(s)
    }
    if (get && set && !modify) {
      modify = (f: (a: A) => B) => (s: S) => set(f(get(s)))(s)
    }
    if (modify) {
      this.modify = mkFun2((f: (a: A) => B, s: S) => modify(f)(s))
      this.quality.isSetter = true
    }
    if (set) {
      this.set = mkFun2((b: B, s: S) => set(b)(s))
    }
  }
  // warning: these signatures are only partially true.
  // Composition will never yield a "bigger" optic than any of the arguments, including `this`.
  // For example, if `this` is in fact a `Setter`, composition with a `Lens` will
  // return another `Setter` (and not a `Lens`, as the signature would suggest).
  // This is an artifact of all optics being the same class and appears only in the signatures
  // in package-internal class `Optics`. The composition signatures on exproted interfaces
  // are correct.
  public compose<X, Y>(next: PLens<A, B, X, Y>): PLens<S, T, X, Y>
  public compose<X, Y>(next: PPrism<A, B, X, Y>): PPrism<S, T, X, Y>
  public compose<X, Y>(next: PSetter<A, B, X, Y>): PSetter<S, T, X, Y>
  // public compose<BB>(next: Review<B, BB>): Review<BB, T>
  public compose<AA>(nextGetter: (a: A) => AA): Getter<S, AA>
  public compose<X, Y>(next: PLens<A, B, X, Y>
                           | PPrism<A, B, X, Y>
                           | PSetter<A, B, X, Y>
                           | ((a: A) => X)): PSetter<S, T, X, Y>
                                           | Getter<S, X>
                                           | PPrism<S, T, X, Y>
                                           | PLens<S, T, X, Y> {
    if (next instanceof Function) {
      return mkGetter((s: S) => next(this.get(s)))
    }
    if (next instanceof Optic) {
      const composed = {
        get: (this.quality.isGetter && next.quality.isGetter) ? this.get.andThen(next.get) : null,
        modify: (this.quality.isSetter && next.quality.isSetter) ? next.modify.andThen(this.modify) : null,
        re: (this.quality.isReview && next.quality.isReview) ? next.re.andThen(this.re) : null,
        set: (this.set && this.get && next.set) ? (y: Y) => (s: S) => this.set(next.set(y, this.get(s)), s) : null,
        preview: (this.preview && next.quality.isPrism) ? (s: S) => this.preview(s)
          .flatMap((a: A) => next.preview(a).leftMap(this.re)) : null
      }
      const result = new Optic<S, T, X, Y>(composed)
      if (result.quality.isGetter) return result.withCall()
      return result
    }

  }
  
  public toString() {
    return `Optic ${this.quality}`
  }

  public withCall(): Optic<S, T, A, B> & Fun<S, A> {
    const duplicatedGet = assignToFunc(this.get, this)
    // Important: mkFun adds a .compose, which compose functions. We need to delete it,
    // so that clas method kicks in.
    delete duplicatedGet.compose
    duplicatedGet.__proto__ = Optic.prototype
    return duplicatedGet
  }

}

function assignToFunc<S, A, X>(f: (s: S) => A, x: X): X & Fun<S, A> & ({ __proto__: any }) {
  const baseFun = mkFun(f) as any
  return Object.assign(baseFun, x)
}
