import React, {useState} from 'react';
import {Link} from 'react-router-dom';

function Sidebar() {
    return <div>
        <Link to="/home">Home</Link>
        <Link to="/meeting">Meeting</Link>
    </div>;
}

export default Sidebar;