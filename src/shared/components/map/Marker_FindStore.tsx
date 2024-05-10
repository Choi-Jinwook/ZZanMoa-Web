import React, { memo, useState, useEffect } from 'react';
import { MapMarker } from "react-kakao-maps-sdk";
import StoreOverlay from './StoreOverlay';
import StoreInfoWindow from '../SideNavigation/FindStore/StoreInfoWindow';

const Marker_FindStore = memo(({ map, position, storeId, content, store, onClose }) => {
    const [isActive, setIsActive] = useState(false);
    const [isInfoActive, setIsInfoActive] = useState(false);

    const handleMarkerClick = () => {
        setIsActive(!isActive);
        setIsInfoActive(!isInfoActive);        
    };

    useEffect(() => {
        if (map) {
            const handleClick = () => {
                setIsInfoActive(false);
            };
            kakao.maps.event.addListener(map, 'click', handleClick);

            return () => {
                kakao.maps.event.removeListener(map, 'click', handleClick);
            };
        }
    }, [map]);


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
                isActive={isActive}
                toggleActive={handleMarkerClick}
            />
            {isInfoActive && (
                <StoreInfoWindow store={store} onClose={() => {
                    setIsInfoActive(false);
                    onClose();
                }} />
            )}
        </>
    );
});

export default Marker_FindStore;
