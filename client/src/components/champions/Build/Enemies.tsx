import { Col, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from '../../../AppRoutes';
import { getChampionIconUrl, getPercent } from '../../../common/helpers';
import { AppState } from '../../../reducers';
import { Enemy, TierListParticipant } from '../../../services/champion';
import { Dictionary } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

type P = {
  participant: TierListParticipant;
  isStrong?: boolean;
}

export const Enemies: React.FC<P> = ({ participant: { enemies, _id }, isStrong = false }) => {
  const championById = useSelector((state: AppState) => state.champion.byId);
  const filteredEnemies = Object.values(enemies as Dictionary<Enemy>)
    .filter(({ count }) => count > 5)
    .sort((a, b) => +getPercent(a.count, a.win) - +getPercent(b.count, b.win));
  const sortedEnemies = isStrong ? filteredEnemies : filteredEnemies.reverse();

  return (
    <Row gutter={[8, 8]} className="row">
      {[...Array(10).keys()].map(id => {
        const enemy = sortedEnemies[id];
        if (!enemy) return null;

        const winRate = getPercent(enemy.count, enemy.win);
        const enemyChamp = championById[enemy._id];
        const rowChamp = championById[_id];

        if (!enemyChamp || !rowChamp) return null;

        const enemyImg = <img src={getChampionIconUrl(enemyChamp.image.full)} alt={enemyChamp.name}/>;

        return (
          <Col span={3} key={uuidv4()}>
            <Row justify="center" className="champion-page__enemies">
              <Col span={24}>
                <Row justify="center">{enemyImg}</Row>
              </Col>
              <Col span={24}>
                <Link to={routes.championPage({ championName: enemy._id })}>{enemy._id}</Link>
              </Col>
              <Col span={24}>{(100 - +winRate).toFixed(2)}%</Col>
            </Row>
          </Col>
        );
      })}
    </Row>
  );
}
