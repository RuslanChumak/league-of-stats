import { regionToContinent } from "../common/helpers";
import config from "../config";
import { Failure, RemoteService } from "./remoteService";
import { Region } from "./summoners";

export interface GetMatchsDTO {
  startTime?: number;
  endTime?: number;
  queue?: number;
  type?: string;
  start?: number;
  count?: number;
};

export interface MatchMetadata {
  matchId: string;
  participants: string[];
}

export interface Match {
  metadata: MatchMetadata;
  info: {
    gameCreation: number;
    gameDuration: number;
    gameEndTimestamp: number;
    gameId: number;
    gameMode: string; //ADD queue type?
    gameName: string;
    gameStartTimestamp: number;
    gameType: string;
    gameVersion: string;
    mapId: number;
    platformId: Region;
    queueId: number; //ADD queue type?
    tournamentCode: string;
    teams: MatchTeam[];
    participants: MatchPaticipant[];
  }
}

export interface MatchTeam {

}

export interface MatchPaticipant {
  assists: number;
  baronKills: number;
  bountyLevel: number;
  champExperience: number;
  champLevel: number;
  championId: number;
  championName: string;
  championTransform: number;
  consumablesPurchased: number;
  damageDealtToBuildings: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  deaths: number;
  detectorWardsPlaced: number;
  doubleKills: number;
  dragonKills: number;
  firstBloodAssist: boolean;
  firstBloodKill: boolean;
  firstTowerAssist: boolean;
  firstTowerKill: boolean;
  gameEndedInEarlySurrender: boolean;
  gameEndedInSurrender: boolean;
  goldEarned: number;
  goldSpent: number;
  individualPosition: string;
  inhibitorKills: number;
  inhibitorTakedowns: number;
  inhibitorsLost: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  itemsPurchased: number;
  killingSprees: number;
  bot: boolean; // only for active match
  kills: number;
  lane: string;
  largestCriticalStrike: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  longestTimeSpentLiving: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  neutralMinionsKilled: number;
  nexusKills: number;
  nexusTakedowns: number;
  nexusLost: number;
  objectivesStolen: number;
  objectivesStolenAssists: number;
  participantId: number;
  pentaKills: number;
  perks: Perk;
  physicalDamageDealt: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  profileIcon: number;
  puuid: string;
  quadraKills: number;
  riotIdName: string;
  riotIdTagline: string;
  role: string;
  sightWardsBoughtInGame: number;
  spell1Casts: number;
  spell2Casts: number;
  spell3Casts: number;
  spell4Casts: number;
  summoner1Casts: number;
  summoner1Id: number;
  summoner2Casts: number;
  summoner2Id: number;
  summonerId: string;
  summonerLevel: number;
  summonerName: string;
  teamEarlySurrendered: boolean;
  teamId: number;
  teamPosition: string;
  timeCCingOthers: number;
  timePlayed: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageShieldedOnTeammates: number;
  totalDamageTaken: number;
  totalHeal: number;
  totalHealsOnTeammates: number;
  totalMinionsKilled: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
  totalUnitsHealed: number;
  tripleKills: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  turretKills: number;
  turretTakedowns: number;
  turretsLost: number;
  unrealKills: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  win:	boolean;
}

export interface MatchTimeline {
  metadata: MatchMetadata;
  info: {
    frameInterval: number;
    gameId: number;
    participants: {
      participantId: number;
      puuid: string;
    }[];
    frames: {
      events: MatchTimelineEvent[],
      participantFrames: {} // MatchTimelineParticipant
      timestamp: number;
    }[]
  }
}

export type MatchTimelineEventType = "ITEM_PURCHASED" | "SKILL_LEVEL_UP" | "WARD_PLACED" | "ITEM_DESTROYED" | "LEVEL_UP" | "ITEM_SOLD";

export interface MatchTimelineEvent {
  type: MatchTimelineEventType;
  participantId: number;
  timestamp: number;

  level?: number;
  skillSlot?: number;
  itemId?: number;
}

export type PerksStyle = 'primaryStyle' | 'subStyle';

export interface Perk {
  statPerks: {
    defense: number,
    flex: number,
    offense: number
  },
  styles: {
    description: PerksStyle,
    selections: {
      perk: number,
      var1?: number,
      var2?: number,
      var3?: number
    }[],
    style: number
  }[]
}

export interface ActiveMatchPerks {
  perkIds: number[];
  perkStyle: number;
  perkSubStyle: number;
}

export interface ActiveMatchParticipant {
  championId: number;
  perks: ActiveMatchPerks;
  profileIconId: number;
  bot: boolean;
  teamId: number;
  summonerName: string;
  summonerId: string;
  spell1Id: number;
  spell2Id: number;
}

export interface ActiveMatch {
  gameQueueConfigId: number;
  gameStartTime: number;
  gameLength: number;
  platformId: string;
  participants: ActiveMatchParticipant[];
}

export interface GetFeaturedGamesResponse {
  clientRefreshInterval: number;
  gameList: ActiveMatch[];
}

export type Continent = 'americas' | 'asia' | 'europe' | 'sea';

export class MatchService extends RemoteService {
  baseUri = config.apiBase;

  async getMatchs(summonerPuuid: string, summonerName: string, region: Region, dto: GetMatchsDTO): Promise<string[] | Failure> {
    return await this.callService<string[], Failure>('GET', `/summoner/matches/${summonerPuuid}`, { region: regionToContinent(region), ...dto, summonerName });
  }

  async getMatch(matchId: string, region: Region): Promise<Match | Failure> {
    return await this.callService<Match, Failure>('GET', `/match/${matchId}`, { region: regionToContinent(region) });
  }

  async getMatchTimeline(matchId: string, region: Region): Promise<MatchTimeline | Failure> {
    return await this.callService<MatchTimeline, Failure>('GET', `/match/${matchId}/timeline`, { region: regionToContinent(region) });
  }

  async getActiveMatch(summonerId: string, region: Region): Promise<ActiveMatch | Failure> {
    return await this.callService<ActiveMatch, Failure>('GET', `/summoner/${summonerId}/active-game`, { region });
  }

  async getFeaturedGames(region: Region): Promise<GetFeaturedGamesResponse | Failure> {
    return await this.callService<GetFeaturedGamesResponse, Failure>('GET', `/featured-games`, { region });
  }
}