import { Card, Col, Row, Tooltip } from 'antd';
import { startCase } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../reducers';
import { v4 as uuidv4 } from 'uuid';
import { getItemTooltip } from './summoner/matchHistory/MatchItemHeader';
import { getItemIconUrl } from '../common/helpers';
import { Dictionary } from '../types';
import { Item } from '../services/mocks';
import { renderInput } from './champions/Filters';

// const label = {
//   Boots: 'Чоботи',
//   'Mana Regen': 'Відновлненя мани',
//   'Health Regen': 'Відновлення здоров\'я',
//   'Health': 'Здоров\'я',
//   'Critical Strike': 'Критичний удар',
//   'Spell Damage': 'Пошкодження уміннями',
//   'Mana': 'Мана',
//   'Armor': 'Броня',
//   'Spell Block': 'Блокування умінь',
//   'Life Steal': 'Викрадення життів',
//   'Spell Vamp': 'Викрадення умінь',
//   'Jungle': 'Ліс',
//   'Damage': 'Пошкодження',
//   'Lane': 'Лінія',
//   'Armor': 'Броня',
// }

export const Items: React.FC = () => {
  const [value, setValue] = useState<string>();
  const items = useSelector((state: AppState) => state.items);
  const groupedItems: Dictionary<Item[]> = Object.keys(items.data).reduce((res, key) => {
    const item = items.data[key];
    if (
      (value && !item.name.toLowerCase().includes(value.toLowerCase())) || // search
      !item.maps['11'] // map only summoner rift
    ) return res;

    return {
      ...res,
      ...item.tags.reduce((tagRes, tag) => ({
        ...tagRes,
        [tag]: [
          ...res[tag] || [],
          { id: key, ...item }
        ]
      }), {})
    };
  }, {});

  const handleChange = ({ target: { value } }) => setValue(value);

  return (
    <div className="champions champion-page">
      <Row>
        <Col>
          <h1>Предмети</h1>
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              {renderInput({ input: { value, onChange: handleChange }, placeholder: 'Введіть назву предмету' })}
            </Col>
            {Object.keys(groupedItems).map(key => {
              return (
                <Col span={24} key={uuidv4()}>
                  <Card className="champion-page__items" title={startCase(key)}> 
                    <Row>
                      {groupedItems[key].map(item => (
                        <Col key={uuidv4()}>
                          <Tooltip title={getItemTooltip(item)}>
                            <img alt={item.name} src={getItemIconUrl(item.id!)} />
                          </Tooltip>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </div>
  )
}