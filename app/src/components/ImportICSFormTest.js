import React from 'react';
import ImportICSForm from './ImportICSForm.js';
import renderer from 'react-test-renderer';

describe('ImportICSForm', () =>{
  test('snapshot renders', () => {
    const component = renderer.create(<ImportICSForm/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});