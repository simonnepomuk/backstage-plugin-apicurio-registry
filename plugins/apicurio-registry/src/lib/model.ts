import type { components, paths } from '../generated/api/apicurio-registry';

export const annotations = {
  groupId: 'apicur.io/registry.groupId',
  artifactId: 'apicur.io/registry.artifactId',
};

export type ArtifactRuleConfig =
  paths['/groups/{groupId}/artifacts/{artifactId}/rules/{ruleType}']['get']['responses'][200]['content']['application/json'];

export type SearchedVersion = components['schemas']['SearchedVersion'];
