export const isString = (str: any) => {
  return typeof str === 'string' ? `'${str}'` : str
}
