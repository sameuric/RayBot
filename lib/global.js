/**
  *     Global variables and libraries
  */


global.data = require('./data');
global.rand = require('crypto').randomInt;





/**
  *     Global functions
  */


global.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

global.mixArray = array => {
    array.forEach((e, i) => {
        const j = rand(i, array.length);
        [array[i], array[j]] = [array[j], array[i]];
    });
};