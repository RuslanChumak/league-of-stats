import React from 'react';
import { Provider } from 'react-redux'
import { store } from './store';
import { Switch, BrowserRouter, Route } from 'react-router-dom'
import { App } from './components/App';
import { Home } from './components/home';
import { routes } from './AppRoutes';
import SummonerPage from './components/summoner';
import moment from 'moment';
import 'moment/locale/uk';
import { TierList } from './components/tierList';
import { FeaturedGames } from './components/featuredGames';
import { Champions } from './components/champions';
import { ChampionPage } from './components/champions/Build';
import { Items } from './components/Items';
import { LogIn } from './components/authentication/LogIn';
import { Register } from './components/authentication/Register';
import { RedirectIfAutheticated } from './components/authentication/RedirectIfAutheticated';
import { Wrapper } from './components/Wrapper';
import { RequireAuthetication } from './components/authentication/RequireAuthetication';
import { Settings } from './components/settings';

moment.locale('uk');

function Main() {
  return (
    <Provider store={store}>
        <BrowserRouter>
          <Wrapper>
            <Route path={routes.logIn()} children={<RedirectIfAutheticated children={<LogIn />} />} />
            <Route path={routes.register()} children={<RedirectIfAutheticated children={<Register />} />} />
            <App>
              <Switch>
                <Route path={routes.settings()} children={<RequireAuthetication children={<Settings />} />} />
                <Route path={routes.summonerPage()} children={<SummonerPage />} />
                <Route path={routes.tierList()} children={<TierList />} />
                <Route path={routes.championPage()} children={<ChampionPage />} />
                <Route path={routes.champions()} children={<Champions />} />
                <Route path={routes.items()} children={<Items />} />
                <Route path={routes.featuredGames()} children={<FeaturedGames />} />
                <Route exact path={routes.root()} children={<Home />} />
              </Switch>
            </App>
        </Wrapper>
      </BrowserRouter>
    </Provider>
  );
}

export default Main;
