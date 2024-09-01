import { Action, combineReducers } from "redux";
import { isType } from "typescript-fsa";
import { getSummonerByNameAsync, getSummonerLeaguesBySummonerAsync } from "../actions/summoners";
import { Summoner, SummonerLeague } from "../services/summoners";
import { Dictionary } from "../types";

function summonerByIdReducer(state: Dictionary<Dictionary<Summoner>> = {}, action: Action) {
  if (isType(action, getSummonerByNameAsync.done)) {
    const { result, params: { region = 'na1' } } = action.payload;

    return {
      ...state,
      [region]: {
        ...state[region] || {},
        [result.name]: result
      }
    };
  }

  return state;
}

function summonerLeaguesByIdReducer(state: Dictionary<Dictionary<SummonerLeague[]>> = {}, action: Action) {
  if (isType(action, getSummonerLeaguesBySummonerAsync.done)) {
    const { result, params: { region = 'na1', id } } = action.payload;

    return {
      ...state,
      [region]: {
        ...state[region] || {},
        [id]: result as SummonerLeague[]
      }
    };
  }

  return state;
}

export interface SummonerState {
  byId: Dictionary<Dictionary<Summoner>>;
  leaguesById: Dictionary<Dictionary<SummonerLeague[]>>;
}
  
export const summonerReducer = combineReducers<SummonerState>({
  byId: summonerByIdReducer,
  leaguesById: summonerLeaguesByIdReducer
});
