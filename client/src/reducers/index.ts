import { combineReducers } from 'redux';
import { Region } from '../services/summoners';
import { Dictionary } from '../types';
import { asyncReducer, AsyncState } from './async';
import { championReducer, ChampionState } from './champions';
import { matchReducer, MatchState } from './match';
import { regionReducer } from './region';
import { summonerReducer, SummonerState } from './summoner';
import runes from '../mocks/runesReforged.json';
import items from '../mocks/item.json';
import statPerks from '../mocks/statRunes.json';
import summonerSpells from '../mocks/summoner.json';
import { Item, Rune, StatRune, SummonerSpell } from '../services/mocks';
import { keyBy } from 'lodash';
import { reducer as formReducer } from 'redux-form'
import { userReducer, UserState } from './user';

export interface AppState {
  region: Region;
  champion: ChampionState;
  summoner: SummonerState;
  match: MatchState;
  async: AsyncState;
  runes: RunesReducer;
  items: ItemsReducer;
  summonerSpellById: Dictionary<SummonerSpell>;
  user: UserState;
  form: any;
}

interface RunesReducer {
  byId: Dictionary<Rune>;
  statRunesById: Dictionary<StatRune>;
};

const runesIntital = {
  byId: keyBy(runes, 'id'),
  statRunesById: keyBy(statPerks, 'id')
};

export function runesReducer(state: RunesReducer = runesIntital) {
  return state;
}

interface ItemsReducer {
  data: Dictionary<Item>;
  groups: { id: string; MaxGroupOwnable: string; }[];
  tree: { header: string; tags: string[] }[];
}

export function itemsReducer(state: ItemsReducer = items) {
  return state;
}

export function summonerSpellByIdReducer(state: Dictionary<SummonerSpell> = summonerSpells.data) {
  return state;
}

export const rootReducer = combineReducers<AppState>({
  region: regionReducer,
  champion: championReducer,
  summoner: summonerReducer,
  match: matchReducer,
  async: asyncReducer,
  runes: runesReducer,
  items: itemsReducer,
  summonerSpellById: summonerSpellByIdReducer,
  user: userReducer,
  form: formReducer
});
