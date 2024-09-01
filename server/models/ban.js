const mongoose = require('mongoose')

let banSchema = new mongoose.Schema({
  championId:{
    type: mongoose.Schema.Types.Mixed,
  },
  pickTurn:{
    type: mongoose.Schema.Types.Mixed,
  },
  queueId: {
    type: mongoose.Schema.Types.Mixed,
  },
  platformId: {
    type: mongoose.Schema.Types.Mixed,
  },
})

const Ban = mongoose.model("Ban", banSchema)

module.exports = Ban

