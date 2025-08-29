import {
  DismissableBanner,
  Progress,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { apicurioRegistryApiRef } from '../../lib/api';
import { capitalize } from '../../lib/utils';
import { useApi } from '@backstage/core-plugin-api';
import { useApicurioMetadata } from '../../lib/hooks';
import { useAsyncRetry } from 'react-use';
import { ArtifactRuleConfig } from '../../lib/model';
import { MissingAnnotationEmptyState } from '@backstage/plugin-catalog-react';

export const ApicurioArtifactRulesComponent = () => {
  const { groupId, artifactId } = useApicurioMetadata();
  const api = useApi(apicurioRegistryApiRef);

  const { value, loading, error } = useAsyncRetry(async () => {
    return api.fetchArtifactRules(groupId || '', artifactId || '');
  }, []);

  if (!groupId || !artifactId) {
    return (
      <MissingAnnotationEmptyState
        annotation={['apicurio.io/groupId', 'apicurio.io/artifactId']}
      />
    );
  }

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (!value || value.length === 0) {
    return (
      <DismissableBanner
        variant="warning"
        message="Unable to load artifact rules"
        id="no-artifact-rules-warning"
      />
    );
  }

  const columns: TableColumn<ArtifactRuleConfig>[] = [
    {
      title: 'Rule',
      field: 'ruleType',
      render: renderValue => capitalize(renderValue.ruleType),
    },
    {
      title: 'Configuration',
      field: 'config',
      render: renderValue => capitalize(renderValue.config),
    },
  ];

  return (
    <Table
      title="Artifact Rules"
      options={{
        paging: false,
        search: false,
      }}
      columns={columns}
      data={value}
    />
  );
};
