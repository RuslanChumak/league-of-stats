import { AutoComplete, Col, Input, Row, Select, Tag } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSummonerByName } from '../../actions/summoners';
import { AppState } from '../../reducers';
import { Region, Summoner } from '../../services/summoners';
import { Failure } from '../../services/remoteService';
import { getChampionIconUrl, getProfileIconUrl } from '../../common/helpers';
import config from '../../config';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { routes } from '../../AppRoutes';
import { debounce } from 'lodash';
import { setRegion } from '../../actions/region';
import { UserOutlined } from '@ant-design/icons';

const { regions } = config;

type RouteProps = RouteComponentProps<{}>;

type OwnProps = {
  isRegister?: boolean;
  handleSelectSummoner?: (summonerName: string | undefined, region: Region) => void;
}

type P = RouteProps & OwnProps;

const HeaderSearch: React.FC<P> = ({ history, isRegister, handleSelectSummoner }) => {
  const champions = useSelector((state: AppState) => Object.values(state.champion.byId));
  const region = useSelector((state: AppState) => state.region);
  const [options, setOptions] = React.useState<{ value: string; label: JSX.Element }[]>([]);
  const [customRegion, setCustomRegion] = React.useState<Region>(region);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const dispatch = useDispatch();

  const handleChangeRegion = (value: string) => setCustomRegion(value as Region);

  const getSummoner = async (name: string): Promise<Summoner | Failure | undefined> => {
    try {
      const summoner = await dispatch(getSummonerByName(name, customRegion));
      return summoner;
    } catch (e) {
      console.error(e);
    }
  }

  const onSearch = async (value) => {
    const summoner: Summoner | Failure | undefined = value && await getSummoner(value);
    const championsOptions = !isRegister ? champions.reduce((res, { id, name, image: { full } }) => {
      if (id.toLowerCase().includes(value.toLowerCase()) || name.toLowerCase().includes(value.toLowerCase()))
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

    const summonerRegion = regions.find(({ value }) => value === customRegion)?.shortLabel.toUpperCase();

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
        value: summoner.name + (isRegister ? '' : ':Summoner')
      },
      ...championsOptions
    ] : championsOptions;

    setOptions(options);
  }

  const onSelect = (data: string) => {
    if (isRegister && handleSelectSummoner) {
      handleSelectSummoner(data, customRegion);
      setSearchValue(data);
      return;
    };

    setSearchValue('');

    const [id, type] = data.split(':');
    if (type === 'Summoner' && region !== customRegion) dispatch(setRegion(customRegion));

    const route = type === 'Summoner' ? 
      routes.summonerPage({ summonerName: id, region: customRegion, tab: 'match-history' }) :
      routes.championPage({ championName: id });
    
    history.push(route);
  };

  const regionSelect = (
    <Select value={customRegion} onSelect={handleChangeRegion} dropdownStyle={{ width: 30 }} showArrow={false}>
      {regions.map(({ value, shortLabel }) => <Select.Option key={value} value={value}>{shortLabel.toUpperCase()}</Select.Option>)}
    </Select>
  )

  return (
    <AutoComplete
      options={options}
      onSelect={onSelect}
      searchValue={searchValue}
      value={searchValue}
      onSearch={value => {
        setSearchValue(value);
        debounce(onSearch, 500)(value);
      }}
      className="header-search"
    >
      <Input
        placeholder="Введіть ім'я гравця"
        addonAfter={regionSelect}
        prefix={<UserOutlined />}
      />
    </AutoComplete>
  );
}

const decoratedComponent = withRouter(HeaderSearch);
export { decoratedComponent as HeaderSearch };
