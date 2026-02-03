import { useState } from "react";
import { useUserStore } from "../store/user.store";
import { getUserProfile, putUserLocation } from "../services/user.api"; // Import từ file của bạn

export const useUserActions = () => {
  const [loading, setLoading] = useState(false);
  const { setProfileData, profiles } = useUserStore();

  const fetchProfile = async (roleType: "farmer" | "coop" | "enterprise") => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      setProfileData(roleType, data);
      return data;
    } catch (err) {
      console.error("Hook Fetch Profile Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (
    roleType: "farmer" | "coop" | "enterprise",
    lat: number,
    lng: number,
  ) => {
    setLoading(true);
    try {
      const locationPayload = { latitude: lat, longitude: lng };

      const updatedLocationData = await putUserLocation(locationPayload);

      const currentProfile = profiles[roleType];
      if (currentProfile) {
        setProfileData(roleType, { ...currentProfile, ...locationPayload });
      }

      return updatedLocationData;
    } catch (err) {
      console.error("Hook Update Location Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { fetchProfile, updateLocation, loading };
};
