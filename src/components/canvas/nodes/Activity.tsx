import { Handle, Position } from 'reactflow';
import { CELL_SIZE } from '../../../constants';
import './Activity.css';

type Props = {
  data: {
    span: number;
  };
};

const ActivityNode = ({ data }: Props) => {
  const width = (data?.span || 2) * CELL_SIZE;

  return (
    <div
      className="activity-node"
      style={{ width: CELL_SIZE * 2, maxWidth: CELL_SIZE * 2, height: CELL_SIZE }}

    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default ActivityNode;
