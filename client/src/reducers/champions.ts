import { isType } from "typescript-fsa";
import { Champion } from "../services/mocks";
import { Action, combineReducers } from "redux";
import { getChamionsRotationAsync, getChampionBuildAsync, getTierListAsync } from "../actions/champions";
import { Dictionary } from "../types";
import { ChampionBuild, ChampionRotation, TierList } from "../services/champion";
import champions from './../mocks/championFull.json'

export function championsByIdReducer(state: Dictionary<Champion> = champions.data) {
  return state;
}

export function championRotationByRegionReducer(state: Dictionary<ChampionRotation> = {}, action: Action) {
  if (isType(action, getChamionsRotationAsync.done)) {
    return {
      ...state,
      [action.payload.params.region!]: action.payload.result as ChampionRotation
    };
  }

  return state;
}

export function tierListReducer(state: TierList | null = null, action: Action) {
  if (isType(action, getTierListAsync.done)) {
    return action.payload.result as TierList;
  }

  return state;
}

export function buildByChampionReducer(state: Dictionary<ChampionBuild> = {}, action: Action) {
  if (isType(action, getChampionBuildAsync.done)) {
    return {
      ...state,
      [action.payload.params.championName]: action.payload.result as ChampionBuild
    }
  }

  return state;
}

export interface ChampionState {
  byId: Dictionary<Champion>;
  championRotationByRegion: Dictionary<ChampionRotation>;
  tierList: TierList | null;
  buildByChampion: Dictionary<ChampionBuild>;
}
  
export const championReducer = combineReducers<ChampionState>({
  byId: championsByIdReducer,
  championRotationByRegion: championRotationByRegionReducer,
  tierList: tierListReducer,
  buildByChampion: buildByChampionReducer
});
