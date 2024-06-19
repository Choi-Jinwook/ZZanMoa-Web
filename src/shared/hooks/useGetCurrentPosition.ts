import { useEffect, useState } from "react";

export const useGetCurrentPosition = () => {
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const { geolocation } = navigator;

    geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords;
      setCurrentPosition({ lat: latitude, lng: longitude });
    });
  }, []);

  return { currentPosition };
};
