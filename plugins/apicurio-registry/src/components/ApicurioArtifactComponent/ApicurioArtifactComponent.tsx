import { useMemo, useState } from 'react';
import { Box, createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import { CardTab, TabbedCard } from '@backstage/core-components';
import { ApicurioArtifactVersionMetadataComponent } from '../ApicurioArtifactVersionMetadataComponent';
import { ApicurioArtifactVersionList } from '../ApicurioArtifactVersionListComponent';
import { ApicurioArtifactVersionContentComponent } from '../ApicurioArtifactVersionContentComponent';
import { SearchedVersion } from '../../lib/model';
import {configApiRef, useApi} from '@backstage/core-plugin-api';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  }),
);

export const ApicurioArtifactComponent = () => {
  const classes = useStyles();
  const [selectedArtifactVersion, setSelectedArtifactVersion] =
    useState<SearchedVersion>(undefined);
  const config = useApi(configApiRef);
  const apicurioUiBaseUrl = useMemo(() => config.getOptionalString('apicurio.ui.baseUrl'), [config]);
  const apicurioUiVersionUrl = useMemo<string | undefined>(() => {
    if (!selectedArtifactVersion) {
      return undefined;
    }
    return `${apicurioUiBaseUrl}/explore/${selectedArtifactVersion.groupId}/${selectedArtifactVersion.artifactId}/versions/${selectedArtifactVersion.version}`;
  }, [apicurioUiBaseUrl, selectedArtifactVersion]);

  return (
    <Paper style={{ padding: 16 }}>
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12} sm={12} md={4} lg={3}>
          <ApicurioArtifactVersionList onSelect={setSelectedArtifactVersion} />
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Box
            style={{
              height: '600px',
              overflowY: 'auto',
              padding: 2,
            }}
          >
            <TabbedCard
              deepLink={{
                link: apicurioUiVersionUrl,
                title: 'View in Registry UI',
              }}
              title="Details"
            >
              <CardTab label="Content">
                <ApicurioArtifactVersionContentComponent
                  artifactVersion={selectedArtifactVersion?.version}
                />
              </CardTab>
              <CardTab label="Metadata">
                <Box
                  style={{
                    height: '400px',
                    overflowY: 'auto',
                    padding: 2,
                  }}
                >
                  <ApicurioArtifactVersionMetadataComponent
                    artifactVersion={selectedArtifactVersion}
                  />
                </Box>
              </CardTab>
            </TabbedCard>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
