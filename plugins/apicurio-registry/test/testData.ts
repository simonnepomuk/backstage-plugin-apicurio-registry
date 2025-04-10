import { SearchedVersion } from '../src/lib/model';

export const createSearchedVersion = (
  options?: Partial<SearchedVersion>,
): SearchedVersion => {
  return {
    groupId: 'com.example',
    artifactId: 'test',
    version: '1.0.0',
    description: 'description',
    createdOn: new Date().toISOString(),
    owner: 'Inco Gnito',
    modifiedOn: new Date().toISOString(),
    modifiedBy: 'Inco Gnito',
    globalId: 1,
    contentId: 1,
    artifactType: 'OPENAPI',
    state: 'ENABLED',
    ...options,
  };
};

export const createSearchedVersionsList = (
  numberOfVersions: number = 10,
): SearchedVersion[] => {
  return range(1, numberOfVersions + 1).map(number =>
    createSearchedVersion({
      globalId: number,
      contentId: number,
      version: `${number}.0.0`,
    }),
  );
};

function range(start: number, stop: number, step: number = 1): number[] {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step,
  );
}
