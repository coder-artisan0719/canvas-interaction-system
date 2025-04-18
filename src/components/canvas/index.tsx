import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Controls,
  ReactFlowProvider,
  addEdge,
  MarkerType,
  Position,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CELL_SIZE, NODE_TYPES, GRID_ROWS, GRID_COLS } from '../../constants';
import ActivityNode from './nodes/Activity';
import EventNode from './nodes/Event';
import ToolBox from './toolbox';
import GridCanvas from './GridCanvas';
import { toast } from 'react-toastify';
import './canvas.css';

const snapToCell = (x: number, y: number) => [
  Math.round(x / CELL_SIZE) * CELL_SIZE,
  Math.round(y / CELL_SIZE) * CELL_SIZE,
];

const nodeTypes = {
  activity: ActivityNode,
  event: EventNode,
};

const Canvas: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dragType, setDragType] = useState<'activity' | 'event' | ''>('');
  const [activitySpan, setActivitySpan] = useState(2);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  const isOnCellBorder = (x: number, y: number) => {
    const offsetX = x % CELL_SIZE;
    const offsetY = y % CELL_SIZE;
    const threshold = 30;
    const nearVerticalBorder = offsetX < threshold || offsetX > CELL_SIZE - threshold;
    const nearHorizontalBorder = offsetY < threshold || offsetY > CELL_SIZE - threshold;
    return nearVerticalBorder || nearHorizontalBorder;
  };

  const isNearActivityEnd = (x: number, y: number) => {
    const threshold = CELL_SIZE;
    for (const node of nodes) {
      if (node.type !== 'activity') continue;
      const span = node.data?.span || activitySpan;
      const head = node.position;
      const butt = {
        x: node.position.x + span * CELL_SIZE,
        y: node.position.y,
      };
      const nearHead = Math.abs(x - head.x) < threshold && Math.abs(y - head.y) < threshold;
      const nearButt = Math.abs(x - butt.x) < threshold && Math.abs(y - butt.y) < threshold;
      if (nearHead) return { target: node, pos: head };
      if (nearButt) return { target: node, pos: butt };
    }
    return null;
  };

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!rfInstance || !wrapperRef.current || !dragType) return;

    const bounds = wrapperRef.current.getBoundingClientRect();
    const pos = rfInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    let [xCell, yCell] = snapToCell(pos.x, pos.y);
    const col = xCell / CELL_SIZE;
    const row = yCell / CELL_SIZE;

    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
      toast.warning('Drop is outside of the 25x25 grid!', { className: 'toast-message' });
      return;
    }

    if (dragType === 'activity') {
      if (!isOnCellBorder(pos.x, pos.y)) {
        toast.warning('Activities must be dropped on cell borders only.', { className: 'toast-message' });
        return;
      }
      if (col + activitySpan > GRID_COLS) {
        toast.warning('Activity cannot span outside the grid.', { className: 'toast-message' });
        return;
      }
    }

    if (dragType === 'event') {
      const activity = isNearActivityEnd(pos.x, pos.y);
      if (!activity) {
        toast.warning('Events must be dropped at the head or butt of an activity.', { className: 'toast-message' });
        return;
      }
      const snapped = snapToCell(activity.pos.x, activity.pos.y);
      xCell = snapped[0];
      yCell = snapped[1];
    }

    const id = `${dragType}-${Date.now()}`;
    const newNode: Node = {
      id,
      type: dragType,
      position: { x: xCell, y: yCell },
      data: { span: activitySpan },
      width: dragType === 'activity' ? activitySpan * CELL_SIZE : CELL_SIZE,
      height: CELL_SIZE,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    requestAnimationFrame(() => {
      setNodes((nds) => [...nds, newNode]);
    });
  }, [dragType, rfInstance, activitySpan, nodes]);

  const onConnect = useCallback((params: Connection | Edge) => {
    const sourceNode = nodes.find((n) => n.id === params.source);
    const targetNode = nodes.find((n) => n.id === params.target);
    if (!sourceNode || !targetNode) return;

    const isValid =
      (sourceNode.type === 'event' && targetNode.type === 'activity') ||
      (sourceNode.type === 'activity' && targetNode.type === 'event');

    if (!isValid) {
      toast.warning('Only event-activity connections allowed.', { className: 'toast-message' });
      return;
    }

    if (sourceNode.type === 'event') {
      const alreadyConnected = edges.some((e) => e.source === sourceNode.id);
      if (alreadyConnected) {
        toast.warning('Each event can only connect to one activity.', { className: 'toast-message' });
        return;
      }
    }

    if (targetNode.type === 'event') {
      const alreadyConnected = edges.some((e) => e.target === targetNode.id);
      if (alreadyConnected) {
        toast.warning('Each event can only connect to one activity.', { className: 'toast-message' });
        return;
      }
    }

    setEdges((eds) =>
      addEdge(
        {
          ...params,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#fff', strokeWidth: 1.5 },
        },
        eds
      )
    );
  }, [nodes, edges]);

  const onSave = () => {
    localStorage.setItem('canvas-nodes', JSON.stringify(nodes));
    localStorage.setItem('canvas-edges', JSON.stringify(edges));
  };

  const onLoad = () => {
    const savedNodes = localStorage.getItem('canvas-nodes');
    const savedEdges = localStorage.getItem('canvas-edges');
    if (savedNodes) setNodes(JSON.parse(savedNodes));
    if (savedEdges) setEdges(JSON.parse(savedEdges));
  };

  const onDragStart = (e: any, nodeType: string) => {
    if (nodeType === NODE_TYPES.ACTIVITY) {
      setDragType('activity');
      setActivitySpan(e.shiftKey ? 2 : 1);
    } else if (nodeType === NODE_TYPES.EVENT) {
      setDragType('event');
    }
  };

  return (
    <ReactFlowProvider>
      <div className='canvas-wrapper'>
        <ToolBox
          onDragStart={onDragStart}
          onSave={onSave}
          onLoad={onLoad}
          summary={{
            activities: nodes.filter((n) => n.type === 'activity').length,
            events: nodes.filter((n) => n.type === 'event').length,
            connections: edges.length,
          }}
        />

        <div ref={wrapperRef} className='react-flow-wrapper'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onInit={(instance) => {
              setRfInstance(instance);
              setViewport({ ...instance.getViewport() });
            }}
            onMoveEnd={(e, vp) => setViewport({ ...vp })}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onDrop={onDrop}
            onConnect={onConnect}
            onDragOver={(e) => e.preventDefault()}
            onEdgeUpdate={(oldEdge, newConnection) =>
              setEdges((eds) =>
                addEdge(
                  {
                    ...newConnection,
                    style: oldEdge.style,
                    markerEnd: oldEdge.markerEnd,
                  },
                  eds.filter((e) => e.id !== oldEdge.id)
                )
              )
            }
            edgesUpdatable
            snapGrid={[CELL_SIZE, CELL_SIZE]}
            nodeExtent={[[0, 0], [GRID_COLS * CELL_SIZE, GRID_ROWS * CELL_SIZE]]}
            translateExtent={[[0, 0], [GRID_COLS * CELL_SIZE, GRID_ROWS * CELL_SIZE]]}
            fitView
            onNodeContextMenu={(event, node) => {
              event.preventDefault();
              setNodes((nds) => nds.filter((n) => n.id !== node.id));
              setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
            }}
            onEdgeContextMenu={(event, edge) => {
              event.preventDefault();
              setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            }}
          >
            <GridCanvas
              style={{
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                transformOrigin: '0 0',
              }}
            />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default Canvas;
