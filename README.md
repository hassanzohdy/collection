# Collections

Collections are immutable arrays of values. They are similar to JavaScript arrays, besides that, it provides you with numerous helpers methods.

The collection has over 100 methods that are divided into categories. it can be used to work with Numbers, Objects, Strings, Filtering, Sorting, Grouping, Merging and other tons of features.

## Installation

```bash
yarn add @mongez/collection
```

Or using npm

```bash
npm install @mongez/collection
```

Using PNPM

```bash
pnpm add @mongez/collection
```

## Usage

```ts
import { collect } from "@mongez/collection";

const numbers = collect([1, 2, 3, 4, 5]);
```

We can also import `ImmutableCollection` class to create a collection instance.

```ts
import { ImmutableCollection } from "@mongez/collection";

const numbers = new ImmutableCollection([1, 2, 3, 4, 5]);
```

## Immutable Collection

The `collect` function returns a new instance of `ImmutableCollection` which means any operation you perform like `map` or `filter` will return a new instance of `ImmutableCollection` and will not affect the original collection.

Also please note that any returned value as an array will be returned in a new `ImmutableCollection`, to transform it to array, you can use `toArray` method.

## Array Built In Methods

Array collections have all the built in methods of the array class. You can use them as you would use them in the array.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.map(number => number * 2); // [2, 4, 6, 8, 10]
```

## Unique

The `unique` method will remove any duplicate values from the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5, 5, 5]);

numbers.unique(); // [1, 2, 3, 4, 5]
```

We can also get the unique values of specific key.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.unique("name"); // ["John", "Jane"]
```

## Unique List

The `uniqueList` method will return all unique elements for the given value, so the key will be matched against the uniqueness criteria, and the first unique value will return the entire object instead of just the value itself.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.uniqueList("name"); // [{ id: 1, name: 'John' }, { id: 3, name: 'Jane' }]
```

## Is Empty

The `isEmpty` method will return `true` if the collection is empty.

```ts
const numbers = collect([]);

numbers.isEmpty(); // true
```

## Is Not Empty

The `isNotEmpty` method will return `true` if the collection is not empty.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.isNotEmpty(); // true
```

## The Power of `where`

One of the most important methods that you might need to use most of the time is `where`. It will return a new collection with all the elements that match the given criteria.

### Identical match

To filter data that based on the given value, you can use the `where` method by passing the first argument as the searching key and second argument will receive the matching value.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.where("name", "John"); // [{ id: 1, name: "John" }, { id: 2, name: "John" }]
```

### Where Operators

You can also use operators to filter the data, the operators are:

```ts
Operators = [
  "=",
  "equals",
  "!=",
  "not",
  "not equals",
  ">",
  "gt",
  "<",
  "lt",
  ">=",
  "gte",
  "<=",
  "lte",
  "regex",
  "like",
  "%",
  "not like",
  "!%",
  "in",
  "!in",
  "not in",
  "between",
  "<>",
  "!between",
  "not between",
  "!<>",
  "is",
  "typeof",
  "is not",
  "!is",
  "not typeof",
  "is a",
  "instanceof",
  "is not a",
  "not instanceof",
  "!instanceof",
  "!is a",
  "exists",
  "not exists",
  "!exists",
  "contains",
  "not contains",
  "!contains",
  "starts with",
  "not starts with",
  "!starts with",
  "ends with",
  "not ends with",
  "!ends with",
  "null",
  "is null",
  "is not null",
  "!null",
  "!not null",
  "empty",
  "is empty",
  "is not empty",
  "!empty",
  "true",
  "is true",
  "is not true",
  "!true",
  "false",
  "is false",
  "!false",
  "undefined",
  "is undefined",
  "is not false",
  "is undefined",
  "is not undefined",
  "!undefined",
];
```

Let's group them by their usage.

- `=` and `equals` will match the value with the given value.
- `!=` and `not` and `not equals` will match the value **that is not equal** to the given value.
- `>` and `gt` will match the value **that is greater than** the given value.
- `<` and `lt` will match the value **that is less than** the given value.
- `>=` and `gte` will match the value **that is greater than or equal** to the given value.
- `<=` and `lte` will match the value **that is less than or equal** to the given value.
- `regex` will match the value **that matches the given regex**.
- `like` and `%` will match the value **that contains** the given value.
- `not like` and `!%` will match the value **that does not contain** the given value.
- `in` will match the value **that is in the given array**.
- `!in` and `not in` will match the value **that is not in the given array**.
- `between` and `<>` will match the value **that is between the given values**.
- `!between` and `not between` and `!<>` will match the value **that is not between the given values**.
- `is` and `typeof` will match the value **that is of the given type**.
- `is not` and `!is` and `not typeof` will match the value **that is not of the given type**.
- `is a` and `instanceof` will match the value **that is an instance of the given class**.
- `is not a` and `not instanceof` and `!instanceof` and `!is a` will match the value **that is not an instance of the given class**.
- `exists` will match the value **that exists**.
- `not exists` and `!exists` will match the value **that does not exist**.
- `contains` will match the value **that contains the given value**.
- `not contains` and `!contains` will match the value **that does not contain the given value**.
- `starts with` will match the value **that starts with the given value**.
- `not starts with` and `!starts with` will match the value **that does not start with the given value**.
- `ends with` will match the value **that ends with the given value**.
- `not ends with` and `!ends with` will match the value **that does not end with the given value**.
- `null` and `is null` will match the value **that is null**.
- `is not null` and `!null` and `!not null` will match the value **that is not null**.
- `empty` and `is empty` will match the value **that is empty**.
- `is not empty` and `!empty` will match the value **that is not empty**.
- `true` and `is true` will match the value **that is true**.
- `is not true` and `!true` will match the value **that is not true**.
- `false` and `is false` will match the value **that is false**.
- `is not false` and `!false` will match the value **that is not false**.
- `undefined` and `is undefined` will match the value **that is undefined**.
- `is not undefined` and `!undefined` will match the value **that is not undefined**.

Let's see example of each one of them

#### `=` and `equals`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.where("name", "=", "John"); // [{ id: 1, name: "John" }, { id: 2, name: "John" }]
```

#### `!=` and `not` and `not equals`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.where("name", "!=", "John"); // [{ id: 3, name: "Jane" }]
```

It is also possible to use the `not` operator

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.where("name", "not", "John"); // [{ id: 3, name: "Jane" }]
```

#### `>` and `gt`

```ts
const users = collect([
  { id: 1, age: 20 },
  { id: 2, age: 30 },
  { id: 3, age: 40 },
]);

users.where("age", ">", 30); // [{ id: 3, age: 40 }]
```

It can also be used with dates

```ts
const users = collect([
  { id: 1, created_at: new Date("2020-01-01") },
  { id: 2, created_at: new Date("2020-02-01") },
  { id: 3, created_at: new Date("2020-03-01") },
]);

users.where("created_at", ">", new Date("2020-01-15")); // [{ id: 2, created_at: new Date("2020-02-01") }, { id: 3, created_at: new Date("2020-03-01") }]
```

#### `<` and `lt`

```ts
const users = collect([
  { id: 1, age: 20 },
  { id: 2, age: 30 },
  { id: 3, age: 40 },
]);

users.where("age", "<", 30); // [{ id: 1, age: 20 }]
```

#### `>=` and `gte`

```ts
const users = collect([
  { id: 1, age: 20 },
  { id: 2, age: 30 },
  { id: 3, age: 40 },
]);

users.where("age", ">=", 30); // [{ id: 2, age: 30 }, { id: 3, age: 40 }]
```

It can also compare dates

```ts
const users = collect([
  { id: 1, created_at: new Date("2020-01-01") },
  { id: 2, created_at: new Date("2020-02-01") },
  { id: 3, created_at: new Date("2020-03-01") },
]);

users.where("created_at", ">=", new Date("2020-02-01")); // [{ id: 2, created_at: new Date("2020-02-01") }, { id: 3, created_at: new Date("2020-03-01") }]
```

#### `<=` and `lte`

```ts
const users = collect([
  { id: 1, age: 20 },
  { id: 2, age: 30 },
  { id: 3, age: 40 },
]);

users.where("age", "<=", 30); // [{ id: 1, age: 20 }, { id: 2, age: 30 }]
```

It can also compare to date

```ts
const users = collect([
  { id: 1, created_at: new Date("2020-01-01") },
  { id: 2, created_at: new Date("2020-02-01") },
  { id: 3, created_at: new Date("2020-03-01") },
]);

users.where("created_at", "<=", new Date("2020-02-01")); // [{ id: 1, created_at: new Date("2020-01-01") }, { id: 2, created_at: new Date("2020-02-01") }]
```

#### `regex`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jill" },
]);

users.where("name", "regex", /^J/); // [{ id: 1, name: "John" }, { id: 2, name: "Jane" }, { id: 3, name: "Jill" }]
```

You can also pass directly the regular expression as second argument without specifying the operator.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jill" },
]);

users.where("name", /^J/); // [{ id: 1, name: "John" }, { id: 2, name: "Jane" }, { id: 3, name: "Jill" }]
```

#### `like` and `%`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.where("name", "like", "Jo"); // [{ id: 1, name: "John" }, { id: 2, name: "Jone" }]
```

### `not like` and `!like` and `!%`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.where("name", "not like", "Jo"); // [{ id: 3, name: "Jill" }]
```

#### `is` and `typeof`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.where("name", "is", "string"); // [{ id: 1, name: "John" }, { id: 2, name: "Jone" }, { id: 3, name: "Jill" }]
```

#### `not is` and `!is` and `!typeof`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.where("name", "not is", "string"); // []
```

#### `starts with`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.where("name", "starts with", "Jo"); // [{ id: 1, name: "John" }, { id: 2, name: "Jone" }]
```

#### `ends with`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.where("name", "ends with", "ne"); // [{ id: 2, name: "Jone" }]
```

#### `in`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.where("name", "in", ["John", "Jill"]); // [{ id: 1, name: "John" }, { id: 3, name: "Jill" }]
```

#### `not in` and `!in`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.where("name", "not in", ["John", "Jill"]); // [{ id: 2, name: "Jone" }]
```

#### `between` and `<>`

```ts
const users = collect([
  { id: 1, age: 20 },
  { id: 2, age: 30 },
  { id: 3, age: 40 },
]);

users.where("age", "between", [25, 35]); // [{ id: 2, age: 30 }]
```

It can also compare to dates as well.

```ts
const users = collect([
  { id: 1, created_at: new Date("2020-01-01") },
  { id: 2, created_at: new Date("2020-02-01") },
  { id: 3, created_at: new Date("2020-03-01") },
]);

users.where("created_at", "<>", [
  new Date("2020-01-15"),
  new Date("2020-02-15"),
]); // [{ id: 2, created_at: new Date("2020-02-01") }]
users.where("created_at", "between", [
  new Date("2020-01-15"),
  new Date("2020-02-15"),
]); // [{ id: 2, created_at: new Date("2020-02-01") }]
```

#### `not between` and `!<>` and `!between`

```ts
const users = collect([
  { id: 1, age: 20 },
  { id: 2, age: 30 },
  { id: 3, age: 40 },
]);

users.where("age", "!<>", [25, 35]); // [{ id: 1, age: 20 }, { id: 3, age: 40 }]
users.where("age", "not between", [25, 35]); // [{ id: 1, age: 20 }, { id: 3, age: 40 }]
```

It can also compare to dates as well.

```ts
const users = collect([
  { id: 1, created_at: new Date("2020-01-01") },
  { id: 2, created_at: new Date("2020-02-01") },
  { id: 3, created_at: new Date("2020-03-01") },
]);

users.where("created_at", "not between", [
  new Date("2020-01-15"),
  new Date("2020-02-15"),
]); // [{ id: 1, created_at: new Date("2020-01-01") }, { id: 3, created_at: new Date("2020-03-01") }]
```

#### `null`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: null },
  { id: 3, name: "Jill" },
]);

users.where("name", "null"); // [{ id: 2, name: null }]
```

#### `not null` and `!null`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: null },
  { id: 3, name: "Jill" },
]);

users.where("name", "not null"); // [{ id: 1, name: "John" }, { id: 3, name: "Jill" }]
```

#### `empty`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "" },
  { id: 3, name: "Jill" },
]);

users.where("name", "empty"); // [{ id: 2, name: "" }]
```

> Please note that the `empty` operator uses [Is.empty](https://github.com/hassanzohdy/supportive-is) under the hood to determine if the value is empty or not.

#### `not empty` and `!empty`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "" },
  { id: 3, name: "Jill" },
]);

users.where("name", "not empty"); // [{ id: 1, name: "John" }, { id: 3, name: "Jill" }]
```

> Please note that the `not empty` operator uses [Is.empty](https://github.com/hassanzohdy/supportive-is) under the hood to determine if the value is empty or not.

### undefined

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: undefined },
  { id: 3, name: "Jill" },
]);

users.where("name", "undefined"); // [{ id: 2, name: undefined }]
```

#### `not undefined` and `!undefined`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: undefined },
  { id: 3, name: "Jill" },
]);

users.where("name", "not undefined"); // [{ id: 1, name: "John" }, { id: 3, name: "Jill" }]
```

### `is a` and `instance of`

```ts
class Member {
  id = 1;
  name: "John";
}

const users = collect([
  new Member(),
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.where("name", "is a", Member); // [new Member()]
```

### `not is a` and `!is a` and `!instance of`

```ts
class Member {
  id = 1;
  name: "John";
}

const users = collect([
  new Member(),
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.where("name", "not is a", Member); // [{ id: 2, name: "Jone" }, { id: 3, name: "Jill" }]
```

### `exists`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
  { id: 4, age: 31 },
]);

users.where("name", "exists"); // [{ id: 1, name: "John" }, { id: 2, name: "Jone" }, { id: 3, name: "Jill" }]
```

### `not exists` and `!exists`

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
  { id: 4, age: 31 },
]);

users.where("name", "not exists"); // [{id: 4, age: 31}]
```

### whereIn

Alias to `where('column', 'in', values)`.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.whereIn("name", ["John", "Jill"]); // [{ id: 1, name: "John" }, { id: 3, name: "Jill" }]
```

### whereNotIn

Alias to `where('column', 'not in', values)`.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.whereNotIn("name", ["John", "Jill"]); // [{ id: 2, name: "Jone" }]
```

### whereNull

Alias to `where('column', 'null')`.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: null },
  { id: 3, name: "Jill" },
]);

users.whereNull("name"); // [{ id: 2, name: null }]
```

### whereNotNull

Alias to `where('column', 'not null')`.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: null },
  { id: 3, name: "Jill" },
]);

users.whereNotNull("name"); // [{ id: 1, name: "John" }, { id: 3, name: "Jill" }]
```

### whereEmpty

Alias to `where('column', 'empty')`.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "" },
  { id: 3, name: "Jill" },
]);

users.whereEmpty("name"); // [{ id: 2, name: "" }]
```

### whereNotEmpty

Alias to `where('column', 'not empty')`.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "" },
  { id: 3, name: "Jill" },
]);

users.whereNotEmpty("name"); // [{ id: 1, name: "John" }, { id: 3, name: "Jill" }]
```

`heavy` is an alias to `whereNotEmpty`.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "" },
  { id: 3, name: "Jill" },
]);

users.heavy("name"); // [{ id: 1, name: "John" }, { id: 3, name: "Jill" }]
```

### whereUndefined

Alias to `where('column', 'undefined')`.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: undefined },
  { id: 3, name: "Jill" },
]);

users.whereUndefined("name"); // [{ id: 2, name: undefined }]
```

### whereNotUndefined

Alias to `where('column', 'not undefined')`.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: undefined },
  { id: 3, name: "Jill" },
]);

users.whereNotUndefined("name"); // [{ id: 1, name: "John" }, { id: 3, name: "Jill" }]
```

### whereBetween

Alias to `where('column', 'between', [min, max])`.

```ts
const users = collect([
  { id: 1, age: 18 },
  { id: 2, age: 20 },
  { id: 3, age: 25 },
]);

users.whereBetween("age", [18, 25]); // [{ id: 1, age: 18 }, { id: 2, age: 20 }, { id: 3, age: 25 }]
```

### whereNotBetween

Alias to `where('column', 'not between', [min, max])`.

```ts
const users = collect([
  { id: 1, age: 18 },
  { id: 2, age: 20 },
  { id: 3, age: 25 },
]);

users.whereNotBetween("age", [18, 25]); // []
```

### whereNot

Alias to `where('column', 'not', value)`.

```ts
const users = collect([
  { id: 1, age: 18 },
  { id: 2, age: 20 },
  { id: 3, age: 25 },
]);

users.whereNot("age", 20); // [{ id: 1, age: 18 }, { id: 3, age: 25 }]
```

### whereExists

Alias to `where('column', 'exists')`.

```ts
const users = collect([{ id: 1, age: 18 }, { id: 2, age: 20 }, { id: 3 }]);

users.whereExists("age"); // [{ id: 1, age: 18 }, { id: 2, age: 20 }]
```

### whereNotExists

Alias to `where('column', 'not exists')`.

```ts
const users = collect([{ id: 1, age: 18 }, { id: 2, age: 20 }, { id: 3 }]);

users.whereNotExists("age"); // [{ id: 3}]
```

## Partition

> Since `v1.1.0`

The `partition` method will return two collections, the first one will contain the items that match the given criteria, and the second one will contain the items that do not match the given criteria.

```ts
const users = collect([
  { id: 1, age: 18 },
  { id: 2, age: 20 },
  { id: 3, age: 25 },
  { id: 4, age: 12 },
  { id: 5, age: 15 },
]);

const [adults, children] = users.partition(user => user.age >= 18);

console.log(adults.all()); // [{ id: 1, age: 18 }, { id: 2, age: 20 }, { id: 3, age: 25 }]
console.log(children.all()); // [{ id: 4, age: 12 }, { id: 5, age: 15 }]
```

Be aware that the `partition` method returns two new collections not `arrays`.

## Group By

The `groupBy` method groups the collection's items by a given key.

```ts
const users = collect([
  { name: "Ahmed", age: 20 },
  { name: "Mohamed", age: 25 },
  { name: "Ali", age: 30 },
  { name: "Hasan", age: 30 },
]);

users.groupBy("age");
// [
//     {
//     age: 20,
//     data: [{ name: "Ahmed", age: 20 }],
//     },
//     {
//     age: 25,
//     data: [{ name: "Mohamed", age: 25 }],
//     },
//     {
//     age: 30,
//     data: [
//         { name: "Ali", age: 30 },
//         { name: "Hasan", age: 30 },
//     ],
//     },
// ]
```

It basically creates a new array of objects, each object contains the key and the items that have the same value for that key will be added in `data` key for that grouped data.

### Group By Multiple Keys

You can also group the collection by multiple keys.

```ts

const studentsClasses = collect[
  {
    id: 1,
    class: "A",
    grade: 1,
  },
  {
    id: 2,
    class: "B",
    grade: 2,
  },
  {
    id: 3,
    class: "A",
    grade: 3,
  },
  {
    id: 4,
    class: "B",
    grade: 2,
  },
  {
    id: 5,
    class: "B",
    grade: 2,
  },
  {
    id: 6,
    class: "C",
    grade: 5,
  },
]);

studentsClasses.groupBy(["class", "grade"]);
// [
//     {
//     class: "A",
//     grade: 1,
//     items: [
//         {
//         id: 1,
//         class: "A",
//         grade: 1,
//         },
//     ],
//     },
//     {
//     class: "B",
//     grade: 2,
//     items: [
//         {
//         id: 2,
//         class: "B",
//         grade: 2,
//         },
//         {
//         id: 4,
//         class: "B",
//         grade: 2,
//         },
//         {
//         id: 5,
//         class: "B",
//         grade: 2,
//         },
//     ],
//     },
//     {
//     class: "A",
//     grade: 3,
//     items: [
//         {
//         id: 3,
//         class: "A",
//         grade: 3,
//         },
//     ],
//     },
//     {
//     class: "C",
//     grade: 5,
//     items: [
//         {
//         id: 6,
//         class: "C",
//         grade: 5,
//         },
//     ],
//     },
// ]
```

### Defining other key for grouped data

By default, the grouped data will be added in `data` key, but you can change that by passing the second argument to the `groupBy` method.

```ts
const users = collect([
  { name: "Ahmed", age: 20 },
  { name: "Mohamed", age: 25 },
  { name: "Ali", age: 30 },
  { name: "Hasan", age: 30 },
]);

users.groupBy("age", "students");

// [
//     {
//     age: 20,
//     students: [{ name: "Ahmed", age: 20 }],
//     },
//     {
//     age: 25,
//     students: [{ name: "Mohamed", age: 25 }],
//     },
//     {
//     age: 30,
//     students: [
//         { name: "Ali", age: 30 },
//         { name: "Hasan", age: 30 },
//     ],
//     },
// ]
```

## Sorting

Another powerful feature we have in this package is the ability to sort the collection's items.

### sortBy

The `sortBy` method sorts the collection's items by a given key.

```ts
const users = collect([
  { name: "Ahmed", age: 20 },
  { name: "Mohamed", age: 25 },
  { name: "Ali", age: 30 },
  { name: "Hasan", age: 30 },
]);

users.sortBy("age"); // [{ name: "Ahmed", age: 20 }, { name: "Mohamed", age: 25 }, { name: "Ali", age: 30 }, { name: "Hasan", age: 30 }]
```

### sortByDesc

The `sortByDesc` method sorts the collection's items by a given key in descending order.

```ts
const users = collect([
  { name: "Ahmed", age: 20 },
  { name: "Mohamed", age: 25 },
  { name: "Ali", age: 30 },
  { name: "Hasan", age: 30 },
]);

users.sortByDesc("age"); // [{ name: "Ali", age: 30 }, { name: "Hasan", age: 30 }, { name: "Mohamed", age: 25 }, { name: "Ahmed", age: 20 }]
```

### Sort By Multiple Keys

You can also sort the collection by multiple keys using `sortBy`.

```ts
const users = collect([
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Ali", age: 20 },
  { name: "Hasan", age: 20 },
  { name: "Hasan", age: 19 },
]);

users.sortBy({
  age: "asc",
  name: "asc",
}); // [{ name: "Hasan", age: 19 }, { name: "Ali", age: 20 }, { name: "Hasan", age: 20 }, { name: "Jane", age: 25 }, { name: "Jack", age: 30 }]
```

The method receives an object, the key will be the sorting key and its value is either `asc` or `desc` for ascending or descending order.

## Element Positions

### Swap

Using `swap` method will allow you swap between two indexes in the collection

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.swap(0, 4); // [5, 2, 3, 4, 1]
```

### Moving Elements

Using `move` method will allow you move an element from one index to another.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.move(0, 4); // [2, 3, 4, 5, 1]
```

### Shuffling

The `shuffle` method will randomly shuffle the items in the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.shuffle(); // something like [2, 5, 1, 4, 3]
```

### Reverse

The `reverse` method will reverse the order of the collection's items.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.reverse(); // [5, 4, 3, 2, 1]
```

> `flip` method is an alias to `reverse` method.

### Reordering

The `reorder` method will reorder the items in the collection using the given keys.

```ts
const numbers = collect([1, 2, 3, 4, 5, 6, 7]);

numbers.reorder({
  0: 3,
  1: 4,
  2: 5,
  3: 6,
  4: 0,
  5: 1,
  6: 2,
}); // [5, 6, 7, 1, 2, 3, 4]
```

It receives an object, the key is the old index, and its value is the new index.

## Push

The `push` method will add the given value to the end of the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.push(6); // [1, 2, 3, 4, 5, 6]
```

> `append` method is an alias for `push`.

## Push Unique

The `pushUnique` method will add the given value to the end of the collection if it doesn't exist.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.pushUnique(6, 2, 3, 4, 5); // [1, 2, 3, 4, 5, 6]
```

## Prepend

The `prepend` method will add the given value to the beginning of the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.prepend(0); // [0, 1, 2, 3, 4, 5]
```

> `unshift` method is an alias for `prepend`.

## Unshift Unique

The `unshiftUnique` method will add the given value to the beginning of the collection if it doesn't exist.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.unshiftUnique(0, 2, 3, 4, 5, 6, 7); // [7, 6, 0, 1, 2, 3, 4, 5]
```

> `prependUnique` method is an alias for `unshiftUnique`.

## Indexes

Get, Set, and Remove indexes from the collection.

### Get all indexes

Using `indexes` method will return a new collection of all indexes.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.indexes(); // [0, 1, 2, 3, 4]
```

### Getting Even Indexes

Using `evenIndexes` method will return a new collection of all even indexes.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.evenIndexes(); // [0, 2, 4]
```

### Getting Odd Indexes

Using `oddIndexes` method will return a new collection of all odd indexes.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.oddIndexes(); // [1, 3]
```

### Getting certain indexes

Using `onlyIndexes` method will return a new collection of the given indexes.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.onlyIndexes(0, 2, 4); // [1, 3, 5]
```

### Getting all indexes except the given

Using `exceptIndexes` method will return a new collection of all indexes except the given indexes.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.exceptIndexes(0, 2, 4); // [2, 4]
```

### Get Index

Using `index` method will return the index of the given value.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.index(3); // 2
```

> `at` method is an alias for `index`.

### Get last index

Using `lastIndex` method will return the last index of the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.lastIndex(); // 4
```

> If the collection is empty, it will return `-1`.

### Update By Index

Using `set` method will update the value of the given index.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.set(2, 6); // [1, 2, 6, 4, 5]
```

> `update` method is an alias for `set`.

### Remove By Index

Using `delete` method will remove the value of the given index.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.delete(2); // [1, 2, 4, 5]
```

We can also remove multiple indexes at once

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.delete(2, 3); // [1, 2, 5]
```

### Remove multiple indexes

The `unset` method will remove the given indexes from the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.unset(2, 3); // [1, 2, 5]
```

## Working With Objects

### Pluck

The `pluck` method will return a new collection of the given key.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
]);

users.pluck("name"); // ["John", "Jane"]
```

It also accepts an array of strings to return multiple keys.

```ts
const users = collect([
  { id: 1, name: "John", age: 20 },
  { id: 2, name: "Jane", age: 25 },
]);

users.pluck(["name", "age"]); // [{ name: "John", age: 20 }, { name: "Jane", age: 25 }]
```

Kindly note that if `pluck` accepts a single key, it will return array of values for that key, but if it receives an array of keys, it will return an array of objects.

### Select

The `select` method will allow you return only the given keys from each of elements in the collection.

> It works exactly like pluck but it always returns an array of objects.

```ts
const users = collect([
  { id: 1, name: "John", age: 20 },
  { id: 2, name: "Jane", age: 25 },
]);

users.select("name", "age"); // [{ name: 'John', age: 20 }, { name: 'Jane', age: 25 }]
```

## Working With Single Values

The following methods will return a single value instead of a collection.

### First

The `first` method will return the first element in the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.first(); // 1
```

> If the collection is empty, undefined will be returned.

### Last

The `last` method will return the last value from the collection without removing it.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.last(); // 5
```

> `end` method is an alias for `last`.

### First where

The `firstWhere` receives the same exact arguments as `where` but it returns the first item that matches the condition.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "Jill" },
]);

users.firstWhere("name", "John"); // { id: 1, name: "John" }
```

### Last where

The `lastWhere` receives the same exact arguments as `where` but it returns the last item that matches the condition.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "Jone" },
  { id: 3, name: "John" },
  { id: 4, name: "Jill" },
]);

users.lastWhere("name", "John"); // { id: 3, name: "John" }
```

> If the collection is empty, undefined will be returned.

### Pop

The `pop` method will `remove` and `return` the last value from the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.pop(); // 5
console.log(numbers); // [1, 2, 3, 4]
```

> Please note that this method is mutable as it returns the last value

### Value

The `value` method will return value of the given key from array of objects

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.value("name"); // John
```

If the given key does not exist, you can set default value to be returned instead

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.value("age", 20); // 20
```

### Last Value

The `lastValue` method will return the last value of the given key from array of objects.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.lastValue("name"); // Jane
```

If the given key does not exist, you can set default value to be returned instead

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.lastValue("age", 20); // 20
```

### Getting value by index

The `valueAt` method will return the value of the given index for the given key.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.valueAt(1, "name"); // John
```

### Getting value by index and key using dot notation

You can alternatively use dot notation to get the value of the given index and key using `get` method.

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.get("1.name"); // John
```

If the given key does not exist, you can set default value to be returned instead

```ts
const users = collect([
  { id: 1, name: "John" },
  { id: 2, name: "John" },
  { id: 3, name: "Jane" },
]);

users.valueAt(1, "age", 20); // 20
```

### Getting random value

The `random` method will return a random value from the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.random(); // 3
```

You can also specify how many random values you want to be returned.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.random(2); // [3, 5]
```

## Working With Math

Collection provides you with a set of methods to work with numbers which will make it easier to manipulate.

### sum

The `sum` method returns the sum of all items in the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.sum(); // 15
```

We can also sum value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.sum("age"); // 75
```

### average

The `average` method returns the average of all items in the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.average(); // 3
```

We can also average value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.average("age"); // 25
```

> `avg` is an alias of `average`, you can use it as well.

### min

The `min` method returns the minimum value of all items in the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.min(); // 1
```

We can also get the minimum value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.min("age"); // 20
```

### max

The `max` method returns the maximum value of all items in the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.max(); // 5
```

We can also get the maximum value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.max("age"); // 30
```

### median

The `median` method returns the median value of all items in the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.median(); // 3
```

We can also get the median value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.median("age"); // 25
```

### Plus

The `plus` method increase the given value to each element of the array.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.plus(2); // [3, 4, 5, 6, 7]
```

We can also increase the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.plus("age", 2); // [{ name: 'John', age: 22 }, { name: 'Jane', age: 27 }, { name: 'Jack', age: 32 }]
```

### increment

The `increment` method works exactly like `plus` except that increases each element by only `1`.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.increment(); // [2, 3, 4, 5, 6]
```

We can also increase the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.increment("age"); // [{ name: 'John', age: 21 }, { name: 'Jane', age: 26 }, { name: 'Jack', age: 31 }]
```

### Minus

The `minus` method decrease the given value to each element of the array.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.minus(2); // [-1, 0, 1, 2, 3]
```

We can also decrease the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.minus("age", 2); // [{ name: 'John', age: 18 }, { name: 'Jane', age: 23 }, { name: 'Jack', age: 28 }]
```

### Decrement

The `decrement` method works exactly like `minus` except that decreases each element by only `1`.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.decrement(); // [0, 1, 2, 3, 4]
```

We can also decrease the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.decrement("age"); // [{ name: 'John', age: 19 }, { name: 'Jane', age: 24 }, { name: 'Jack', age: 29 }]
```

### Multiply

The `multiply` method multiply the given value to each element of the array.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.multiply(2); // [2, 4, 6, 8, 10]
```

We can also multiply the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.multiply("age", 2); // [{ name: 'John', age: 40 }, { name: 'Jane', age: 50 }, { name: 'Jack', age: 60 }]
```

You can also double numbers directly by using `double` method.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.double(); // [2, 4, 6, 8, 10]
```

Double key values

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.double("age"); // [{ name: 'John', age: 40 }, { name: 'Jane', age: 50 }, { name: 'Jack', age: 60 }]
```

### Divide

The `divide` method divide the given value to each element of the array.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.divide(2); // [0.5, 1, 1.5, 2, 2.5]
```

We can also divide the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.divide("age", 2); // [{ name: 'John', age: 10 }, { name: 'Jane', age: 12.5 }, { name: 'Jack', age: 15 }]
```

If the given number is `0` it will throw an error so you might need to wrap it in try/catch block.

```ts
try {
  users.divide("age", 0);
} catch (error) {
  console.log(error.message); // Cannot divide by zero
}
```

### Modulus

The `modulus` method returns the remainder of the division of each element of the array by the given value.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.modulus(2); // [1, 0, 1, 0, 1]
```

We can also get the remainder of the division of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.modulus("age", 2); // [{ name: 'John', age: 0 }, { name: 'Jane', age: 1 }, { name: 'Jack', age: 0 }]
```

If the given number is `0` it will throw an error so you might need to wrap it in try/catch block.

```ts
try {
  users.modulus("age", 0);
} catch (error) {
  console.log(error.message); // Cannot have a modulus of zero
}
```

### Even Numbers

The `even` method returns all the even numbers in the array.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.even(); // [2, 4]
```

We can also get the even numbers of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.even("age"); // [{ name: 'John', age: 20 }, { name: 'Jack', age: 30 }]
```

### Odd Numbers

The `odd` method returns all the odd numbers in the array.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.odd(); // [1, 3, 5]
```

We can also get the odd numbers of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.odd("age"); // [{ name: 'Jane', age: 25 }]
```

### Working With Strings

The Collection provides some utilities to work with strings.

### Concat String

The `concatString` method concatenates the given string to each element of the array.

```ts
const names = collect(["John", "Jane", "Jack"]);

names.concatString(" Doe"); // ['John Doe', 'Jane Doe', 'Jack Doe']
```

### Append String

The `appendString` method appends the given string to each element of the array.

```ts
const names = collect(["John", "Jane", "Jack"]);

names.appendString(" Doe"); // ['John Doe', 'Jane Doe', 'Jack Doe']
```

We can also append the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.appendString("name", " Doe"); // [{ name: 'John Doe', age: 20 }, { name: 'Jane Doe', age: 25 }, { name: 'Jack Doe', age: 30 }]
```

> Note: The `appendString` method is an alias of `concatString`.

### Prepend String

The `prependString` method prepends the given string to each element of the array.

```ts
const names = collect(["John", "Jane", "Jack"]);

names.prependString("Mr. "); // ['Mr. John', 'Mr. Jane', 'Mr. Jack']
```

We can also prepend the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.prependString("name", "Mr. "); // [{ name: 'Mr. John', age: 20 }, { name: 'Mr. Jane', age: 25 }, { name: 'Mr. Jack', age: 30 }]
```

### Replace String

The `replaceString` method replaces the given string with the given replacement string in each element of the array.

```ts
const names = collect(["John", "Jane", "Jack"]);

names.replaceString("John", "Johnny"); // ['Johnny', 'Jane', 'Jack']
```

We can also replace the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.replaceString("John", "Johnny", "name"); // [{ name: 'Johnny', age: 20 }, { name: 'Jane', age: 25 }, { name: 'Jack', age: 30 }]
```

We can also pass regular expression for replacement as first argument.

```ts
const names = collect(["John", "Jane", "Jack"]);

names.replaceString(/John/, "Johnny"); // ['Johnny', 'Jane', 'Jack']
```

### Replace All String

The `replaceAllString` method replaces all the given string with the given replacement string in each element of the array.

```ts
const names = collect(["John", "Jane", "Jack"]);

names.replaceAllString("J", "L"); // ['Lohn', 'Lane', 'Lack']
```

We can also replace all the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.replaceAllString("J", "L", "name"); // [{ name: 'Lohn', age: 20 }, { name: 'Lane', age: 25 }, { name: 'Lack', age: 30 }]
```

> Kindly note that `replaceAllString` method does not accept regular expression, use `replaceString` instead.

### Remove String

The `removeString` method removes the given string from each element of the array.

```ts
const names = collect(["John", "Jane", "Jack"]);

names.removeString("John"); // ['', 'Jane', 'Jack']
```

We can also remove the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.removeString("John", "name"); // [{ name: '', age: 20 }, { name: 'Jane', age: 25 }, { name: 'Jack', age: 30 }]
```

We can also pass regular expression for removal as first argument.

```ts
const names = collect(["John", "Jane", "Jack"]);

names.removeString(/John/); // ['', 'Jane', 'Jack']
```

### Remove All String

The `removeAllString` method removes all the given string from each element of the array.

```ts
const names = collect(["John", "Jane", "Jack"]);

names.removeAllString("J"); // ['ohn', 'ane', 'ack']
```

We can also remove all the value of key if the array is an array of objects.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.removeAllString("J", "name"); // [{ name: 'ohn', age: 20 }, { name: 'ane', age: 25 }, { name: 'ack', age: 30 }]
```

> Kindly note that `removeAllString` method does not accept regular expression, use `removeString` instead.

## Equals

The `equals` method determines if the given array is equal to the current array.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.equals([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]); // true
```

It also can check against another collection not just arrays.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.equals(
  collect([
    { name: "John", age: 20 },
    { name: "Jane", age: 25 },
    { name: "Jack", age: 30 },
  ]),
); // true
```

> Kindly note that the order of the elements in the array is neglected, it will check if it contains the exact content but not exact order either on the array elements order of the object keys order.

## Tapping And Callbacks

### Tap

We can perform some actions on the array without modifying the original array using the `tap` method.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.tap(collection => {
  collection.push({ name: "Jill", age: 35 });
});
```

### Callbacks Over Elements

The `forEach` method iterates over the array and passes each value to the given callback.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.forEach(user => {
  console.log(user);
});
```

The `each` method is an alias of `forEach` method.

## Filtering

The following methods will filter the array based on the given conditions.

### Except

The `except` method will return all elements that does not match the given criteria.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.except(user => user.age > 25); // [{ name: 'John', age: 20 }, { name: 'Jane', age: 25 }]
```

> `reject` is an alias of `except` method.

### Except first

The `exceptFirst` method will return all elements except the first element that matches the given criteria.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 25 },
]);

users.exceptFirst(user => user.age === 25); // [{ name: 'John', age: 20 }, { name: 'Jack', age: 25 }]
```

> `rejectFirst` is an alias of `exceptFirst` method.

### Except last

The `exceptLast` method will return all elements except the last element that matches the given criteria.

```ts
const users = collect([
  { name: "John", age: 25 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
]);

users.exceptLast(user => user.age === 25); // [{ name: 'John', age: 25 }, { name: 'Jack', age: 30 }]
```

> `rejectLast` is an alias of `exceptLast` method.

### Not

The `not` method will return all elements that does not match the given value.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.not(2); // [1, 3, 4, 5]
```

## Limitations and Skipped Methods

The following methods will allow you skip and limit your collection easily

### Skip

The `skip` method skips the given number of items in the array.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill", age: 35 },
]);

users.skip(2); // [{ name: 'Jack', age: 30 }, { name: 'Jill', age: 35 }]
```

### Skip Until

The `skipUntil` method skips items in the array until the given value is found.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill", age: 35 },
]);

users.skipUntil(user => user.age >= 30); // [{ name: 'Jack', age: 30 }, { name: 'Jill', age: 35 }]
```

### Skip Last

The `skipLast` method skips the given number of items from the end of the array.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill", age: 35 },
]);

users.skipLast(2); // [{ name: 'John', age: 20 }, { name: 'Jane', age: 25 }]
```

### Skip Last Until

The `skipLastUntil` method skips items from the end of the array until the given value is found.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill", age: 35 },
]);

users.skipLastUntil(user => user.age <= 30); // [{ name: 'John', age: 20 }, { name: 'Jane', age: 25 }]
```

### Skip While

The `skipWhile` method skips items in the array while the given value is true.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill", age: 35 },
]);

users.skipWhile(user => user.age < 30); // [{ name: 'Jack', age: 30 }, { name: 'Jill', age: 35 }]
```

### Skip To

The `skipTo` method skips items in the array and returns all elements starting from the given index.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill", age: 35 },
]);

users.skipTo(2); // [{ name: 'Jack', age: 30 }, { name: 'Jill', age: 35 }]
```

### Take

The `take` method limits the number of items in the array.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill", age: 35 },
]);

users.take(2); // [{ name: 'John', age: 20 }, { name: 'Jane', age: 25 }]
```

> `limit` is an alias of `take` method.

### Take Until

The `takeUntil` method limits items in the array until the given value is found.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill", age: 35 },
]);

users.takeUntil(user => user.age >= 30); // [{ name: 'John', age: 20 }, { name: 'Jane', age: 25 }]
```

### Take Last

The `takeLast` method limits the given number of items from the end of the array.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill", age: 35 },
]);

users.takeLast(2); // [{ name: 'Jack', age: 30 }, { name: 'Jill', age: 35 }]
```

### Take While

The `takeWhile` method limits items in the array while the given value is true.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill", age: 35 },
]);

users.takeWhile(user => user.age < 30); // [{ name: 'John', age: 20 }, { name: 'Jane', age: 25 }]
```

## Replacing Values

The following methods will allow you to replace values in the collection.

### Replace All

The `replaceAll` method replaces all occurrences of the given value in the array with the given replacement.

```ts
const numbers = collect([1, 2, 3, 4, 5, 2]);

numbers.replaceAll(2, 10); // [1, 10, 3, 4, 5, 10]
```

### Replace

The `replace` method replaces the first occurrence of the given value in the array with the given replacement.

```ts
const numbers = collect([1, 2, 3, 4, 5, 2]);

numbers.replace(2, 10); // [1, 10, 3, 4, 5, 2]
```

## Chunk

The `chunk` method breaks the collection into multiple, smaller collections of a given size.

```ts
const numbers = collect([1, 2, 3, 4, 5, 6, 7]);

numbers.chunk(4); // [[1, 2, 3, 4], [5, 6, 7]]
```

The generated chunks will be returned as a new collection instance, if you want to return it as a normal array, pass the second argument to false.

```ts
const numbers = collect([1, 2, 3, 4, 5, 6, 7]);

numbers.chunk(4, false); // [[1, 2, 3, 4], [5, 6, 7]]
```

## Counting

### Getting collection length

The `length` property will return the number of items in the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.length; // 5
```

### Counting values

The `countValue` method will return the number of occurrences for the given value.

```ts
const numbers = collect([1, 2, 3, 4, 5, 2]);

numbers.countValue(2); // 2
```

### Counting Value for key

The `count` method will return the number of occurrences for the given key and value.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill" },
]);

users.count("age"); // 3
```

### Counting each value for the given key

The `countBy` method will return the number of occurrences for each value of the given key.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
  { name: "Jack", age: 30 },
  { name: "Jill" },
]);

users.countBy("age"); // { 20: 1, 25: 1, 30: 1 }
```

## Iterating

Collections are `iterable`, so you can loop over it using `for...of` loop.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

for (const number of numbers) {
  console.log(number);
}
```

## Getting array values

To convert the collection into an array, you can use the `all` method.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.all(); // [1, 2, 3, 4, 5]
```

> `toArray` is an alias of `all` method.

## Clone

The `clone` method will return a new collection instance with the same items.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

const cloned = numbers.clone();

cloned.all(); // [1, 2, 3, 4, 5]
```

> `copy` is an alias of `clone` method.

## Includes

The `includes` method will return true if the given value is in the collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.includes(3); // true
```

> `contains` is an alias of `includes` method.

## Has

The `has` method will return true if the given callback is true.

```ts
const users = collect([
  { name: "John", age: 20 },
  { name: "Jane", age: 25 },
]);

users.has(user => user.age > 20); // true
```

## Merge

The `merge` method will merge the given array or collection with the original collection.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

const merged = numbers.merge([6, 7, 8, 9, 10]); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

It can also merge another collection

```ts
const numbers = collect([1, 2, 3, 4, 5]);

const merged = numbers.merge(collect([6, 7, 8, 9, 10])); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

> `concat` is an alias of `merge` method.

## Join

The `join` method will join all items from the collection using a string. The glue string is optional and defaults to an empty string.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.join(); // '12345'

numbers.join(", "); // '1, 2, 3, 4, 5'
```

> `implode` is an alias of `join` method.

## Convert to json string

The `toJson` method will convert the collection into a JSON string.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.toJson(); // '[1,2,3,4,5]'
```

## toString

The `toString` method will convert the collection into a string.

```ts
const numbers = collect([1, 2, 3, 4, 5]);

numbers.toString(); // '1,2,3,4,5'
```

## Collecting all data from certain key

The `collectFrom` method will allow you to collect items from a given key of each element.

```ts
const users = collect([
  { name: "John", age: 20, pets: ["dog", "cat"] },
  { name: "Jane", age: 25, pets: ["dog", "cat"] },
  { name: "Jack", age: 30, pets: ["dog", "cat"] },
  { name: "Jill", age: 35, pets: ["dog", "cat"] },
]);

users.collectFrom("pets"); // ['dog', 'cat', 'dog', 'cat', 'dog', 'cat', 'dog', 'cat']
```

## Collecting from certain key only

The `collectFromKey` method allow you to create a new collection from the given key directly, the key supports dot notation, starting with the index.

```ts
const users = collect([
  { name: "John", age: 20, pets: ["dog", "cat"] },
  { name: "Jane", age: 25, pets: ["dog", "cat"] },
  { name: "Jack", age: 30, pets: ["dog", "cat"] },
  { name: "Jill", age: 35, pets: ["dog", "cat"] },
]);

users.collectFromKey("0.pets"); // ['dog', 'cat']
```

## Collecting from iterators

The `collect` function can be used to convert an iterable into a collection using `collect.fromIterator` method.

```ts
const numbers = collect.fromIterator([1, 2, 3, 4, 5].values());
```

## Create empty collection

The `collect` function can also be used to create an empty collection using `collect.create(length: number, initialValue: any)` method.

```ts
const numbers = collect.create(10); // [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
```

You can also specify the initial value.

```ts
const numbers = collect.create(10, 0); // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

Also specify initial value based on index.

```ts
const numbers = collect.create(10, index => index); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```
