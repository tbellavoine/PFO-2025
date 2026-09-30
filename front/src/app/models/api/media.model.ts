/** Matches GET /v1/admin/media's response shape (back/src/modules/media/entities/media.entity.ts). */
export interface MediaApiModel {
  id: string;
  filename: string;
  url: string;
  altText?: string;
}
