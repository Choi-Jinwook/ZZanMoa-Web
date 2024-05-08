import { useEffect, useRef, useState } from "react";
import StyledInfoWindow from "@shared/components/StyledInfoWindow";
import { createRoot } from "react-dom/client";
import { MarkerInfo } from "@shared/types";
import { useRecoilState, useSetRecoilState } from "recoil";
import selectedMarketsState from "@shared/atoms/MarketState";
import { markersState } from "@shared/atoms/MapState";

const Marker_ComparePrice = ({ map }: { map: kakao.maps.Map }) => {
  const [markers, setMarkers] = useRecoilState(markersState);
  const setSelectedMarkets = useSetRecoilState(selectedMarketsState);
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);
  const circleOverlaysRef = useRef(new Map());
  const [focusedMarkerId, setFocusedMarkerId] = useState<number | null>(null);

  const toggleAdded = (id: number) => {
    setMarkers((prevMarkers) => {
      return prevMarkers.map((marker) => {
        if (marker.id === id) {
          const newAddedStatus = !marker.added;
          updateCircleOverlay(marker, newAddedStatus);
          return { ...marker, added: newAddedStatus };
        }
        return marker;
      });
    });
  };

  const handleMarkerClick = (markerId: number) => {
    closeInfoWindow();
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) => {
        const isFocused = marker.id === markerId;
        if (marker.id === markerId) {
          if (!marker.focus) {
            updateMarkerOnMap({ ...marker, focus: true }, marker.added);
          }
        } else {
          if (marker.focus) {
            updateMarkerOnMap({ ...marker, focus: false }, marker.added);
          }
        }
        return { ...marker, focus: isFocused };
      })
    );
    setFocusedMarkerId(markerId);
  };

  const closeInfoWindow = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) => {
          if (marker.focus) {
            updateMarkerOnMap({ ...marker, focus: false }, marker.added);
          }
          return { ...marker, focus: false };
        })
      );
      setFocusedMarkerId(null);
    }
  };

  useEffect(() => {
    const selectedMarkets = markers.filter((marker) => marker.added);
    setSelectedMarkets(selectedMarkets);
    localStorage.setItem(
      "addedMarkers",
      JSON.stringify(selectedMarkets.map((market) => market.id)),
    );
    console.log("첫번째 useEffect");
  }, [markers]);

  useEffect(() => {
    if (!map) return;

    const places = new kakao.maps.services.Places();
    const savedMarkers = JSON.parse(
      localStorage.getItem("addedMarkers") || "[]",
    );

    const markerUpdates = markers
      .filter((marker) => !marker.position)
      .map(
        (marker) =>
          new Promise((resolve) => {
            places.keywordSearch(marker.name, (result, status) => {
              if (status === kakao.maps.services.Status.OK && result[0]) {
                const updatedMarker = {
                  ...marker,
                  address: result[0].address_name,
                  position: {
                    lat: parseFloat(result[0].y),
                    lng: parseFloat(result[0].x),
                  },
                  added: savedMarkers.includes(marker.id),
                };
                updateMarkerOnMap(updatedMarker, updatedMarker.added);
                resolve(updatedMarker);
              } else {
                console.error(`Failed to find location: ${marker.name}`);
                resolve({ ...marker });
              }
            });
          }),
      );

    Promise.all(markerUpdates).then((newMarkers) => {
      setMarkers((prev: MarkerInfo[]): MarkerInfo[] => {
        return prev.map((marker) => {
          const updated = (newMarkers as MarkerInfo[]).find(
            (m) => m.id === marker.id,
          );
          return updated || marker;
        });
      });
    });

    kakao.maps.event.addListener(map, "click", closeInfoWindow);
    return () => kakao.maps.event.removeListener(map, "click", closeInfoWindow);
  }, [map]);


  function updateMarkerOnMap(marker: any, added: boolean) {
    const markerPosition = new kakao.maps.LatLng(
      marker.position.lat,
      marker.position.lng,
    );
    const imageSrc = getMarkerImage(marker.focus);
    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      new kakao.maps.Size(44, 51),
    );

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

    const infoWindowContent = document.createElement("div");
    infoWindowContent.style.backgroundColor = 'transparent';
    infoWindowContent.style.border = 'none';
    const root = createRoot(infoWindowContent);
    root.render(
      <StyledInfoWindow
        {...marker}
        added={added}
        onToggleAdded={onToggleAdded}
      />,
    );

    kakao.maps.event.addListener(kakaoMarker, "click", () => {
      handleMarkerClick(marker.id);
      infoWindowRef.current = new kakao.maps.InfoWindow({
        content: infoWindowContent,
      });
      infoWindowRef.current.open(map, kakaoMarker);
    });

    updateCircleOverlay(marker, added);
  }

  function updateCircleOverlay(marker: MarkerInfo, display: boolean) {
    let circleOverlay = circleOverlaysRef.current.get(marker.id);
    if (!circleOverlay) {
      const circleContent = document.createElement("div");
      circleContent.style.position = "absolute";
      circleContent.style.width = "75px";
      circleContent.style.height = "75px";
      circleContent.style.borderRadius = "50%";
      circleContent.style.backgroundColor = "rgba(16, 185, 129, 0.3)";
      circleContent.style.display = display ? "block" : "none";
      circleContent.style.transform = "translate(-50%, -80%)";
      circleContent.style.zIndex = "-3";
      circleContent.style.pointerEvents = "none";

      circleOverlay = new kakao.maps.CustomOverlay({
        map: map,
        position: new kakao.maps.LatLng(
          marker.position.lat,
          marker.position.lng,
        ),
        content: circleContent,
        zIndex: -1,
      });
      circleOverlaysRef.current.set(marker.id, circleOverlay);
    } else {
      circleOverlay.getContent().style.display = display ? "block" : "none";
    }
  }

  function getMarkerImage(focus: boolean) {
    return focus ? "/images/selectedMarker.png" : "/images/defaultMarker.png";
  }

  return null;
};
export default Marker_ComparePrice;
