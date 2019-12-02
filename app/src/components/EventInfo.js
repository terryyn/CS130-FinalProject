import React from 'react';
import './ImportICSForm.css';

function EventInfo(props) {
	return (
		<div className="form">
			<div>
				<h3 style={{ display: 'inline' }}>Name: </h3>
				{props.name}
			</div>
			<div>
				<h3 style={{ display: 'inline' }}>Location: </h3>
				{props.location}
			</div>
			<div>
				<h3 style={{ display: 'inline' }}>Description: </h3>
				{props.description}
			</div>
		</div>
	);
}

export default EventInfo;
