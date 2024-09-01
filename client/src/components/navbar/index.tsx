import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { matchPath, RouteComponentProps, withRouter } from 'react-router';
import {
  HomeOutlined, ProfileOutlined, RobotOutlined, ShoppingCartOutlined, VideoCameraOutlined,
} from '@ant-design/icons';
import logo from '../../images/logo.png';
import { routes } from '../../AppRoutes';
import { HeaderSearch } from './HeaderSearch';
import { User } from './User';

const NavBar: React.FC<RouteComponentProps<{}>> = ({ history }) => {
  const getRoute = (pathname) => Object.values(routes).find(func => matchPath(pathname, { path: func(), exact: func() === '/' }))();
  const [route, setRoute] = useState<string>(getRoute(history.location.pathname));

  useEffect(() => {
    return history.listen((location) => { 
      setRoute(getRoute(location.pathname));
    }) 
  }, [history]) 

  return (
    <div className="navbar">
      <div className="navbar__menu">
        <img src={logo} alt="logo" className='logo' />
        <Menu
          mode="horizontal"
          theme="dark"
          onClick={({ key }) => history.push(key)}
          selectedKeys={[route]}
          items={[
            {
              key: routes.root(),
              icon: <HomeOutlined />,
              label: 'Головна',
            },
            {
              key: routes.tierList(),
              icon: <ProfileOutlined />,
              label: 'Загальний список',
            },
            {
              key: routes.champions(),
              icon: <RobotOutlined />,
              label: 'Чемпіони',
            },
            {
              key: routes.featuredGames(),
              icon: <VideoCameraOutlined />,
              label: 'Рекомендовані матчі',
            },
            {
              key: routes.items(),
              icon: <ShoppingCartOutlined />,
              label: 'Предмети',
            },
          ]}
        />
      </div>
      {![routes.root(), routes.featuredGames()].includes(route) && <HeaderSearch />}
      <User />
    </div>
  );
};

export default withRouter(NavBar);