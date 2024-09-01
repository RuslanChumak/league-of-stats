import actionCreatorFactory from 'typescript-fsa';
import { asyncActionWrapper } from "../common/helpers";
import { Failure } from "../services/remoteService";
import { ChampionBuild, ChampionRotation, ChampionService, GetTierListDTO, TierList } from '../services/champion';
import { Region } from '../services/summoners';

const actionCreator = actionCreatorFactory();
const championService = new ChampionService();

export const getChamionsRotationAsync = asyncActionWrapper(actionCreator).async<{ region?: Region }, ChampionRotation | Failure>
  ('GET_CHAMPIONS_ROTATION');
export const getChamionsRotation = () =>
  getChamionsRotationAsync.run({}, async (params) => {
    const result = await championService.getChamionsRotation(params.region!);
    if ((result as Failure).status_code) throw result;
    return result;
});

export const getTierListAsync = asyncActionWrapper(actionCreator).async<GetTierListDTO, TierList | Failure>
  ('GET_TIER_LIST');
export const getTierList = (dto: GetTierListDTO) => getTierListAsync.run(dto, async () => {
  const result = await championService.getTierList(dto);
  if ((result as Failure).status_code) throw result;
  return result;
});

export const getChampionBuildAsync = asyncActionWrapper(actionCreator).async<{ championName: string }, ChampionBuild | Failure>
  ('GET_CHAMPION_BUILD');
export const getChampionBuild = (championName: string) => getChampionBuildAsync.run({ championName }, async () => {
  const result = await championService.getChampionBuild(championName);
  if ((result as Failure).status_code) throw result;
  return result;
});