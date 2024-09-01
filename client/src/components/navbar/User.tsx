import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, Row } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logOut } from '../../actions/user';
import { routes } from '../../AppRoutes';
import { getProfileIconUrl } from '../../common/helpers';
import { AppState } from '../../reducers';

export const User: React.FC = () => {
  const auth = useSelector((state: AppState) => state.user.authetication);
  const summoner = useSelector((state: AppState) => auth && state.summoner.byId[auth.region]?.[auth.summonerName]);
  const history = useHistory();
  const dispatch = useDispatch();

  const toSummonerPage = () => auth && history.push(routes.summonerPage({ summonerName: auth.summonerName, region: auth.region }));
  const toSettings = () => history.push(routes.settings());
  const handleLogout = async () => {
    try {
      await dispatch(logOut());
    } catch (e) {
      console.error(e);
    }
  }

  if (!auth || !summoner) return (
    <div className="navbar__user">
      <Row gutter={[4, 4]}>
        <Col span={24} className="navbar__user__guest">
          Гість
        </Col>
        <Col span={24} className="navbar__user__log-in">
          <Link to={routes.logIn()}>Увійти</Link>
        </Col>
      </Row>
    </div>
  );

  const menu = (
    <Menu
      className="pref"
      items={[
        {
          key: '2',
          label: (
            <div onClick={toSettings}><SettingOutlined /> Налаштування</div>
          ),
        },
        {
          key: '1',
          label: (
            <div onClick={handleLogout}><LogoutOutlined /> Вийти</div>
          ),
        },
      ]}
    />
  )

  return (
    <div className="navbar__user">
      <Row gutter={[8, 8]} className="navbar__user__row" align="middle">
        <Col>
          <img src={getProfileIconUrl(summoner.profileIconId)} />
        </Col>
        <Col onClick={toSummonerPage} className="navbar__user__row__name">
          <div>{summoner.name}</div>
          <div className="online">Онлайн</div>
        </Col>
        <Col>
          <Dropdown overlay={menu}>
            <SettingOutlined />
          </Dropdown>
        </Col>
      </Row>
    </div>
  )
}
