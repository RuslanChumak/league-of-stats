import { Col, Input, Row } from 'antd';
import React, { useEffect } from 'react'
import { Field, reduxForm, FormProps } from 'redux-form'
import { renderRadio } from '../tierList/Filters';

export type FiltersFormData = {
  championName?: string;
  teamPosition: string;
};

type FiltersFormProps = FormProps<FiltersFormData>;

export const renderInput = ({ input: { onChange, value }, placeholder }) => (
  <Input value={value} placeholder={placeholder} onChange={onChange} allowClear />
);

const Filters: React.FC<FiltersFormProps> = ({ initialize }) => {
  useEffect(() => {
    initialize({ teamPosition: 'all' });
  }, []);

  return (
    <Row gutter={[16, 16]} align="middle" className="champions__filters">
      <Col>
        <Field 
          name="teamPosition"
          component={renderRadio}
        />
      </Col>
      <Col>
        <Field 
          name="championName"
          placeholder="Введіть ім'я чемпіона"
          component={renderInput}
        />
      </Col>
    </Row>
  );
}

const decoratedComponent = reduxForm({ form: 'champions-filters' })(Filters);
export { decoratedComponent as Filters };
      