import { isType } from "typescript-fsa";
import { Action, combineReducers } from "redux";
import { Dictionary } from "../types";
import { ActiveMatch, GetFeaturedGamesResponse, Match, MatchTimeline } from "../services/match";
import { getActiveMatchAsync, getFeaturedGamesAsync, getMatchsAsync, getMatchTimelineAsync } from "../actions/match";
import { uniqBy } from 'lodash';

export function matchsBySummonerPuuidReducer(state: Dictionary<Match[]> = {}, action: Action) {
  if (isType(action, getMatchsAsync.done)) {
    const { params: { summonerPuuid, reset }, result } = action.payload;

    return {
      ...state,
      [summonerPuuid]: !reset ? uniqBy([
        ...state[summonerPuuid] || [],
        ...result as Match[]
      ], 'metadata.matchId') : result as Match[]
    };
  }

  return state;
}

export function matchTimelineByIdReducer(state: Dictionary<MatchTimeline> = {}, action: Action) {
  if (isType(action, getMatchTimelineAsync.done)) {
    const { params: { matchId }, result } = action.payload;

    return {
      ...state,
      [matchId]: result as MatchTimeline
    }
  }

  return state;
}

export function featuredGamesByRegionReducer(state: Dictionary<GetFeaturedGamesResponse> = {}, action: Action) {
  if (isType(action, getFeaturedGamesAsync.done)) {
    const { params: { region }, result } = action.payload;

    return {
      ...state,
      [region!]: result as GetFeaturedGamesResponse
    }
  }

  return state;
}

export function activeMatchBySummonerIdReducer(state: Dictionary<Dictionary<ActiveMatch>> = {}, action: Action) {
  if (isType(action, getActiveMatchAsync.done)) {
    const { params: { summonerId, region }, result } = action.payload;

    return {
      ...state,
      [region!]: {
        ...state[region!] || {},
        [summonerId]: result as ActiveMatch
      }
    }
  }

  if (isType(action, getActiveMatchAsync.failed)) {
    const { params: { summonerId, region } } = action.payload;

    return {
      ...state,
      [region!]: {
        ...state[region!] || {},
        [summonerId]: undefined
      }
    }
  }

  return state;
}

export interface MatchState {
  matchsBySummonerPuuid: Dictionary<Match[]>;
  matchTimelineById: Dictionary<MatchTimeline>;
  activeMatchBySummonerId: Dictionary<Dictionary<ActiveMatch | undefined>>;
  featuredGamesByRegion: Dictionary<GetFeaturedGamesResponse>;
}
  
export const matchReducer = combineReducers<MatchState>({
  matchsBySummonerPuuid: matchsBySummonerPuuidReducer,
  matchTimelineById: matchTimelineByIdReducer,
  activeMatchBySummonerId: activeMatchBySummonerIdReducer,
  featuredGamesByRegion: featuredGamesByRegionReducer
});
