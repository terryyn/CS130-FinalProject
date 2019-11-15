import React from 'react';
import Meeting from './Meeting.js';
import renderer from 'react-test-renderer';

describe('Meeting page', () =>{
  test('snapshot renders', () => {
    const component = renderer.create(<Meeting/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});