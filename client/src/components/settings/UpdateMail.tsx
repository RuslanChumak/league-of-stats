import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUserCreds } from '../../actions/user';
import { AppState } from '../../reducers';

export const UpdateEmail: React.FC = () => {
  const [form] = useForm();
  const auth = useSelector((state: AppState) => state.user.authetication!);
  const dispatch = useDispatch();
  
  const handleFinish = async (values) => {
    const dto = {
      password: values.password,
      newEmail: values.email,
      email: auth.email
    };

    try {
      await dispatch(editUserCreds(dto));
      message.success('Пошту успішно змінено!');
      form.resetFields();
    } catch (e) {
      message.error(e.message);
    }
  }

  return (
    <Form
      name="update-email"
      form={form}
      className="login-form"
      initialValues={{ email: auth!.email }}
      onFinish={handleFinish}
    >
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
        <Input prefix={<MailOutlined />} placeholder="Нова Пошта" />
      </Form.Item>
      <Form.Item
        name="confirmEmail"
        dependencies={['email']}
        rules={[
          { required: true, message: 'Підтвердіть вашу пошту!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('email') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Пошти не співпадають!'));
            },
          }),
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Повторіть Нову Пошту" />
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
          Зберегти
        </Button>
      </Form.Item>
    </Form>
  );
}
