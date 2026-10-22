/** Matches back/src/modules/profile/entities/profile.entity.ts's public shape. */
export interface ProfileApiModel {
  id: string;
  name: string;
  title: string;
  /** HTML fragments (may contain <strong>/<em>) — bind with [innerHTML], not text interpolation. */
  bioParagraphs: string[];
  softSkills: string[];
  cvUrl?: string;
}
