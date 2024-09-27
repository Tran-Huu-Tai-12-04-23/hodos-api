import * as Location from "expo-location";
import { LocationObject, PermissionStatus } from "expo-location";
import { useEffect, useState } from "react";

export const useCurrentLocation = (): [
  LocationObject | null,
  PermissionStatus | null
] => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [permission, setPermission] = useState<PermissionStatus | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermission(status);

      if (status !== "granted") {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };

    getLocation();
  }, []);

  return [location, permission];
};
