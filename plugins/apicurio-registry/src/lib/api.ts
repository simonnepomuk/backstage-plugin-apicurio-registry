import createClient, { Client } from 'openapi-fetch';
import type { components, paths } from '@generated/api/apicurio-registry';
import {
  createApiRef,
  DiscoveryApi,
  FetchApi,
} from '@backstage/core-plugin-api';
import { SearchedVersion } from './model';

export const apicurioRegistryApiRef = createApiRef<ApicurioRegistryApi>({
  id: 'plugin.apicurio-registry.api',
});

export class ApicurioRegistryApi {
  private client: Client<paths> | undefined;
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(discoveryApi: DiscoveryApi, fetchApi: FetchApi) {
    this.discoveryApi = discoveryApi;
    this.fetchApi = fetchApi;
  }

  async getClient() {
    if (!this.client) {
      const baseUrl = await this.getBaseUrl();
      this.client = createClient({
        baseUrl,
        fetch: this.fetchApi.fetch,
      });
    }
    return this.client;
  }

  private async getBaseUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return `${proxyUrl}/apicurio-registry/api/`;
  }

  async fetchVersionContent(
    groupId: string,
    artifactId: string,
    versionExpression: string,
  ) {
    const client = await this.getClient();
    // eslint-disable-next-line new-cap
    return client.GET(
      '/groups/{groupId}/artifacts/{artifactId}/versions/{versionExpression}/content',
      {
        params: {
          path: {
            groupId,
            artifactId,
            versionExpression,
          },
        },
        parseAs: 'text',
      },
    );
  }

  async fetchVersions(
    groupId: string,
    artifactId: string,
    options?: {
      query?: {
        limit?: number;
        offset?: number;
        orderBy?: keyof SearchedVersion;
        order?: 'asc' | 'desc';
      };
    },
  ) {
    const client = await this.getClient();
    const defaultQuery = {
      limit: 20,
      offset: 0,
      orderBy: 'modifiedOn',
      order: 'asc' as const,
    };

    // eslint-disable-next-line new-cap
    return client.GET('/groups/{groupId}/artifacts/{artifactId}/versions', {
      params: {
        path: {
          groupId,
          artifactId,
        },
        query: {
          ...defaultQuery,
          ...options?.query,
        },
      },
    });
  }

  async fetchArtifactRules(groupId: string, artifactId: string) {
    const client = await this.getClient();
    return await Promise.all(
      (['VALIDITY', 'COMPATIBILITY', 'INTEGRITY'] as const).flatMap(
        async ruleType => {
          // eslint-disable-next-line new-cap
          const result = await client.GET(
            '/groups/{groupId}/artifacts/{artifactId}/rules/{ruleType}',
            {
              params: {
                path: {
                  groupId,
                  artifactId,
                  ruleType,
                },
              },
            },
          );
          return {
            ruleType,
            config: this.getConfigurationText(result.response, result.data),
          };
        },
      ),
    );
  }

  private getConfigurationText(
    response: Response,
    data?: components['schemas']['Rule'],
  ) {
    if (response.status === 404) {
      return 'Disabled';
    }
    if (response.status !== 200) {
      return 'Unable to retrieve configuration';
    }

    return data.config;
  }
}
