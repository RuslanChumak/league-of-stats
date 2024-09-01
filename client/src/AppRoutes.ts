import { Region } from "./services/summoners";

export abstract class RouteManager {

  protected replaceRouteParams(route: string, params: Object | undefined) {
    if (!params) return route.replace(/\?[^\/]+$/, '');

    // pathToRegexp can probably help here, but moving swiftly on...
    for (let key in params) {
      route = route.replace(new RegExp(`:${key}`), params[key]);
      route = route.replace(new RegExp(`([?&]${key})\\??`), `$1=${encodeURIComponent(params[key])}`);
    }

    // replace any optionals that didnt get set, and trailing question marks / ampersands     
    route = route.replace(/\/?:[^\?:\/]*(\?(?=\/))?/g, '');
    route = route.replace(/([?&])[^\/=]*(?:&|$)/g, '$1');
    
    route = route.replace(/\?$/g, '');
    route = route.replace(/\&$/g, '');
    route = route.replace(/\?(?=\/)/g, '');    

    return route;
  }
}

export type SummonerPageTab = 'live-game' | 'match-history';
  
export class AppRouteManager extends RouteManager {
  root = () => '/';
  tierList = () => '/tier-list';
  champions = () => '/champions';
  logIn = () => '/log-in';
  register = () => '/register';
  items = () => '/items';
  settings = () => '/settings';
  featuredGames = () => '/featured-games';
  summonerPage = (params?: { summonerName: string, region: Region, tab?: SummonerPageTab }) => this.replaceRouteParams('/:region/summoners/:summonerName?tab', params);
  championPage = (params?: { championName: string }) => this.replaceRouteParams('/champions/:championName', params);
}

export const routes = new AppRouteManager();
