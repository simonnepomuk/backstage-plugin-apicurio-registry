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
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useApicurioMetadata } from '../../lib/hooks';
import { useApi } from '@backstage/core-plugin-api';
import { apicurioRegistryApiRef } from '../../lib/api';
import InfiniteLoader from 'react-window-infinite-loader';
import { SearchedVersion } from '../../lib/model';
import { MissingAnnotationEmptyState } from '@backstage/plugin-catalog-react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {},
    listItemTextSecondary: {
      fontSize: '0.8rem',
      color: theme.palette.text.secondary,
    },
  }),
);

type ApicurioArtifactVersionListProps = {
  onSelect: (version: SearchedVersion) => void;
};

export function ApicurioArtifactVersionList(
  props: Readonly<ApicurioArtifactVersionListProps>,
) {
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
      const newVersions = await api.fetchVersions(
        groupId || '',
        artifactId || '',
      );
      setCount(newVersions?.data?.count || 0);
      setApiVersions(prev => [...prev, ...(newVersions?.data?.versions ?? [])]);
      setIsNextPageLoading(false);
    },
    [isItemLoaded, api, groupId, artifactId],
  );

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
    if (selectedVersion) {
      props.onSelect(selectedVersion);
    }
  }, [selectedVersion, props]);

  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  const formatSecondaryText = (version: SearchedVersion): string => {
    const date = new Date(version.modifiedOn as string); // modifiedOn is always defined
    const formattedDate = date.toLocaleString();
    return `Modified: ${formattedDate} by ${version?.modifiedBy || 'Unknown'}`;
  };

  const Item: ({
    index,
    style,
  }: {
    index: number;
    style?: React.CSSProperties;
  }) => ReactElement = useCallback(
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

  if (!groupId || !artifactId) {
    return (
      <MissingAnnotationEmptyState
        annotation={['apicurio.io/groupId', 'apicurio.io/artifactId']}
      />
    );
  }

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
