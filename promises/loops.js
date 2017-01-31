"use strict";

exports.while = (condition, action) => Promise.resolve(condition())
  .then(function (conditionResult) {
    if (conditionResult) {
      return Promise.resolve(action()).then(() => exports.while(condition, action));
    }
  });

exports.for = (setup, condition, increment, action) => Promise.resolve(setup())
  .then(function (initialValue) {
    var incrementValue = initialValue;

    var whileCondition = () => Promise.resolve(condition(incrementValue));

    var whileAction = () => Promise.resolve(action(incrementValue))
      .then(() => Promise.resolve(increment(incrementValue)))
      .then(function (newValue) {
      incrementValue = newValue;
      });

    return exports.while(whileCondition, whileAction);
  });
