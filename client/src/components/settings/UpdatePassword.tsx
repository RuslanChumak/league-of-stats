import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUserCreds } from '../../actions/user';
import { AppState } from '../../reducers';

export const UpdatePassword: React.FC = () => {
  const [form] = useForm();
  const auth = useSelector((state: AppState) => state.user.authetication!);
  const dispatch = useDispatch();
  
  const handleFinish = async (values) => {
    const dto = {
      password: values.oldPassword,
      newPassword: values.password,
      email: auth.email
    };

    try {
      await dispatch(editUserCreds(dto));
      message.success('Пароль успішно змінено!');
      form.resetFields();
    } catch (e) {
      message.error(e.message);
    }
  }

  return (
    <Form
      name="update-password"
      form={form}
      className="login-form"
      onFinish={handleFinish}
    >
      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Будь ласка введіть новий пароль!' }
        ]}
      >
        <Input type="password" prefix={<LockOutlined />} placeholder="Новий пароль" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Підтвердіть ваш пароль!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Паролі не співпадають!'));
            },
          }),
        ]}
      >
        <Input type="password" prefix={<LockOutlined />} placeholder="Повторіть новий пароль" />
      </Form.Item>
      <Form.Item
        name="oldPassword"
        rules={[{ required: true, message: 'Будь ласка введіть старий пароль!' }]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Старий пароль"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Зберегти
        </Button>
      </Form.Item>
    </Form>
  );
}
