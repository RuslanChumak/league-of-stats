import { Dictionary, mapValues } from 'lodash';
import { useLocation } from 'react-router';
import React from 'react';
import { Action, ActionCreatorFactory, AsyncActionCreators } from 'typescript-fsa';
import { AppState } from '../reducers';
import { Continent } from '../services/match';
import { Region } from '../services/summoners';
import { TierList, TierListParticipant } from '../services/champion';
import { Champion } from '../services/mocks';

export const csvArrays = (obj: Object) => {
  // delete any empty arrays
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    if (Array.isArray(obj[key]) && !obj[key].length) delete obj[key];
  }
  return mapValues(obj, (val) => Array.isArray(val) ? val.join(',') : val);
};

const getIcon = (folder: string, id: string) => `https://ddragon.leagueoflegends.com/cdn/12.21.1/img/${folder}/${id}.png`;

export const getProfileIconUrl = (id) => `https://static.u.gg/assets/lol/riot_static/12.22.1/img/profileicon/${id}.png`;
export const getChampionIconUrl = (id) => `https://ddragon.leagueoflegends.com/cdn/12.21.1/img/champion/${id}`;
export const getSummonerSpellIconUrl = (id) => getIcon('spell', id);
export const getItemIconUrl = (id) => getIcon('item', id);
export const getChampionSpellIconUrl = (id) => getIcon('spell', id);
export const getChampionPassiveIconUrl = (img) => `https://ddragon.leagueoflegends.com/cdn/12.21.1/img/passive/${img}`
export const getPerkIconUrl = (icon) => `https://ddragon.canisback.com/img/${icon}`;
export const getRoleIcon = (role) => `https://static.u.gg/assets/lol/roles/${role}.svg`;

type OperationType<P, S> = (params: P, dispatch, getState: () => AppState) => Promise<S>;
type DecoratedActionCreators<P, S, E> = AsyncActionCreators<P, S, E> & { run: (params: P, operation: OperationType<P, S>, meta?) => Action<{}> & Promise<S> };
export function asyncActionWrapper(factory: ActionCreatorFactory) {
  return {
    ...factory,
    async: <P, S, E = Error>(type: string, commonMeta?: Object) => {
      const asyncAction = factory.async<P, S>(type, commonMeta);
      return {
        ...asyncAction,
        run: (params: any, operation: OperationType<P, S>, meta = {}) => async (dispatch, getState: () => AppState) => {
          const region = getState().region;
          const newParams = { ...params, region: params?.region || region } as P;

          dispatch(asyncAction.started(newParams, meta));
          try {
            const result = await operation(newParams, dispatch, getState);
            dispatch(asyncAction.done({ params: newParams, result }));
            return result;
          } catch (e) {
            dispatch(asyncAction.failed({ params: newParams, error: e }));
            throw e;
          }
        }
      } as any as DecoratedActionCreators<P, S, E>;
    }
  };
}

export const regionToContinent = (region: Region): Continent => {
  if (['na1', 'br1', 'la1', 'la2'].includes(region)) return 'americas';
  if (['jp1', 'kr1'].includes(region)) return 'asia';
  if (region === 'oc1') return 'sea';
  return 'europe';
}

export const getQueueNameById = (id: number | string) => {
  switch (id) {
    case 420:
    case 'RANKED_SOLO_5x5':
    case 4: return 'Рейтинг Одиночний/Парний';
    case 6:
    case 440:
    case 'RANKED_FLEX_SR':
    case 42: return 'Рейтинг Комадний';
    case 65:
    case 100:
    case 1900:
    case 450: return 'АРАМ';
    case 2:
    case 16:
    case 430: return 'Звичайний в сліпу';
    case 14:
    case 17:
    case 400: return 'Звичайний з вибором';
  }
}

export const calcKDA = (kills: number, deaths: number, assists: number) => deaths === 0 ? "Perfect" : ((kills + assists) / deaths).toFixed(2);

export const getLoadingState = (asyncAction: DecoratedActionCreators<{}, any, any>) => (state: AppState) => {
  const actionState = state.async.byAction[asyncAction.type];
  return actionState ? actionState.isLoading : false;
}

export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const getChampionBanCount = (championName: string, championById: Dictionary<Champion>, tierList: TierList | null) => {
  if (!tierList) return 0;

  const champ = Object.values(championById).find(({ name }) => name === championName);
  if (!champ) return 0;

  return tierList.bans[+champ.key]?.count || 0;
}
export const getPercent = (total: number, current: number) => ((current * 100) / total).toFixed(2);
export const getGrade = (row: TierListParticipant, allMatches: number, allBans: number, championById: Dictionary<Champion>, tierList: TierList | null) => {
  let grade = 0;
  const winRate = +getPercent(row.count, row.wins);
  const pickRate = +getPercent(allMatches, row.count);
  const banRate = +getPercent(allBans, getChampionBanCount(row._id, championById, tierList));

  if (winRate > 60) grade += 4;
  if (winRate > 52) grade += 3;
  else if (winRate > 50) grade += 2;
  else if (winRate > 48) grade += 1;

  if (pickRate > 2) grade += 3;
  else if (winRate > 1) grade += 2;
  // else if (winRate > 0.5) grade += 1;

  if (banRate > 3) grade += 3;
  else if (winRate > 2) grade += 2;
  else if (winRate > 1) grade += 1;

  return grade;
}

export const convertGradeToLetter = (grade: number) => {
  if (grade > 7) return 'S+';
  else if (grade >= 6) return 'S';
  else if (grade === 5) return 'A';
  else if (grade === 4) return 'B';
  else if (grade >= 1) return 'C';
  else return 'D';
}
