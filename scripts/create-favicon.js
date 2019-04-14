#!/usr/bin/env node

// eslint-disable-next-line import/no-extraneous-dependencies
const svgToPng = require('svg-to-png');
const path = require('path');
const fs = require('fs');

const cwd = process.cwd();
const iconInputName = 'icon.svg';
const outputFolder = 'src/assets';

const sizes = [16, 32, 48, 72, 96, 144, 168, 192, 512];

const promisifiedRename = (oldPath, newPath) =>
  new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, error => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });

const executePromises = (promises = []) =>
  promises.reduce(
    (lastPromise, nextPromise) => lastPromise.then(nextPromise),
    Promise.resolve(),
  );

// create tasks
const tasks = sizes.map(size => () => {
  console.group(size);
  console.log('create png');
  return svgToPng
    .convert(path.join(cwd, iconInputName), outputFolder, {
      defaultWidth: `${size}px`,
      defaultHeight: `${size}px`,
    })
    .then(() => {
      console.log('append size to name');
      const basePath = path.join(
        cwd,
        outputFolder,
        iconInputName.split('.')[0],
      );
      return promisifiedRename(
        `${basePath}.png`,
        `${basePath}${size.toString()}.png`,
      );
    })
    .then(() => {
      console.groupEnd(size);
    });
});

executePromises(tasks);
