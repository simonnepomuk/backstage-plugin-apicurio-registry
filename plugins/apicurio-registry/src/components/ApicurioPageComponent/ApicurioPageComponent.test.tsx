import { act } from 'react';
import { ApicurioPageComponent } from './ApicurioPageComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  MockFetchApi,
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { createSearchedVersionsList } from '../../../test/testData';
import { ApicurioRegistryApi, apicurioRegistryApiRef } from '../../lib/api';

jest.mock('../../lib/hooks', () => ({
  useApicurioMetadata: jest
    .fn()
    .mockReturnValue({ groupId: 'com.example', artifactId: 'test' }),
}));

const mockRegistryUrl = 'http://localhost:8080';
const mockRegistryApi = new ApicurioRegistryApi(
  { getBaseUrl: jest.fn().mockResolvedValue(mockRegistryUrl) },
  new MockFetchApi(),
);

describe('ApicurioPageComponent', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get(
        '*/apicurio-registry/api/groups/com.example/artifacts/test/versions',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({ count: 1, versions: createSearchedVersionsList() }),
          ),
      ),
      rest.get(
        '*/apicurio-registry/api/groups/com.example/artifacts/test/rules/*',
        (_, res, ctx) => res(ctx.status(404), ctx.json({})),
      ),
      rest.get(
        '*/apicurio-registry/api/groups/com.example/artifacts/test/versions/*/content',
        (_, res, ctx) => res(ctx.status(200), ctx.json({ mock: 'data' })),
      ),
    );
  });

  it('should render', async () => {
    await act(() =>
      renderInTestApp(
        <TestApiProvider apis={[[apicurioRegistryApiRef, mockRegistryApi]]}>
          <ApicurioPageComponent />
        </TestApiProvider>,
      ),
    );
    expect(screen.getByText('Artifact: com.example/test')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('"mock":', { exact: false })).toBeInTheDocument();
  });
});
