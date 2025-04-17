import { Handle, Position } from 'reactflow';
import { CELL_SIZE } from '../../../constants';

import './Event.css';

const EventNode = () => (
  <div
    className="event-node"
    style={{
      width: CELL_SIZE,
      height: CELL_SIZE,
    }}
  >
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
  </div>
);

export default EventNode;
