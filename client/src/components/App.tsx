import { Layout, ConfigProvider } from 'antd';
import React from 'react';
import locale from 'antd/lib/locale-provider/uk_UA';
import NavBar from './navbar';
import '../styles/index.scss';
import { useLocation } from 'react-router';
import { routes } from '../AppRoutes';

const { Header, Content, Footer } = Layout;

type P = {
  children: JSX.Element;
}

export const App: React.FC<P> = ({ children }) => {
  const location = useLocation();
  if (location.pathname === routes.logIn()) return null;

  return (
    <ConfigProvider locale={locale}>
      <div className={`background light-theme-background`} />
      <Layout>
        <Header className="header">
          <NavBar />
        </Header>
        <Content className="content">
          {children}
        </Content>
        <Footer className="footer">League of stats ©2022 Created by Matrix</Footer>
      </Layout>
    </ConfigProvider>
  );
} 
