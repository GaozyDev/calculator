export class Base {
  value: string;
  type: string;

  constructor(value: string, type: string) {
    this.value = value;
    this.type = type;
  }

  getValue(): string {
    return this.value;
  }

  setValue(value: string): void {
    this.value = value;
  }

  getType(): string {
    return this.type;
  }

  setType(type: string): void {
    this.type = type;
  }
}