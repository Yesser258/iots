// This interface defines the structure for all sensor data in your app
export interface SensorData {
  location: {
    latitude: number;
    longitude: number;
  };
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
  timestamp: string;
}

/**
 * Provides a set of default data so the dashboard doesn't
 * start empty before the first database message arrives.
 */
export function getSimulatedData(): SensorData {
  return {
    location: {
      latitude: 37.3382, // Default location (e.g., Apple Park)
      longitude: -122.0086,
    },
    accelerometer: {
      x: 0, // No acceleration
      y: 0, // No acceleration
      z: 1, // 1g of gravity pulling down
    },
    gyroscope: {
      x: 0, // No rotation
      y: 0, // No rotation
      z: 0, // No rotation
    },
    timestamp: new Date().toISOString(),
  };
}