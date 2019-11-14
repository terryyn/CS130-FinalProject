import React from 'react';
import DayView from './DayVIew.js';
import renderer from 'react-test-renderer';

describe('Day View', () =>{
  test('snapshot renders', () => {
    const component = renderer.create(<DayView/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});