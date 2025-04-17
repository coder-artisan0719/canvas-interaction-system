import React from 'react';
import './summary.css';

type Props = {
  activities?: number
  events?: number
  connections?: number
}

const Summary = ({
  activities = 0,
  events = 0,
  connections = 0,
}: Props) => {
  return (
    <div className='summary-wrapper'>
      <h3>Summary</h3>
      
      <div className='summary-item'>
        <label>Activities: </label>
        <span>{activities}</span>
      </div>
      <div className='summary-item'>
        <label>Events: </label>
        <span>{events}</span>
      </div>
      <div className='summary-item'>
        <label>Connections: </label>
        <span>{connections}</span>
      </div>
    </div>
  );
};

export default Summary;
