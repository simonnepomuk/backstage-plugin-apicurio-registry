import { apicurioRegistryPlugin } from './plugin';

describe('apicurio-registry.d.ts', () => {
  it('should export plugin', () => {
    expect(apicurioRegistryPlugin).toBeDefined();
  });
});
