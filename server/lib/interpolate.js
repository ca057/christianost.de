const interpolateLinear = (inputRange, outputRange) => value => {
  const [min, max] = inputRange;
  const [targetMin, targetMax] = outputRange;

  const actualValue = value - min;
  const currPercentage = actualValue / ((max - min) / 100) / 100;

  return targetMin + (targetMax - targetMin) * currPercentage;
};

module.exports = { interpolateLinear };
