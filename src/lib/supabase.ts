import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SensorDataRow {
  id: string;
  latitude: number;
  longitude: number;
  acc_x: number;
  acc_y: number;
  acc_z: number;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  valid: boolean;
  created_at: string;
}

export async function getLatestSensorData(): Promise<SensorDataRow | null> {
  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching sensor data:', error);
    return null;
  }

  return data;
}

// --- FONCTION CORRIGÉE POUR L'HISTORIQUE ---

// --- FONCTION CORRIGÉE POUR L'HISTORIQUE ---
export async function getSensorHistory(days: number = 2) { // Par défaut 2 jours pour éviter trop de données
  const date = new Date();
  date.setDate(date.getDate() - days);

  // On limite artificiellement à 1000 points pour ne pas faire ramer l'affichage
  // Cela suffit largement pour voir le tracé
  const { data, error } = await supabase
    .from('sensor_data')
    .select('latitude, longitude, created_at')
    .gte('created_at', date.toISOString())
    .order('created_at', { ascending: false }) 
    .limit(2000); 

  if (error) {
    console.error('Error fetching history:', error);
    return [];
  }
  
  // On remet dans l'ordre chronologique (Ancien -> Récent) pour le tracé
  return data ? data.reverse() : [];
}

export function subscribeSensorData(callback: (data: SensorDataRow) => void) {
  const channel = supabase
    .channel('sensor_data_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'sensor_data',
      },
      (payload) => {
        callback(payload.new as SensorDataRow);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}