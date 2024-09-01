import { Col, Progress, Row, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { SorterResult } from 'antd/lib/table/interface';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { calcKDA, getChampionIconUrl } from '../../../common/helpers';
import { AppState } from '../../../reducers';
import { MatchPaticipant } from '../../../services/match';

type P = {
  participants: MatchPaticipant[];
}

export const Performance: React.FC<P> = ({ participants }) => {
	const maxKills = Math.max(...participants.map(({ kills }) => kills));
	const [value, setValue] = React.useState<undefined | { field: string, maxValue: number }>({ field: 'kills', maxValue: maxKills });
	const championById = useSelector((state: AppState) => state.champion.byId);

  const columns: ColumnType<MatchPaticipant>[] = [
    {
      title: 'Учасник',
      dataIndex: 'champion',
      width: 220,
      render: (text, row) => {
				const champion = championById[row.championName];
				const getPercent = () => {
					if (!value) return undefined;

					if (value.field === 'kda') return (+calcKDA(row.kills, row.deaths, row.assists) * 100) / value.maxValue;
					else if (value.field === 'cs') return ((row.totalMinionsKilled + row.neutralMinionsKilled) * 100) / value.maxValue;
					else return (row[value.field] * 100) / value.maxValue;
				}
				const percent = getPercent();

				return (
					<Row align="top" gutter={[8, 8]}>
						<Col span={6}>
							<img className="game-history__current-champion" src={getChampionIconUrl(champion.image.full)} alt={row.championName}/>
						</Col>
						<Col span={18}>
							<Row>
								<Col span={24}>{row.summonerName}</Col>
								{percent && <Col span={24}><Progress strokeWidth={5} percent={percent} showInfo={false} /></Col>}
							</Row>
						</Col>
					</Row>
				);
			}
    },
    {
      title: 'Вбивства',
      dataIndex: 'kills',
			key: 'kills',
			sorter: (a, b) => a.kills - b.kills,
			defaultSortOrder: 'descend',
      align: 'left',
    },
    {
			title: 'KDA',
			dataIndex: 'kda',
			key: 'kda',
			align: 'left',
			sorter: (a, b) => +calcKDA(a.kills, a.deaths, a.assists) - +calcKDA(b.kills, b.deaths, b.assists),
			render: (text, { kills, assists, deaths }) => calcKDA(kills, deaths, assists) 
    },
    {
      title: 'Пошкодження',
			sorter: (a, b) => a.totalDamageDealtToChampions - b.totalDamageDealtToChampions,
      dataIndex: 'totalDamageDealtToChampions',
			key: 'totalDamageDealtToChampions',
      width: 80,
    },
    {
      title: 'Золото',
      dataIndex: 'goldEarned',
			key: 'goldEarned',
			sorter: (a, b) => a.goldEarned - b.goldEarned,
      render: (text, { goldEarned }) => <span>{(goldEarned / 1000).toFixed(1)}k</span>
    },
    {
      title: 'CS',
      dataIndex: 'cs',
			key: 'cs',
			sorter: (a, b) => (a.neutralMinionsKilled + a.totalMinionsKilled) - (b.neutralMinionsKilled + b.totalMinionsKilled),
      render: (text, { neutralMinionsKilled, totalMinionsKilled }) => neutralMinionsKilled + totalMinionsKilled
    },
    {
      title: 'Огляд',
      dataIndex: 'visionScore',
			key: 'visionScore',
			sorter: (a, b) => a.visionScore - b.visionScore,
      render: (text, { visionScore }) => visionScore
    },
    
  ];

	const handleChange = (pagination, filter, sorter: SorterResult<MatchPaticipant>) => {
		if (value && sorter.order && (sorter.columnKey === value.field)) return;
		if (!sorter.columnKey || !sorter.order) return setValue(undefined);

		if (sorter.columnKey === 'kda') {
			const max = Math.max(...participants.map(({ kills, assists, deaths }) => +calcKDA(kills, deaths, assists)));
			setValue({ field: sorter.columnKey, maxValue: max });
		}
		else if (sorter.columnKey === 'cs') {
			const max = Math.max(...participants.map(({ neutralMinionsKilled, totalMinionsKilled }) => neutralMinionsKilled + totalMinionsKilled));
			setValue({ field: sorter.columnKey, maxValue: max });
		}
		else {
			const max = Math.max(...participants.map(participant => participant[sorter.columnKey!]));
			setValue({ field: sorter.columnKey as string, maxValue: max });
		}
	}

  return (
    <Row gutter={[8, 8]} justify="center">
      <Table
        columns={columns}
        className="perfomance-table"
        sortDirections={['descend']}
        dataSource={participants}
				rowKey={({ summonerName }) => summonerName}
        rowClassName={({ win }) => win ? 'row-win' : 'row-loose'}
        pagination={false}
		    onChange={handleChange}
      />
    </Row>
  )
}