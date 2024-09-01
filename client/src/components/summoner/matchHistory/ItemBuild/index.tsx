import { Divider } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMatchTimeline } from '../../../../actions/match';
import { AppState } from '../../../../reducers';
import { MatchPaticipant } from '../../../../services/match';
import { Items } from './Items';
import { Runes } from './Runes';
import { SkillOrder } from './SkillOrder';

type P = {
  data: MatchPaticipant;
  matchId: string;
}

export const ItemBuild: React.FC<P> = ({ data, matchId }) => {
  const dispatch = useDispatch();
  const timeline = useSelector((state: AppState) => state.match.matchTimelineById[matchId]);

  const fetchMatchTimeline = debounce(async () => {
    try {
      await dispatch(getMatchTimeline(matchId));
    } catch (e) {
      console.error(e);
    }
  })

  useEffect(() => {
    fetchMatchTimeline();
  }, []);

  return (
    <div className="item-bluid">
      <Divider />
      <h3 className="league-info__title">Руни</h3>
      <Runes data={data.perks} />
      <Divider />
      <h3 className="league-info__title">Порядок Здібностей</h3>
      <SkillOrder timeline={timeline} summonerPuuid={data.puuid} championName={data.championName} />
      <Divider />
      <h3 className="league-info__title">Предмети</h3>
      <Items timeline={timeline} summonerPuuid={data.puuid} />
    </div>
  )
}