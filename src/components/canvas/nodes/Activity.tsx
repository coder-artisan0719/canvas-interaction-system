import { Handle, Position } from "reactflow";
import constants from '../../../constants';
import './Activity.css';

type Props = {
  data: {
    span: number
  }
}

const ActivityNode = ({ data }: Props) => {
  const width = (data?.span || 2) * constants.CELL_SIZE;

  return (
    <div
      className="activity-node"
      style={{ width, height: constants.CELL_SIZE }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default ActivityNode;
