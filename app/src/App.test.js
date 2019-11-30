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

  test('mock sign up', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/');

    //make sure the log in page popos up
    await page.waitForSelector('#regLogin');

    // check nonexistent account
    // const signup = await page.$x("//Link[contains(text(),'Don\'t have an account? Sign Up')]");
    // if (signup) {
    //     await signup.click();
    // }
    await clickByText(page,"Don\'t have an account? Sign Up");

    await page.click('input[name=name');
    await page.type('input[name=name]','')
    await page.click('input[name=email]');
    await page.type('input[name=email]','yeyunong@hotmail.com');
    await page.click('input[name=password]');
    await page.type('input[name=password]','12345678');
    await page.keyboard.press('Enter');


    await page.$eval("#message-id", el => el.value = 'Invalid email. Must have a g.ucla.edu email');
  });
});

const clickByText = async (page, text) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);
  
  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found: ${text}`);
  }
};

const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};