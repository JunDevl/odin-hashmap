import {MapLinkedList, SetLinkedList} from "./linkedList";
import type {MapNode, SetNode} from "./linkedList"
import prompt from "./prompt";

class HashMap {
  #capacity = 16;
  #loadFactor = 0.65;
  #bucketLength = 0;
  #buckets: MapLinkedList[] | null[] = new Array(this.#capacity).fill(null);
  length = 0;

  constructor(keyValue?: [[string, string]]) {
    if (!keyValue) return;

    for (let [key, value] of keyValue) this.set(key, value)
  }

  #hash(key: string): number {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) 
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.#capacity;

    return hashCode - 1;
  }

  #indexIsInvalid(index: number) {
    if (index < 0 || index >= this.#capacity) {
      throw new Error("Trying to access index out of bounds");
    }
  }

  #adjustCapacity(currentLength: number = this.#bucketLength) {
    if (currentLength > (this.#capacity * this.#loadFactor)) {
      this.#capacity *= 2;

      this.#bucketLength = 0;
      this.length = 0;
      let newBuckets: MapLinkedList[] = new Array(this.#capacity).fill(null);
      for (let [key, value] of this.entries()) {
        const newHashedKey = this.#hash(key);
        this.#indexIsInvalid(newHashedKey);

        this.length++;

        if (!newBuckets[newHashedKey]) {
          newBuckets[newHashedKey] = new MapLinkedList({
            key,
            value
          });

          this.#bucketLength++;

          continue;
        }

        newBuckets[newHashedKey].append(key, value);
      }

      this.#buckets = newBuckets;
    } 
  }

  set(key: string, value: string): void {
    const hashedKey = this.#hash(key);
    this.#indexIsInvalid(hashedKey);

    if (!this.#buckets[hashedKey]) {
      this.#buckets[hashedKey] = new MapLinkedList({
        key,
        value
      });

      this.#bucketLength++;
      this.length++;
      this.#adjustCapacity();

      return;
    }

    const keyAlreadyExists = this.#buckets[hashedKey].get(key)
    if (keyAlreadyExists) {
      keyAlreadyExists.value = value;
      return;
    }
    
    this.length++;
    this.#buckets[hashedKey].append(key, value);

  }

  get(key: string): string | undefined {
    const keyValue = this.#buckets[this.#hash(key)];

    if (!keyValue) return;

    const node = keyValue.get(key);
    
    if (!node) return;

    return node.value;
  }

  has(key: string): boolean {
    const keyValue = this.#buckets[this.#hash(key)];

    if (keyValue) 
      return !!keyValue.get(key)?.value;

    return false;
  }

  remove(key: string): boolean {
    const hashedKey = this.#hash(key)
    const keyValue = this.#buckets[hashedKey];

    if (keyValue) { 
      keyValue.remove(key);
      if (keyValue.Size === 0) {
        this.#buckets[hashedKey] = null;
        this.#bucketLength--;
      }
      this.length--;
      this.#adjustCapacity();
      return true;
    };

    return false;
  }

  clear(): void {
    this.#buckets = new Array(this.#capacity).fill(null);
    this.length = 0;
    this.#bucketLength = 0;
  }

  keys(): string[] {
    let keys = [];

    for (let linkedList of this.#buckets) {
      if (!linkedList) continue;
      let current: MapNode | undefined = linkedList.head;
      while(current) {
        keys.push(current.key);
        current = current?.next;
      }
    }

    return keys;
  }

  values(): string[] {
    let values = [];

    for (let linkedList of this.#buckets) {
      if (!linkedList) continue;
      let current: MapNode | undefined = linkedList.head;
      while(current) {
        values.push(current.value);
        current = current?.next;
      }
    }

    return values;
  }

  entries(): [[string, string]] {
    let keyValues: [[string, string]] = <unknown>[] as [[string, string]];

    for (let linkedList of this.#buckets) {
      if (!linkedList) continue;
      let current: MapNode | undefined = linkedList.head;
      while(current) {
        keyValues.push([current.key, current.value]);
        current = current?.next;
      }
    }

    return keyValues;
  }
}

const test = new HashMap();

test.set('apple', 'red');
test.set('banana', 'yellow');
test.set('carrot', 'orange');
test.set('dog', 'brown');
test.set('elephant', 'gray');
test.set('frog', 'green');
test.set('grape', 'purple');
test.set('hat', 'black');
test.set('ice cream', 'white');
test.set('jacket', 'blue');
test.set('kite', 'pink');
test.set('lion', 'golden');
test.set('son', 'goku');

console.log(test);

test.set('moon', 'silver');

console.log(test);

console.log(test.get("apple"));
console.log(test.entries());
console.log(test.keys());
console.log(test.values());
console.log(test.has("hat"));
console.log(test.has("vicking"));
console.log(test.has("kite"));
console.log(test.length);
console.log(test.get("bettlejuice"));
console.log(test.remove("kite"));
console.log(test);
console.log(test.clear());

console.log(test);

// prompt("Enter an array of objects with the current structure:\n" 
//   + "{\n"
//   + "  data: string\n"
//   + "}\n"
// )
//   .then((value) => {
//     linkedList = new LinkedList(...JSON.parse(value as string) as Node[]);
//   })

