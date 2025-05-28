import { StructuredMetadataTable } from '@backstage/core-components';

import {SearchedVersion} from "../../lib/model";

export const ApicurioArtifactVersionMetadataComponent = (props: {
  artifactVersion: SearchedVersion;
}) => {
  const { artifactVersion } = props;
  const metadata = {
    'Global ID': artifactVersion.globalId,
    'Content ID': artifactVersion.contentId,
    'Artifact ID': artifactVersion.artifactId,
    Group: artifactVersion.groupId,
    Version: artifactVersion.version,
    createdOn: new Date(artifactVersion.createdOn).toLocaleString(),
    Owner: artifactVersion.owner || 'Unknown',
    State: artifactVersion.state,
    'Modified On': artifactVersion.modifiedOn
      ? new Date(artifactVersion.modifiedOn).toLocaleString()
      : 'N/A',
    'Modified By': artifactVersion.modifiedBy || 'Unknown',
  };

  return <StructuredMetadataTable metadata={metadata} />;
};
