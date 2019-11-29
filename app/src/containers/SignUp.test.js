import React from 'react';
import SignUp from './SignUp.js';
import renderer from 'react-test-renderer';

describe('SignUp page', () =>{
  test('snapshot renders', () => {
    const component = renderer.create(<SignUp/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});