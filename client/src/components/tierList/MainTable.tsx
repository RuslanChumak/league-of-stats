import { Col, Popover, Row, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { capitalize, compact, Dictionary } from 'lodash';
import { AlignType } from 'rc-table/lib/interface';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from '../../AppRoutes';
import { convertGradeToLetter, getChampionBanCount, getChampionIconUrl, getGrade, getPercent, getRoleIcon } from '../../common/helpers';
import { AppState } from '../../reducers';
import { Enemy, TierListParticipant } from '../../services/champion';
import { roles } from './Filters';

type P = {
  view: string;
};

export const renderGrade = (row, allMatches, allBans, championById, tierList) => {
  const grade = convertGradeToLetter(getGrade(row, allMatches, allBans, championById, tierList))

  return <span className={`grade-${grade === 'S+' ? 's-plus' : grade.toLowerCase()}`}>{grade}</span>;
}
export const renderWinRate = ({ count, wins }) => {
  const percent = +getPercent(count, wins);

  return <span className={percent > 51 ? 'blue' : percent < 49 ? 'red' : ''}>{percent}%</span>;
}
export const renderPickRate = ({ count }, allMatches) => <span>{getPercent(allMatches, count)}%</span>
export const renderBanRate = ({ _id }, allBans, championById, tierList) => {
  const bans = getChampionBanCount(_id, championById, tierList);
  return <span>{bans ? getPercent(allBans, getChampionBanCount(_id, championById, tierList)) : 0}%</span>
}

export const MainTable: React.FC<P> = ({ view }) => {
  const tierList = useSelector((state: AppState) => state.champion.tierList);
  const championById = useSelector((state: AppState) => state.champion.byId);

  const allMatches = tierList ? Object.values(tierList.participants).reduce((res, { count }) => res + count, 0) : 0;
  const allBans = tierList ? Object.values(tierList.bans).reduce((res, { count }) => res + count, 0) : 0;

  const getColTitle = field => {
    switch (field) {
      case 'kills': return 'Вбивства';
      case 'deaths': return 'Смерті';
      case 'assists': return 'Допомоги';
      case 'totalDamageDealtToChampions': return 'Пошкодження';
      case 'totalDamageTaken': return 'Отриманий Пошкодження';
      case 'damageSelfMitigated': return 'Уникнено Пошкоджень';
      case 'totalHeal': return 'Відновлено Здоров\'я';
      case 'goldEarned': return 'Золото';
      case 'totalMinionsKilled': return 'CS';
      case 'neutralMinionsKilled': return 'CS в лісі';
      case 'turretKills': return 'Башні';
      case 'damageDealtToTurrets': return 'Пошкодження Башням';
      case 'wardsKilled': return 'Знешкодженно обзору';
      default: capitalize(field);
    }
  }

  const objectivesView: ColumnType<TierListParticipant>[] = ['goldEarned', 'totalMinionsKilled', 'neutralMinionsKilled', 'turretKills', 'damageDealtToTurrets', 'wardsKilled'].map(field => ({
    title: getColTitle(field),
    dataIndex: field,
    key: field,
    align: 'center' as AlignType,
    sorter: (a, b) => a[field] - b[field],
    render: (text) => text.toFixed(['goldEarned', 'damageDealtToTurrets'].includes(field) ? 0 : 1)
  }));

  const combatView: ColumnType<TierListParticipant>[] = ['kills', 'deaths', 'assists', 'totalDamageDealtToChampions', 'totalDamageTaken', 'damageSelfMitigated', 'totalHeal'].map(field => ({
    title: getColTitle(field),
    dataIndex: field,
    key: field,
    align: 'center' as AlignType,
    sorter: (a, b) => a[field] - b[field],
    render: (text) => text.toFixed(['totalDamageDealtToChampions', 'totalDamageTaken', 'damageSelfMitigated', 'totalHeal'].includes(field) ? 0 : 2)
  }));

  const gradeCol = {
    title: 'Оцінка',
    dataIndex: 'grade',
    key: 'grade',
    align: 'center',
    sorter: (a, b) => getGrade(a, allMatches, allBans, championById, tierList) - getGrade(b, allMatches, allBans, championById, tierList),
    render: (text, row) => renderGrade(row, allMatches, allBans, championById, tierList)
  };

  const mainView: ColumnType<TierListParticipant>[] = [
    {
      title: '% Вибору',
      dataIndex: 'pickRate',
      key: 'pickRate',
      align: 'center',
      sorter: (a, b) => +getPercent(allMatches, a.count) - +getPercent(allMatches, b.count),
      render: (text, row) => renderPickRate(row, allMatches)
    },
    {
      title: '% Бану',
      dataIndex: 'banRate',
      key: 'banRate',
      align: 'center',
      sorter: (a, b) => +getPercent(allBans, getChampionBanCount(a._id, championById, tierList)) - +getPercent(allBans, getChampionBanCount(b._id, championById, tierList)),
      render: (text, row) => renderBanRate(row, allBans, championById, tierList)
    },
    {
      title: 'Слабкий проти',
      dataIndex: 'counterPicks',
      key: 'counterPicks',
      align: 'center',
      render: (text, { _id, enemies }) => {
        const sortedEnemies = Object.values(enemies as Dictionary<Enemy>).sort((a, b) => +getPercent(a.count, a.win) - +getPercent(b.count, b.win));

        return [...Array(3).keys()].map(id => {
          const enemy = sortedEnemies[id];
          if (!enemy) return null;

          const winRate = getPercent(enemy.count, enemy.win);
          const enemyChamp = championById[enemy._id];
          const rowChamp = championById[_id];

          if (!enemyChamp || !rowChamp) return null;

          const enemyImg = <img src={getChampionIconUrl(enemyChamp.image.full)} alt={enemyChamp.name}/>;
          const rowImg = <img src={getChampionIconUrl(rowChamp.image.full)} alt={rowChamp.name}/>;

          return (
            <Popover
              popupVisible
              overlayClassName="counter-pick-popover"
              content={(
                <Row justify="center" gutter={[8, 8]}>
                  <Col>{enemyImg}</Col>
                  <Col>перемагає {100 - +winRate}% проти</Col>
                  <Col>{rowImg}</Col>
                  <Col span={24} className="second-row">
                    <span className="matches">Матчі:</span> {enemy.count}
                  </Col>
                </Row>
              )}
            >
              {enemyImg}
            </Popover>
          );
        })
      }
    },
  ];

  const getColumns = () => {
    if (view === 'main') return mainView;
    if (view === 'combat') return combatView;
    return objectivesView;
  }

  const columns: ColumnType<TierListParticipant>[] = compact([
    {
      title: 'Ранг',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (text, row, id) => id + 1
    },
    {
      title: 'Роль',
      dataIndex: 'teamPosition',
      key: 'teamPosition',
      align: 'center',
      sorter: (a, b) => a.teamPosition!.localeCompare(b.teamPosition!),
      render: (text, row) => {
        const role = roles.find(({ value }) => text === value)!;
        return <img className="role-img" src={getRoleIcon(role.img)} />;
      }
    },
    {
      title: 'Чемпіон',
      dataIndex: '_id',
      key: '_id',
      sorter: (a, b) => a._id.localeCompare(b._id),
      render: (text) => {
        const champ = championById[text];
        return (
          <Row align="middle" gutter={[8, 8]}>
            <Col>
              <img src={getChampionIconUrl(champ.image.full)} alt={text}/>
            </Col>
            <Col><Link to={routes.championPage({ championName: text })}>{text}</Link></Col>
          </Row>
        )
      }
    },
    view === 'main' && gradeCol,
    {
      title: '% Перемог',
      dataIndex: 'wins',
      key: 'wins',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) => (+getPercent(a.count, a.wins)) - (+getPercent(b.count, b.wins)),
      render: (text, row) => renderWinRate(row)
    },
    ...getColumns(),
    {
      title: 'Кількість матчів',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      sorter: (a, b) => a.count - b.count,
      render: (text) => text
    },
  ]) as ColumnType<TierListParticipant>[];

  return (
    <Table
      columns={columns}
      className="main-table"
      rowKey={({ _id }) => _id}
      dataSource={tierList ? Object.values(tierList.participants) : []}
      pagination={false}
    />
  )
}