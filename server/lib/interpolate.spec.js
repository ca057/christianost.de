const { interpolateLinear } = require('./interpolate');

describe(interpolateLinear, () => {
  it('should interpolate basic values', () => {
    expect(interpolateLinear([0, 100], [1, 2])(50)).toBe(1.5);
    expect(interpolateLinear([0, 100], [0, 2])(50)).toBe(1);
    expect(interpolateLinear([0, 100], [1, 2])(75)).toBe(1.75);
    expect(interpolateLinear([0, 100], [0, 2])(75)).toBe(1.5);

    expect(interpolateLinear([50, 100], [1, 2])(75)).toBe(1.5);
    expect(interpolateLinear([50, 100], [0, 2])(75)).toBe(1);
  });

  it('should use the correct min and max', () => {
    expect(interpolateLinear([0, 100], [1, 2])(0)).toBe(1);
    expect(interpolateLinear([0, 100], [1, 2])(100)).toBe(2);
  });
});
