const { setPriority } = require('../modules/setPriority');

describe('setPriority function', () => {
  it('returns faible for empty array or invalid input', () => {
    expect(setPriority([])).toBe('faible');
  });

  it('returns urgent for a single blesse (50)', () => {
    expect(setPriority(['blesse'])).toBe('urgent');
  });

  it('calculates important for agressif + coince (60)', () => {
    expect(setPriority(['agressif', 'coince'])).toBe('important');
  });

  it('calculates modere for peureux + sain + petits', () => {
    expect(setPriority(['peureux', 'sain', 'petits'])).toBe('modere');
  });
});
