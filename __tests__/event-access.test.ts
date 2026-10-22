import { describe, test, expect } from 'vitest';
import { canSeeExactLocation } from '@/lib/event-access';

describe('canSeeExactLocation', () => {
  const ev = { organizer_id: 'org-1', hide_location: true };

  test('anonymous cannot see hidden location', () => {
    expect(canSeeExactLocation(ev, { kind: 'anonymous' }, null)).toBe(false);
  });

  test('pending user cannot see hidden location', () => {
    expect(canSeeExactLocation(ev, { kind: 'user', userId: 'u-2' }, 'pending')).toBe(false);
  });

  test('rejected user cannot see hidden location', () => {
    expect(canSeeExactLocation(ev, { kind: 'user', userId: 'u-2' }, 'rejected')).toBe(false);
  });

  test('approved user sees hidden location', () => {
    expect(canSeeExactLocation(ev, { kind: 'user', userId: 'u-2' }, 'approved')).toBe(true);
  });

  test('organizer sees hidden location', () => {
    expect(canSeeExactLocation(ev, { kind: 'user', userId: 'org-1' }, null)).toBe(true);
  });

  test('open location visible to anonymous', () => {
    expect(
      canSeeExactLocation({ organizer_id: 'org-1', hide_location: false }, { kind: 'anonymous' }, null)
    ).toBe(true);
  });
});