import { Col, Radio, Row, Select, Tooltip } from 'antd';
import React, { useEffect } from 'react'
import { Field, reduxForm, FormProps } from 'redux-form'
import { getRoleIcon } from '../../common/helpers';
import config from '../../config';

const { regions } = config;

export type FiltersFormData = {
  region?: string;
  teamPosition?: string;
  queueId?: number;
};

type FiltersFormProps = FormProps<FiltersFormData>;

export const roles = [
  { value: 'all', label: 'Всі ролі', img: 'specialist' },
  { value: 'TOP', label: 'Верхня лінія', img: 'top' },
  { value: 'JUNGLE', label: 'Ліс', img: 'jung' },
  { value: 'MIDDLE', label: 'Середня лінія', img: 'mid' },
  { value: 'BOTTOM', label: 'Нижня лінія', img: 'bot' },
  { value: 'UTILITY', label: 'Підтримка', img: 'supp' },
];

const queues = [
  { value: 420, label: 'Рейтинг Одиночний/Парний' },
  { value: 440, label: 'Рейтинг Командний' },
  { value: 450, label: 'АРАМ' },
  { value: 430, label: 'Звичайний в сліпу' },
  { value: 400, label: 'Звичайний з вибором' },
];

export const renderRadio = ({ input: { value, onChange } }) => (
  <Radio.Group
    value={value}
    defaultValue="all"
    optionType="button"
    buttonStyle="solid"
    onChange={({ target: { value } }) => onChange(value)}
  >
    {roles.map(({ img, value, label }) => (
      <Tooltip title={label} key={value}>
        <Radio value={value}>{value === 'all' ? allRolesSvg : <img src={getRoleIcon(img)}/>}</Radio>
      </Tooltip>
    ))}
  </Radio.Group>
);

export const allRolesSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M16 1.25V16H1.25l2.828-2.828h9.094V4.079L16 1.25zM14.75 0l-2.828 2.828H2.828v9.093L0 14.75V0h14.75zm-4.617 5.867v4.266H5.867V5.867h4.266z" fill="#FFF"></path></svg>;

const Filters: React.FC<FiltersFormProps> = ({ initialize }) => {
  useEffect(() => {
    initialize({ teamPosition: 'all', queueId: 420, region: 'all' });
  }, []);

  const renderSelect = ({ input: { value, onChange }, options }) => (
    <Select
      value={value}
      onChange={onChange}
    >
      {options.map(({ value, label }) => (
        <Select.Option key={value} value={value}>{label}</Select.Option>
      ))}
    </Select>
  );

  return (
    <Row gutter={[16, 16]}>
      <Col>
        <Field 
          name="teamPosition"
          component={renderRadio}
        />
      </Col>
      <Col>
        <Field 
          name="queueId"
          component={renderSelect}
          options={queues}
        />
      </Col>
      <Col>
        <Field 
          name="region"
          component={renderSelect}
          options={[{ value: 'all', label: 'Весь світ' }, ...regions]}
        />
      </Col>
    </Row>
  );
}

const decoratedComponent = reduxForm({ form: 'tier-list-filters' })(Filters);
export { decoratedComponent as Filters };
      