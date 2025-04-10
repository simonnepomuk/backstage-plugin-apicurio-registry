import {
  Progress,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { apicurioRegistryApiRef } from '../../lib/api';
import React from 'react';
import { capitalize } from '../../lib/utils';
import { useApi } from '@backstage/core-plugin-api';
import { useApicurioMetadata } from '../../lib/hooks';
import { useAsyncRetry } from 'react-use';
import {ArtifactRuleConfig} from "../../lib/model";

export const ApicurioArtifactRulesComponent = () => {
  const { groupId, artifactId } = useApicurioMetadata();
  const api = useApi(apicurioRegistryApiRef);

  const { value, loading, error } = useAsyncRetry(
    async () => api.fetchArtifactRules(groupId, artifactId),
    [],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
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
