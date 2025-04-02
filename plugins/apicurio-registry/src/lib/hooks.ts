import {useEntity} from "@backstage/plugin-catalog-react";
import {annotations} from "./model";

export function useApicurioMetadata() {
    const { entity } = useEntity();
    const groupId =
        entity.metadata.annotations?.[annotations.groupId];
    const artifactId =
        entity.metadata.annotations?.[annotations.artifactId];
    return { groupId, artifactId };
}