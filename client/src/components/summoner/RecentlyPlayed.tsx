import { Card, Col, Row, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { Dictionary } from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from '../../AppRoutes';
import { getProfileIconUrl } from '../../common/helpers';
import { AppState } from '../../reducers';
import { Match } from '../../services/match';

type P = {
  summonerPuuid: string;
};

interface RecentlyPlayedItem {
  count: number;
  wins: number;
  summonerName: string;
  profileIcon: number;
};

export const RecentlyPlayed: React.FC<P> = ({ summonerPuuid }) => {
  const region = useSelector((state: AppState) => state.region);
  const matches = useSelector((state: AppState) => state.match.matchsBySummonerPuuid[summonerPuuid]?.slice(0, 20));
  const participants = matches && matches.reduce((res, item: Match) => [...res, ...item.info.participants], []);

  const recenltlyPlayedItems = participants && Object.values(participants.reduce((res, { win, summonerName, puuid, profileIcon }) => {
    if (puuid === summonerPuuid) return res;
    return {
      ...res,
      [summonerName]: {
        count: (res[summonerName]?.count + 1) || 1,
        wins: res[summonerName]?.wins ? (res[summonerName].wins + (win ? 1 : 0)) : (win ? 1 : 0),
        summonerName,
        profileIcon
      }
    };
  }, {} as Dictionary<RecentlyPlayedItem>)).sort((a, b) => a.count - b.count).reverse().slice(0, 10);

  const cardTitle = (
    <Row justify="space-between" align="middle">
      <Col><b className="league-info__title">Нещодавні гравці</b></Col>
      <Col style={{ fontSize: 11 }}>(Останні 20 матчів)</Col>
    </Row>
  );

  const columns: ColumnType<RecentlyPlayedItem>[] = [
    {
      title: "Гравець",
      dataIndex: 'summonerName',
      width: 30,
      render: (name, { profileIcon }) => (
        <Row align="middle" gutter={8}>
          <Col className="summoner-img-col" span={10}>
            <img src={getProfileIconUrl(profileIcon)} alt={name}/>
          </Col>
          <Col span={14}>
            <Link className="truncate-summoner-name" to={routes.summonerPage({ summonerName: name, region })}>{name}</Link>
          </Col>
        </Row>
      )
    },
    {
      title: "№",
      dataIndex: 'count',
    },
    {
      title: "W - L",
      dataIndex: 'wins/looses',
      render: (text, { wins, count }) => <span>{wins} - {count - wins}</span>
    },
    {
      title: 'Win rate',
      dataIndex: 'winrate',
      render: (text, { wins, count }) => <span>{((wins * 100) / count).toFixed(2)}%</span>
    }
  ]

  return (
    <Card title={cardTitle} className={`league-info ${(!matches || !matches.length) && 'unranked'} recently-played`}>
      <Table
        dataSource={recenltlyPlayedItems}
        columns={columns}
        rowKey={({ summonerName }) => summonerName}
        pagination={false}
      />
    </Card>
  )
}