import { useEffect, useRef } from 'react';
import StyledInfoWindow from './StyledInfoWindow';
import { createRoot } from 'react-dom/client';
import { MarkerData } from '@shared/types';
import ReactDOM from 'react-dom';

interface MarkerProps {
  markers: MarkerData[];
  map: kakao.maps.Map;
}

const Marker: React.FC<MarkerProps> = ({ markers, map }) => {
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);

  useEffect(() => {
    const places = new kakao.maps.services.Places();

    markers.forEach((keyword) => {
      places.keywordSearch(keyword.name, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          const { y, x } = result[0];
          const markerPosition = new kakao.maps.LatLng(parseFloat(y), parseFloat(x));
          const marker = new kakao.maps.Marker({
            map: map,
            position: markerPosition,
          });

          const infoWindowContent = document.createElement('div');
          ReactDOM.render(
            <StyledInfoWindow name={keyword.name} description={keyword.description} />,
            infoWindowContent
          );

          const customOverlay = new kakao.maps.CustomOverlay({
            position: markerPosition,
            content: `<div class="marker-label">${keyword.name}</div>`,
            yAnchor: 3,
          });
          customOverlay.setMap(map);

          const infoWindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${keyword.name}<br>${keyword.description}<br><button onclick="alert('${keyword.name} 추가하기')">추가하기</button></div>`,
          });

          kakao.maps.event.addListener(marker, 'click', () => {
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }
            const infoWindowContent = document.createElement('div');
            const root = createRoot(infoWindowContent);
            root.render(<StyledInfoWindow name={keyword.name} description={keyword.description} />);
          
            infoWindow.setContent(infoWindowContent);
            infoWindow.open(map, marker);
            infoWindowRef.current = infoWindow;
          });
        }
      });
    });

    kakao.maps.event.addListener(map, 'click', () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    });
  }, [markers, map]);

  return null;
};
export default Marker;
