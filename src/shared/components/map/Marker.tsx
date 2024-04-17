import { useEffect, useRef, useState } from 'react';
import StyledInfoWindow from '@shared/components/StyledInfoWindow';
import { createRoot } from 'react-dom/client';
import { MarkerInfo } from '@shared/types';
import styled from 'styled-components';

interface MarkerProps {
  markers: MarkerInfo[];
  map: kakao.maps.Map;
}

const Marker: React.FC<MarkerProps> = ({ markers, map }) => {
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);
  const circleOverlaysRef = useRef(new Map());

  const [markerStates, setMarkerStates] = useState<MarkerInfo[]>(markers.map((marker, index) => ({
    ...marker,
    id: index,
    focus: false,
    added: marker.added || false
  })));

  const toggleAdded = (id: number) => {
    const updatedMarkers = markerStates.map(marker =>
      marker.id === id ? { ...marker, added: !marker.added } : marker
    );
    setMarkerStates(updatedMarkers);

    const storageData = updatedMarkers.filter(marker => marker.added).map(marker => marker.id);
    localStorage.setItem('addedMarkers', JSON.stringify(storageData));

    const circleOverlay = circleOverlaysRef.current.get(id);
    if (circleOverlay) {
      const currentDisplay = circleOverlay.getContent().style.display;
      circleOverlay.getContent().style.display = currentDisplay === 'none' ? 'block' : 'none';
    }
  };

  useEffect(() => {
    const addedMarkers = JSON.parse(localStorage.getItem('addedMarkers') || '[]');
    console.log(addedMarkers);
    
    addedMarkers.forEach((id: any) => {
      // const circleOverlay = circleOverlaysRef.current.get(id);
      // if (circleOverlay) {
      //   const content = circleOverlay.getContent();
      //   content.style.display = content.style.display === 'none' ? 'block' : 'none';
      // }
    });

    const places = new kakao.maps.services.Places();

    markerStates.forEach((markerData) => {
      places.keywordSearch(markerData.name, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          const { y, x } = result[0];
          const markerPosition = new kakao.maps.LatLng(parseFloat(y), parseFloat(x));
          const imageSrc = getMarkerImage(markerData.focus);
          const markerImage = new kakao.maps.MarkerImage(
            imageSrc,
            new kakao.maps.Size(44, 51)
          );
          const marker = new kakao.maps.Marker({
            map: map,
            position: markerPosition,
            image: markerImage,
            zIndex: 2,
          });

          let circleOverlay = circleOverlaysRef.current.get(markerData.id);

          if (!circleOverlaysRef.current.has(markerData.id)) {

            const circleContent = document.createElement('div');
            circleContent.style.position = 'absolute';
            circleContent.style.width = '75px';
            circleContent.style.height = '75px';
            circleContent.style.borderRadius = '50%';
            circleContent.style.backgroundColor = 'rgba(16, 185, 129, 0.3)';
            circleContent.style.display = 'none';
            circleContent.style.transform = 'translate(-50%, -80%)';
            circleContent.style.zIndex = '-1';
            circleContent.style.pointerEvents = 'none';


            const circleOverlay = new kakao.maps.CustomOverlay({
              map: map,
              position: markerPosition,
              content: circleContent,
              zIndex: 1,
            });
            circleOverlaysRef.current.set(markerData.id, circleOverlay);
          }

          const infoWindowContent = document.createElement('div');
          const root = createRoot(infoWindowContent);
          root.render(
            <StyledInfoWindow
              name={markerData.name}
              description={markerData.description}
              added={markerData.added || false}
              onToggleAdded={() => toggleAdded(markerData.id)}
              overlayRef={circleOverlay}
            />
          );

          kakao.maps.event.addListener(marker, 'click', () => {
            const updatedMarkers = markerStates.map(m => ({
              ...m,
              focus: m.id === markerData.id
            }));
            console.log(markerData.id);

            setMarkerStates(updatedMarkers);
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }
            infoWindowRef.current = new kakao.maps.InfoWindow({
              content: infoWindowContent
            });
            infoWindowRef.current.open(map, marker);
          });
        }
      });
    });

    kakao.maps.event.addListener(map, 'click', () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      setMarkerStates(markerStates.map(marker => ({
        ...marker,
        focus: false
      })));
    });
  }, [map, markerStates]);

  function getMarkerImage(focus: boolean) {
    return focus ? '/images/selectedMarker.png' : '/images/defaultMarker.png';
  }

  return null;
};
export default Marker;
