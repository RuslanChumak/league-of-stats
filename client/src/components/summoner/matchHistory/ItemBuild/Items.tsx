import { Col, Row, Spin, Tooltip } from 'antd';
import React from 'react';
import { MatchTimeline } from '../../../../services/match';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../reducers';
import { getItemTooltip } from '../MatchItemHeader';
import { getItemIconUrl } from '../../../../common/helpers';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

type P = {
  summonerPuuid: string;
  timeline: MatchTimeline;
}

export const Items: React.FC<P> = ({ summonerPuuid, timeline }) => {
  const itemById = useSelector((state: AppState) => state.items.data);
  if (!timeline) return <Spin />;
  const { info: { participants, frames } } = timeline;
  const participantId = participants.find(({ puuid }) => puuid === summonerPuuid)!.participantId;

  const itemsFrames = frames.reduce((frameRes, frame) => {
    const eventItems = frame.events.reduce((eventRes, event) => {
      if (['ITEM_SOLD', 'ITEM_PURCHASED'].includes(event.type) && event.participantId === participantId) return [...eventRes, event];
      return eventRes;
    }, []);

    return eventItems.length ? [...frameRes, { time: frame.timestamp, events: eventItems }] : frameRes;
  }, []);

  return (
    <Row className="participant-build-items" gutter={[16, 24]}>
      {itemsFrames.map(({ events, time }, id) => (
        <Col key={uuidv4()} className={id < (itemsFrames.length - 1) ? 'participant-build-items__tail' : ''}>
          <Row gutter={4} wrap={false}>
            {events.map(event => {
              const item = itemById[event.itemId!];
              return (
                <Col key={uuidv4()} className="participant-build-items__item">
                  <Tooltip title={getItemTooltip(item)}>
                    <img className={event.type === 'ITEM_SOLD' ? 'sold' : ''} src={getItemIconUrl(event.itemId!)} alt={item.name}/>
                    {event.type === 'ITEM_SOLD' && <CloseOutlined className="sold-icon" />}
                  </Tooltip>
                </Col>
              );
            })}
          </Row>
          <div className="participant-build-items__time">{(moment.duration(time, 'milliseconds').asMinutes() - 1).toFixed(0)} хв</div>
        </Col>
      ))}
    </Row>
  )
}