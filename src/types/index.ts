type RangeFromZeroToN<
  N extends number,
  T extends number[] = [],
> = T['length'] extends N ? T[number] : RangeFromZeroToN<N, [...T, T['length']]>

export type Range<From extends number, To extends number> = Exclude<
  RangeFromZeroToN<To>,
  RangeFromZeroToN<From>
>
