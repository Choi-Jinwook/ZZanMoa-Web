import { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { storeMarkerState } from '@shared/atoms/storeMarkerState';
import { StoreData } from '@shared/types';
import { createRoot } from 'react-dom/client';
import StoreInfoWindow from '../SideNavigation/FindStore/StoreInfoWindow';

const Marker_FindStore = ({ map }: { map: kakao.maps.Map }) => {
    const storeMarkers = useRecoilValue(storeMarkerState);
    const geocoder = new kakao.maps.services.Geocoder();
    const [markers, setMarkers] = useState<Map<string, { marker: kakao.maps.Marker, infoWindow: kakao.maps.InfoWindow }>>(new Map());
    const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);


    useEffect(() => {

        // const existingMarkers: kakao.maps.Marker[] = [];
        removeAllMarkers();

        console.log(storeMarkers);
        // console.log(existingMarkers);
        
        // 지도 강제 갱신
        function forceMapRefresh(map) {
            const currentCenter = map.getCenter();
            const slightShiftLat = currentCenter.getLat() + 0.0001;
            const slightShiftLng = currentCenter.getLng() + 0.0001;
        
            map.setCenter(new kakao.maps.LatLng(slightShiftLat, slightShiftLng));
        
            setTimeout(() => {
                map.setCenter(currentCenter);
            }, 100);
        }

        // info 닫기
        function closeInfoWindow() {
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
        }

        // 지도 위 마커 삭제
        // function removeAllMarkers() {
        //     existingMarkers.forEach(marker => marker.setMap(null));
        //     forceMapRefresh(map);
        // }
        
        function removeAllMarkers() {
            console.log("Removing all markers");
            markers.forEach((value, key) => {
                console.log(`Removing marker at: ${value.marker.getPosition().toString()}`);
                value.marker.setMap(null);
                markers.delete(key);
            });
            console.log(`삭제 후 마커: ${markers.size}`);
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
                            const newPos = new kakao.maps.LatLng(result[0].y, result[0].x);
                            const marker = new kakao.maps.Marker({
                                map: map,
                                position: newPos,
                                title: store.storeName
                            });

                            // existingMarkers.push(marker);
                            // console.log(existingMarkers);
                            
                            console.log(`Adding new marker for: ${store.storeName}`);

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

        return () => {
            markers.forEach((value, key) => {
                value.marker.setMap(map);
                value.marker.setMap(null);
            });
            // existingMarkers.forEach(marker => marker.setMap(null));
        };
    }, [storeMarkers, map]);
    return null;
};

export default Marker_FindStore;

