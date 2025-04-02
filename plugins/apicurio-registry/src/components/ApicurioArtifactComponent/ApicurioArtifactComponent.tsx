import React, { useMemo, useState } from 'react';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core';
import { CardTab, TabbedCard } from '@backstage/core-components';
import { ApicurioArtifactVersionMetadataComponent } from '../ApicurioArtifactVersionMetadataComponent';
import { ApicuriosArtifactVersionList } from '../ApicurioArtifactVersionListComponent';
import { SearchedVersion } from '../../lib/api';
import { ApicurioArtifactVersionContentComponent } from '../ApicurioArtifactVersionContentComponent';

const useStyles = makeStyles((theme: Theme) =>
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
  const apicurioUiBaseUrl = 'http://localhost:8888'
  const apicurioUiVersionUrl = useMemo<string | undefined>(() => {
    if (!selectedArtifactVersion) {
      return undefined;
    }
    return `${apicurioUiBaseUrl}/explore/${selectedArtifactVersion.groupId}/${selectedArtifactVersion.artifactId}/versions/${selectedArtifactVersion.version}`;
  }, [apicurioUiBaseUrl,  selectedArtifactVersion]);

  return (
    <Paper style={{ padding: 16 }}>
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12} sm={4} md={3}>
          <ApicuriosArtifactVersionList onChange={setSelectedArtifactVersion} />
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
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
