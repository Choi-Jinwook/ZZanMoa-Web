import { useEffect, useRef } from 'react';
import StyledInfoWindow from '@shared/components/StyledInfoWindow';
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

    markers.forEach((markerData) => {
      places.keywordSearch(markerData.name, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          const { y, x } = result[0];
          const markerPosition = new kakao.maps.LatLng(parseFloat(y), parseFloat(x));
          const marker = new kakao.maps.Marker({
            map: map,
            position: markerPosition,
          });

          const infoWindowContent = document.createElement('div');
          const root = createRoot(infoWindowContent);
          root.render(<StyledInfoWindow name={markerData.name} description={markerData.description} />);

          kakao.maps.event.addListener(marker, 'click', () => {
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
    });
  }, [markers, map]);

  return null;
};
export default Marker;
