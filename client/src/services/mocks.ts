import config from "../config";
import { Dictionary } from "../types";
import { Failure, RemoteService } from "./remoteService";

export interface GetChampionsResponse {
  type: string;
  version: number,
  data: Dictionary<Champion>;
};

export interface Champion {
  id: string;
  name: string;
  key: string;
  image: {
    sprite: string;
    full: string;
  };
  spells: ChampionSpell[];
  passive: Partial<ChampionSpell>;
};

export interface ChampionSpell {
  id: string;
  name: string;
  image: {
    sprite: string;
    full: string;
  };
  description: string;
  cooldown: number[];
}

export interface Item {
  id?: number;
  name: string;
  description: string;
  plaintext: string;
  into?: string[];
  gold: {
    base: number;
    purchasable: boolean;
    total: number;
    sell: number;
  },
  tags: string[];
  maps: {
    11: boolean;
  }
};

export interface Rune {
  id: number;
  name: string;
  icon: string;
  slots: {
    runes: {
      id: number;
      key: string;
      icon: string;
      name: string;
      shortDesc: string;
      longDesc: string;
    }[]
  }[]
};

export interface StatRune {
  id: number;
  desc: string;
  icon: string;
}

export interface SummonerSpell {
  id: string,
  name: string,
  description: string,
  maxrank: number,
  cooldown: number[],
  cooldownBurn: string,
  costBurn: string,
  key: string,
  summonerLevel: number,
  modes: string[],
  costType: string,
  maxammo: string,
  rangeBurn: string,
  resource: string;
};

export class MocksService extends RemoteService {
  baseUri = config.mocksApiBase;

  async getChampions(): Promise<GetChampionsResponse | Failure> {
    return await fetch('./champions.json').then((response) => response.json()).then((json) => json);
  }
}