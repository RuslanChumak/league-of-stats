import { Button, Col, message, Row } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editUser } from '../../actions/user';
import { Region } from '../../services/summoners';
import { HeaderSearch } from '../navbar/HeaderSearch';

export const UpdateSummoner: React.FC = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<{ summonerName: string; region: Region } | undefined>();

  const handleSave = async () => {
    try {
      value && await dispatch(editUser(value));
      message.success("Гравця успішно змінено!");
    } catch (e) {
      message.error(e.message);
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <HeaderSearch isRegister handleSelectSummoner={(summonerName, region) => setValue(summonerName ? { summonerName, region } : undefined)} />
      </Col>
      <Col span={24}>
        <Button disabled={!value} type="primary" onClick={handleSave}>Зберегти</Button>
      </Col>
    </Row>
  )
}
