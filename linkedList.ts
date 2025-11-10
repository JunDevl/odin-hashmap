import prompt from "./prompt";

type TrasverseReturnTypes = "index" | "value";

class LinkedList {
  head: Node;
  tail: Node;
  #size: number = 0;

  constructor(...values: Node[]) {
    this.head = values[0];
    for (let [i, value] of values.entries()) {
      if (value.next) value.next = values[i++];
      this.#size++;
    }
    this.tail = values[values.length - 1];
  }

  #search(compareTo: TrasverseReturnTypes,
          isEqual: (predicate: number | string) => boolean,
          returnType?: TrasverseReturnTypes,
          current: Node | null = this.head, 
          i: number = 0, 
  ): Node | string | number | undefined {
    if (!current) return;
    if (compareTo === "index" && isEqual(i) || compareTo === "value" && isEqual(current.data)) {
      switch (returnType) {
        case "index":
          return i;
        case "value":
          return current.data;
        default: 
          return current;
      }
    }
    const increment = i + 1;
    const next = current.next ?? null;
    return this.#search(compareTo, isEqual, returnType, next, increment);
  }

  get Size() {return this.#size;}

  append(value: string): void {
    this.tail.next = {data: value};
    this.#size++;
  };

  prepend(value: string): void {
    const newHead: Node = {
      data: value,
      next: this.head
    };

    this.head = newHead;
    this.#size++;
  };

  at (index: number): Node | undefined {
    const comparator = (target_i: string | number) => index == target_i;
    return this.#search("index", comparator) as Node | undefined;
  };

  get(value: string): Node | undefined {
    const comparator = (targetKey: string | number) => value == targetKey;
    return this.#search("value", comparator) as Node | undefined;
  }

  pop(): void {
    const comparator = (target_i: string | number) => (this.#size - 2) == target_i;

    const secondLast = this.#search("index", comparator) as Node;
    this.tail = secondLast;
    secondLast.next = undefined;
    this.#size--;
  };

  contains(value: string): boolean {
    const comparator = (target_value: string | number) => value == target_value;
    const containing = this.#search("value", comparator);

    return !!containing;
  };

  findIndex(value: string): number | undefined {
    const comparator = (target_value: string | number) => value == target_value;
    return this.#search("value", comparator, "index") as number | undefined;
  };

  toString(): string {
    let result = "head -> ";
    let current: Node | undefined = this.head;

    while(current) {
      result += `[${current.data}] -> `
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
      data: value,
      next: previousNext
    };

    if (!previous.next.next) this.tail = previous.next

    this.#size++;
  };

  removeAt(index: number): void | undefined {
    const previous = this.at(index - 1);
    if (!previous) return;

    const current = previous.next;

    if (current)
      previous.next = current.next as Node;

    this.#size--;
  };
}

interface Node {
  data: string,
  next?: Node,
}

let linkedList: LinkedList;

prompt("Enter an array of objects with the current structure:\n" 
  + "{\n"
  + "  data: string\n"
  + "}\n"
)
  .then((value) => {
    linkedList = new LinkedList(...JSON.parse(value as string) as Node[])
    
    linkedList.append("f");
    linkedList.prepend("0");
    linkedList.insertAt(1, "ab");
    linkedList.insertAt(14, "error");
    linkedList.removeAt(3);
    linkedList.removeAt(45);
    console.log(linkedList.at(1));
    console.log(linkedList.at(90));
    console.log(linkedList.contains("1"));
    console.log(linkedList.contains("0"));
    console.log(linkedList.findIndex("d"));
    console.log(linkedList.findIndex("inexistent"));
    console.log(linkedList.toString());
  })

