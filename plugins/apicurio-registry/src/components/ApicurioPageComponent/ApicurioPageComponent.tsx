import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Content,
  ContentHeader,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { ApicurioArtifactVersionMetadataComponent } from '../ApicurioArtifactVersionMetadataComponent';
import { ApicurioArtifactRulesComponent } from '../ApicurioArtifactRulesComponent/ApicurioArtifactRulesComponent';
import { ApicurioArtifactComponent } from '../ApicurioArtifactComponent';

export const ApicurioPageComponent = () => (
  <Page themeId="tool">
    <Content>
      <ContentHeader title="Apicurio Registry Artifact">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item xs={12} md={12}>
          <ApicurioArtifactComponent />
        </Grid>
        <Grid item xs={12}>
          <ApicurioArtifactRulesComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
