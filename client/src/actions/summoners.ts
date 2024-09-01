import { Region, Summoner, SummonerLeague, SummonerService } from "../services/summoners";
import actionCreatorFactory from 'typescript-fsa';
import { asyncActionWrapper } from "../common/helpers";
import { Failure } from "../services/remoteService";

const actionCreator = actionCreatorFactory();
const summonerSvc = new SummonerService();

export const getSummonerByNameAsync = asyncActionWrapper(actionCreator).async<{ name: string, region?: Region }, Summoner | Failure>
  ('GET_SUMMONER_BY_NAME');
export const getSummonerByName = (name: string, region?: Region) =>
  getSummonerByNameAsync.run({ name, region }, async (params) => {
    const result = await summonerSvc.getSummonerByName(name, params.region!);
    if ((result as Failure).status_code) throw result;
    return result;
  });

export const getSummonerLeaguesBySummonerAsync = asyncActionWrapper(actionCreator).async<{ id: string, region?: Region }, SummonerLeague[] | Failure>
  ('GET_SUMMONER_LEAGUES_BY_SUMMONER');
export const getSummonerLeaguesBySummoner = (id: string, name: string) =>
  getSummonerLeaguesBySummonerAsync.run({ id }, async (params) => {
    const result = await summonerSvc.getSummonerLeaguesBySummoner(id, name, params.region!);
    if ((result as Failure).status_code) throw result;
    return result;
  });

export const cleareSummonerCacheAsync = asyncActionWrapper(actionCreator).async<{ name: string }, string | Failure>
  ('CLEAR_SUMMONER_CACHE');
export const cleareSummonerCache = (name: string) => cleareSummonerCacheAsync.run({ name }, async () => {
  const result = await summonerSvc.cleareSummonerCache(name);
  if ((result as Failure).status_code) throw result;
  return result;
});
