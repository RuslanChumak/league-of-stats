import { Button, Card, Col, List, Progress, Row, Spin } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMatchs, getMatchsAsync } from '../../../actions/match';
import { calcKDA, getChampionIconUrl } from '../../../common/helpers';
import { AppState } from '../../../reducers';
import { debounce } from 'lodash';
import { MatchItem } from './MatchItem';

const LIMIT = 20;

type P = {
	summonerPuuid: string;
  summonerName: string;
}

interface Pagination {
  count: number;
  start: number;
};

export const MatchHistory: React.FC<P> = ({ summonerPuuid, summonerName }) => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = React.useState<Pagination>({ count: LIMIT, start: 0 });
  const matchs = useSelector((state: AppState) => state.match.matchsBySummonerPuuid[summonerPuuid]) || [];
  const loading = useSelector((state: AppState) => state.async.byAction[getMatchsAsync.type]?.isLoading) || false;
  const championById = useSelector((state: AppState) => state.champion.byId);

  const getMatchsBySummoner = debounce(async () => {
    if (loading || !summonerPuuid) return;

    try {
      await dispatch(getMatchs(summonerPuuid, summonerName, { ...pagination }));
    } catch (e) {
      console.error(e);
    }
  }, 500)

  React.useEffect(() => {
    getMatchsBySummoner();
  }, [pagination]);

  const loadMore = (
    <Row justify="center" >
      {loading ? <Spin spinning={!!matchs.length} /> : <Button onClick={() => setPagination({ count: LIMIT, start: pagination.start + LIMIT })}>Завантажити ще</Button>}
    </Row>
  );

  const { wins, kills, deaths, assists, champions } = matchs.reduce((res, { info: { participants } }, id) => {
    if (id >= 19) return res;
    const participant = participants.find(({ puuid }) => puuid === summonerPuuid)!;
    const getPrevValue = (field: string) => res.champions[participant.championName]?.[field] || 0;

    return {
      wins: participant.win ? res.wins + 1 : res.wins,
      kills: res.kills + participant.kills,
      deaths: res.deaths + participant.deaths,
      assists: res.assists + participant.assists,
      champions: {
        ...res.champions,
        [participant.championName]: {
          championName: participant.championName,
          count: getPrevValue('count') + 1,
          wins: participant.win ? getPrevValue('wins') + 1 : getPrevValue('wins'),
          kills: getPrevValue('kills') + participant.kills,
          deaths: getPrevValue('deaths') + participant.deaths,
          assists: getPrevValue('assists') + participant.assists,
        }
      }
    }
  }, { wins: 0, kills: 0, deaths: 0, assists: 0, champions: {} });
  const winRate = +((100 * wins) / 20).toFixed(2);
  const lastKda = calcKDA(kills, deaths, assists);
  const mostPlayedChamps = Object.values(champions).sort((a: { count: number }, b: { count: number }) => a.count - b.count).reverse();

  return (
    <Row className="game-history">
      <Card className="league-info">
        <Spin spinning={loading && !matchs.length}>
          {!!matchs.length && (
            <Row gutter={[8, 8]} style={{ marginBottom: 20 }} align="middle">
              <Col>
                <Progress
                  width={40}
                  strokeWidth={30}
                  showInfo={false}
                  strokeColor="#E97777"
                  percent={100}
                  success={{ percent: winRate, strokeColor: '#08d1f5' }}
                  type="circle"
                />
              </Col>
              <Col span={3}>
                <div className="game-history__type">{winRate}% Перемог</div>
                <div className="game-history__created">Останні 20 ігор</div>
              </Col>
              <Col span={3}>
                <div className="game-history__type">{lastKda} KDA</div>
                <div className="game-history__created">{+(kills / 20).toFixed(1)} / {+(deaths / 20).toFixed(1)} / {+(assists / 20).toFixed(1)}</div>
              </Col>
              {mostPlayedChamps.map(({ championName, kills, assists, deaths, wins, count }, id) => {
                if (id > 2) return null;
                const champion = championById[championName];

                return (
                  <Col span={5} key={championName}>
                    <Row align="middle" gutter={[8, 8]}>
                      <Col>
                        <img className="game-history__current-champion" src={getChampionIconUrl(champion.image.full)} alt={championName}/>
                      </Col>
                      <Col>
                        <div className="game-history__type">{((wins * 100) / count).toFixed(0)}% ({wins}/{count - wins})</div>
                        <div className="game-history__created">{+(kills / count).toFixed(1)} / {+(deaths / count).toFixed(1)} / {+(assists / count).toFixed(1)}</div>
                      </Col>
                    </Row>
                  </Col>
                )
              })}
            </Row>
          )}
          <List
            dataSource={matchs}
            itemLayout="horizontal"
            loadMore={loadMore}
            renderItem={match => <MatchItem match={match} summonerPuuid={summonerPuuid} />}
          />
        </Spin>
      </Card>
    </Row>
  );
};
