import React from 'react';
import StyleForm from './addeventForm.js';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import {shallow,configure } from 'enzyme';


configure({adapter: new Adapter()});

describe('add event form', () =>{
  let  component;
  beforeEach (() => {
    component = shallow(<StyleForm/>).dive();
  });

  test('snapshot renders', () => {
    const component = renderer.create(<StyleForm/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('handle start date change', () => {
    const event = {
      target: {value: '2019-11-15'}
    };
    
    component.find('#startdate-input').simulate('change', event);
    expect(component.state('startdate')).toBe('2019-11-15');
  });

  test('handle start time change', () => {
    const event = {
      target: {value: '14:15'}
    };
    
    component.find('#starttime-input').simulate('change', event);
    expect(component.state('starttime')).toBe('14:15');
  });

  test('handle name change', () => {
    const event = {
      target: {value: 'class'}
    };
    
    component.find('#name-input').simulate('change', event);
    expect(component.state('name')).toBe('class');
  });

  test('handle type change', () => {
    const event = {
      target: {value: 2}
    };
    
    component.find('#type-input').simulate('change', event);
    expect(component.state('type')).toBe(2);
  });
});