
export interface Labelled<X> {
  x: X
  label: string
}

export const int2str = (n: number) => `Num is ${n}`
export const lab4 = { x: 4, label: 'Lab4' }
export const stringed = { x: 'Num is 4', label: 'Lab4' }
