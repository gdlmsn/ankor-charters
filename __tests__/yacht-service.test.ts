import {
  AvailabilityInput,
  normalizeAvailability,
  parseLength,
} from '@/services/yacht-service';

describe('parseLength', () => {
  it('converts numeric meters to rounded meters string', () => {
    expect(parseLength('24.6')).toBe('25m');
  });

  it('returns original value when parsing fails', () => {
    expect(parseLength('twenty')).toBe('twenty');
  });

  it('returns em dash when value missing', () => {
    expect(parseLength(undefined)).toBe('—');
  });
});

describe('normalizeAvailability', () => {
  const base: AvailabilityInput = {};

  it('marks listings with active specials as inquiry', () => {
    expect(
      normalizeAvailability({
        ...base,
        isSpecialActive: true,
      })
    ).toBe('inquiry');
  });

  it('marks listings that do not accept weekly charters as booked', () => {
    expect(
      normalizeAvailability({
        ...base,
        acceptsWeeklyCharters: false,
      })
    ).toBe('booked');
  });

  it('defaults to available otherwise', () => {
    expect(normalizeAvailability(base)).toBe('available');
  });
});
