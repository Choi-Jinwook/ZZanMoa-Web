import React, { memo } from 'react';
import { MapMarker } from "react-kakao-maps-sdk";
import StoreOverlay from './StoreOverlay';

const Marker_FindStore = memo(({ map, position, content, store, onClose }) => {
    return (
        <>
            <MapMarker
                map={map}
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
});

export default Marker_FindStore;
