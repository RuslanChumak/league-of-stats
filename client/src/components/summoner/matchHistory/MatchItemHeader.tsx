import { Col, Row, Tooltip } from 'antd';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from '../../../AppRoutes';
import { calcKDA, getChampionIconUrl, getItemIconUrl, getPerkIconUrl, getQueueNameById, getSummonerSpellIconUrl } from '../../../common/helpers';
import { AppState } from '../../../reducers';
import { Match } from '../../../services/match';
import { Item } from '../../../services/mocks';

type P = {
  summonerPuuid: string;
  match: Match;
}

export const MatchItemHeader: React.FC<P> = ({ summonerPuuid, match: { info: { queueId, gameCreation, participants, gameDuration } }}) => {
  const region = useSelector((state: AppState) => state.region);
  const championById = useSelector((state: AppState) => state.champion.byId);
  const participant = participants.find(({ puuid }) => puuid === summonerPuuid)!;
  const duration = moment.duration(gameDuration, 'seconds');
  const csInMin = ((participant.totalMinionsKilled + participant.neutralMinionsKilled) / duration.asMinutes()).toFixed(2);

  return (
    <Row gutter={[8, 8]} align="middle" justify="space-between">
      <Col span={6}>
        <div className="game-history__type">{getQueueNameById(queueId)}</div>
        <div className="game-history__created">{moment.unix(gameCreation / 1000).fromNow()}</div>
        <div className="game-history__duration">
          {participant.win ? <span className="blue">Перемога</span> : <span className="red">Поразка</span>}{' '}
          {moment.utc(duration.asMilliseconds()).format("mm:ss")}
        </div>
      </Col>
      <Col span={4} className="flex-col">
        <ParticipantChampion participant={participant as any} />
      </Col>
      <Col className="flex-col">
        <div>
          <ParticipantKDA participant={participant} />
          <div className="game-history__type">{participant.totalMinionsKilled + participant.neutralMinionsKilled} CS ({csInMin} в хв)</div>
        </div>
      </Col>
      <Col span={4} className="flex-col">
        <ParticipantItems participant={participant} />
      </Col>
      <Col span={5}>
        <Row className="game-history__participants">
          {participants.map(({ summonerName, championName, puuid }) => {
            const champion = championById[championName];
            if (!champion) return championName;

            return (
              <Link to={routes.summonerPage({ summonerName, region })} key={summonerName}>
                <img className={`game-history__small-img ${puuid === summonerPuuid && 'own-img'}`} src={getChampionIconUrl(champion.image.full)} alt={championName}/>
                <span className={`game-history__type truncate-summoner-name ${puuid === summonerPuuid && 'own-name'}`}>{summonerName}</span>
              </Link>
            )
          })}
        </Row>
      </Col>
    </Row>
  );
}

export const getItemTooltip = ({ name, description, plaintext, gold: { total, sell } }: Item) => {
  return (
    <>
      <h3 className="blue">{name}</h3>
      <p dangerouslySetInnerHTML={{ __html: description }}></p>
      <p>{plaintext}</p>
      <p className="orange">Ціна: {total} ({sell})</p>
    </>
  );
};

export const ParticipantItems = ({ participant }) => {
  const itemById = useSelector((state: AppState) => state.items.data);

  return (
    <Row>
      {[0, 1, 2, 6, 3, 4, 5].map(id => {
        const key = participant[`item${id}`];
        const item = itemById[key];

        if (!item || !key) return <Col key={id} span={6}><div className="game-history__item-placeholder" /></Col>;

        return (
          <Col span={6} key={uuidv4()}>
            <Tooltip title={getItemTooltip(item)}>
              <img className="game-history__item-image" src={getItemIconUrl(key)}/>
            </Tooltip>
          </Col>
        );
      })}
    </Row>
  )
}

export const ParticipantKDA = ({ participant }) => {
  const getKDAColor = kda => {
    if (kda === 'Perfect' || kda >= 5) return 'orange';
    if (kda >= 2) return 'blue';
    return undefined;
  }

  const kda = calcKDA(participant.kills, participant.deaths, participant.assists);

  return (
    <>
      <div className="game-history__type">{participant.kills} / <span className="deaths">{participant.deaths}</span> / {participant.assists}</div>
      <div className={`game-history__created ${getKDAColor(kda)}`}>{kda} KDA</div>
    </>
  )
}

export const ParticipantChampion = ({ participant: { championName, championId, perks, summoner1Id, summoner2Id, champLevel, spell1Id, spell2Id } }) => {
  const championById = useSelector((state: AppState) => state.champion.byId);
  const runeById = useSelector((state: AppState) => state.runes.byId);
  const summonerSpells = useSelector((state: AppState) => Object.values(state.summonerSpellById));
  
  const champion = 
    (championName && championById[championName]) ||
    (championId && Object.values(championById).find(({ key }) => +key === championId));

  if (!champion) return null;

  const getPerk = (description) => perks.styles.find((perk) => perk.description === description)!.style;
  const mainPerkParticipant = perks.styles.find((perk) => perk.description === 'primaryStyle');
  const mainPerk = runeById[mainPerkParticipant!.style].slots[0].runes.find(({ id }) => id === mainPerkParticipant!.selections[0].perk)!;
  const subPerkId = getPerk('subStyle');
  const subPerk = runeById[subPerkId];

  const { spell1, spell2 } = summonerSpells.reduce((res, spell) => {
    if ((summoner1Id || spell1Id).toString() == spell.key) return { ...res, spell1: spell };
    if ((summoner2Id || spell2Id).toString() == spell.key) return { ...res, spell2: spell };
    return res;
  }, { spell1: null, spell2: null });

  return (
    <Row align="middle" style={{ position: 'relative' }}>
      <img className="game-history__current-champion" src={getChampionIconUrl(champion.image.full)} alt={championName}/>
      {champLevel && <div className="game-history__champ-level">{champLevel}</div>}
      <Tooltip title={renderTootip(mainPerk.name, mainPerk.shortDesc)} placement="right">
        <img className="game-history__perk main-perk" src={getPerkIconUrl(mainPerk.icon)} alt={mainPerk.icon}/>
      </Tooltip>
      <Tooltip title={subPerk.name} placement="right">
        <img className="game-history__perk sub-perk" src={getPerkIconUrl(subPerk.icon)} alt={subPerk.name}/>
      </Tooltip>
      <Tooltip title={renderTootip(spell1!.name, spell1!.description)} placement="right">
        <img className="game-history__spell main-spell" src={getSummonerSpellIconUrl(spell1!.id)} alt={spell1?.name}/>
      </Tooltip>
      <Tooltip title={renderTootip(spell2!.name, spell2!.description)} placement="right">
        <img className="game-history__spell sub-spell" src={getSummonerSpellIconUrl(spell2!.id)} alt={spell2?.name}/>
      </Tooltip>
    </Row>
  )
}

export const renderTootip = (title: string, description: string) => (
  <>
    <h3 className="blue">{title}</h3>
    <p dangerouslySetInnerHTML={{ __html: description }}></p>
  </>
)
