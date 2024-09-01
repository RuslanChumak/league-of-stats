import { Region } from "../services/summoners";
import actionCreatorFactory from 'typescript-fsa';
import { asyncActionWrapper } from "../common/helpers";
import { Failure } from "../services/remoteService";
import { ActiveMatch, GetFeaturedGamesResponse, GetMatchsDTO, Match, MatchService, MatchTimeline } from "../services/match";

const actionCreator = actionCreatorFactory();
const matchSvc = new MatchService();

export const getMatchsAsync = asyncActionWrapper(actionCreator).async<{ summonerPuuid: string, dto: GetMatchsDTO, region?: Region, reset?: boolean }, Match[] | Failure>
  ('GET_MATCHS');
export const getMatchs = (summonerPuuid: string, summonerName: string, dto: GetMatchsDTO, reset?: boolean) => getMatchsAsync.run({ summonerPuuid, dto, reset }, async (params) => {
  const matchIds = await matchSvc.getMatchs(summonerPuuid, summonerName, params.region!, dto);
  if ((matchIds as Failure).status_code) throw matchIds;
  const matchs: Match[] = [];

  for await (const matchId of matchIds as string[]) {
    const match = await matchSvc.getMatch(matchId, params.region!);
    if (!(match as Failure).status_code) matchs.push(match as Match);
  }

  return matchs;
});

export const getMatchTimelineAsync = asyncActionWrapper(actionCreator).async<{ matchId: string, region?: Region }, MatchTimeline | Failure>
  ('GET_MATCH_TIMELINE');
export const getMatchTimeline = (matchId: string) => getMatchTimelineAsync.run({ matchId }, async (params) => {
  const res = await matchSvc.getMatchTimeline(matchId, params.region!);
  if ((res as Failure).status_code) throw res;
  return res;
});

export const getActiveMatchAsync = asyncActionWrapper(actionCreator).async<{ summonerId: string, region?: Region }, ActiveMatch | Failure>
  ('GET_ACTIVE_MATCH');
export const getActiveMatch = (summonerId: string) => getActiveMatchAsync.run({ summonerId }, async (params) => {
  const res = await matchSvc.getActiveMatch(summonerId, params.region!);
  if ((res as Failure).status_code) throw res;
  return res;
});

export const getFeaturedGamesAsync = asyncActionWrapper(actionCreator).async<{ region?: Region }, GetFeaturedGamesResponse | Failure>
  ('GET_FEATURED_GAMES');
export const getFeaturedGames = () => getFeaturedGamesAsync.run({}, async (params) => {
  const res = await matchSvc.getFeaturedGames(params.region!);
  if ((res as Failure).status_code) throw res;
  return res;
});
