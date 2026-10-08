import * as Location from 'expo-location'

export async function getCurrentCityName(): Promise<string | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') return null

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    })

    const results = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })

    const place = results[0]
    return place?.city || place?.subregion || place?.region || null
  } catch {
    return null
  }
}
