import { Handle, Position } from "reactflow";
import constants from '../../../constants';

type Props = {
  data: {
    span: number
  }
}

const ActivityNode = ({ data }: Props) => {
  const width = (data?.span || 2) * constants.CELL_SIZE;

  return (
    <div
      style={{
        width,
        height: constants.CELL_SIZE,
        background: '#ffd600',
        border: '1px solid #ff6f00',
        borderRadius: 4,
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default ActivityNode;
