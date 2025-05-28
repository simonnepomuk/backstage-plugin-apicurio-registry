import { Grid } from '@material-ui/core';
import {
  Content,
  ContentHeader,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { ApicurioArtifactRulesComponent } from '../ApicurioArtifactRulesComponent/ApicurioArtifactRulesComponent';
import { ApicurioArtifactComponent } from '../ApicurioArtifactComponent';
import { useApicurioMetadata } from '../../lib/hooks';

export const ApicurioPageComponent = () => {
  const { groupId, artifactId } = useApicurioMetadata();

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title={`Artifact: ${groupId}/${artifactId}`}>
          <SupportButton>Displays Info from the Apicurio Registry inside Backstage.</SupportButton>
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
};
