export const isDefined = <T>(argument: T | undefined): argument is T => {
  return argument !== undefined
}
