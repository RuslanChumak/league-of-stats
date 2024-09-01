import { Button, Col, Empty, Progress, Row, Spin, Table } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveMatchAsync } from '../../../actions/match';
import { getLoadingState, getQueueNameById } from '../../../common/helpers';
import { ActiveMatch, ActiveMatchParticipant, ActiveMatchPerks, Perk } from '../../../services/match';
import moment from 'moment';
import { ColumnType } from 'antd/lib/table';
import { ParticipantChampion } from '../matchHistory/MatchItemHeader';
import { Link } from 'react-router-dom';
import { routes } from '../../../AppRoutes';
import { AppState } from '../../../reducers';
import { getSummonerLeaguesBySummoner } from '../../../actions/summoners';
import { Runes } from '../matchHistory/ItemBuild/Runes';

type P = {
  activeMatch?: ActiveMatch;
  updateData: () => void;
}

export const ActiveMatchTable: React.FC<P> = ({ activeMatch, updateData }) => {
  const region = useSelector((state: AppState) => state.region);
  const loading = useSelector(getLoadingState(getActiveMatchAsync));
  const leagueBySummoner = useSelector((state: AppState) => state.summoner.leaguesById[state.region]);
  const dispatch = useDispatch();

  const convertActivePerks = ({ perkIds, perkStyle, perkSubStyle }: ActiveMatchPerks): Perk => ({
    statPerks: { flex: perkIds[7], offense: perkIds[6], defense: perkIds[8] },
    styles: [
      {
        description: 'primaryStyle',
        style: perkStyle,
        selections: perkIds.slice(0, 4).map(perk => ({ perk }))
      },
      {
        description: 'subStyle',
        style: perkSubStyle,
        selections: perkIds.slice(4, 6).map(perk => ({ perk }))
      }
    ]
  });

  useEffect(() => {
    activeMatch?.participants.map(({ summonerId, bot, summonerName }) => {
      if (bot || loading || (leagueBySummoner && leagueBySummoner[summonerId])) return;
      dispatch(getSummonerLeaguesBySummoner(summonerId, summonerName));
    })
  }, [activeMatch])

  if (!activeMatch) return <Empty className="empty-dark" description="Наразі немає активного матчу" />;
  if (loading) return <Spin spinning ><Row justify="center" style={{ minHeight: 300}}></Row></Spin>;

  const { gameStartTime, gameQueueConfigId } = activeMatch;
  const startTime = moment.unix(gameStartTime / 1000);
  const duration = moment.duration(moment().diff(startTime));

  const columns: ColumnType<ActiveMatchParticipant>[] = [
    {
      title: 'Чемпіон',
      key: 'champ',
      render: (text, row: ActiveMatchParticipant) => {
        const participant = {
          ...row,
          perks: convertActivePerks(row.perks)
        }
        return (
          <Row gutter={8} align="top">
            <Col flex="90px">
              <ParticipantChampion participant={participant as any} />
            </Col>
            <Col>
              <Link to={routes.summonerPage({ summonerName: row.summonerName, region })}>{row.summonerName}</Link>
            </Col>
          </Row>
        );
      }
    },
    {
      title: 'Ранг',
      key: 'rank',
      align: 'center',
      render: (text, { summonerId }: ActiveMatchParticipant) => {
        const league = leagueBySummoner?.[summonerId]?.find(({ queueType }) => queueType === 'RANKED_SOLO_5x5');
        if (!league) return 'Без рейтингу';

        const tier = league.tier[0].toLowerCase();
        return <span className={`tier-${tier}`}>{`${league.tier} ${league.rank} / ${league.leaguePoints} LP`}</span>
      }
    },
    {
      title: '% Перемог',
      key: 'winRate',
      align: 'center',
      render: (text, { summonerId, teamId }: ActiveMatchParticipant) => {
        const league = leagueBySummoner?.[summonerId]?.find(({ queueType }) => queueType === 'RANKED_SOLO_5x5');
        if (!league) return 'Без рейтингу';

        const winRate = (league.wins * 100) / (league.wins + league.losses);
        return (
          <Row justify="center">
            <Col>{winRate.toFixed(2)}% / {league.wins}W {league.losses}L</Col>
            <Col span={24}>
              <Progress trailColor="white" strokeColor={teamId === 100 ? '#08d1f5' : '#E97777'} percent={winRate} showInfo={false} />
            </Col>
          </Row>
        );
      }
    },
    Table.EXPAND_COLUMN,
  ]

  return ( 
    <Row justify="space-between" className="active-match game-history" gutter={[8, 8]} align="middle">
      <Col className="active-match__time-queue">
        {moment.utc(duration.asMilliseconds()).format("mm:ss")} {getQueueNameById(gameQueueConfigId)}
      </Col>
      <Col>
        <Button type="primary" onClick={updateData}>Обновити</Button>
      </Col>
      <Col span={24}>
        <Table
          columns={columns}
          dataSource={activeMatch.participants}
          pagination={false}
          rowKey={({ summonerName }) => summonerName}
          rowClassName={({ teamId }) => teamId === 100 ? 'blue' : 'red'}
          expandable={{
            columnTitle: 'Руни',
            expandedRowRender: (record) => <Runes data={convertActivePerks(record.perks)} />
          }}
          bordered
        />
      </Col>
    </Row>
  );
}
