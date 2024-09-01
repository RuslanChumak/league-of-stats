import { Col, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedGames, getFeaturedGamesAsync } from '../../actions/match';
import { getLoadingState } from '../../common/helpers';
import { AppState } from '../../reducers';
import { Search } from '../home/Search';
import { FeatureGame } from './FeatureGame';
import { v4 as uuidv4 } from 'uuid';

export const FeaturedGames: React.FC = () => {
  const loading = useSelector(getLoadingState(getFeaturedGamesAsync));
  const region = useSelector((state: AppState) => state.region);
  const featuredGames = useSelector((state: AppState) => state.match.featuredGamesByRegion[region]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeaturedGames());
  }, [region]);

  return (
    <div className="home">
      <Row justify="center" align="middle" gutter={[8, 8]}>
        <Col>
          <h1>Живі матчі</h1>
        </Col>
      </Row>
      <Row justify="center" align="middle" gutter={[8, 8]}>
        <Col>
          <Search mode="live-games" />
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: 30 }}>
        <Col span={16}>
          <Spin spinning={loading || !featuredGames}>
            <Row justify="center" align="middle" gutter={[8, 8]}>
              {(featuredGames?.gameList || []).map((activeMatch) => (
                <Col span={8} key={uuidv4()}>
                  <FeatureGame data={activeMatch} />
                </Col>
              ))}
            </Row>
          </Spin>
        </Col>
      </Row>
    </div>
  )
}
