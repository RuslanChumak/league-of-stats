import { Col, Row } from 'antd';
import { debounce, groupBy } from 'lodash';
// import { groupBy } from 'lodash';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTierList } from '../../actions/champions';
import { routes } from '../../AppRoutes';
import { getChampionIconUrl } from '../../common/helpers';
import { AppState } from '../../reducers';
import { Champion } from '../../services/mocks';
import { Filters, FiltersFormData } from './Filters';

export const Champions: React.FC = () => {
  const dispatch = useDispatch();
  const championsByLane = useSelector((state: AppState) => {
    const participants = state.champion.tierList?.participants;
    if (!participants) return {};
    return groupBy(Object.values(participants), 'teamPosition');
  });
  const champions = useSelector((state: AppState) => Object.values(state.champion.byId));
  const [currentChampions, setCurrentChampions] = useState<Champion[]>(champions);

  useEffect(() => {
    dispatch(getTierList({ queueId: 420 }));
  }, []);

  const handleFormChange = ({ teamPosition, championName }: FiltersFormData) => {
    let newChampions = champions;

    if (teamPosition !== 'all') newChampions = newChampions.filter(({ id }) => championsByLane[teamPosition].find(item => item._id === id));
    if (championName) newChampions = newChampions.filter(({ name }) => name.toLowerCase().includes(championName.toLowerCase()));

    setCurrentChampions(newChampions);
  }

  return (
    <div className="champions">
      <Row>
        <Col>
          <h1>Чемпіони</h1>
        </Col>
        <Col span={24} className="champions__list">
          <Filters onChange={debounce(handleFormChange, 500)} />
          <Row gutter={[24, 24]} justify="start">
            {currentChampions.map(champion => (
              <Col span={2} key={champion.id}>
                <Link to={routes.championPage({ championName: champion.id })}>
                  <Row justify="center">
                    <Col span={24}>
                      <Row justify="center"><img src={getChampionIconUrl(champion.image.full)} alt={champion.name}/></Row>
                    </Col>
                    <Col>{champion.name}</Col>
                  </Row>
                </Link>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}
