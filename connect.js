const mongoose = require('mongoose')

const connect = async (url) => {
  try {
    await mongoose.connect(url)
    console.log('Connected to DB !')
  } catch (error) {
    console.log({
      message: 'Connect Fail !',
      error: error.message,
    })
  }
}

module.exports = {connect}
