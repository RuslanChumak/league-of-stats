import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { registerUser } from '../../actions/user';
import { routes } from '../../AppRoutes';
import logo from '../../images/logo.png';
import { HeaderSearch } from '../navbar/HeaderSearch';

export const Register: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistory();

  const setSummonerName = (name, region) => {
    form.setFieldValue('summonerName', name);
    form.setFieldValue('region', region);
  }

  const handleFinish = async (values) => {
    try {
      await dispatch(registerUser(values));
      history.push(routes.summonerPage({ summonerName: values.summonerName, region: values.region }));
    } catch (e) {
      message.error(e.message);
    }
  }

  const formHeader = (
    <Row gutter={[16, 16]} align="middle">
      <Col><img src={logo} alt="logo" /></Col>
      <Col className="form-container__title">League of Stats</Col>
    </Row>
  );

  return (
    <div className="empty-page">
      <Card className="form-container" title={formHeader}>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          onFinish={handleFinish}
        >
          <h2>Реєстрація</h2>
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
            rules={[{ required: true, min: 7, message: 'Будь ласка введіть пароль більше 6 символів!' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item
            name="summonerName"
            rules={[{ required: true, message: 'Будь ласка введіть ім\'я гравця!' }]}
          >
            <HeaderSearch isRegister handleSelectSummoner={setSummonerName} />
          </Form.Item>
          <Form.Item name="region" style={{ display: 'none' }} />
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Зареєструватися
            </Button>
            <div className="register-link">Уже маєте обліковий запис? <Link to={routes.logIn()}>Увійти!</Link></div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
