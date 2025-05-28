import {
  CodeSnippet,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { Box } from '@material-ui/core';
import { useMemo } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { apicurioRegistryApiRef } from '../../lib/api';
import { useAsyncRetry } from 'react-use';
import { isJsonString } from '../../lib/utils';
import { useApicurioMetadata } from '../../lib/hooks';

export function ApicurioArtifactVersionContentComponent(
  props: Readonly<{
    artifactVersion: string;
  }>,
) {
  const { groupId, artifactId } = useApicurioMetadata();
  const { artifactVersion } = props;
  const api = useApi(apicurioRegistryApiRef);
  const {
    value: contentResponse,
    loading: isContentLoading,
    error: contentError,
  } = useAsyncRetry(async () => {
    if (artifactVersion) {
      return api.fetchVersionContent(groupId, artifactId, artifactVersion);
    }
    return null;
  }, [groupId, artifactId, artifactVersion]);

  const selectedContent = useMemo(() => {
    if (contentResponse?.data) {
      if (isJsonString(contentResponse.data)) {
        return JSON.stringify(JSON.parse(contentResponse.data), null, 2);
      }
      return contentResponse.data;
    }
    return null;
  }, [contentResponse]);

  if (isContentLoading) {
    return <Progress />;
  } else if (contentError) {
    return <ResponseErrorPanel error={contentError} />;
  }

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
        language="yaml"
        showLineNumbers
        showCopyCodeButton
        customStyle={{ height: '100%' }}
      />
    </Box>
  );
}
