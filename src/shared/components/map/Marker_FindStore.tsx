import { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { storeMarkerState } from '@shared/atoms/storeMarkerState';
import { createRoot } from 'react-dom/client';
import StoreInfoWindow from '../SideNavigation/FindStore/StoreInfoWindow';

const Marker_FindStore = ({ map }: { map: kakao.maps.Map }) => {
    const storeMarkers = useRecoilValue(storeMarkerState);
    const geocoder = new kakao.maps.services.Geocoder();
    const [markers, setMarkers] = useState(new Map());

    const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);

    useEffect(() => {
        // info 닫기
        function closeInfoWindow() {
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
        }

        function removeAllMarkers() {
            markers.forEach((value, key) => {
                value.marker.setMap(null);
                markers.delete(key);
            });
            setMarkers(new Map());
        }

        kakao.maps.event.addListener(map, 'click', closeInfoWindow);

        // 마커 추가
        function addNewMarkers() {
            const newMarkers = new Map();
            storeMarkers.forEach(store => {
                // 가게 주소를 위도경도로 변환하여 반환
                if (!store.position && store.address) {
                    geocoder.addressSearch(store.address, (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            const newPos = new kakao.maps.LatLng(parseFloat(result[0].y), parseFloat(result[0].x));
                            // const content = document.createElement('div');
                            // content.className = 'custom-overlay';
                            // content.style.cssText = overlayStyle;
                            // content.innerHTML = `<strong>${store.storeName}</strong>`;
                            
                            // const overlay = new kakao.maps.CustomOverlay({
                            //     map: map,
                            //     position: newPos,
                            //     content: content,
                            //     yAnchor: 1.1
                            // });
                            const marker = new kakao.maps.Marker({
                                map: map,
                                position: newPos,
                                title: store.storeName
                            });

                            const infoWindowContent = document.createElement("div");
                            const root = createRoot(infoWindowContent);
                            root.render(
                                <StoreInfoWindow store={store} onClose={closeInfoWindow} />
                            );

                            kakao.maps.event.addListener(marker, 'click', () => {
                                if (infoWindowRef.current) {
                                    infoWindowRef.current.close();
                                }
                                infoWindowRef.current = new kakao.maps.InfoWindow({
                                    content: infoWindowContent,
                                });
                                infoWindowRef.current.open(map, marker);
                            });

                            newMarkers.set(store.storeId, { marker });
                        } else {
                            console.error("Fail");
                        }
                    });
                }
            });
            setMarkers(newMarkers);
        }

        removeAllMarkers();
        addNewMarkers();
    }, [storeMarkers, map]);
    return null;
};

export default Marker_FindStore;

