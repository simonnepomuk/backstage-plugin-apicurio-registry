import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { ApicurioRegistryApi, apicurioRegistryApiRef } from './lib/api';

export const apicurioRegistryPlugin = createPlugin({
  id: 'apicurio-registry',
  apis: [
    createApiFactory({
      api: apicurioRegistryApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) => {
        return new ApicurioRegistryApi(discoveryApi, fetchApi);
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const ApicurioRegistryPage = apicurioRegistryPlugin.provide(
  createRoutableExtension({
    name: 'ApicurioRegistryPage',
    component: () =>
      import('./components/ApicurioPageComponent').then(
        m => m.ApicurioPageComponent,
      ),
    mountPoint: rootRouteRef,
  }),
);

export const ApicurioArtifactComponent = apicurioRegistryPlugin.provide(
  createComponentExtension({
    name: 'ApicurioArtifactComponent',
    component: {
      lazy: () =>
        import('./components/ApicurioArtifactComponent').then(
          m => m.ApicurioArtifactComponent,
        ),
    },
  }),
);
