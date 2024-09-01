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
  skills: {
    type: mongoose.Schema.Types.Mixed,
  }
})

const Skill = mongoose.model("Skill", schema)

module.exports = Skill

