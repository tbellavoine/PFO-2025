import { RenderMode, ServerRoute } from '@angular/ssr';
import { Path } from '@enums/path.enum';
import { ImageAssetsMap } from '@components/explorer/assets-images.const';

export const serverRoutes: ServerRoute[] = [
  {
    path: `${Path.PREVIEW}/:imageName`,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      Array.from(ImageAssetsMap.keys()).map((imageName) => ({ imageName })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
