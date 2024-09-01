import config from "../config";
import { Failure, RemoteService } from "./remoteService";

export interface Summoner {
  id: string;
  accountId: string;
  name: string;
  profileIconId: number;
  puuid: string;
  revisionDate: number; //last online
  summonerLevel: number;
};
export type Region = 'ru' | 'br1' | 'eun1' | 'euw1' | 'jp1' | 'kr' | 'la1' | 'la2' | 'na1' | 'oc1' | 'tr1';

export interface SummonerLeague {
  leagueI: string	;
  summonerId: string;	//Player's encrypted summonerId.
  summonerName: string;
  queueType: string;
  tier:	string;
  rank:	string;	//The player's division within a tier.
  leaguePoints:	number;	
  wins:	number;	//Winning team on Summoners Rift.
  losses:	number;	//Losing team on Summoners Rift.
  hotStreak:	boolean;
  veteran:	boolean;
  freshBlood:	boolean;
  inactive:	boolean;
}


export class SummonerService extends RemoteService {
  baseUri = config.apiBase;

  async getSummonerByName(summonerName: string, region: Region): Promise<Summoner | Failure> {
    return await this.callService<Summoner, Failure>('GET', `/summoner/by-name/${summonerName}`, { region, summonerName });
  }

  async getSummonerLeaguesBySummoner(encryptedSummonerId: string, summonerName: string, region: Region): Promise<SummonerLeague[] | Failure> {
    return await this.callService<SummonerLeague[], Failure>('GET', `/summoner/league/${encryptedSummonerId}`, { region, summonerName });
  }

  async cleareSummonerCache(summonerName: string): Promise<string | Failure> {
    return await this.callService<string, Failure>('GET', `/clear-cache/summoner/${summonerName}`);
  }
}