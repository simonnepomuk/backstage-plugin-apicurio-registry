import { CodeSnippet } from '@backstage/core-components';
import { Box } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { apicurioRegistryApiRef } from '../../lib/api';
import { useAsyncRetry } from 'react-use';
import { isJsonString } from '../../lib/utils';
import { useApicurioMetadata } from '../../lib/hooks';

export function ApicurioArtifactVersionContentComponent(props: {
  artifactVersion: string;
}) {
  const { groupId, artifactId } = useApicurioMetadata();
  const { artifactVersion } = props;
  const api = useApi(apicurioRegistryApiRef);
  const {
    value: contentResponse,
    loading: isContentLoading,
    error: contentError,
  } = useAsyncRetry(async () => {
    if (artifactVersion) {
      return api.fetchVersionContent(
        groupId,
        artifactId,
        artifactVersion,
      );
    }
    return null;
  }, [groupId, artifactId, artifactVersion]);

  const selectedContent = useMemo(() => {
    if (contentResponse && contentResponse.data) {
      if (isJsonString(contentResponse.data)) {
        return JSON.stringify(JSON.parse(contentResponse.data), null, 2);
      }
      return contentResponse.data;
    }
    return null;
  }, [contentResponse]);
  return (
    <Box
      style={{
        height: '400px',
        overflowY: 'auto',
        padding: 2,
      }}
    >
      <CodeSnippet
        text={selectedContent}
        language="YAML"
        showLineNumbers
        customStyle={{ height: '100%' }} // Make snippet take available height
        // className={classes.codeSnippet} // Alternative styling
      />
    </Box>
  );
}
