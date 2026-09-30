/**
 * Matches the two symbols actually used in the current static data
 * (✓ acquired, ~ notions); ✗ is kept as a third option for a skill
 * explicitly listed as "not a fit" rather than simply absent.
 */
export enum SkillLevel {
  ACQUIRED = '✓',
  NOTIONS = '~',
  NOT_A_FIT = '✗',
}
