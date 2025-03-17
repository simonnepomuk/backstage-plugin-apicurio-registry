import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { apicurioRegistryPlugin, ApicurioRegistryPage } from '../src/plugin';

createDevApp()
  .registerPlugin(apicurioRegistryPlugin)
  .addPage({
    element: <ApicurioRegistryPage />,
    title: 'Root Page',
    path: '/apicurio-registry',
  })
  .render();
