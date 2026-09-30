/** Matches back/src/modules/projects/entities/*.ts's public shape (GET /v1/projects). */
export interface ProjectApiModel {
  id: string;
  date: string;
  name: string;
  company: string;
  category: string;
  type: string;
  status: string;
  description: string;
  order: number;
  published: boolean;
  skills: { id: string; name: string; slug: string }[];
  links: { id: string; label: string; url: string; order: number }[];
  previewImage?: { id: string; filename: string; url: string; altText?: string };
}
