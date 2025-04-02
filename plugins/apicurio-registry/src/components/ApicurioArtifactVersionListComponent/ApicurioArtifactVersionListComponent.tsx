import {
  Box,
  createStyles,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAsyncRetry } from 'react-use';
import { useApicurioMetadata } from '../../lib/hooks';
import { useApi } from '@backstage/core-plugin-api';
import { apicurioRegistryApiRef, SearchedVersion } from '../../lib/api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {},
    listItemTextSecondary: {
      // Finer control over secondary text appearance if needed
      fontSize: '0.8rem',
      color: theme.palette.text.secondary,
    },
  }),
);

export function ApicuriosArtifactVersionList(props: {
  onChange: (version: SearchedVersion) => void;
}) {
  const classes = useStyles();
  const { groupId, artifactId } = useApicurioMetadata();
  const api = useApi(apicurioRegistryApiRef);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const {
    value: fetchVersionsResponse,
    loading,
    error,
  } = useAsyncRetry(
    async () => api.fetchVersions(groupId, artifactId),
    [groupId, artifactId],
  );
  const apiVersions = useMemo(
    () => fetchVersionsResponse?.data?.versions,
    [fetchVersionsResponse],
  );

  const selectedVersion = useMemo(
    () =>
      apiVersions && apiVersions.length > selectedIndex
        ? apiVersions[selectedIndex]
        : null,
    [apiVersions, selectedIndex],
  );

  const handleListItemClick = useCallback(
    (index: number) => {
      setSelectedIndex(index);
    },
    [selectedVersion, props],
  );

  useEffect(() => {
    props.onChange(selectedVersion);
  }, [selectedVersion, props]);

  const formatSecondaryText = (version: SearchedVersion): string => {
    const date = new Date(version.modifiedOn);
    const formattedDate = date.toLocaleString();
    return `Modified: ${formattedDate} by ${version.modifiedBy || 'Unknown'}`;
  };

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Box
      style={{
        height: '600px',
        overflowY: 'auto',
        padding: 2,
      }}
      className={classes.listContainer}
    >
      <Typography variant="h6" gutterBottom>
        Versions
      </Typography>
      <List component="nav" aria-label="api versions">
        {apiVersions.map((version, index) => (
          <ListItem
            button
            key={version.globalId}
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index)}
          >
            <ListItemText
              primary={version.version}
              secondary={formatSecondaryText(version)}
              secondaryTypographyProps={{
                className: classes.listItemTextSecondary,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
