import React from 'react';
import App from './App.js';
import renderer from 'react-test-renderer';
import {shallow, mount} from 'enzyme';
import Login from './containers/Login.js';

const faker = require('faker');
const puppeteer = require('puppeteer');

describe('App', () =>{
  test('snapshot renders', () => {
    const component = renderer.create(<App/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('mock log in', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('#regLogin');

    // check nonexistent account
    await page.click('input[name=email]');
    await page.type('input[name=email]','yeyunong@hotmail.com');
    await page.click('input[name=password]');
    await page.type('input[name=password]','12345678');
    await page.click('Button');

    await page.$eval("Snackbar", el => el.value = "Looks like you don't have an account. Let's get you signed up7");
  });
});