const mongoose = require('mongoose')

let schema = new mongoose.Schema({
  championName:{
    type: mongoose.Schema.Types.Mixed,
  },
  queueId: {
    type: mongoose.Schema.Types.Mixed,
  },
  platformId: {
    type: mongoose.Schema.Types.Mixed,
  },
  win: {
    type: mongoose.Schema.Types.Mixed,
  },
  perks: {
    type: mongoose.Schema.Types.Mixed,
  },
})

const Perk = mongoose.model("Perk", schema)

module.exports = Perk

