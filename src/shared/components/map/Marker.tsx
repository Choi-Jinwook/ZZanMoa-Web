import { useEffect, useRef, useState } from 'react';
import StyledInfoWindow from '@shared/components/StyledInfoWindow';
import { createRoot } from 'react-dom/client';
import { MarkerInfo } from '@shared/types';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import selectedMarketsState from '@shared/atoms/MarketState';
import { markersState } from '@shared/atoms/MapState';

const Marker = ({ map }: { map: kakao.maps.Map }) => {
  const [markers, setMarkers] = useRecoilState(markersState);
  const setSelectedMarkets = useSetRecoilState(selectedMarketsState);
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);
  const circleOverlaysRef = useRef(new Map());

  const [focusedMarkerId, setFocusedMarkerId] = useState<number | null>(null);

  const closeInfoWindow = () => {
    console.log("Closing InfoWindow for marker", focusedMarkerId);
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
      if (focusedMarkerId !== null) {
        setMarkers(prevMarkers => prevMarkers.map(marker =>
          marker.id === focusedMarkerId ? { ...marker, focus: false } : marker
        ));
        setFocusedMarkerId(null);
      } else {
        setMarkers(prevMarkers => prevMarkers.map(marker => ({ ...marker, focus: false })));
      }
    }
  };

  const toggleAdded = (id: number) => {
    setMarkers(markers => markers.map(marker =>
      marker.id === id ? { ...marker, added: !marker.added } : marker
    ));
    const updatedMarkers = markers.map(marker => {
      if (marker.id === id) {
        const newAddedStatus = !marker.added;
        const updatedMarker = { ...marker, added: newAddedStatus };
        updateCircleOverlay(updatedMarker, newAddedStatus);
        return updatedMarker;
      }
      return marker;
    });
    setMarkers(updatedMarkers);
    const selectedMarkets = updatedMarkers.filter(marker => marker.added);
    setSelectedMarkets(selectedMarkets);
    localStorage.setItem('addedMarkers', JSON.stringify(selectedMarkets.map(market => market.id)));
  };

  useEffect(() => {
    kakao.maps.event.addListener(map, 'click', () => {
      closeInfoWindow();
    });

    const savedMarkers = JSON.parse(localStorage.getItem('addedMarkers') || '[]');
    console.log(savedMarkers);

    const handleMapClick = () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
        setMarkers(markers.map(marker => ({ ...marker, focus: false })));
      }
    };
  
    kakao.maps.event.addListener(map, 'click', handleMapClick);

    const initializeOrUpdateMarkers = () => {
      const places = new kakao.maps.services.Places();
      const needsUpdate = markers.some(marker => !marker.position);

      if (!needsUpdate) {
        markers.forEach(marker => {
          updateMarkerOnMap(marker, savedMarkers.includes(marker.id));
        });
        return;
      }

      Promise.all(markers.map(marker => {
        if (marker.position) {
          return Promise.resolve(marker);
        }
        return new Promise<MarkerInfo>((resolve, reject) => {
          places.keywordSearch(marker.name, (result, status) => {
            if (status === kakao.maps.services.Status.OK && result[0]) {
              const { y, x, address_name } = result[0];
              resolve({
                ...marker,
                address: address_name,
                position: { lat: parseFloat(y), lng: parseFloat(x) },
                added: savedMarkers.includes(marker.id),
                src: "/images/sample.png", 
              });
            } else {
              resolve(marker);
            }
          });
        });
      })).then(updatedMarkers => {
        setMarkers(updatedMarkers);
      });
    };

    initializeOrUpdateMarkers();
  }, [map, markers, setMarkers]);

  const handleMarkerClick = (markerId) => {
    setMarkers(prevMarkers => prevMarkers.map(marker => {
      if (marker.id === markerId) {
        return { ...marker, focus: !marker.focus };
      }
      return { ...marker, focus: false };
    }));
    setFocusedMarkerId(markerId);
  };

  function updateMarkerOnMap(marker, added) {
    console.log(marker.id);
    const markerPosition = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
    const imageSrc = getMarkerImage(marker.focus);
    const markerImage = new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(44, 51));

    const kakaoMarker = new kakao.maps.Marker({
      map: map,
      position: markerPosition,
      title: marker.name,
      image: markerImage,
      zIndex: 2
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

  function updateCircleOverlay(marker, display) {
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
      circleContent.style.zIndex = '-1';
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
