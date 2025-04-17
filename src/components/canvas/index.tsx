import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
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
import constants from '../../constants';
import ActivityNode from './nodes/Activity';
import EventNode from './nodes/Event';
import ToolBox from './toolbox';
import './canvas.css';

const snapToBorder = (x: number) => Math.round(x / constants.CELL_SIZE) * constants.CELL_SIZE;
const snapToCell = (x: number, y: number) => [Math.round(x / constants.CELL_SIZE) * constants.CELL_SIZE, Math.round(y / constants.CELL_SIZE) * constants.CELL_SIZE];

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

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!rfInstance || !wrapperRef.current || !dragType) return;
  
    const bounds = wrapperRef.current.getBoundingClientRect();
    const pos = rfInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    const [xCell, yCell] = snapToCell(pos.x, pos.y);
    const xBorder = snapToBorder(pos.x);

    const isOnBorder = (xBorder % constants.CELL_SIZE) === 0;
    
    if (dragType === 'activity' && !isOnBorder) {
      alert('Activities must be dropped on borders between cells.');
      return;
    }

    if (dragType === 'event' && (!Number.isFinite(xCell) || !Number.isFinite(yCell))) {
      alert('Invalid drop for event.');
      return;
    }
  
    const id = `${dragType}-${Date.now()}`;
    const newNode: Node = {
      id,
      type: dragType,
      position: dragType === 'activity' ? { x: xBorder, y: yCell } : { x: xCell, y: yCell },
      data: { span: activitySpan },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  
    requestAnimationFrame(() => {
      setNodes((nds) => [...nds, newNode]);
    });
  }, [dragType, rfInstance, activitySpan]);

  const onConnect = useCallback((params: Connection | Edge) => {
    const sourceNode = nodes.find((n) => n.id === params.source);
    const targetNode = nodes.find((n) => n.id === params.target);

    if (!sourceNode || !targetNode) return;

    const valid = (
      (sourceNode.type === 'event' && targetNode.type === 'activity') ||
      (sourceNode.type === 'activity' && targetNode.type === 'event')
    );

    if (!valid) {
      alert('Only EVENT between ACTIVITY connections allowed.');
      return;
    }

    setEdges((eds) =>
      addEdge({
        ...params,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#fff', strokeWidth: 1.5 },
      }, eds)
    );
  }, [nodes]);

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
    if (nodeType === constants.NODE_TYPES.ACTIVITY) {
      setDragType('activity');
      setActivitySpan(e.shiftKey ? 4 : 2);
    } else if (nodeType === constants.NODE_TYPES.EVENT) {
      setDragType('event');
    }
  }

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
            connections: edges.length
          }}
        />

        <div ref={wrapperRef} className='react-flow-wrapper'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onInit={setRfInstance}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onDrop={onDrop}
            onConnect={onConnect}
            onDragOver={(e) => e.preventDefault()}
            onEdgeUpdate={(oldEdge, newConnection) =>
              setEdges((eds) => addEdge({ ...newConnection, style: oldEdge.style, markerEnd: oldEdge.markerEnd }, eds.filter((e) => e.id !== oldEdge.id)))
            }
            edgesUpdatable
            fitView
            snapGrid={[25, 25]}
          >
            <Background gap={constants.CELL_SIZE} color="#35a9db" />
            <MiniMap nodeColor={(n) => (n.type === 'activity' ? '#ffd600' : '#00e5ff')} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default Canvas;
