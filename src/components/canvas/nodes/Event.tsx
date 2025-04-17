import { Handle, Position } from 'reactflow';
import constants from '../../../constants';

const EventNode = () => (
  <div
    style={{
      width: constants.CELL_SIZE,
      height: constants.CELL_SIZE,
      background: '#00e5ff',
      borderRadius: '50%',
      border: '1px solid #0288d1',
      boxSizing: 'border-box',
    }}
  >
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
  </div>
);

export default EventNode;
