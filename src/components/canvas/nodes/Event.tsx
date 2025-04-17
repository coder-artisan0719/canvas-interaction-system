import { Handle, Position } from 'reactflow';
import constants from '../../../constants';
import './Event.css';

const EventNode = () => (
  <div
    className="event-node"
    style={{
      width: constants.CELL_SIZE,
      height: constants.CELL_SIZE,
    }}
  >
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
  </div>
);

export default EventNode;
