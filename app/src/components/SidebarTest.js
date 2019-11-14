import React from 'react';
import Sidebar from './Sidebar.js';
import renderer from 'react-test-renderer';

describe('Sidebar', () =>{
  test('snapshot renders', () => {
    const component = renderer.create(<Sidebar/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});