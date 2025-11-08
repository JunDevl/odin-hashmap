type MapTrasverseReturnType = "index" | "key_value";

export interface MapNode {
  key: string,
  value: string,
  next?: MapNode,
}

export class MapLinkedList {
  head: MapNode;
  tail: MapNode;
  #size: number = 0;

  constructor(...nodes: MapNode[]) {
    this.head = nodes[0];
    for (let [i, node] of nodes.entries()) {
      if (node.next) node.next = nodes[i++];
      this.#size++;
    }
    this.tail = nodes[nodes.length - 1];
  }

  search(compareTo: MapTrasverseReturnType,
          isEqual: (predicate: string | number) => boolean,
          returnType?: MapTrasverseReturnType,
          current: MapNode | null = this.head, 
          i: number = 0, 
  ): MapNode | [string, string] | number | undefined {
    if (!current) return;
    if (compareTo === "index" && isEqual(i) || compareTo === "key_value" && isEqual(current.key)) {
      const {key, value} = current
      switch (returnType) {
        case "index":
          return i;
        case "key_value":
          return [key, value];
        default: 
          return current;
      }
    }
    const increment = i + 1;
    const next = current.next ?? null;
    return this.search(compareTo, isEqual, returnType, next, increment);
  }

  get Size() {return this.#size;}

  append(key: string, value: string): void {
    this.tail.next = {key, value};
    this.#size++;
  };

  prepend(key: string, value: string): void {
    const newHead: MapNode = {
      key,
      value,
      next: this.head
    };

    this.head = newHead;
    this.#size++;
  };

  at(index: number): MapNode | undefined {
    const comparator = (target_i: string | number) => index == target_i;
    return this.search("index", comparator) as MapNode | undefined;
  };

  get(key: string): MapNode | undefined {
    const comparator = (targetKey: string | number) => key == targetKey;
    return this.search("key_value", comparator) as MapNode | undefined;
  }

  pop(): void {
    const comparator = (target_i: string | number) => (this.#size - 2) == target_i;

    const secondLast = this.search("index", comparator) as MapNode;
    this.tail = secondLast;
    secondLast.next = undefined;
    this.#size--;
  };

  contains(key: string): boolean {
    const comparator = (targetKey: string | number) => key == targetKey;
    const containing = this.search("key_value", comparator);

    return !!containing;
  };

  findIndex(key: string): number | undefined {
    const comparator = (targetKey: string | number) => key == targetKey;
    return this.search("key_value", comparator, "index") as number | undefined;
  };

  toString(): string {
    let result = "head -> ";
    let current: MapNode | undefined = this.head;

    while(current) {
      const {key, value} = current;
      result += `[${key}: ${value}] -> `
      current = current?.next;
    }

    result += "null"

    return result;
  };

  insertAt(index: number, key: string, value: string): void | undefined {
    const previous = this.at(index - 1);

    if (!previous) return;
    const previousNext = previous.next;

    previous.next = {
      key,
      value,
      next: previousNext
    };

    if (!previous.next.next) this.tail = previous.next

    this.#size++;
  };

  removeAt(index: number): void {
    const previous = this.at(index - 1);
    if (!previous) return;

    const current = previous.next;

    if (current)
      previous.next = current.next as MapNode;

    this.#size--;
  };

  remove(key: string): void {
    const target = this.get(key);
    if (!target) return;

    const current = target.next;

    if (current)
      target.next = current.next as MapNode;

    this.#size--;
  }
}

export interface SetNode {
  key: string,
  next?: SetNode,
}

type SetTrasverseReturnType = "index" | "key";

export class SetLinkedList {
  head: SetNode;
  tail: SetNode;
  #size: number = 0;

  constructor(...values: SetNode[]) {
    this.head = values[0];
    for (let [i, value] of values.entries()) {
      if (value.next) value.next = values[i++];
      this.#size++;
    }
    this.tail = values[values.length - 1];
  }

  search(compareTo: SetTrasverseReturnType,
          isEqual: (predicate: number | string) => boolean,
          returnType?: SetTrasverseReturnType,
          current: SetNode | null = this.head, 
          i: number = 0, 
  ): SetNode | string | number | undefined {
    if (!current) return;
    if (compareTo === "index" && isEqual(i) || compareTo === "key" && isEqual(current.key)) {
      switch (returnType) {
        case "index":
          return i;
        case "key":
          return current.key;
        default: 
          return current;
      }
    }
    const increment = i + 1;
    const next = current.next ?? null;
    return this.search(compareTo, isEqual, returnType, next, increment);
  }

  get Size() {return this.#size;}

  append(value: string): void {
    this.tail.next = {key: value};
    this.#size++;
  };

  prepend(value: string): void {
    const newHead: SetNode = {
      key: value,
      next: this.head
    };

    this.head = newHead;
    this.#size++;
  };

  at (index: number): SetNode | undefined {
    const comparator = (target_i: string | number) => index == target_i;
    return this.search("index", comparator) as SetNode | undefined;
  };

  get(key: string): MapNode | undefined {
    const comparator = (targetKey: string | number) => key == targetKey;
    return this.search("key", comparator) as MapNode | undefined;
  }

  pop(): void {
    const comparator = (target_i: string | number) => (this.#size - 2) == target_i;

    const secondLast = this.search("index", comparator) as SetNode;
    this.tail = secondLast;
    secondLast.next = undefined;
    this.#size--;
  };

  contains(value: string): boolean {
    const comparator = (target_value: string | number) => value == target_value;
    const containing = this.search("key", comparator);

    return !!containing;
  };

  findIndex(value: string): number | undefined {
    const comparator = (target_value: string | number) => value == target_value;
    return this.search("key", comparator, "index") as number | undefined;
  };

  toString(): string {
    let result = "head -> ";
    let current: SetNode | undefined = this.head;

    while(current) {
      result += `[${current.key}] -> `
      current = current?.next;
    }

    result += "null"

    return result;
  };

  insertAt(index: number, value: string): void | undefined {
    const previous = this.at(index - 1);

    if (!previous) return;
    const previousNext = previous.next;

    previous.next = {
      key: value,
      next: previousNext
    };

    if (!previous.next.next) this.tail = previous.next

    this.#size++;
  };

  removeAt(index: number): void {
    const previous = this.at(index - 1);
    if (!previous) return;

    const current = previous.next;

    if (current)
      previous.next = current.next as MapNode;

    this.#size--;
  };

  remove(key: string): void {
    const target = this.get(key);
    if (!target) return;

    const current = target.next;

    if (current)
      target.next = current.next as MapNode;

    this.#size--;
  }
}