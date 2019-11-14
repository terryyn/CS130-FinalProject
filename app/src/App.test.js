import React from 'react';
import App from './App.js';
import renderer from 'react-test-renderer';

describe('App', () =>{
  test('snapshot renders', () => {
    const component = renderer.create(<App/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});