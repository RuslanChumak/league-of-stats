import { Dictionary } from "lodash";
import config from "../config";
import { Perk } from "./match";
import { Failure, RemoteService } from "./remoteService";
import { Region } from "./summoners";

export interface ChampionRotation {
  maxNewPlayerLevel: number;	
  freeChampionIdsForNewPlayers: number[];
  freeChampionIds: number[];
};

export interface Ban {
  _id: number;
  count: number;
}

export interface TierListParticipant {
  _id: string;
  index: number;
  count: number;
  wins: number;
  wardsKilled: number;
  neutralMinionsKilled: number;
  totalMinionsKilled: number;
  turretKills: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  totalHeal: number;
  goldEarned: number;
  kills: number;
  assists: number;
  deaths: number;
  teamPosition?: TeamPosition;
  enemies: Dictionary<Enemy>;
}

export type TeamPosition = 'UTILITY' | 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM';

export interface Enemy {
  _id: string;
  count: number;
  win: number;
}

export interface TierList {
  bans: Dictionary<Ban>; //by champion key
  participants: Dictionary<TierListParticipant>; //by champion name
}

export interface GetTierListDTO {
  region?: Region;
  queueId?: number;
  teamPosition?: string;
  championName?: string;
  championId?: string;
}

export interface ChampionBuild {
  perks: Perk;
  items: number[];
  skills: number[];
}

export class ChampionService extends RemoteService {
  baseUri = config.apiBase;

  async getChamionsRotation(region: Region): Promise<ChampionRotation | Failure> {
    return await this.callService<ChampionRotation, Failure>('GET', `/champion/rotations`, { region });
  }

  async getTierList(dto: GetTierListDTO): Promise<TierList | Failure> {
    return await this.callService<TierList, Failure>('GET', `/tier-list`, dto);
  }

  async getChampionBuild(championName: string): Promise<ChampionBuild | Failure> {
    return await this.callService<ChampionBuild, Failure>('GET', `/champions/${championName}/build`);
  }
}