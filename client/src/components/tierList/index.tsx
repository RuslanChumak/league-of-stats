import { Col, Row, Spin, Tabs } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTierList, getTierListAsync } from '../../actions/champions';
import { getLoadingState } from '../../common/helpers';
import { Filters, FiltersFormData } from './Filters';
import { MainTable } from './MainTable';

export const TierList: React.FC = () => {
  const [view, setView] = useState<string>('main');
  const loading = useSelector(getLoadingState(getTierListAsync));
  const dispatch = useDispatch();

  const fetchTierList = debounce((dto) => dispatch(getTierList(dto)), 500);

  useEffect(() => {
    fetchTierList({});
  }, []);

  const handleFormChange = (values: FiltersFormData) => {
    const dto = {
      region: values.region === 'all' ? undefined : values.region,
      teamPosition: values.teamPosition === 'all' ? undefined : values.teamPosition,
      queueId: values.queueId
    };

    fetchTierList(dto);
  }

  const handleChangeView = (key) => setView(key);

  return (
    <div className="tier-list">
      <Spin spinning={loading}>
        <Row justify="center" align="middle" gutter={[24, 24]}>
          <Col span={24}>
            <Tabs
              activeKey={view}
              onChange={handleChangeView}
              items={[
                {
                  label: `Загальний Список`,
                  key: 'main',
                },
                {
                  label: `Бойовий Список`,
                  key: 'combat',
                },
                {
                  label: `Об'єкти`,
                  key: 'objectives',
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <Filters onChange={handleFormChange} />
          </Col>
          <Col span={24}>
            <MainTable view={view} />
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
