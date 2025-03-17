import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const apicurioRegistryPlugin = createPlugin({
  id: 'apicurio-registry',
  routes: {
    root: rootRouteRef,
  },
});

export const ApicurioRegistryPage = apicurioRegistryPlugin.provide(
  createRoutableExtension({
    name: 'ApicurioRegistryPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
