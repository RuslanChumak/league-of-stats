import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logIn } from '../../actions/user';
import { routes } from '../../AppRoutes';
import logo from '../../images/logo.png';

export const LogIn: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const formHeader = (
    <Row gutter={[16, 16]} align="middle">
      <Col><img src={logo} alt="logo" /></Col>
      <Col className="form-container__title">League of Stats</Col>
    </Row>
  );

  const handleFinish = async (values) => {
    try {
      const { user } = await dispatch(logIn(values));
      history.push(routes.summonerPage({ summonerName: user.summonerName, region: user.region }));
    } catch (e) {
      message.error(e.message);
    }
  }

  return (
    <div className="empty-page">
      <Card className="form-container" title={formHeader}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={handleFinish}
        >
          <h2>Вхід</h2>
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Введіть вірну пошту!',
              },
              { required: true, message: 'Будь ласка введіть пошту!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Пошта" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Будь ласка введіть пароль!' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Увійти
            </Button>
            <span className="register-link">Або <Link to={routes.register()}>зареєструватися зараз!</Link></span>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
