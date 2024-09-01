import { Col, Row } from 'antd';
import * as React from 'react';
import ChampionRotation from './ChampionRotation';
import { Search } from './Search';

export const Home: React.FC = () => {
  return (
    <div className="home">
      <Row justify="center" align="middle"  gutter={[8, 8]}>
        <Col>
          <Search mode="home" />
        </Col>
      </Row>
      <Row justify="center" align="middle" className="champion-rotatin" gutter={[8, 8]}>
        <Col span={16}>
          <ChampionRotation />
        </Col>
      </Row>
    </div>
  );
}
