const generateIdNumber = (): number => {
  let randomNumber = ''
  for (let i = 0; i < 9; i++) {
    randomNumber += Math.floor(Math.random() * 10)
  }
  return parseInt(randomNumber)
}

export default generateIdNumber
