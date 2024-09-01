import { Button, Card, Col, message, Popconfirm, Row } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { removeUser } from '../../actions/user';
import { UpdateEmail } from './UpdateMail';
import { UpdatePassword } from './UpdatePassword';
import { UpdateSummoner } from './UpdateSummoner';

export const Settings: React.FC = () => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(removeUser());
      message.success('Обліковий запис успішно видалений!');
    } catch (e) {
      message.error(e);
    }
  }

  return (
    <div className="champions champion-page">
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <h1>Налаштування</h1>
        </Col>
        <Col span={12}>
          <Card title="Зміна пошти">
            <UpdateEmail />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Зміна паролю">
            <UpdatePassword />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Зміна гравця">
            <UpdateSummoner />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Видалити обліковий запис League of Stats" className="delete-account-card">
            <div>Видалення облікового запису призведе до:</div>
            <ul>
              <li>Всі ваші дані будуть видалі з бази даних</li>
              <li>Ваш обліковий запис League of Legends більше не буде асоціюватися з обліковим записом League of Stats</li>
            </ul>
            <Popconfirm
              title="Ви впевнені?"
              okText="Так"
              cancelText="Ні"
              onConfirm={handleDelete}
            >
              <Button type="primary" danger>Видалити</Button>
            </Popconfirm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
