/** Matches GET /v1/admin/skills's response shape (back/src/modules/skills/entities/skill.entity.ts). */
export interface SkillApiModel {
  id: string;
  name: string;
  slug: string;
}

/** Matches GET /v1/admin/skills/categories's response shape. */
export interface SkillCategoryEntity {
  id: string;
  key: string;
  label: string;
  order: number;
}

/** Matches GET /v1/admin/skills/categories/:categoryId/entries's response shape. */
export interface SkillCategoryEntryApiModel {
  id: string;
  skill: { id: string; name: string; slug: string };
  category: { id: string; key: string; label: string; order: number };
  level: string;
  order: number;
}
