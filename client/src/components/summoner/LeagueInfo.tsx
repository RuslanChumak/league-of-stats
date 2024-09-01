import { Card, Col, Row, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { SummonerLeague } from '../../services/summoners';
import platinum from '../../images/ranks-emblems/Emblem_Platinum.png';
import bronze from '../../images/ranks-emblems/Emblem_Bronze.png';
import silver from '../../images/ranks-emblems/Emblem_Silver.png';
import iron from '../../images/ranks-emblems/Emblem_Iron.png';
import gold from '../../images/ranks-emblems/Emblem_Gold.png';
import diamond from '../../images/ranks-emblems/Emblem_Diamond.png';
import master from '../../images/ranks-emblems/Emblem_Master.png';
import grandmaster from '../../images/ranks-emblems/Emblem_Grandmaster.png';
import challenger from '../../images/ranks-emblems/Emblem_Challenger.png';
import { capitalize } from 'lodash';

type P = {
  league?: SummonerLeague;
  title: string;
}

const getRankEmblem = (rank: string) => {
  switch(rank) {
    case 'bronze': return bronze;
    case 'silver': return silver;
    case 'gold': return gold;
    case 'platinum': return platinum;
    case 'diamond': return diamond;
    case 'master': return master;
    case 'grandmaster': return grandmaster;
    case 'challenger': return challenger;
    default: return iron;
  }
}

export const LeagueInfo: React.FC<P> = ({ league, title }) => {
  const cardTitle = (
    <Row justify="space-between">
      <Col><b className="league-info__title">{title}</b></Col>
      <Col>{!league && <div>Без рейтингу</div>}</Col>
    </Row>
  )
  return (
    <Card title={cardTitle} className={`league-info ${!league && 'unranked'}`}>
      {league && (
        <Row justify="space-between" align="middle">
          <Col>
            <img src={getRankEmblem(league.tier.toLowerCase())} alt={league.rank}/>
          </Col>
          <Col>
            <div className="league-info__tier">{capitalize(league.tier)} {league.rank}</div>
            <div className="league-info__lp">{league.leaguePoints} LP</div>
          </Col>
          <Col className="league-info__lp">
            <i>
              <div className="league-info__win-losses">
                {league.wins}/{league.losses} <Tooltip title="Пермоги/Поразки"><QuestionCircleOutlined /></Tooltip>
              </div>
              <div>
                {((league.wins * 100) / (league.wins + league.losses)).toFixed(2)}% <Tooltip title="Частота перемог"><QuestionCircleOutlined /></Tooltip>
              </div>
            </i>
          </Col>
        </Row>
      )}
    </Card>
  )
}
