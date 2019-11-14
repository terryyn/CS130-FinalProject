import React from 'react';
import StyleForm from './addeventForm.js';
import renderer from 'react-test-renderer';

describe('add event form', () =>{
  test('snapshot renders', () => {
    const component = renderer.create(<StyleForm/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});