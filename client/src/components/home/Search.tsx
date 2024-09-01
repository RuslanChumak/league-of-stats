import { AutoComplete, Col, Radio, Row, Tag, Tooltip } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSummonerByName } from '../../actions/summoners';
import { AppState } from '../../reducers';
import { Region, Summoner } from '../../services/summoners';
import { Failure } from '../../services/remoteService';
import { getChampionIconUrl, getProfileIconUrl } from '../../common/helpers';
import config from '../../config';
import { setRegion } from '../../actions/region';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { routes } from '../../AppRoutes';
import { debounce } from 'lodash';
import { getActiveMatch } from '../../actions/match';

const { regions } = config;

type OwnProps = {
  mode: 'home' | 'live-games';
};

type RouteProps = RouteComponentProps<{}>;

type P = OwnProps & RouteProps;

const Search: React.FC<P> = ({ history, mode }) => {
  const champions = useSelector((state: AppState) => Object.values(state.champion.byId));
  const region = useSelector((state: AppState) => state.region);
  const [options, setOptions] = React.useState<{ value: string; label: JSX.Element }[]>([]);
  const dispatch = useDispatch();

  const handleChangeRegion = (value: string) => dispatch(setRegion(value as Region));

  const getSummoner = async (name: string): Promise<Summoner | Failure | undefined> => {
    try {
      const summoner = await dispatch(getSummonerByName(name));
      mode === 'live-games' && await dispatch(getActiveMatch(summoner.id));
      return summoner;
    } catch (e) {
      console.error(e);
    }
  }

  const onSearch = async (searchText: string) => {
    const summoner: Summoner | Failure | undefined = await getSummoner(searchText);
    const championsOptions = mode === 'home' ? champions.reduce((res, { id, name, image: { full } }) => {
      if (id.toLowerCase().includes(searchText.toLowerCase()) || name.toLowerCase().includes(searchText.toLowerCase()))
        return [...res, { value: id + ':Champion', label: (
          <div className="search-option">
            <Row align="middle" gutter={8}>
              <Col>
                <img alt={id} src={getChampionIconUrl(full)} />
              </Col>
              <Col>
                {name} (Чемпіон)
              </Col>
            </Row>
          </div>
        )}];
      return res;
    }, []) : [];

    const summonerRegion = regions.find(({ value }) => value === region)?.shortLabel.toUpperCase();

    const options = summoner ? [
      { 
        label: (
          <div className="search-option">
            <Row justify="space-between" align="middle">
              <Col>
                <Row gutter={8} align="middle">
                  <Col style={{ marginBottom: -4 }}>
                    <img alt={summoner.profileIconId} src={getProfileIconUrl(summoner.profileIconId)} />
                  </Col>
                  <Col>
                    {summoner.name} 
                  </Col>
                  <Col className="search-option__lvl">
                    {summoner.summonerLevel} lvl
                  </Col>
                </Row>
              </Col>
              <Col><Tag color="#001027">{summonerRegion}</Tag></Col>
            </Row>
             
          </div>
        ),
        value: summoner.name + ':Summoner'
      },
      ...championsOptions
    ] : championsOptions;

    setOptions(options);
  }

  const onSelect = (data: string) => {
    const [id, type] = data.split(':');
    const route = type === 'Summoner' ? 
      routes.summonerPage({ summonerName: id, region, tab: mode === 'home' ? 'match-history' : 'live-game' }) :
      routes.championPage({ championName: id });
    
    history.push(route);
  };

  return (
    <div>
      <Col span={24} className="autocomplete-col">
        <Row justify="center" gutter={[24, 24]}>
          {mode === 'home' && <Col><div className="home-art"></div></Col>}
          <Col span={24}>
            <Row justify="center">
              <Col>
                <AutoComplete
                  options={options}
                  onSelect={onSelect}
                  onSearch={debounce(onSearch, 500)}
                  placeholder="Введіть ім'я гравця чи чемпіона"
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Radio.Group
              value={region}
              optionType="button"
              buttonStyle="solid"
              onChange={({ target: { value } }) => handleChangeRegion(value)}
            >
              {regions.map(({ shortLabel, value, label }) => (
                <Tooltip title={label} key={value}>
                  <Radio value={value}>{shortLabel.toUpperCase()}</Radio>
                </Tooltip>
              ))}
            </Radio.Group>
          </Col>
        </Row>
      </Col>
    </div>
  );
}

const decoratedComponent = withRouter(Search);
export { decoratedComponent as Search };
