// Shared test fixtures. Keep these immutable — never reassign properties on
// them inside tests. If a test needs to mutate, make a deep copy first.

export type User = {
  id: number;
  name: string;
  age: number;
  active?: boolean;
};

export const users: User[] = [
  { id: 1, name: "Ada", age: 20, active: true },
  { id: 2, name: "Bob", age: 25, active: false },
  { id: 3, name: "Cid", age: 30, active: true },
  { id: 4, name: "Dot", age: 35, active: false },
];

export type Order = {
  id: number;
  customer: string;
  amount: number;
  total: { price: number };
};

export const orders: Order[] = [
  { id: 1, customer: "A", amount: 100, total: { price: 150 } },
  { id: 2, customer: "B", amount: 200, total: { price: 250 } },
  { id: 3, customer: "A", amount: 300, total: { price: 350 } },
  { id: 4, customer: "C", amount: 300, total: { price: 350 } },
];

export const students = [
  { id: 1, class: "A", grade: 1 },
  { id: 2, class: "B", grade: 2 },
  { id: 3, class: "A", grade: 3 },
  { id: 4, class: "B", grade: 2 },
  { id: 5, class: "B", grade: 2 },
  { id: 6, class: "C", grade: 5 },
];

export const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
