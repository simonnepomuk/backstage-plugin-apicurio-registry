import { apicurioRegistryPlugin } from './plugin';

describe('apicurio-registry', () => {
  it('should export plugin', () => {
    expect(apicurioRegistryPlugin).toBeDefined();
  });
});
