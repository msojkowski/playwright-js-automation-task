function generateRandomNumber(numberOfElements) {
    return Math.floor(Math.random() * numberOfElements - 1)
}

module.exports = {
    generateRandomNumber,
}