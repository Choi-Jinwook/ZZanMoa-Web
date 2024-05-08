// import { useState, useEffect, useRef } from 'react';
// import { useRecoilValue } from 'recoil';
// import { storeMarkerState } from '@shared/atoms/storeMarkerState';
// import { createRoot } from 'react-dom/client';
// import StoreInfoWindow from '../SideNavigation/FindStore/StoreInfoWindow';

// const Marker_FindStore = ({ map }: { map: kakao.maps.Map }) => {
//     const storeMarkers = useRecoilValue(storeMarkerState);
//     const geocoder = new kakao.maps.services.Geocoder();
//     const [markers, setMarkers] = useState(new Map());

//     const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);

//     useEffect(() => {
//         // info 닫기
//         function closeInfoWindow() {
//             if (infoWindowRef.current) {
//                 infoWindowRef.current.close();
//             }
//         }

//         function removeAllMarkers() {
//             markers.forEach((value, key) => {
//                 value.marker.setMap(null);
//                 markers.delete(key);
//             });
//             setMarkers(new Map());
//         }

//         kakao.maps.event.addListener(map, 'click', closeInfoWindow);

//         // 마커 추가
//         function addNewMarkers() {
//             console.log(storeMarkers);
            
//             const newMarkers = new Map();
//             storeMarkers.forEach(store => {

//                 if ( store.latitude && store.longitude) {
//                     const newPos = new kakao.maps.LatLng(store.latitude, store.longitude);
                    
//                     const marker = new kakao.maps.Marker({
//                         map: map,
//                         position: newPos,
//                         title: store.storeName
//                     });

//                     const infoWindowContent = document.createElement("div");
//                     const root = createRoot(infoWindowContent);
//                     root.render(
//                         <StoreInfoWindow store={store} onClose={closeInfoWindow} />
//                     );

//                     kakao.maps.event.addListener(marker, 'click', () => {
//                         if (infoWindowRef.current) {
//                             infoWindowRef.current.close();
//                         }
//                         infoWindowRef.current = new kakao.maps.InfoWindow({
//                             content: infoWindowContent,
//                         });
//                         infoWindowRef.current.open(map, marker);
//                     });

//                     newMarkers.set(store.storeId, { marker, overlay: null }); // overlay 관련 코드가 주석 처리되어 있으므로 여기도 반영
//                 } else {
//                     console.error("Location data missing for store:", store.storeName);
//                 }
//             });
//             setMarkers(newMarkers);
//         }


//         removeAllMarkers();
//         addNewMarkers();
//     }, [storeMarkers, map]);
//     return null;
// };

// export default Marker_FindStore;

