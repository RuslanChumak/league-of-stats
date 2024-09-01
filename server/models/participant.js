const mongoose = require('mongoose')

let participantSchema = new mongoose.Schema({
  championName: {
    type: mongoose.Schema.Types.Mixed,
  },
  platformId: {
    type: mongoose.Schema.Types.Mixed,
  },
  win: {
    type: mongoose.Schema.Types.Mixed,
  },
  enemy: {
    type: mongoose.Schema.Types.Mixed,
  },
  queueId: {
    type: mongoose.Schema.Types.Mixed,
  },
  teamPosition: {
    type: mongoose.Schema.Types.Mixed,
  },
  kills: {
    type: mongoose.Schema.Types.Mixed,
  },
  assists: {
    type: mongoose.Schema.Types.Mixed,
  },
  deaths: {
    type: mongoose.Schema.Types.Mixed,
  },
  damageSelfMitigated: {
    type: mongoose.Schema.Types.Mixed,
  },
  totalDamageDealtToChampions: {
    type: mongoose.Schema.Types.Mixed,
  },
  totalDamageTaken: {
    type: mongoose.Schema.Types.Mixed,
  },
  totalHeal: {
    type: mongoose.Schema.Types.Mixed,
  },
  goldEarned: {
    type: mongoose.Schema.Types.Mixed,
  },
  wardsKilled: {
    type: mongoose.Schema.Types.Mixed,
  },
  neutralMinionsKilled: { // JNG CS
    type: mongoose.Schema.Types.Mixed,
  },
  totalMinionsKilled: { // LANE CS
    type: mongoose.Schema.Types.Mixed,
  },
  turretKills: {
    type: mongoose.Schema.Types.Mixed,
  },
  damageDealtToTurrets: {
    type: mongoose.Schema.Types.Mixed,
  }
})

const Participant = mongoose.model("Participant", participantSchema)

module.exports = Participant

