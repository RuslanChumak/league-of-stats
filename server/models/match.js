const mongoose = require('mongoose')

let matchSchema = new mongoose.Schema({
  info:{
    type: mongoose.Schema.Types.Mixed,
  },
  metadata:{
    type: mongoose.Schema.Types.Mixed,
  },
})

const Match = mongoose.model("Match", matchSchema)

module.exports = Match

