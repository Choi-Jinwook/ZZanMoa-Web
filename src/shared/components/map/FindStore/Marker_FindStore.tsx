import React, { memo } from "react";
import { MapMarker } from "react-kakao-maps-sdk";
import StoreOverlay from "./StoreOverlay";
import { StoreData } from "@shared/types";

export interface MarkerFindStoreProps {
  map: kakao.maps.Map;
  position: { lat: number; lng: number };
  content: string;
  store: StoreData;
  onClose: () => void;
}

const Marker_FindStore = memo<MarkerFindStoreProps>(
  ({ map, position, content, store, onClose }) => {
    return (
      <>
        <MapMarker
          // map={map}
          position={position}
          image={{
            src: "/images/transparentIcon.svg",
            size: {
              width: 1,
              height: 1,
            },
            options: {
              offset: {
                x: 0,
                y: 0,
              },
            },
          }}
        />
        <StoreOverlay
          map={map}
          position={position}
          content={content}
          onClose={onClose}
          store={store}
        />
      </>
    );
  },
);

Marker_FindStore.displayName = "Marker_FindStore";

export default Marker_FindStore;
