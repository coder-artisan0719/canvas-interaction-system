import React from 'react';
import { NODE_TYPES } from '../../../constants';

import Summary from '../summary';
import './toolbox.css';

type Props = {
  onDragStart: (e: React.DragEvent, type: string) => void;
  onSave: () => void;
  onLoad: () => void;
  summary?: {
    activities: number;
    events: number;
    connections: number;
  };
};

const ToolBox = ({
  onDragStart,
  onSave,
  onLoad,
  summary,
}: Props) => {
  return (
    <div className='toolbox-wrapper'>
      <h3>Toolbox</h3>

      <div className='toolbox-item toolbox-nodes'>
        <label>Nodes</label>

        <div
          draggable
          onDragStart={(e) => onDragStart(e, NODE_TYPES.ACTIVITY)}
          className='activity-node-item'
        >
          Activity
        </div>
        <div
          draggable
          onDragStart={(e) => onDragStart(e, NODE_TYPES.EVENT)}
          className='event-node-item'
        >
          Event
        </div>
      </div>

      <div className='toolbox-item toolbox-actions'>
        <label>Actions</label>

        <button onClick={onSave} className='action-btn'>Save</button>
        <button onClick={onLoad} className='action-btn'>Load</button>
      </div>
      
      <Summary 
        activities={summary?.activities}
        events={summary?.events}
        connections={summary?.connections}
      />
    </div>
  );
};

export default ToolBox;
