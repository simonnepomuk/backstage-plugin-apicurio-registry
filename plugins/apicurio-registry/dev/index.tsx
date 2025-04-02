import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { apicurioRegistryPlugin, RegistryApiInformationComponent } from '../src/plugin';

createDevApp()
  .registerPlugin(apicurioRegistryPlugin)
  .addPage({
    element: <RegistryApiInformationComponent />,
    title: 'Root Page',
    path: '/apicurio-registry.d.ts',
  })
  .render();
