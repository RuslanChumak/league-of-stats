import { Collapse, List, Tabs } from 'antd';
import * as React from 'react';
import { Match } from '../../../services/match';
import { ItemBuild } from './ItemBuild';
import { MatchItemHeader } from './MatchItemHeader';
import { Performance } from './Perfomance';
import { PostGame } from './PostGame';

type P = {
  summonerPuuid: string;
  match: Match;
}

export const MatchItem: React.FC<P> = ({ summonerPuuid, match: { metadata: { matchId }, info: { participants } }, match }) => {
  const participant = participants.find(({ puuid }) => puuid === summonerPuuid)!;

  return (
    <List.Item key={matchId} className={`game-history__${participant.win ? 'win' : 'loose'}`}>
      <Collapse expandIconPosition="end">
        <Collapse.Panel header={<MatchItemHeader summonerPuuid={summonerPuuid} match={match} />} key="1">
          <Tabs
            className="game-history__tabs"
            type="card"
            items={[
              {
                key: 'postGame',
                label: 'Загальна статистика',
                children: <PostGame summonerPuuid={summonerPuuid} participants={participants} />
              },
              {
                key: 'perfomance',
                label: 'Продуктивність',
                children: <Performance participants={participants} />
              },
              {
                key: 'itemBuild',
                label: 'Збірка',
                children: <ItemBuild data={participant} matchId={matchId} />
              },
            ]}
          />
        </Collapse.Panel>
      </Collapse>
    </List.Item>
  );
}
