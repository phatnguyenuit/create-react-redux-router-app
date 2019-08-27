#! /usr/bin/env node

const shell = require('shelljs');
const colors = require('colors');
const fs = require('fs');
const templates = require('./templates/templates.js');

const appName = process.argv[2];
const appDirectory = `${process.cwd()}/${appName}`;

const REQUIRED_PACKAGES = [
  'redux',
  'react-router',
  'react-redux',
  'redux-thunk',
  'react-router-dom',
];

const run = async () => {
  try {
    const success = await createReactApp();
    if (!success) {
      console.log(
        'Something went wrong while trying to create a new React app using create-react-app'
          .red,
      );
      return false;
    }
    await cdIntoNewApp();
    await installPackages();
    await updateTemplates();
    console.log('All done');
  } catch (error) {
    console.log(
      'Something went wrong while trying to create a new React Redux Router App using create-react-redux-router-app'
        .red,
    );
    return false;
  }
};
const createReactApp = () => {
  return new Promise(resolve => {
    if (appName) {
      shell.exec(`create-react-app ${appName}`, () => {
        console.log('Created react app');
        resolve(true);
      });
    } else {
      console.log('\nNo app name was provided.'.red);
      console.log('\nProvide an app name in the following format: ');
      console.log('\ncreate-react-redux-router-app ', 'app-name\n'.cyan);
      resolve(false);
    }
  });
};

const cdIntoNewApp = () => {
  console.log(`\ncd ${appDirectory}\n`.cyan);
  return new Promise((resolve, reject) => {
    process.chdir(`${appName}`);
    if (process.cwd() === appDirectory){
      resolve(true);
    }
    else {
      reject('Fail');
    }
  });
};

const installPackages = () => {
  const app_packages_comma_str = REQUIRED_PACKAGES.join(', ');
  const app_packages_space_str = REQUIRED_PACKAGES.join(' ');
  return new Promise(resolve => {
    console.log(`\nInstalling ${app_packages_comma_str}\n`.cyan);
    shell.exec(`yarn add ${app_packages_space_str}`, () => {
      console.log('\nFinished installing packages\n'.green);
      resolve();
    });
  });
};
const updateTemplates = () => {
  return new Promise(resolve => {
    let promises = [];
    Object.keys(templates).forEach((fileName, i) => {
      promises[i] = new Promise(res => {
        fs.writeFile(
          `${appDirectory}/src/${fileName}`,
          templates[fileName],
          function(err) {
            if (err) {
              return console.log(`${err}`.red);
            }
            res();
          },
        );
      });
    });
    Promise.all(promises).then(() => {
      resolve();
    });
  });
};

run();
