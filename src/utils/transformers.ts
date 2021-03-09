export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

export class ColumnNumericArrayTransformer {
  to(data: Array<number>): Array<number> {
    return data;
  }
  from(data: Array<string>): Array<number> {
    return data ? data.map(x => parseInt(x)) : null
  }
}
