class Node {
  private value: unknown;
  private next: undefined;

  constructor(value) {
    this.value = value;
    this.next = undefined;
  }
}

export default class Queue {
  #size;
  #head;
  #tail;

  constructor() {
    this.clear();
  }

  get size() {
    return this.#size;
  }

  enqueue(value) {
    const node = new Node(value);

    if (this.#head) {
      this.#tail.next = node;
      this.#tail = node;
    } else {
      this.#head = node;
      this.#tail = node;
    }

    this.#size++;
  }

  dequeue() {
    const current = this.#head;
    if (!current) {
      return;
    }

    this.#head = this.#head.next;
    this.#size--;
    return current.value;
  }

  clear() {
    this.#head = undefined;
    this.#tail = undefined;
    this.#size = 0;
  }

  *[Symbol.iterator]() {
    let current = this.#head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
