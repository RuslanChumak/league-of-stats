import { Col, Progress, Row, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from '../../../AppRoutes';
import { AppState } from '../../../reducers';
import { MatchPaticipant } from '../../../services/match';
import { ParticipantChampion, ParticipantItems, ParticipantKDA } from './MatchItemHeader';

type P = {
  summonerPuuid: string;
  participants: MatchPaticipant[];
}

export const PostGame: React.FC<P> = ({ summonerPuuid, participants }) => {
  const region = useSelector((state: AppState) => state.region);
  const firstTeam = participants.slice(0, 5);
  const secondTeam = participants.slice(5);
  const maxDamage = Math.max(...participants.map(({ totalDamageDealtToChampions }) => totalDamageDealtToChampions));

  const getColumns = (win: boolean): ColumnType<MatchPaticipant>[] => [
    {
      title: win ? 'Перемога' : 'Поразка',
      dataIndex: 'champion',
      width: 220,
      render: (text, row) => (
        <Row>
          <Col span={12}>
            <ParticipantChampion participant={row as any} />
          </Col>
          <Col span={12}>
            <Link to={routes.summonerPage({ summonerName: row.summonerName, region })}>{row.summonerName}</Link>
          </Col>
        </Row>
      )
    },
    {
      title: 'KDA',
      dataIndex: 'kda',
      width: 100,
      align: 'left',
      render: (text, row) => <ParticipantKDA participant={row} />
    },
    {
      title: 'Пошкодження',
      dataIndex: 'totalDamageDealtToChampions',
      width: 80,
      render: (text, row) => <Row justify="center" align="middle">
        <Col className="total-damage">
          {text}
        </Col>
        <Col span={24}>
          <Progress
            strokeColor={win ? '#08d1f5' : '#E97777'}
            trailColor="white"
            strokeWidth={5}
            showInfo={false}
            percent={(text * 100) / maxDamage}
          />
        </Col>
      </Row>
    },
    {
      title: 'Золото',
      dataIndex: 'gold',
      render: (text, { goldEarned }) => <span>{(goldEarned / 1000).toFixed(1)}k</span>
    },
    {
      title: 'CS',
      dataIndex: 'cs',
      render: (text, { neutralMinionsKilled, totalMinionsKilled }) => neutralMinionsKilled + totalMinionsKilled
    },
    {
      title: 'Огляд',
      dataIndex: 'wards',
      render: (text, { visionScore }) => visionScore
    },
    {
      title: 'Предмети',
      dataIndex: 'items',
      width: 110,
      render: (text, row) => <ParticipantItems participant={row} />
    },
  ];

  return (
    <Row gutter={[8, 8]} justify="center">
      <Table
        columns={getColumns(firstTeam[0].win)}
        className={`table-${firstTeam[0].win ? 'win' : 'loose'}`}
        dataSource={firstTeam}
        rowKey={({ summonerName }) => summonerName}
        rowClassName={(row) => row.puuid === summonerPuuid ? 'selected-row' : ''}
        pagination={false}
      />
      <Table
        columns={getColumns(secondTeam[0].win)}
        className={`table-${secondTeam[0].win ? 'win' : 'loose'}`}
        rowClassName={(row) => row.puuid === summonerPuuid ? 'selected-row' : ''}
        dataSource={secondTeam}
        rowKey={({ summonerName }) => summonerName}
        pagination={false}
      />
    </Row>
  )
}