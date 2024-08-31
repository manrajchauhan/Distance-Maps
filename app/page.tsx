"use client"
import React, { useState } from 'react';

export default function Home() {
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');

  const staticDestination = "19.0067059,73.066554";

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(calculateDistance, handleError);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        setError("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        setError("The request to get user location timed out.");
        break;
      default:
        setError("An unknown error occurred.");
        break;
    }
  };

  const calculateDistance = async (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const origin = `${latitude},${longitude}`;
    setOrigin(origin);

    try {
      const response = await fetch(`/api/distance?origin=${origin}&destination=${encodeURIComponent(staticDestination)}`);
      const data = await response.json();

      if (data.rows && data.rows[0].elements[0].status === 'OK') {
        setDistance(data.rows[0].elements[0].distance.text);
        setDuration(data.rows[0].elements[0].duration.text);
      } else {
        setError("Could not retrieve distance information.");
      }
    } catch (error) {
      setError("An error occurred while fetching distance information.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
      <div className="max-w-lg w-full border border-neutral-400 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">My Location to Destination</h1>
        <p className="text-lg"><strong>My Location:</strong> {origin}</p>
        <p className="text-lg"><strong>Destination:</strong> {staticDestination}</p>
        <button
          onClick={handleLocationPermission}
          className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition"
        >
          GET Distance
        </button>

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {distance && (
          <div className="mt-6 p-4 bg-gray-200 rounded-md">
            <p className="text-lg"><strong>Distance:</strong> {distance}</p>
            <p className="text-lg"><strong>Estimated Time:</strong> {duration}</p>
          </div>
        )}
      </div>
    </div>
  );
}
