export function pWhile(condition: () => Promise<boolean>, action: () => Promise<void>): Promise<void> {
  return Promise.resolve(condition())
    .then(function checkCondition(conditionResult) {
      if (conditionResult) {
        return Promise.resolve(action()).then(() => pWhile(condition, action));
      } else {
        return Promise.resolve();
      }
    });
}

export function pFor<T>(setup: () => Promise<T>, condition: (currentValue: T) => boolean, increment: (currentValue: T) => T, action: (currentValue: T) => Promise<void>) {
  return Promise.resolve(setup())
    .then(function initialiseFor(initialValue) {
      let incrementValue = initialValue;

      let whileCondition = () => Promise.resolve(condition(incrementValue));

      let whileAction = () => Promise.resolve(action(incrementValue))
        .then(() => Promise.resolve(increment(incrementValue)))
        .then(function incrementFor(newValue): void {
          incrementValue = newValue;
        });

      return pWhile(whileCondition, whileAction);
    });
}
