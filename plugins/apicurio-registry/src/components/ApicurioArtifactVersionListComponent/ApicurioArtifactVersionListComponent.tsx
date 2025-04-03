import {
  Box,
  createStyles,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { FixedSizeList } from 'react-window';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useApicurioMetadata } from '../../lib/hooks';
import { useApi } from '@backstage/core-plugin-api';
import { apicurioRegistryApiRef, SearchedVersion } from '../../lib/api';
import InfiniteLoader from 'react-window-infinite-loader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {},
    listItemTextSecondary: {
      fontSize: '0.8rem',
      color: theme.palette.text.secondary,
    },
  }),
);

export function ApicurioArtifactVersionList(props: {
  onSelect: (version: SearchedVersion) => void;
}) {
  const classes = useStyles();
  const { groupId, artifactId } = useApicurioMetadata();
  const api = useApi(apicurioRegistryApiRef);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [apiVersions, setApiVersions] = useState<SearchedVersion[]>([]);
  const [count, setCount] = useState<number>(9999);
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const hasNextPage = useMemo(
    () => apiVersions.length < count,
    [apiVersions, count],
  );

  const isItemLoaded = useCallback(
    (index: number) => !hasNextPage || index < apiVersions.length,
    [apiVersions, hasNextPage],
  );

  const loadNextPage = useCallback(
    async (startIndex: number) => {
      if (isItemLoaded(startIndex)) return;
      setIsNextPageLoading(true);
      const newVersions = await api.fetchVersions(groupId, artifactId, {
        query: { offset: apiVersions.length, limit: 20 },
      });
      setCount(newVersions?.data?.count);
      setApiVersions(prev => [...prev, ...newVersions?.data?.versions]);
      setIsNextPageLoading(false);
    },
    [isItemLoaded, api, groupId, artifactId, apiVersions.length],
  );

  useEffect(() => {
    loadNextPage(0);
  }, []);

  const selectedVersion = useMemo(
    () =>
      apiVersions && apiVersions.length > selectedIndex
        ? apiVersions[selectedIndex]
        : null,
    [apiVersions, selectedIndex],
  );

  const handleListItemClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  useEffect(() => {
    props.onSelect(selectedVersion);
  }, [selectedVersion, props]);

  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  const formatSecondaryText = (version: SearchedVersion): string => {
    const date = new Date(version?.modifiedOn);
    const formattedDate = date.toLocaleString();
    return `Modified: ${formattedDate} by ${version?.modifiedBy || 'Unknown'}`;
  };

  const Item = useCallback(
    ({ index, style }) => {
      if (!isItemLoaded(index)) {
        return <div style={style}>Loading...</div>;
      }

      const version = apiVersions[index];
      return (
        <ListItem
          button
          style={style}
          key={version?.globalId}
          selected={selectedIndex === index}
          onClick={() => handleListItemClick(index)}
        >
          <ListItemText
            primary={version?.version}
            secondary={formatSecondaryText(version)}
            secondaryTypographyProps={{
              className: classes.listItemTextSecondary,
            }}
          />
        </ListItem>
      );
    },
    [
      apiVersions,
      classes.listItemTextSecondary,
      handleListItemClick,
      isItemLoaded,
      selectedIndex,
    ],
  );

  return (
    <Box className={classes.listContainer}>
      <Typography variant="h6" gutterBottom>
        Versions
      </Typography>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={count}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            className="List"
            height={600}
            itemCount={count}
            itemSize={80}
            onItemsRendered={onItemsRendered}
            ref={ref}
            width="100%"
          >
            {Item}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    </Box>
  );
}
