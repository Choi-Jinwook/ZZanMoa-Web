import { useEffect, useRef, useState } from 'react';
import StyledInfoWindow from '@shared/components/StyledInfoWindow';
import { createRoot } from 'react-dom/client';
import { MarkerInfo } from '@shared/types';
import { useRecoilState, useSetRecoilState } from 'recoil';
import selectedMarketsState from '@shared/atoms/MarketState';
import { markersState } from '@shared/atoms/MapState';

const Marker = ({ map }: { map: kakao.maps.Map }) => {
  const [markers, setMarkers] = useRecoilState(markersState);
  const setSelectedMarkets = useSetRecoilState(selectedMarketsState);
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);
  const circleOverlaysRef = useRef(new Map());

  const [focusedMarkerId, setFocusedMarkerId] = useState<number | null>(null);

  const closeInfoWindow = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
      if (focusedMarkerId !== null) {
        setMarkers(prevMarkers => prevMarkers.map(marker => {
          if (marker.id === focusedMarkerId) {
            const updatedMarker = {...marker, focus: false};
            updateMarkerOnMap(updatedMarker, marker.added);
            return updatedMarker;
          }
          return marker;
        }));
        setFocusedMarkerId(null);
      }
    }
  };

  const toggleAdded = (id: number) => {
    setMarkers(prevMarkers => {
      return prevMarkers.map(marker => {
        if (marker.id === id) {
          const newAddedStatus = !marker.added;
          updateCircleOverlay(marker, newAddedStatus);
          return { ...marker, added: newAddedStatus };
        }
        return marker;
      });
    });
  };
  
  useEffect(() => {
    const selectedMarkets = markers.filter(marker => marker.added);
    setSelectedMarkets(selectedMarkets);
    localStorage.setItem('addedMarkers', JSON.stringify(selectedMarkets.map(market => market.id)));
  }, [markers]);

  useEffect(() => {
    const places = new kakao.maps.services.Places();
    const savedMarkers = JSON.parse(localStorage.getItem('addedMarkers') || '[]');
  
    if (!map) return;
  
    const markerUpdates = markers.filter(marker => !marker.position)
      .map(marker => new Promise(resolve => {
        places.keywordSearch(marker.name, (result, status) => {
          if (status === kakao.maps.services.Status.OK && result[0]) {
            const updatedMarker = {
              ...marker,
              address: result[0].address_name,
              position: { lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) },
              added: savedMarkers.includes(marker.id),
              src: "/images/sample.png", 
            };
            updateMarkerOnMap(updatedMarker, updatedMarker.added);
            resolve(updatedMarker);

          } else {
            console.error(`Failed to find location: ${marker.name}`);
            resolve({ ...marker});
          }
        });
      }));
  
    Promise.all(markerUpdates).then(newMarkers => {
      setMarkers((prev: MarkerInfo[]): MarkerInfo[] => {
        return prev.map(marker => {
          const updated = newMarkers.find(m => m.id === marker.id);
          return updated || marker;
        });
      });
    });
  
    const handleMapClick = () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
        setMarkers(prev => prev.map(marker => ({ ...marker, focus: false })));
      }
    };
  
    kakao.maps.event.addListener(map, 'click', handleMapClick);
    return () => kakao.maps.event.removeListener(map, 'click', handleMapClick);
  }, [map]);
  
  const handleMarkerClick = (markerId: any) => {
    closeInfoWindow();
    setMarkers(prevMarkers => prevMarkers.map(marker => {
      const focused = marker.id === markerId ? !marker.focus : false;
      if (marker.id === markerId) {
        updateMarkerOnMap({...marker, focus: true}, marker.added);
      }
      return { ...marker, focus: false };
    }));
    setFocusedMarkerId(markerId);
  };
  

  function updateMarkerOnMap(marker: any, added: boolean) {
    const markerPosition = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
    const imageSrc = getMarkerImage(marker.focus);
    const markerImage = new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(44, 51));

    const kakaoMarker = new kakao.maps.Marker({
      map: map,
      position: markerPosition,
      title: marker.name,
      image: markerImage,
      zIndex: -1,
    });

    const onToggleAdded = () => {
      toggleAdded(marker.id);
    };

    const infoWindowContent = document.createElement('div');
    const root = createRoot(infoWindowContent);
    root.render(<StyledInfoWindow {...marker} added={added} onToggleAdded={onToggleAdded} />);

    kakao.maps.event.addListener(kakaoMarker, 'click', () => {
      handleMarkerClick(marker.id);
      infoWindowRef.current = new kakao.maps.InfoWindow({ content: infoWindowContent });
      infoWindowRef.current.open(map, kakaoMarker);
    });

    updateCircleOverlay(marker, added);
  }

  function updateCircleOverlay(marker: MarkerInfo, display: boolean) {
    let circleOverlay = circleOverlaysRef.current.get(marker.id);
    if (!circleOverlay) {
      const circleContent = document.createElement('div');
      circleContent.style.position = 'absolute';
      circleContent.style.width = '75px';
      circleContent.style.height = '75px';
      circleContent.style.borderRadius = '50%';
      circleContent.style.backgroundColor = 'rgba(16, 185, 129, 0.3)';
      circleContent.style.display = display ? 'block' : 'none';
      circleContent.style.transform = 'translate(-50%, -80%)';
      circleContent.style.zIndex = '-3';
      circleContent.style.pointerEvents = 'none';

      circleOverlay = new kakao.maps.CustomOverlay({
        map: map,
        position: new kakao.maps.LatLng(marker.position.lat, marker.position.lng),
        content: circleContent,
        zIndex: -1,
      });
      circleOverlaysRef.current.set(marker.id, circleOverlay);
    } else {
      circleOverlay.getContent().style.display = display ? 'block' : 'none';
    }
  }

  function getMarkerImage(focus: boolean) {
    return focus ? '/images/selectedMarker.png' : '/images/defaultMarker.png';
  }

  return null;
};
export default Marker;
