import { Col, Divider, Row, Tooltip } from 'antd';
import { capitalize } from 'lodash';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { getPerkIconUrl } from '../../../../common/helpers';
import { AppState } from '../../../../reducers';
import { Perk, PerksStyle } from '../../../../services/match';
import { renderTootip } from '../MatchItemHeader';

type P = {
  data: Perk;
}

export const statPersOrder = [5008, 5005, 5007, 5008, 5002, 5003, 5001, 5002, 5003];

export const Runes: React.FC<P> = ({ data: perks }) => {
  const { byId: runeById, statRunesById } = useSelector((state: AppState) => state.runes);
  const getPerk = (description) => perks.styles.find((perk) => perk.description === description)!.style;
  const mainPerk = runeById[getPerk('primaryStyle')];
  const subPerk = runeById[getPerk('subStyle')];

  const isSelected = (perkStyle: PerksStyle, perkId) => {
    const selectedRunes = perks.styles.find(({ description }) => description === perkStyle)!;
    return selectedRunes.selections.some(({ perk }) => perk === perkId);
  }

  return (
    <Row gutter={[64, 64]} className="runes">
      <Col span={10} offset={3}>
        <Row justify="center">
          <Col span={24}>
            <div className="runes__title">
              <img src={getPerkIconUrl(mainPerk.icon)} alt={mainPerk.name} />
              <div>{mainPerk.name}</div>
            </div>
          </Col>
          <Col span={20}>
            {mainPerk.slots.map(({ runes }, id) => (
              <Row key={uuidv4()}>
                {runes.map(rune => (
                  <Col span={24 / runes.length} key={uuidv4()} className="runes__perk-col">
                    <Row justify="center">
                      <Tooltip title={renderTootip(rune.name, rune.shortDesc)}>
                        <img
                          className={`runes__perk-img ${id === 0 && 'main-img'} ${isSelected('primaryStyle', rune.id) && 'selected'}`}
                          src={getPerkIconUrl(rune.icon)}
                          alt={rune.name}
                        />
                      </Tooltip>
                    </Row>
                  </Col>
                ))}
                {id === 0 && <Divider />}
              </Row>
            ))}
          </Col>
        </Row>
      </Col>
      <Col span={10}>
        <Row justify="center">
          <Col span={24}>
            <div className="runes__title">
              <img src={getPerkIconUrl(subPerk.icon)} alt={subPerk.name} /> {subPerk.name}
            </div>
          </Col>
          <Col span={20}>
            {subPerk.slots.map(({ runes }, id) => (
              <Row key={uuidv4()} justify="space-between">
                {runes.map(rune => id > 0 && (
                  <Col span={24 / runes.length} key={uuidv4()} className="runes__perk-col">
                    <Row justify="center">
                      <Tooltip title={renderTootip(rune.name, rune.shortDesc)}>
                        <img
                          className={`runes__sub-perk-img ${isSelected('subStyle', rune.id) && 'selected'}`}
                          src={getPerkIconUrl(rune.icon)}
                          alt={rune.name}
                        />
                      </Tooltip>
                    </Row>
                  </Col>
                ))}
              </Row>
            ))}
          </Col>
          <Divider />
          <Col span={14}>
            <Row justify="space-between" gutter={[8, 8]}>
              {statPersOrder.map((statPerkId, id) => {
                const rune = statRunesById[statPerkId];
                const name = id < 3 ? 'offense' : id < 6 ? 'flex' : 'defense';

                return (
                  <Col span={8} key={uuidv4()}>
                    <Row justify="center">
                      <Tooltip title={renderTootip(capitalize(name), rune.desc)}>
                        <img
                          className={`runes__stat-perk-img ${perks.statPerks[name] === statPerkId && 'selected'}`}
                          src={getPerkIconUrl(rune.icon)}
                          alt={name}
                        />
                      </Tooltip>
                    </Row>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}