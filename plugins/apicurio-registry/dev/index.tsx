import { createDevApp } from '@backstage/dev-utils';
import {ApicurioRegistryPage, apicurioRegistryPlugin} from '../src';

createDevApp()
  .registerPlugin(apicurioRegistryPlugin)
  .addPage({
    element: <ApicurioRegistryPage />,
    title: 'Root Page',
    path: '/apicurio-registry',
  })
  .render();
