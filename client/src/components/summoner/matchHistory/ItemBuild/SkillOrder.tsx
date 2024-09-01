import { Col, Row, Spin, Tooltip } from 'antd';
import React from 'react';
import { MatchTimeline } from '../../../../services/match';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../reducers';
import { getChampionSpellIconUrl } from '../../../../common/helpers';
import { renderTootip } from '../MatchItemHeader';
import { skillLetter } from '../../../champions/Build';

type P = {
  summonerPuuid: string;
  timeline: MatchTimeline;
  championName: string;
}

export const SkillOrder: React.FC<P> = ({ summonerPuuid, timeline, championName }) => {
  const champion = useSelector((state: AppState) => state.champion.byId[championName]);
  if (!timeline) return <Spin />;

  const { info: { participants, frames } } = timeline;
  const participantId = participants.find(({ puuid }) => puuid === summonerPuuid)!.participantId;
  const skillsOrder = frames.reduce((frameRes, frame) => {
    const eventSkillOrder = frame.events.reduce((eventRes, event) => {
      if (event.type === 'SKILL_LEVEL_UP' && event.participantId === participantId) return [...eventRes, event.skillSlot!];
      return eventRes;
    }, []);

    return [...frameRes, ...eventSkillOrder];
  }, []);

  return <Skills champion={champion} skillsOrder={skillsOrder} />
}

export const Skills = ({ skillsOrder, champion }) => (
  <Row className="skill-order" gutter={[4, 4]}>
    <Col span={1} className="skill-order__outer-cell">
      <Row gutter={[4, 4]}>
        {champion.spells.map(({ id, name, description }, index) => (
          <Col span={24} className="skill-order__cell" key={uuidv4()}>
            <Tooltip title={renderTootip(name, description)}>
              <img src={getChampionSpellIconUrl(id)} alt={name}/>
              <div className="skill-order__cell__letter">{skillLetter[index]}</div>
            </Tooltip>
          </Col>
        ))}
      </Row>
    </Col>
    {[...Array(18).keys()].map(level => (
      <Col span={1} key={uuidv4()} className="skill-order__outer-cell">
        <Row gutter={[4, 4]}>
          {[...Array(4).keys()].map(skillId => {
            const isSelected = skillsOrder[level] === (skillId + 1);
            return (
              <Col span={24} key={uuidv4()} className={`skill-order__cell ${isSelected ? 'selected' : ''}`}>
                {isSelected && level + 1}
              </Col>
            );
          })}
        </Row>
      </Col>
    ))}
  </Row>
)
