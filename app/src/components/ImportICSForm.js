import React, { useState, Fragment } from 'react';
import Dropzone from 'react-dropzone-uploader';
import './ImportICSForm.css';
import 'react-dropzone-uploader/dist/styles.css';

function ImportICS(props) {
	return (
		<div className="form">
			<h1>Import your calendar</h1>
			<Dropzone
				getUploadParams={() => {}}
				onChangeStatus={() => {}}
				onSubmit={() => {}}
				multiple={false}
				inputContent="Upload an .ics file"
				accept=".ics"
			/>
		</div>
	);
}

export default ImportICS;
