/*
  # Create sensor data table for ESP32 IoT tracking

  1. New Tables
    - `sensor_data`
      - `id` (uuid, primary key)
      - `latitude` (float8) - GPS latitude coordinate
      - `longitude` (float8) - GPS longitude coordinate
      - `acc_x` (integer) - Accelerometer X-axis reading
      - `acc_y` (integer) - Accelerometer Y-axis reading
      - `acc_z` (integer) - Accelerometer Z-axis reading
      - `gyro_x` (integer) - Gyroscope X-axis reading
      - `gyro_y` (integer) - Gyroscope Y-axis reading
      - `gyro_z` (integer) - Gyroscope Z-axis reading
      - `valid` (boolean) - GPS signal validity status
      - `created_at` (timestamptz) - Timestamp of data reception
  
  2. Security
    - Enable RLS on `sensor_data` table
    - Add policy for public read access (for dashboard viewing)
    - Add policy for service role to insert data (for MQTT bridge)
  
  3. Important Notes
    - Data retention: Consider adding cleanup for old records
    - Indexes added for querying by timestamp
    - This table stores real-time sensor readings from ESP32
*/

CREATE TABLE IF NOT EXISTS sensor_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude float8 NOT NULL DEFAULT 0,
  longitude float8 NOT NULL DEFAULT 0,
  acc_x integer NOT NULL DEFAULT 0,
  acc_y integer NOT NULL DEFAULT 0,
  acc_z integer NOT NULL DEFAULT 0,
  gyro_x integer NOT NULL DEFAULT 0,
  gyro_y integer NOT NULL DEFAULT 0,
  gyro_z integer NOT NULL DEFAULT 0,
  valid boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sensor data"
  ON sensor_data
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to read sensor data"
  ON sensor_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS sensor_data_created_at_idx ON sensor_data(created_at DESC);
