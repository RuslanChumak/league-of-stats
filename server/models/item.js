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
  items: {
    type: mongoose.Schema.Types.Mixed,
  }
})

const Item = mongoose.model("Item", schema)

module.exports = Item

