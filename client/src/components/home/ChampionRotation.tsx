import { Card, Col, Row, Spin, Tooltip } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { getChamionsRotation } from '../../actions/champions';
import { AppState } from '../../reducers';
import { keyBy } from 'lodash';
import { getChampionIconUrl } from '../../common/helpers';
import { Link } from 'react-router-dom';
import { routes } from '../../AppRoutes';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';

const ChampionRotation: React.FC = () => {
  const dispatch = useDispatch();
  const region = useSelector((state: AppState) => state.region);
  const rotation = useSelector((state: AppState) => state.champion.championRotationByRegion[region]);

  const getRotation = debounce(async () => {
    try {
      await dispatch(getChamionsRotation());
    } catch(e) {
      console.error(e);
    }
  }, 500)

  React.useEffect(() => {
    getRotation();
  }, [region]);

  if (!rotation) return <Spin spinning />;

  const title = (
    <Tooltip title={`Максимальний рівень нового гравця - ${rotation.maxNewPlayerLevel}`}>
      Безкоштовні чемпіони для нових гравців <QuestionCircleOutlined />
    </Tooltip>
  );

  return (
    <Row gutter={[8, 8]}>
      <Col span={12}>
        <ChampionsList ids={rotation.freeChampionIds || []} title="Безкоштовні чемпіони цього тижня" />
      </Col>
      <Col span={12}>
        <ChampionsList ids={rotation.freeChampionIdsForNewPlayers || []} title={title} />
      </Col>
    </Row>
  );
}

type ChampionsListProps = {
  ids: number[];
  title: string | JSX.Element;
}

const ChampionsList: React.FC<ChampionsListProps> = ({ ids, title }) => {
  const championsByKey = useSelector((state: AppState) => keyBy(Object.values(state.champion.byId), 'key'));

  return (
    <Card title={<b>{title}</b>}>
      <Row gutter={[8, 8]}>
        {ids.map(key => {
          const champion = championsByKey[key];

          if (!champion) return null;

          return (
            <Col span={6} key={champion.id}>
              <Link to={routes.championPage({ championName: champion.id })}>
                <Row justify="center">
                  <Col span={24}>
                    <Row justify="center"><img src={getChampionIconUrl(champion.image.full)} alt={champion.name}/></Row>
                  </Col>
                  <Col>{champion.name}</Col>
                </Row>
              </Link>
            </Col>
          );
        })}
      </Row>
    </Card>
  )
}

export default withRouter(ChampionRotation);
