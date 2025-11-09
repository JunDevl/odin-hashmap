import {MapLinkedList, SetLinkedList} from "./linkedList";
import type {MapNode, SetNode} from "./linkedList"
import prompt from "./prompt";

class HashMap {
  #capacity = 16;
  #loadFactor = 0.65;
  #bucketLength = 0;
  #buckets: MapLinkedList[] | null[] = new Array(this.#capacity);
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
      let newBuckets: MapLinkedList[] = new Array(this.#capacity);
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
      return !!keyValue.get(key);

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
    this.#buckets = new Array(this.#capacity);
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

const hashMapTest = new HashMap();

hashMapTest.set('apple', 'red');
hashMapTest.set('banana', 'yellow');
hashMapTest.set('carrot', 'orange');
hashMapTest.set('dog', 'brown');
hashMapTest.set('elephant', 'gray');
hashMapTest.set('frog', 'green');
hashMapTest.set('grape', 'purple');
hashMapTest.set('hat', 'black');
hashMapTest.set('ice cream', 'white');
hashMapTest.set('jacket', 'blue');
hashMapTest.set('kite', 'pink');
hashMapTest.set('lion', 'golden');
hashMapTest.set('son', 'goku');

console.log(hashMapTest);

hashMapTest.set('moon', 'silver');

console.log(hashMapTest);

console.log(hashMapTest.get("apple"));
console.log(hashMapTest.entries());
console.log(hashMapTest.keys());
console.log(hashMapTest.values());
console.log(hashMapTest.has("hat"));
console.log(hashMapTest.has("vicking"));
console.log(hashMapTest.has("kite"));
console.log(hashMapTest.length);
console.log(hashMapTest.get("bettlejuice"));
console.log(hashMapTest.remove("kite"));
console.log(hashMapTest);
console.log(hashMapTest.clear());

console.log(hashMapTest);

class HashSet {
  #capacity = 16;
  #loadFactor = 0.65;
  #bucketLength = 0;
  #buckets: SetLinkedList[] | null[] = new Array(this.#capacity);
  length = 0;

  constructor(keys?: string[]) {
    if (!keys) return;

    for (let key of keys) this.set(key)
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
      let newBuckets: SetLinkedList[] = new Array(this.#capacity);
      for (let key of this.keys()) {
        const newHashedKey = this.#hash(key);
        this.#indexIsInvalid(newHashedKey);

        this.length++;

        if (!newBuckets[newHashedKey]) {
          newBuckets[newHashedKey] = new SetLinkedList({key});

          this.#bucketLength++;

          continue;
        }

        newBuckets[newHashedKey].append(key);
      }

      this.#buckets = newBuckets;
    } 
  }

  set(key: string): void {
    const hashedKey = this.#hash(key);
    this.#indexIsInvalid(hashedKey);

    if (!this.#buckets[hashedKey]) {
      this.#buckets[hashedKey] = new SetLinkedList({key});

      this.#bucketLength++;
      this.length++;
      this.#adjustCapacity();

      return;
    }

    const keyAlreadyExists = this.#buckets[hashedKey].get(key)
    if (keyAlreadyExists) return;

    this.length++;
    this.#buckets[hashedKey].append(key);
  }

  get(key: string): string | undefined {
    const keyLinkedList = this.#buckets[this.#hash(key)];

    if (!keyLinkedList) return;

    const node = keyLinkedList.get(key);
    
    if (!node) return;

    return node.key;
  }

  has(key: string): boolean {
    const keyLinkedList = this.#buckets[this.#hash(key)];

    if (keyLinkedList) 
      return !!keyLinkedList.get(key);

    return false;
  }

  remove(key: string): boolean {
    const hashedKey = this.#hash(key)
    const keyLinkedList = this.#buckets[hashedKey];

    if (keyLinkedList) { 
      keyLinkedList.remove(key);
      if (keyLinkedList.Size === 0) {
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
    this.#buckets = new Array(this.#capacity);
    this.length = 0;
    this.#bucketLength = 0;
  }

  keys(): string[] {
    let keys = [];

    for (let linkedList of this.#buckets) {
      if (!linkedList) continue;
      let current: SetNode | undefined = linkedList.head;
      while(current) {
        keys.push(current.key);
        current = current?.next;
      }
    }

    return keys;
  }
}

const hashSetTest = new HashSet();

hashSetTest.set('apple');
hashSetTest.set('banana');
hashSetTest.set('carrot');
hashSetTest.set('dog');
hashSetTest.set('elephant');
hashSetTest.set('frog');
hashSetTest.set('grape');
hashSetTest.set('hat');
hashSetTest.set('ice cream');
hashSetTest.set('jacket');
hashSetTest.set('kite');
hashSetTest.set('lion');
hashSetTest.set('son');

console.log(hashSetTest);

hashSetTest.set('moon');

console.log(hashSetTest);

console.log(hashSetTest.get("apple"));
console.log(hashSetTest.keys());
console.log(hashSetTest.has("hat"));
console.log(hashSetTest.has("vicking"));
console.log(hashSetTest.has("kite"));
console.log(hashSetTest.length);
console.log(hashSetTest.get("bettlejuice"));
console.log(hashSetTest.remove("kite"));
console.log(hashSetTest);
console.log(hashSetTest.clear());

console.log(hashSetTest);

// prompt("Enter an array of objects with the current structure:\n" 
//   + "{\n"
//   + "  data: string\n"
//   + "}\n"
// )
//   .then((value) => {
//     linkedList = new LinkedList(...JSON.parse(value as string) as Node[]);
//   })

