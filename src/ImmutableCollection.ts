import {
  areEqual,
  average,
  chunk,
  count,
  countBy,
  even,
  evenIndexes,
  get,
  groupBy,
  max,
  median,
  min,
  odd,
  oddIndexes,
  only,
  pluck,
  pushUnique,
  set,
  shuffle,
  sum,
  unique,
  unshiftUnique,
} from "@mongez/reinforcements";
import Is from "@mongez/supportive-is";
import { ComparisonOperator, Operators } from "./types";

const NotExists = Symbol("NotExists");

export class ImmutableCollection<ItemType = any> {
  /**
   * Items list
   */
  public items: ItemType[] = [];

  /**
   * Constructor
   */
  public constructor(items: ItemType[] | ImmutableCollection = []) {
    if (items instanceof ImmutableCollection) {
      this.items = [...(items as any).toArray()];
    } else if (Array.isArray(items)) {
      this.items = [...items];
    } else {
      throw new Error(
        "Invalid items type, it should be an array or an instance of ImmutableCollection",
      );
    }
  }

  /**
   * Create collection from iterator
   */
  public static fromIterator<ItemType = any>(iterator: Iterable<any>) {
    return new ImmutableCollection<ItemType>([...iterator]);
  }

  /**
   * Create an empty collection with the given length
   */
  public static create<ItemType = any>(length: number, initialValue?: any) {
    return new ImmutableCollection<ItemType>(
      Array.from({ length }, (_, index) => {
        if (typeof initialValue === "function") {
          return initialValue(index);
        }

        return initialValue;
      }),
    );
  }

  /**
   * Array length
   */
  public get length(): number {
    return this.items.length;
  }

  /**
   * Get items indexes
   */
  public indexes() {
    return new ImmutableCollection(Object.keys(this.items).map(Number));
  }

  /**
   * Get items in the given indexes
   */
  public onlyIndexes(...indexes: number[]) {
    return new ImmutableCollection(indexes.map(index => this.items[index]));
  }

  /**
   * Get items that are not in the given indexes
   */
  public exceptIndexes(...indexes: number[]) {
    return new ImmutableCollection(
      this.items.filter((_, index) => !indexes.includes(index)),
    );
  }

  /**
   * Get items keys (indexes) as collection of string
   */
  public keys() {
    return ImmutableCollection.fromIterator(this.items.keys());
  }

  /**
   * Get items values
   */
  public values() {
    return ImmutableCollection.fromIterator<ItemType>(this.items.values());
  }

  /**
   * Get items entries
   */
  public entries() {
    return ImmutableCollection.fromIterator<ItemType>(this.items.entries());
  }

  /**
   * Get min value of current items or the given key
   */
  public min(key?: string): number {
    return min(this.items, key);
  }

  /**
   * Get max value of current items or the given key
   */
  public max(key?: string): number {
    return max(this.items, key);
  }

  /**
   * Sum the collection or the value of the given key
   */
  public sum(key?: string) {
    return sum(this.items, key);
  }

  /**
   * Get average value of current items or the given key
   */
  public average(key?: string): number {
    return average(this.items, key);
  }

  /**
   * @alias average
   */
  public avg(key?: string): number {
    return average(this.items, key);
  }

  /**
   * Get median value of current items or the given key
   */
  public median(key?: string): number {
    return median(this.items, key);
  }

  /**
   * Add the given amount to each element or given key in each element
   */
  public plus(amount: number);
  public plus(key: string, amount: number);
  public plus(...args: any[]) {
    let [key, amount] = args;
    if (args.length === 1) {
      amount = key;
      key = null;
    }

    return this.map(item => {
      if (key) {
        return set(item, key, get(item, key) + amount);
      }

      return item + amount;
    });
  }

  /**
   * Increment the given key in each element or the element by 1
   */
  public increment(key?: string) {
    return key ? this.plus(key, 1) : this.plus(1);
  }

  /**
   * Decrease the given amount to each element or given key in each element
   */
  public minus(amount: number);
  public minus(key: string, amount: number);
  public minus(...args: any[]) {
    let [key, amount] = args;
    if (args.length === 1) {
      amount = key;
      key = null;
    }

    return this.map(item => {
      if (key) {
        return set(item, key, get(item, key) - amount);
      }

      return item - amount;
    });
  }

  /**
   * Decrement the given key in each element or the element by 1
   */
  public decrement(key?: string) {
    return key ? this.minus(key, 1) : this.minus(1);
  }

  /**
   * Multiple the given amount to each element or given key in each element
   */
  public multiply(amount: number);
  public multiply(key: string, amount: number);
  public multiply(...args: any[]) {
    let [key, amount] = args;
    if (args.length === 1) {
      amount = key;
      key = null;
    }

    return this.map(item => {
      if (key) {
        return set(item, key, Number(get(item, key)) * amount);
      }

      return item * amount;
    });
  }

  /**
   * Double the given key in each element or the element by 2
   */
  public double(key?: string) {
    return key ? this.multiply(key, 2) : this.multiply(2);
  }

  /**
   * Divide the given amount to each element or given key in each element
   */
  public divide(amount: number);
  public divide(key: string, amount: number);
  public divide(...args: any[]) {
    let [key, amount] = args;

    if (args.length === 1) {
      amount = key;
      key = null;
    }

    if (amount === 0) {
      throw new Error("Cannot divide by zero");
    }

    return this.map(item => {
      if (key) {
        return set(item, key, get(item, key) / amount);
      }

      return item / amount;
    });
  }

  /**
   * Divide the given key in each element or the element by 2
   */
  public half(key?: string) {
    return key ? this.divide(key, 2) : this.divide(2);
  }

  /**
   * Get the modulus of the given amount to each element or given key in each element
   */
  public modulus(amount: number);
  public modulus(key: string, amount: number);
  public modulus(...args: any[]) {
    let [key, amount] = args;

    if (args.length === 1) {
      amount = key;
      key = null;
    }

    if (amount === 0) {
      throw new Error("Cannot have a modulus of zero");
    }

    return this.map(item => {
      if (key) {
        return set(item, key, get(item, key) % amount);
      }

      return item % amount;
    });
  }

  /**
   * Get every items in the array
   */
  public even(key?: string) {
    return new ImmutableCollection(even(this.items, key));
  }

  /**
   * Get odd items in the array
   */
  public odd(key?: string) {
    return new ImmutableCollection(odd(this.items, key));
  }
  /////////////////////////////
  // End Of Number methods
  /////////////////////////////

  /////////////////////////////
  // String methods
  /////////////////////////////
  /**
   * Append string to each element or given key in each element
   */
  public appendString(string: string, key?: string) {
    return this.map(item => {
      if (key) {
        return set(item, key, get(item, key) + string);
      }

      return item + string;
    });
  }

  /**
   * Prepend string to each element or given key in each element
   */
  public prependString(string: string, key?: string) {
    return this.map(item => {
      if (key) {
        return set(item, key, string + get(item, key));
      }

      return string + item;
    });
  }

  /**
   * Concat string to each element or given key in each element
   */
  public concatString(string: string, key?: string) {
    return this.map(item => {
      if (key) {
        return set(item, key, get(item, key).concat(string));
      }

      return item.concat(string);
    });
  }

  /**
   * Find matched string/regular expression and replace it with the given replacement
   */
  public replaceString(
    string: string | RegExp,
    replacement: string,
    key?: string,
  ) {
    return this.map(item => {
      if (key) {
        return set(item, key, get(item, key).replace(string, replacement));
      }

      return item.replace(string, replacement);
    });
  }

  /**
   * Find all matched given strings/regular expressions and replace it with the given replacement
   */
  public replaceAllString(string: string, replacement: string, key?: string) {
    return this.map(item => {
      if (key) {
        return set(
          item,
          key,
          get(item, key).replace(new RegExp(string, "g"), replacement),
        );
      }

      return item.replace(new RegExp(string, "g"), replacement);
    });
  }

  /**
   * Remove first matched string from each element or given key in each element
   */
  public removeString(string: string | RegExp, key?: string) {
    return this.map(item => {
      if (key) {
        return set(item, key, get(item, key).replace(string, ""));
      }

      return item.replace(string, "");
    });
  }

  /**
   * Remove all matched given strings expressions
   */
  public removeAllString(string: string, key?: string) {
    return this.map(item => {
      if (key) {
        return set(
          item,
          key,
          get(item, key).replace(new RegExp(string, "g"), ""),
        );
      }

      return item.replace(new RegExp(string, "g"), "");
    });
  }

  /////////////////////////////
  // End OF String methods
  /////////////////////////////
  /**
   * Merge the given arrays with current array and return new ImmutableCollection
   */
  public merge(...arrays: any[][]) {
    return new ImmutableCollection(this.items.concat(arrays.flat()));
  }

  /**
   * @alias merge
   */
  public concat(...arrays: any[][]) {
    return this.merge(...arrays);
  }

  /**
   * Reduce the array to a single value
   */
  public reduce(...args: Parameters<typeof Array.prototype.reduce>) {
    return this.items.reduce(...args);
  }

  /**
   * Reduce the array to a single value from the right (last to first)
   */
  public reduceRight(...args: Parameters<typeof Array.prototype.reduceRight>) {
    return this.items.reduceRight(...args);
  }

  /**
   * Flat the items
   */
  public flat(depth: number = 1) {
    return new ImmutableCollection(this.items.flat(depth));
  }

  /**
   * Flat Map the items
   */
  public flatMap(callback: Parameters<typeof Array.prototype.flatMap>[0]) {
    return new ImmutableCollection(this.items.flatMap(callback));
  }

  /**
   * Get items in even indexes
   */
  public evenIndexes() {
    return new ImmutableCollection(evenIndexes(this.items));
  }

  /**
   * Get items in odd indexes
   */
  public oddIndexes() {
    return new ImmutableCollection(oddIndexes(this.items));
  }

  /**
   * Get unique items in the array
   */
  public unique(key?: string) {
    return new ImmutableCollection(unique(this.items, key));
  }

  /**
   * Get only first unique items for the given key
   */
  public uniqueList(key: string) {
    const foundValues: any[] = [];

    return new ImmutableCollection(
      this.items.filter(item => {
        const value = get(item, key);

        if (foundValues.includes(value)) {
          return false;
        }

        foundValues.push(value);

        return true;
      }),
    );
  }

  /**
   * Remove and return the first item in the array
   */
  public shift() {
    return this.items.shift();
  }

  /**
   * Add the given items to the beginning of the array
   */
  public unshift(...items: any[]) {
    const currentItems = [...this.items];
    currentItems.unshift(...items);
    return new ImmutableCollection(currentItems);
  }

  /**
   * @alias unshift
   */
  public prepend(...items: any[]) {
    return this.unshift(...items);
  }

  /**
   * Prepend unique values to the array
   */
  public prependUnique(...items: any[]) {
    const currentItems = [...this.items];
    unshiftUnique(currentItems, ...items);
    return new ImmutableCollection(currentItems);
  }

  /**
   * @alias prependUnique
   */
  public unshiftUnique(...items: any[]) {
    return this.prependUnique(...items);
  }

  /**
   * Add the given items to the end of the array
   */
  public push(...items: any[]) {
    const currentItems = [...this.items];
    currentItems.push(...items);
    return new ImmutableCollection(currentItems);
  }

  /**
   * @alias push
   */
  public append(...items: any[]) {
    return this.push(...items);
  }

  /**
   * Add the given items to the end of the array only if they don't exist
   */
  public pushUnique(...items: any[]) {
    const currentItems = [...this.items];
    pushUnique(currentItems, ...items);
    return new ImmutableCollection(currentItems);
  }

  /**
   * Remove and return the last item in the array
   */
  public pop() {
    return this.items.pop();
  }

  /**
   * Get last item in the array
   */
  public last() {
    return this.items[this.items.length - 1] ?? undefined;
  }

  /**
   * @alias last
   */
  public end() {
    return this.last();
  }

  /**
   * Count how many items in the array based on the given key or callback
   */
  public count(
    key: string | Parameters<typeof Array.prototype.filter>[0],
  ): number {
    return count(this.items, key);
  }

  /**
   * Count total occurrence of the given value
   */
  public countValue(value: any) {
    // lets count it using a reducer
    return this.items.reduce((total, item) => {
      if (item === value) {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
  }

  /**
   * Count by the given key total occurrences of each value
   */
  public countBy(key: string) {
    return countBy(this.items, key);
  }

  /**
   * Remove the first item from the array
   */
  public remove(value: Parameters<typeof Array.prototype.indexOf>[0]) {
    return this.delete(this.items.findIndex(value));
  }

  /**
   * Get first item in the array
   */
  public first() {
    return this.items[0] ?? undefined;
  }

  /**
   * Get value using dot notation by the given key that starts with the index
   */
  public get(key: keyof ItemType) {
    return get(this.items, key as string);
  }

  /**
   * Get the first item's value for the given key
   */
  public value(key: keyof ItemType, defaultValue: any = null) {
    for (let item of this.items) {
      let itemValue = get(item, key as string, NotExists);
      if (itemValue !== NotExists) {
        return itemValue;
      }
    }

    return defaultValue;
  }

  /**
   * Get value for the given key at the given index
   */
  public valueAt(index: number, key: keyof ItemType, defaultValue: any = null) {
    return get(this.items, `${index}.${key as string}`, defaultValue);
  }

  /**
   * Get the last's item value for the given key
   */
  public lastValue(key: keyof ItemType, defaultValue: any = null) {
    return this.reverse().value(key, defaultValue);
  }

  /**
   * Determine if the given value exists in the array
   */
  public includes(value: any): boolean {
    return this.items.includes(value);
  }

  /**
   * @alias includes
   */
  public contains(value: any): boolean {
    return this.items.includes(value);
  }

  /**
   * Check if the array has the given callback
   */
  public has(
    callback: Parameters<typeof Array.prototype.findIndex>[0],
  ): boolean {
    return this.items.findIndex(callback) !== -1;
  }

  /**
   * Select only the given keys from each element of the array and return it
   */
  public select(...keys: string[]) {
    return this.map(item => only(item, keys));
  }

  /**
   * Update the given item based on the given index
   * This will return a new collection
   */
  public set(index: number, value: any) {
    const items = [...this.items];
    items[index] = value;
    return new ImmutableCollection(items);
  }

  /**
   * @alias set
   */
  public update(index: number, value: any) {
    return this.set(index, value);
  }

  /**
   * Get item by index
   */
  public index(index: number) {
    return this.items[index];
  }

  /**
   * @alias index
   */
  public at(index: number) {
    return this.items[index];
  }

  /**
   * Return the items list
   */
  public toArray(map?: Parameters<typeof Array.prototype.map>[0]) {
    return map ? this.items.map(map) : this.items;
  }

  /**
   * @alias toArray
   */
  public all() {
    return this.items;
  }

  /**
   * Convert the collection to a string
   */
  public toString() {
    return this.items.toString();
  }

  /**
   * Join the items in the array
   */
  public join(separator?: string) {
    return this.items.join(separator);
  }

  /**
   * @alias join
   */
  public implode(separator?: string) {
    return this.items.join(separator);
  }

  /**
   * Convert the collection to a JSON string
   */
  public toJson(): string {
    return JSON.stringify(this.items);
  }

  /**
   * Map over the collection and return a new collection
   */
  public map(callback: Parameters<typeof Array.prototype.map>[0]) {
    return new ImmutableCollection(this.items.map(callback));
  }

  /**
   * Filter the collection based on the given callback
   */
  public filter(callback: Parameters<typeof Array.prototype.filter>[0]) {
    return new ImmutableCollection(this.items.filter(callback));
  }

  /**
   * @alias filter
   */
  public takeWhile(callback: Parameters<typeof Array.prototype.filter>[0]) {
    return new ImmutableCollection(this.items.filter(callback));
  }

  /**
   * @alias filter
   */
  public removeAll(value: Parameters<typeof Array.prototype.filter>[0]) {
    return this.filter(value);
  }

  /**
   * Sort the collection based on the given callback
   */
  public sort(callback?: Parameters<typeof Array.prototype.sort>[0]) {
    return new ImmutableCollection(this.items.sort(callback));
  }

  /**
   * Sort order by the given key in ascending order
   * If the given key is an object, it will sort by multiple keys
   * the key will be the object's property and the value will be the order
   */
  public sortBy(key: string): ImmutableCollection;
  public sortBy(multipleKeys: {
    [key: string]: "asc" | "desc";
  }): ImmutableCollection;
  public sortBy(sortType: any) {
    if (typeof sortType === "string") {
      // sort items by the given key in asc order

      const items = [...this.items];

      items.sort((a: any, b: any) => {
        const aValue: any = get(a, sortType as string);
        const bValue: any = get(b, sortType as string);

        if (aValue < bValue) {
          return -1;
        }

        if (aValue > bValue) {
          return 1;
        }

        return 0;
      });

      return new ImmutableCollection(items);
    }

    if (typeof sortType === "object") {
      // sort items by multiple keys

      const items = [...this.items];

      items.sort((a: any, b: any) => {
        const keys = Object.keys(sortType);

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const aValue: any = get(a, key);
          const bValue: any = get(b, key);

          if (aValue < bValue) {
            return sortType[key] === "asc" ? -1 : 1;
          }

          if (aValue > bValue) {
            return sortType[key] === "asc" ? 1 : -1;
          }
        }

        return 0;
      });

      return new ImmutableCollection(items);
    }

    return this;
  }

  /**
   * Sort order by the given key in descending order
   */
  public sortByDesc(key: string) {
    return new ImmutableCollection(
      this.items.sort((a: any, b: any) => {
        const aValue: any = get(a, key);
        const bValue: any = get(b, key);

        if (aValue < bValue) {
          return 1;
        }

        if (aValue > bValue) {
          return -1;
        }

        return 0;
      }),
    );
  }

  /**
   * Get all items that are not valid against the given callback
   */
  public reject(callback: Parameters<typeof Array.prototype.filter>[0]) {
    return new ImmutableCollection(
      this.items.filter((item, index, array) => {
        return !callback(item, index, array);
      }),
    );
  }

  /**
   * @alias reject
   */
  public except(callback: Parameters<typeof Array.prototype.filter>[0]) {
    return this.reject(callback);
  }

  /**
   * Get all values that are not equal to the given value
   */
  public not(exceptValue: any) {
    return this.reject(value => value === exceptValue);
  }

  /**
   * @alias reject
   */
  public skipWhile(callback: Parameters<typeof Array.prototype.filter>[0]) {
    return this.reject(callback);
  }

  /**
   * Skip last items while matching the given callback
   */
  public skipLastWhile(callback: Parameters<typeof Array.prototype.filter>[0]) {
    // [1, 2, 3, 4, 5] skip last while (item) => item > 3 should return [1, 2, 3]

    const items = this.items.slice();

    for (let i = items.length - 1; i >= 0; i--) {
      if (!callback(items[i], i, items)) {
        break;
      }

      items.pop();
    }

    return new ImmutableCollection(items);
  }

  /**
   * Get all items except the first matched callback
   */
  public rejectFirst(callback: Parameters<typeof Array.prototype.filter>[0]) {
    // return all items except first matched callback
    const newItems: any[] = [];

    let found = false;

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (!found && callback(item, i, this.items) === true) {
        found = true;
        continue;
      } else {
        newItems.push(item);
      }
    }

    return new ImmutableCollection(newItems);
  }

  /**
   * @alias rejectFirst
   */
  public exceptFirst(callback: Parameters<typeof Array.prototype.filter>[0]) {
    return this.rejectFirst(callback);
  }

  /**
   * Get all items except the last matched callback
   */
  public rejectLast(callback: Parameters<typeof Array.prototype.filter>[0]) {
    // return all items except last matched callback
    const newItems: any[] = [];

    let found = false;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (!found && callback(item, i, this.items) === true) {
        found = true;
        continue;
      } else {
        newItems.push(item);
      }
    }

    return new ImmutableCollection(newItems.reverse());
  }

  /**
   * @alias rejectLast
   */
  public exceptLast(callback: Parameters<typeof Array.prototype.filter>[0]) {
    return this.rejectLast(callback);
  }

  /**
   * Chunk the collection into the given number of groups
   */
  public chunk(size: number, returnAsCollection = true) {
    let chunks = chunk(this.items, size);

    if (returnAsCollection) {
      chunks = chunks.map(chunk => new ImmutableCollection(chunk));
    }

    return new ImmutableCollection(chunks);
  }

  /**
   * Clone the collection
   */
  public clone() {
    return new ImmutableCollection([...this.items]);
  }

  /**
   * @alias clone
   */
  public copy() {
    return this.clone();
  }

  /**
   * Reverse collection items
   */
  public reverse() {
    return new ImmutableCollection(this.items.reverse());
  }

  /**
   * @alias reverse
   */
  public flip() {
    return this.reverse();
  }

  /**
   * Determines whether all the members of an array satisfy the specified test.
   */
  public every(callback: Parameters<typeof Array.prototype.every>[0]) {
    return this.items.every(callback);
  }

  /**
   * Determines whether the specified callback function returns true for any element of an array.
   */
  public some(callback: Parameters<typeof Array.prototype.some>[0]) {
    return this.items.some(callback);
  }

  /**
   * Get the first matched item for the given callback
   */
  public find(callback: Parameters<typeof Array.prototype.find>[0]) {
    return this.items.find(callback);
  }

  /**
   * Skip the given number of items
   */
  public skip(number: number) {
    return new ImmutableCollection(this.items.slice(number));
  }

  /**
   * @alias skip
   */
  public skipTo(number: number) {
    return this.skip(number);
  }

  /**
   * Skip the last given number of items
   */
  public skipLast(number: number) {
    // get all items before the number
    const newItems = this.items.slice(0, -number);

    return new ImmutableCollection(newItems);
  }

  /**
   * Skip all items until the given callback returns true
   */
  public skipUntil(callback: Parameters<typeof Array.prototype.findIndex>[0]) {
    // get all items after the given callback
    const newItems = this.items.slice(this.findIndex(callback));

    return new ImmutableCollection(newItems);
  }

  /**
   * Skip last items until the given callback returns true
   */
  public skipLastUntil(
    callback: Parameters<typeof Array.prototype.findIndex>[0],
  ) {
    // get all items before the given callback
    const newItems = this.items.slice(0, this.findIndex(callback));

    return new ImmutableCollection(newItems);
  }

  /**
   * Get index of the given value
   */
  public indexOf(value: Parameters<typeof Array.prototype.indexOf>[0]) {
    return this.items.indexOf(value);
  }

  /**
   * Find the index of the first item matching the given callback.
   */
  public findIndex(callback: Parameters<typeof Array.prototype.findIndex>[0]) {
    return this.items.findIndex(callback);
  }

  /**
   * Get the last index of the given value.
   */
  public lastIndexOf(...args: Parameters<typeof Array.prototype.lastIndexOf>) {
    return this.items.lastIndexOf(...args);
  }

  /**
   * Get last index of the collection
   */
  public lastIndex() {
    return this.items.length - 1;
  }

  /**
   * Determine if the collection is empty.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Determine if the collection is not empty.
   */
  public isNotEmpty(): boolean {
    return this.items.length > 0;
  }

  /**
   * Replace the first matched old value with the given new value.
   */
  public replace(oldValue: any, newValue: any) {
    const items = [...this.items];

    const valueIndex = items.findIndex(value => value === oldValue);

    if (valueIndex !== -1) {
      items[valueIndex] = newValue;
    }

    return new ImmutableCollection(items);
  }

  /**
   * Replace the old value with the given new value.
   */
  public replaceAll(oldValue: any, newValue: any) {
    return this.map((value: any) => {
      return value === oldValue ? newValue : value;
    });
  }

  /**
   * Shuffle the items in the collection.
   */
  public shuffle() {
    return new ImmutableCollection(shuffle(this.items) as any[]);
  }

  /**
   * Get random item from the collection.
   */
  public random(number: number);
  public random();
  public random(number?: number) {
    return number ? this.shuffle().take(number) : this.shuffle().first();
  }

  /**
   * Take items from the beginning of the collection to the given number.
   */
  public take(number: number) {
    return new ImmutableCollection(this.items.slice(0, number));
  }

  /**
   * @alias take
   */
  public limit(number: number) {
    return this.take(number);
  }

  /**
   * Take last items from the collection to the given number.
   */
  public takeLast(number: number) {
    return new ImmutableCollection(this.items.slice(-number));
  }

  /**
   * Take items from the collection until the given callback returns true.
   */
  public takeUntil(callback: Parameters<typeof Array.prototype.findIndex>[0]) {
    return new ImmutableCollection(
      this.items.slice(0, this.findIndex(callback)),
    );
  }

  /**
   * Take a slice from the collection
   */
  public slice(...args: Parameters<typeof Array.prototype.slice>) {
    return new ImmutableCollection(this.items.slice(...args));
  }

  /**
   * Splice the underlying collection array.
   */
  public splice(...args: Parameters<typeof Array.prototype.splice>) {
    const items = [...this.items];
    items.splice(...args);

    return new ImmutableCollection(items);
  }

  /**
   * Execute a callback over each item.
   */
  public forEach(callback: Parameters<typeof Array.prototype.forEach>[0]) {
    this.items.forEach(callback);
    return this;
  }

  /**
   * @alias forEach
   */
  public each(callback: Parameters<typeof Array.prototype.forEach>[0]) {
    return this.forEach(callback);
  }

  /**
   * Tap into the collection and run a callback.
   */
  public tap(callback: (collection: ImmutableCollection) => any): this {
    callback(this);

    return this;
  }

  /**
   * Delete the given indexes from the collection
   */
  public unset(...indexes: number[]) {
    return this.filter((_, index) => !indexes.includes(index));
  }

  /**
   * Delete item by index
   */
  public delete(key: number) {
    return this.unset(key);
  }

  /**
   * Pluck an array of values from an array.
   * If the given key is string then we'll return an array of values of that key
   * If the given key is an array then we'll return an array of objects contains these keys
   */
  public pluck(key: string | string[]) {
    return new ImmutableCollection(pluck(this.items, key));
  }

  /**
   * Determine whether current collection contains the given item
   */
  public equals(value: any[] | ImmutableCollection): boolean {
    if (value instanceof ImmutableCollection) {
      value = value.all();
    }

    return areEqual(this.items, value);
  }

  /**
   * Get items based on the given operators
   */
  public where(key: string, value: any);
  public where(operator: ComparisonOperator, value: any);
  public where(key: string, operator: ComparisonOperator, value: any);
  public where(...args: any[]) {
    let [key, operator, value] = args;

    let isPrimitive = false;

    let isRegex = false;

    let isDate = false;

    let isObjectValue = false;

    if (args.length === 2) {
      if (Operators.includes(args[0])) {
        isPrimitive = true;
      } else if (!Operators.includes(args[1])) {
        value = operator;

        operator = "=";
      }
    }

    if (value instanceof RegExp || operator === "regex") {
      isRegex = true;
    } else if (value instanceof Date) {
      isDate = true;
    } else if (value && typeof value === "object") {
      isObjectValue = true;
    }

    return this.filter((item: any) => {
      const itemValue: any = isPrimitive
        ? item
        : get(item as object, key, NotExists);

      if (isRegex) {
        return (value as RegExp).test(String(itemValue));
      }

      switch (operator) {
        case "=":
        case "equals":
          if (isDate) {
            return +itemValue === +value;
          }

          if (isObjectValue) {
            return areEqual(itemValue, value);
          }

          return itemValue === value;
        case "!=":
        case "not equals":
        case "not":
          if (isDate) {
            return +itemValue !== +value;
          }

          if (isObjectValue) {
            return areEqual(itemValue, value) === false;
          }

          return itemValue !== value;
        case ">":
        case "gt":
          return itemValue > value;
        case ">=":
        case "gte":
          return itemValue >= value;
        case "<":
        case "lt":
          return itemValue < value;
        case "<=":
        case "lte":
          return itemValue <= value;
        case "like":
        case "%":
          return itemValue.match(
            value instanceof RegExp ? value : new RegExp(value, "i"),
          );
        case "not like":
        case "!%":
          return !itemValue.match(
            value instanceof RegExp ? value : new RegExp(value, "i"),
          );
        case "in":
          return value.includes(itemValue);
        case "not in":
        case "!in":
          return !value.includes(itemValue);
        case "between":
        case "<>":
          return itemValue >= value[0] && itemValue <= value[1];
        case "not between":
        case "!between":
        case "!<>":
          return itemValue < value[0] || itemValue > value[1];
        case "contains":
          if (!itemValue.includes) return false;
          return itemValue.includes(value);
        case "not contains":
        case "!contains":
          if (!itemValue.includes) return false;
          return !itemValue.includes(value);
        case "starts with":
          return itemValue.startsWith(value);
        case "not starts with":
        case "!starts with":
          return !itemValue.startsWith(value);
        case "ends with":
          return itemValue.endsWith(value);
        case "not ends with":
        case "!ends with":
          return !itemValue.endsWith(value);
        case "is null":
        case "null":
          return itemValue === null;
        case "is not null":
        case "!null":
          return itemValue !== null;
        case "is undefined":
        case "undefined":
          return itemValue === undefined;
        case "!undefined":
        case "is not undefined":
          return itemValue !== undefined;
        case "exists":
          return itemValue !== NotExists;
        case "not exists":
        case "!exists":
          return itemValue === NotExists;
        case "true":
        case "is true":
          return itemValue === true;
        case "!true":
        case "is not true":
          return itemValue !== true;
        case "false":
        case "is false":
          return itemValue === false;
        case "!false":
        case "is not false":
          return itemValue !== false;
        case "is":
        case "typeof":
          return typeof itemValue === value;
        case "is not":
        case "!is":
        case "!typeof":
        case "not typeof":
          return typeof itemValue !== value;
        case "instanceof":
        case "is a":
          return itemValue instanceof value;
        case "not instanceof":
        case "!instanceof":
        case "is not a":
        case "!is a":
          return !(itemValue instanceof value);
        case "empty":
        case "is empty":
          return Is.empty(itemValue);
        case "not empty":
        case "is not empty":
        case "!empty":
          return !Is.empty(itemValue);
        default:
          return false;
      }
    });
  }

  /**
   * Get first matching item
   */
  public firstWhere(key: string, value: any);
  public firstWhere(operator: ComparisonOperator, value: any);
  public firstWhere(key: string, operator: ComparisonOperator, value: any);
  public firstWhere(...args: any[]) {
    return this.where(
      ...(args as Parameters<typeof ImmutableCollection.prototype.where>),
    ).first();
  }

  /**
   * Get items where the given key exists
   */
  public whereExists(key: string) {
    return this.where(key, "exists");
  }

  /**
   * Get items where the given key does not exist
   */
  public whereNotExists(key: string) {
    return this.where(key, "not exists");
  }

  /**
   * Get items where its value is in the given array
   */
  public whereIn(
    values: (string | number | boolean | Date)[],
  ): ImmutableCollection;
  public whereIn(
    key: string,
    values: (string | number | boolean | Date)[],
  ): ImmutableCollection;
  public whereIn(...args: any[]) {
    if (args.length === 1) {
      args = args[0];

      return this.filter((item: any) => {
        return args.includes(item);
      });
    }

    const [key, values] = args;

    return this.filter((item: any) => {
      return values.includes(get(item, key));
    });
  }

  /**
   * Get items where its value is not in the given array
   */
  public whereNot(key: string, value: any): ImmutableCollection;
  public whereNot(value: any): ImmutableCollection;
  public whereNot(...args: any[]) {
    if (args.length === 1) {
      args = args[0];

      return this.filter((item: any) => {
        return item !== args;
      });
    }

    const [key, value] = args;

    return this.filter((item: any) => {
      return get(item, key) !== value;
    });
  }

  /**
   * Get items where between the given values
   */
  public whereBetween(key: string, values: any[]): ImmutableCollection;
  public whereBetween(values: any[]): ImmutableCollection;
  public whereBetween(...args: any[]) {
    if (args.length === 1) {
      args = args[0];

      return this.filter((item: any) => {
        const [min, max] = args;

        return item >= min && item <= (max as any);
      });
    }

    const [key, values] = args;

    return this.filter((item: any) => {
      const [min, max] = values;

      const itemValue: any = get(item, key);

      return itemValue >= min && itemValue <= (max as any);
    });
  }

  /**
   * Get items where not between the given values
   */
  public whereNotBetween(key: string, values: any[]): ImmutableCollection;
  public whereNotBetween(values: any[]): ImmutableCollection;
  public whereNotBetween(...args: any[]) {
    if (args.length === 1) {
      args = args[0];

      return this.filter((item: any) => {
        const [min, max] = args;

        return item < min || item > (max as any);
      });
    }

    const [key, values] = args;

    return this.filter((item: any) => {
      const [min, max] = values;

      const itemValue: any = get(item, key);

      return itemValue < min || itemValue > (max as any);
    });
  }

  /**
   * Get empty items, weird but a valid case though
   */
  public whereEmpty(key?: string) {
    return this.filter((item: any) => {
      let value = key ? get(item, key) : item;

      return Is.empty(value);
    });
  }

  /**
   * Get all items that are not empty
   */
  public whereNotEmpty(key?: string) {
    return this.filter((item: any) => {
      let value = key ? get(item, key) : item;

      return !Is.empty(value);
    });
  }

  /**
   * @alias whereNotEmpty
   */
  public heavy(key?: string) {
    return this.whereNotEmpty(key);
  }

  /**
   * Get items where its value is null
   */
  public whereNull(key?: string) {
    return this.filter((item: any) => {
      let value = key ? get(item, key) : item;

      return value === null;
    });
  }

  /**
   * Get items where its value is not null
   */
  public whereNotNull(key?: string) {
    return this.filter((item: any) => {
      const value = key ? get(item, key) : item;

      return value !== null;
    });
  }

  /**
   * Get items that are not defined
   */
  public whereNotUndefined(key?: string) {
    return this.filter((item: any) => {
      const value = key ? get(item, key) : item;

      return value !== undefined;
    });
  }

  /**
   * Get items that are undefined
   */
  public whereUndefined(key?: string) {
    return this.filter((item: any) => {
      const value = key ? get(item, key) : item;

      return value === undefined;
    });
  }

  /**
   * Get last matching item
   */
  public lastWhere(callback: Parameters<typeof Array.prototype.find>[0]);
  public lastWhere(key: any, operator?: ComparisonOperator, value?: any);
  public lastWhere(...args: any[]) {
    return this.where(
      ...(args as Parameters<typeof ImmutableCollection.prototype.where>),
    ).last();
  }

  /**
   * Replace values for the given two indexes
   */
  public swap(index1: number, index2: number) {
    const items = [...this.items];

    [items[index1], items[index2]] = [items[index2], items[index1]];

    return new ImmutableCollection(items);
  }

  /**
   * Move the given index to the given position
   */
  public move(index: number, position: number) {
    const items = [...this.items];

    items.splice(position, 0, items.splice(index, 1)[0]);

    return new ImmutableCollection(items);
  }

  /**
   * Reorder the given indexes
   */
  public reorder(indexes: { [oldIndex: number]: number }) {
    const reorderedItems: any[] = [...this.items];

    Object.keys(indexes).forEach(oldIndex => {
      const newIndex = indexes[oldIndex];

      reorderedItems[newIndex] = this.items[oldIndex];
    });

    return new ImmutableCollection(reorderedItems);
  }

  /**
   * Group by the given key or keys
   */
  public groupBy(keys: string | string[], listAs = "items") {
    return new ImmutableCollection(groupBy(this.items as any, keys, listAs));
  }

  /**
   * Collect all values from the given key and return it in a new collection
   */
  public collectFrom(key: string) {
    const items: any[] = [];

    this.items.forEach(item => {
      const value = get(item, key);

      if (Array.isArray(value)) {
        items.push(...value);
      } else {
        items.push(value);
      }
    });

    return new ImmutableCollection(items);
  }

  /**
   * Return a new collection given key from the given index
   */
  public collectFromKey(key: string);
  public collectFromKey(index: number | string, key?: string);
  public collectFromKey(...args) {
    return new ImmutableCollection(get(this.items, args.join(".")));
  }

  /**
   * Iterator
   */
  public [Symbol.iterator](): Iterator<any, any, undefined> {
    return this.items[Symbol.iterator]();
  }
}

export function collect<ItemType = any>(
  items: ItemType[] | ImmutableCollection = [],
): ImmutableCollection<ItemType> {
  return new ImmutableCollection<ItemType>(items);
}

collect.fromIterator = ImmutableCollection.fromIterator;
collect.create = ImmutableCollection.create;
