import { Coords, PlaceData } from "@shared/types";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";

interface KakaoMapProps {
  mockMarker: PlaceData[];
  center: Coords;
}

const KakaoMap = ({ mockMarker, center }: KakaoMapProps) => {
  return (
    <Map
      center={{ lat: center.lat, lng: center.lng }}
      style={{ width: "100%", height: "360px" }}
    >
      {mockMarker.map(({ lat, lng, data }) => (
        <MapMarker key={data} position={{ lat: lat, lng: lng }}>
          <StoreInfoContainer>{data}</StoreInfoContainer>
        </MapMarker>
      ))}
    </Map>
  );
};

const StoreInfoContainer = styled.div`
  width: 100px;
  height: 20px;
`;

export default KakaoMap;
