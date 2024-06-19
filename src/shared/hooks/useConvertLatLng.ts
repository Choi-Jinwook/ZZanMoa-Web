import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export const useConvertLatLng = (
  lat: number,
  lng: number,
  isInfoActive?: boolean,
) => {
  const [coord, setCoord] = useState({ lat: 0, lng: 0 });

  const fetchData = useCallback(async () => {
    if (lat !== 0 && lng !== 0) {
      const { data } = await axios.get(
        `https://dapi.kakao.com/v2/local/geo/transcoord.json?x=${lng}&y=${lat}&input_coord=WGS84&output_coord=WCONGNAMUL`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
          },
        },
      );

      setCoord({ lat: data.documents[0].y, lng: data.documents[0].x });
    }
  }, [lat, lng]);

  useEffect(() => {
    if (isInfoActive) {
      fetchData();
    }
  }, [lat, lng]);

  return { coord };
};
