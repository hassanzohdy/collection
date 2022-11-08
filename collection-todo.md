# Collection To Do

## Working With Dates

The Collection provides some utilities to work with dates.

### Date Format

To work with date formatters, we need first to set the date formatter.

```ts
const users = collect([
    { name: 'John', created_at: '2020-01-01' },
    { name: 'Jane', created_at: '2020-01-02' },
    { name: 'Jack', created_at: '2020-01-03' },
]);

users.setDateFormatter();


The `dateFormat` method formats the date in each element of the array.

```ts
const dates = collect(['2020-01-01', '2020-01-02', '2020-01-03']);

dates.dateFormat('DD-MM-YYYY'); // ['01-01-2020', '02-01-2020', '03-01-2020']
```

We can also format the value of key if the array is an array of objects.

```ts
const users = collect([
    { name: 'John', birthday: '2020-01-01' },
    { name: 'Jane', birthday: '2020-01-02' },
    { name: 'Jack', birthday: '2020-01-03' },
]);

users.dateFormat('birthday', 'DD-MM-YYYY'); // [{ name: 'John', birthday: '01-01-2020' }, { name: 'Jane', birthday: '02-01-2020' }, { name: 'Jack', birthday: '03-01-2020' }]
```

> Kindly note that the value of the date must be a valid date that the date formatter accepts.

## Where

Adding feature to filter collection by passing an object of key and value.

```ts
const users = collect([
    { name: 'John', age: 20 },
    { name: 'Jane', age: 21 },
    { name: 'Joker', age: 20 },
    { name: 'Jack', age: 22 },
]);

users.where({ age: 20 }); // [{ name: 'John', age: 20 }, { name: 'Joker', age: 20 }]
```
