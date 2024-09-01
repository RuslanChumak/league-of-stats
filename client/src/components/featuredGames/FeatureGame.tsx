import { Card, Col, Row } from 'antd';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from '../../AppRoutes';
import { getChampionIconUrl, getProfileIconUrl, getQueueNameById } from '../../common/helpers';
import { AppState } from '../../reducers';
import { ActiveMatch, ActiveMatchParticipant } from '../../services/match';
import { Champion } from '../../services/mocks';
import { Region } from '../../services/summoners';

type P = {
  data: ActiveMatch;
};

// 0 - 5 = 0
// 1 - 6 = 1
// 2 - 7 = 2

const getNameImg = ({ summonerName, championId, bot, profileIconId }: ActiveMatchParticipant, region: Region, champions: Champion[]) => {
  const champion = champions.find(({ key }) => +key === championId)!;
  const name = (
    <Col>
      <div className="truncate-name">
        {!bot ? (
          <Link to={routes.summonerPage({ summonerName, region, tab: 'live-game' })}>{summonerName}</Link>
        ) : champion.name}
      </div>
      <div className="truncate-name">
        {bot ? 'Бот' : champion.name}
      </div>
    </Col>
  );

  const image = (
    <Col>
      <img src={bot ? getChampionIconUrl(champion.image.full) : getProfileIconUrl(profileIconId)}/>
    </Col>
  );

  return { name, image };
}

export const FeatureGame: React.FC<P> = ({ data: { gameQueueConfigId, participants, platformId } }) => {
  const champions = useSelector((state: AppState) => Object.values(state.champion.byId));
  const region = platformId.toLowerCase() as Region;

  return (
    <Card className="league-info feature-game" title={getQueueNameById(gameQueueConfigId)}>
      {[...Array(5).keys()].map(index => {
        const first = getNameImg(participants[index], region, champions);
        const second = getNameImg(participants[index + 5], region, champions);

        return (
          <Row gutter={[16, 16]} key={uuidv4()}>
            <Col span={12}>
              <Row align="middle" justify="end" className="feature-game__first" gutter={[8, 8]}>
                {first.name}
                {first.image}
              </Row>
            </Col>
            <Col span={12}>
              <Row align="middle" className="feature-game__second" gutter={[8, 8]}>
                {second.image}
                {second.name}
              </Row>
            </Col>
          </Row>
        );
      })}
    </Card>
  );
};
