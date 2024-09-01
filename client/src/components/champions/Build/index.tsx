import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Col, Row, Spin, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useParams, withRouter } from 'react-router';
import { getChampionBuild, getTierList } from '../../../actions/champions';
import { getChampionIconUrl, getChampionPassiveIconUrl, getChampionSpellIconUrl, getItemIconUrl } from '../../../common/helpers';
import { AppState } from '../../../reducers';
import { Runes } from '../../summoner/matchHistory/ItemBuild/Runes';
import { v4 as uuidv4 } from 'uuid';
import { getItemTooltip, renderTootip } from '../../summoner/matchHistory/MatchItemHeader';
import { Filters, FiltersFormData } from '../../tierList/Filters';
import { renderBanRate, renderGrade, renderPickRate, renderWinRate } from '../../tierList/MainTable';
import { debounce } from 'lodash';
import { Skills } from '../../summoner/matchHistory/ItemBuild/SkillOrder';
import { Enemies } from './Enemies';

type RouteProps = { championName: string };

export const skillLetter = ['Q', 'W', 'E', 'R'];

const ChampionPage: React.FC<RouteComponentProps<RouteProps>> = () => {
  const dispatch = useDispatch();
  const { championName } = useParams<RouteProps>();
  const championById = useSelector((state: AppState) => state.champion.byId);
  const itemById = useSelector((state: AppState) => state.items);
  const tierList = useSelector((state: AppState) => state.champion.tierList);
  const build = useSelector((state: AppState) => state.champion.buildByChampion[championName]);

  const champion = championById[championName]
  const { image: { full }, spells, passive } = champion;
  const champStats = tierList && tierList.participants[championName];
  const allMatches = tierList ? Object.values(tierList.participants).reduce((res, { count }) => res + count, 0) : 0;
  const allBans = tierList ? Object.values(tierList.bans).reduce((res, { count }) => res + count, 0) : 0;

  const sortedItems = build?.items?.sort((a, b) => (a ? itemById.data[a]?.gold.total : 0) - (b ? itemById.data[b]?.gold.total : 0)).reverse();

  const handleFormChange = (values: FiltersFormData) => {
    const dto = {
      region: values.region === 'all' ? undefined : values.region,
      teamPosition: values.teamPosition === 'all' ? undefined : values.teamPosition,
      queueId: values.queueId
    };

    fetchTierList(dto);
  }

  const fetchTierList = debounce((dto) => dispatch(getTierList(dto)), 500);

  useEffect(() => {
    fetchTierList({});
  }, []);

  useEffect(() => {
    dispatch(getChampionBuild(championName));
  }, [championName]);

  return (
    <Row className="summoner-page champion-page tier-list" gutter={[24, 24]} style={{ minWidth: 1500 }}>
      <Col span={24}>
        <Row gutter={[8, 16]}>
          <Col span={3}>
            <img className="summoner-page__profile-icon" src={getChampionIconUrl(full)} alt="profileIcon"/>
          </Col>
          <Col span={21}>
            <Row>
              <Col span={24} className="summoner-page__name">{championName}</Col>
              <Col span={24}>
                <Row gutter={[8, 8]}>
                  <Col className="champion-page__cell">
                    <Tooltip title={renderTootip(passive.name!, passive.description!)}>
                      <img src={getChampionPassiveIconUrl(passive.image!.full)} alt={passive.name} />
                      <div className="champion-page__cell__letter">P</div>
                    </Tooltip>
                  </Col>
                  {spells.map(({ name, id, description }, index) => (
                    <Col className="champion-page__cell" key={uuidv4()}>
                      <Tooltip title={renderTootip(name, description)}>
                        <img src={getChampionSpellIconUrl(id)} alt={name} />
                        <div className="champion-page__cell__letter">{skillLetter[index]}</div>
                      </Tooltip>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Filters onChange={handleFormChange} />
          </Col>
          <Col span={24}>
            {champStats && tierList ? (
              <Row className="cards-container">
                <Col span={4} className="card">
                  <div className="card__content">{renderGrade(champStats, allMatches, allBans, championById, tierList)}</div>
                  <div className="card__description">Оцінка</div>
                </Col>
                <Col span={4} className="card">
                  <div className="card__content">{renderWinRate(champStats)}</div>
                  <div className="card__description">Перемог</div>
                </Col>
                <Col span={4} className="card">
                  <div className="card__content">{renderPickRate(champStats, allMatches)}</div>
                  <div className="card__description">Вибору</div>
                </Col>
                <Col span={4} className="card">
                  <div className="card__content">{renderBanRate(champStats, allBans, championById, tierList)}</div>
                  <div className="card__description">Бану</div>
                </Col>
                <Col span={4} className="card">
                  <div className="card__content">{champStats.count}</div>
                  <div className="card__description">Матчів</div>
                </Col>
              </Row>
            ) : <Spin spinning />}
          </Col>
          {build && (
            <Col span={12}>
              <Card title="Руни">
                <Runes data={build.perks} />
              </Card>
            </Col>
          )}
          {build && ( 
            <Col span={12}>
              <Card title="Рекомендовані Предмети" className="champion-page__items">
                <Row align="middle">
                  <Col span={12}>
                    <div className="champion-page__items__title">Основні предмети:</div>
                    <Row align="middle">
                      {[0, 1, 5].map(renderItems(sortedItems, itemById.data))}
                    </Row>
                  </Col>
                  <Col span={12}>
                    <div className="champion-page__items__title">Можливі другорядні предмети:</div>
                    <Row align="middle">
                      {[2, 3, 4].map(renderItems(sortedItems, itemById.data))}
                    </Row>
                  </Col>
                </Row>
              </Card>
              {champStats && (
                <Card title="Слабкий проти" className="champion-page__counter-picks">
                  <Enemies participant={champStats} />
                </Card>
              )}
            </Col>
          )}
          {build && (
            <Col span={12}>
              <Card title="Порядок Здібностей" className="skills-order-card">
                <Skills champion={champion} skillsOrder={build.skills} />
              </Card>
            </Col>
          )}
          <Col span={12}>
            {champStats && (
              <Card title="Сильний проти" className="champion-page__counter-picks">
                <Enemies participant={champStats} isStrong />
              </Card>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

const renderItems = (items, itemById) => (id) => {
  const itemId = items[id];
  if (!itemId || !itemById[itemId]) return null;

  return (
    <Col key={uuidv4()}>
      <Row align="middle">
        <Col>
          <Tooltip title={getItemTooltip(itemById[itemId])}>
            <img alt={itemId.toString()} src={getItemIconUrl(itemId)} />
          </Tooltip>
        </Col>
        {![5, 4].includes(id) && <Col><ArrowRightOutlined /></Col>}
      </Row>
    </Col>
  );
}

const decoratedComponent = withRouter(ChampionPage);
export { decoratedComponent as ChampionPage };
