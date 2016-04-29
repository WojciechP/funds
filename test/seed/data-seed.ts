import { Maybe, just, nothing } from 'funds/data'

export interface Employee {
  name: string
  manager: Maybe<Employee>
}

export interface FullTime extends Employee {
  salary: number
  monthsWorked: number
}

export interface Contractor extends Employee {
  contractHistory: Contract[]
}

export interface Contract {
  title: string
  value: number
}



export const painterPat: Contractor = {
  name: "Pat Peterson",
  manager: nothing<Employee>(),
  contractHistory: [
    { title: "Ballroom", value: 25000 },
    { title: "Fence", value: 700 }
  ]
}

export const chefChuck: FullTime = {
  name: "Chuck Chimmings",
  manager: nothing<Employee>(),
  salary: 5000,
  monthsWorked: 4
}

export const waitressWendy: FullTime = {
  name: "Wendy White",
  manager: just(chefChuck),
  salary: 3000,
  monthsWorked: 2
}


export interface Paycheck {
  recipient: Employee,
  amount: number
}

export const patPaycheck: Paycheck = {
  recipient: painterPat,
  amount: 500
}

