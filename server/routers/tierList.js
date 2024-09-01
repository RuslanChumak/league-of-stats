const express = require('express');
const router = express.Router();
const Match = require('../models/match');
const Ban = require('../models/ban');
const Perk = require('../models/perk');
const Item = require('../models/item');
const Skill = require('../models/skill');
const Participant = require('../models/participant');
const { chunk, keyBy, omitBy, isNil, groupBy, get, countBy, compact, take } = require('lodash');
const apicache = require('apicache');
const { routes, puuidsArr, config } = require('../config/config');
const cache = apicache.middleware;
const request = require("request");

const showPercent = (full, current) => console.log(`${(current * 100 / full).toFixed(3)}%`);
const regionToContinent = (region) => {
  if (['na1', 'br1', 'la1', 'la2'].includes(region)) return 'americas';
  if (['jp1', 'kr1'].includes(region)) return 'asia';
  if (region === 'oc1') return 'sea';
  return 'europe';
}

const getSkillOrder = (timeline, summonerPuuid) => {
  const { info: { participants, frames } } = timeline;
  const participantId = participants.find(({ puuid }) => puuid === summonerPuuid).participantId;
  const skillsOrder = frames.reduce((frameRes, frame) => {
    const eventSkillOrder = frame.events.reduce((eventRes, event) => {
      if (event.type === 'SKILL_LEVEL_UP' && event.participantId === participantId) return [...eventRes, event.skillSlot];
      return eventRes;
    }, []);

    return [...frameRes, ...eventSkillOrder];
  }, []);

  return skillsOrder;
}

router.get('/tier-list-fix', async (req, res) => {
  try {
    res.send('Started')

    let step = 0;

    const id = setInterval(async () => {
      const limit = 10;
      const matches = await Match.find(null, null, { skip: limit * step, limit });
      const method = routes['/match/:matchId/timeline'].method;

      matches.forEach(({ metadata: { matchId }, info: { platformId, participants, queueId } }) => {
        request(`https://${regionToContinent(platformId.toLowerCase())}.${config.apiUrl}${method({ matchId })}?api_key=${config.apiKeyValue}`, { json: true }, (err, res, body) => {
          if (err || body.status) { return console.log(body.status); }

          const skills = participants.map(item => ({
            ...item,
            platformId,
            queueId,
            skills: getSkillOrder(body, item.puuid),
            win: item.win ? 1 : 0
          }))

          Skill.create(skills);
        })
      })

      step++
      step === 139 && clearInterval(id);
      showPercent(139, step);
    }, 1000 * 12);

    // for await (const step of Array(140).keys()) {
    //   const limit = 10;
    //   const matches = await Match.find(null, null, { skip: limit * step, limit });

      // const bans = matches.reduce((res, { info: { teams, queueId, platformId } }) => ([
      //   ...res,
      //   ...teams[0].bans.map(item => ({
      //     ...item,
      //     queueId,
      //     platformId
      //   })),
      //   ...teams[1].bans.map(item => ({
      //     ...item,
      //     queueId,
      //     platformId
      //   }))
      // ]), []);

      // const participants = matches.reduce((res, { info: { platformId, participants, queueId } }) => ([
      //   ...res,
      //   ...participants.map(item => {
      //     const enemy = participants.find(participant => participant.teamPosition === item.teamPosition && participant.puuid !== item.puuid);
      //     return {
      //       ...item,
      //       platformId,
      //       queueId,
      //       win: item.win ? 1 : 0,
      //       enemy: enemy ? {
      //         championName: enemy.championName,
      //         win: item.win ? 1 : 0
      //       } : null
      //     };
      //   })
      // ]), []);

      // const perks = matches.reduce((res, { info: { platformId, participants, queueId } }) => ([
      //   ...res,
      //   ...participants.map(({ perks, championName, win }) => {
      //     return {
      //       championName,
      //       perks,
      //       platformId,
      //       queueId,
      //       win: win ? 1 : 0,
      //     };
      //   })
      // ]), []);

      // const items = matches.reduce((res, { info: { platformId, participants, queueId } }) => ([
      //   ...res,
      //   ...participants.map(({ item0, item1, item2, item3, item4, item5, win, championName }) => {
      //     return {
      //       championName,
      //       items: [item0, item1, item2, item3, item4, item5],
      //       platformId,
      //       queueId,
      //       win: win ? 1 : 0,
      //     };
      //   })
      // ]), []);

      // await Ban.create(bans);
      // await Participant.create(participants);
      // await Item.create(items);
      // await Perk.create(perks);
    //   console.log(step)
    // }
  } catch (e) {
    console.log(e)
  }
})

router.get('/tier-list', cache('1 day'), async (req, res) => {
  const { queueId, region, teamPosition, championId, championName } = req.query;
  const mainFilters = {
    platformId: region && region.toUpperCase(),
    queueId: queueId && +queueId,
    teamPosition: teamPosition || (![1900, 450].includes(+queueId) ? { $ne: "" } : null)
  };
  const banFilters = omitBy({
    ...mainFilters,
    championId: championName && championId && +championId
  }, isNil);
  const participantFilters = omitBy({
    ...mainFilters,
    championName: championId && championName
  }, isNil);

  try {
    const bans = await Ban.aggregate([
      { $match: banFilters },
      {
        $group: {
          _id: '$championId',
          count: { $sum: 1 },
          queueId: { $addToSet: '$queueId' },
          platformId: { $addToSet: '$platformId' },
        }
      }
    ]);

    const participants = await Participant.aggregate([
      { $match: participantFilters },
      { 
        $group: {
          _id: '$championName',
          count: { $sum: 1 },
          wins: { $sum: '$win' },
          wardsKilled: { $avg: '$wardsKilled' },
          neutralMinionsKilled: { $avg: '$neutralMinionsKilled' },
          totalMinionsKilled: { $avg: '$totalMinionsKilled' },
          turretKills: { $avg: '$turretKills' },
          damageDealtToTurrets: { $avg: '$damageDealtToTurrets' },
          damageSelfMitigated: { $avg: '$damageSelfMitigated' },
          totalDamageDealtToChampions: { $avg: '$totalDamageDealtToChampions' },
          totalDamageTaken: { $avg: '$totalDamageTaken' },
          totalHeal: { $avg: '$totalHeal' },
          goldEarned: { $avg: '$goldEarned' },
          kills: { $avg: '$kills' },
          assists: { $avg: '$assists' },
          deaths: { $avg: '$deaths' },
          teamPosition: { $addToSet: '$teamPosition' },
          queueId: { $addToSet: '$queueId' },
          platformId: { $addToSet: '$platformId' },
          enemies: { $push: '$enemy' }
        }
      },
      {
        $unwind: '$teamPosition'
      }
    ]);

    const changedParticipants = participants.map(participant => ({
      ...participant,
      enemies: participant.enemies.reduce((res, enemy) => {
        if (!enemy) return res;
        return {
          ...res,
          [enemy.championName]: {
            _id: enemy.championName,
            ...res[enemy.championName] || {},
            count: res[enemy.championName] ? res[enemy.championName].count + 1 : 1,
            win: res[enemy.championName] ? res[enemy.championName].count + enemy.win : enemy.win
          }
        };
      }, {})
    }))

    res.send({
      bans: keyBy(bans, '_id'),
      participants: keyBy(changedParticipants, '_id'),
    })
  } catch (e) {
    res.status(500).send(e);
  }

})

router.get('/champions/:championName/build', async (req, res) => {
  const { queueId, region } = req.query;
  const { championName } = req.params;

  const filters = { 
    $match: omitBy({ 
      platformId: region && region.toUpperCase(),
      queueId: queueId ? +queueId : { $ne: 450 },
      championName
    }, isNil)
  };

  const getGroupedStatsPerks = (all) => ['flex', 'defense', 'offense'].reduce((res, key) => {
    const byStat = groupBy(all, `perks.statPerks.${key}`);
    const stats = Object.keys(byStat);
    const mostSelectedStat = stats.length - 1;
    const mostSelected = byStat[stats.sort((a, b) => byStat[a].length - byStat[b].length)[mostSelectedStat]];

    return {
      ...res,
      [key]: get(mostSelected, `0.perks.statPerks.${key}`)
    };
  }, {})

  const getGrouped = (id, all) => {
    const byStyle = groupBy(all, `perks.styles.${id}.style`);
    const styles = Object.keys(byStyle);

    const mostSelectedStyle = styles.length - 1;
    const mostSelected = byStyle[styles.sort((a, b) => byStyle[a].length - byStyle[b].length)[mostSelectedStyle]];

    const mostSelectedPerks = [...Array(id ? 2 : 4).keys()].map(key => {
      const byPerks = groupBy(mostSelected, `perks.styles.${id}.selections.${key}.perk`);
      const perks = Object.keys(byPerks);
      const mostSelectedPerk = perks.length - 1;
      const selected = byPerks[perks.sort((a, b) => byPerks[a].length - byPerks[b].length)[mostSelectedPerk]];
      
      return { perk: get(selected, `0.perks.styles.${id}.selections.${key}.perk`) };
    });

    const formatted = {
      style: styles[mostSelectedStyle],
      description: id ? 'subStyle' : 'primaryStyle',
      selections: mostSelectedPerks
    }

    return formatted;
  }

  const startItems = [1054, 2055, 1055, 1056]
  const bootsIds = [1001, 3158, 3006, 3009, 3020, 3047, 3111, 3117];
  const groupItems = (all) => {
    const allItems = compact(all.reduce((res, { items }) => [...res, ...items], []));
    const groupByCount = countBy(allItems);
    const sorted = Object.keys(groupByCount).sort((a, b) => groupByCount[a] - groupByCount[b]).reverse();
    const boots = sorted.find(id => bootsIds.includes(+id));
    
    const notBoots = sorted.filter(id => !bootsIds.includes(+id) && !startItems.includes(+id));

    return [...take(notBoots, 6), boots];
  }

  const groupSkills = (all) => {
    const formatted = all.map(({ skills }, id) => {
      const bySkill = skills.reduce((res, skill, index) => skill !== 4 ? ({
        ...res,
        [skill]: {
          count: (res[skill].count || 0) + 1,
          order: (res[skill].count || 0) + index,
        }
      }) : res, { 1:{}, 2:{}, 3:{}, [`${id}-id`]: {} });

      const sorted = Object.keys(bySkill).sort((a, b) => {
        if (!bySkill[a].count || !bySkill[b].count) return 0;
        if (bySkill[a].count === bySkill[b].count) return bySkill[a].order === bySkill[b].order;
        return bySkill[a].count - bySkill[b].count;
      }).join('-');
      return sorted;
    })

    const grouped = groupBy(formatted.map(item => {
      const slices = item.split('-');
      return {
        id: slices[3],
        pattern: [slices[0], slices[1], slices[2]].join('-')
      };
    }), 'pattern');

    const maxLengthPattern = Math.max(...Object.keys(grouped).map(key => grouped[key].length));
    const patterns = Object.values(grouped).find(arr => arr.length == maxLengthPattern);
    const withMaxLength = patterns.reduce((res, { id }) => {
      if (all[id].skills > res.length) return all[id].skills;
      return res;
    }, all[patterns[0].id].skills);

    return withMaxLength;
  }

  try {
    const allPerks = await Perk.aggregate([filters]);
    const allItems = await Item.aggregate([filters]);
    const allSkills = await Skill.aggregate([filters]);

    const primaryStyle = getGrouped(0, allPerks);
    const subStyle = getGrouped(1, allPerks);
    const statPerks = getGroupedStatsPerks(allPerks);
    const perks = {
      statPerks,
      styles: [primaryStyle, subStyle]
    };

    const items = groupItems(allItems);
    const skills = groupSkills(allSkills);

    res.send({ skills, items, perks });
  } catch (e) {
    console.log(e)
    res.status(500).send(e);
  }

})

router.get('/tier-list/update', async (req, res) => {
  res.status(200).json({ message: 'Load started' });

  const idsMethod = routes['/summoner/matches/:summonerPuuid'].method;
  const matchMethod = routes['/match/:matchId'].method;
  let puuidIndex = 0;

  const puuidIntervalId = setInterval(() => {
    const { region, puuid } = puuidsArr[puuidIndex];
    request(`https://${region}.${config.apiUrl}${idsMethod({ summonerPuuid: puuid })}?count=99&api_key=${config.apiKeyValue}`, { json: true }, (err, res, body) => {
      if (err || body.status) { return console.log(body.status); }
      const chunks = chunk(body, 19);
      let index = 0;

      const intervalId = setInterval(() => {
        chunks[index].map((matchId) => {
          request(`https://${region}.${config.apiUrl}${matchMethod({ matchId })}?api_key=${config.apiKeyValue}`, { json: true }, async (err, res, body) => {
            if (err || body.status) { return console.log(body.status); }
            const bans = [body].reduce((res, { info: { teams, queueId, platformId } }) => ([
              ...res,
              ...teams[0].bans.map(item => ({
                ...item,
                queueId,
                platformId
              })),
              ...teams[1].bans.map(item => ({
                ...item,
                queueId,
                platformId
              }))
            ]), []);

            const participants = [body].reduce((res, { info: { platformId, participants, queueId } }) => ([
              ...res,
              ...participants.map(item => {
                const enemy = participants.find(participant => participant.teamPosition === item.teamPosition && participant.puuid !== item.puuid);
                return {
                  ...item,
                  platformId,
                  queueId,
                  win: item.win ? 1 : 0,
                  enemy: enemy ? {
                    championName: enemy.championName,
                    win: item.win ? 1 : 0
                  } : null
                };
              })
            ]), []);

            const perks = [body].reduce((res, { info: { platformId, participants, queueId } }) => ([
              ...res,
              ...participants.map(({ perks, championName, win }) => {
                return {
                  championName,
                  perks,
                  platformId,
                  queueId,
                  win: win ? 1 : 0,
                };
              })
            ]), []);
      
            const items = [body].reduce((res, { info: { platformId, participants, queueId } }) => ([
              ...res,
              ...participants.map(({ item0, item1, item2, item3, item4, item5, win, championName }) => {
                return {
                  championName,
                  items: [item0, item1, item2, item3, item4, item5],
                  platformId,
                  queueId,
                  win: win ? 1 : 0,
                };
              })
            ]), []);

            await Ban.create(bans);
            await Participant.create(participants);
            await Item.create(items);
            await Perk.create(perks);
          });
        });

        chunks.length !== (index + 1) ? index++ : clearInterval(intervalId);
      }, 1100)
    });

    showPercent(puuidsArr.length, puuidIndex + 1);
    puuidsArr.length !== (puuidIndex + 1) ? puuidIndex++ : clearInterval(puuidIntervalId);
  }, 60 * 2 * 1000) // 2 mins
});

module.exports = router
