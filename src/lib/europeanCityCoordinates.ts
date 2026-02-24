// Major football cities with their real-world coordinates
export interface CityCoordinates { city: string; country: string; lat: number; lng: number; }

export const europeanCityCoordinates: CityCoordinates[] = [
  { city: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 }, { city: "Salzburg", country: "Austria", lat: 47.8095, lng: 13.0550 },
  { city: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 }, { city: "Bruges", country: "Belgium", lat: 51.2093, lng: 3.2247 },
  { city: "Zagreb", country: "Croatia", lat: 45.8150, lng: 15.9819 }, { city: "Split", country: "Croatia", lat: 43.5081, lng: 16.4402 },
  { city: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 }, { city: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
  { city: "London", country: "England", lat: 51.5074, lng: -0.1278 }, { city: "Manchester", country: "England", lat: 53.4808, lng: -2.2426 },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 }, { city: "Marseille", country: "France", lat: 43.2965, lng: 5.3698 },
  { city: "Munich", country: "Germany", lat: 48.1351, lng: 11.5820 }, { city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
  { city: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275 }, { city: "Budapest", country: "Hungary", lat: 47.4979, lng: 19.0402 },
  { city: "Milan", country: "Italy", lat: 45.4642, lng: 9.1900 }, { city: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 }, { city: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
  { city: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 }, { city: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { city: "Bucharest", country: "Romania", lat: 44.4268, lng: 26.1025 }, { city: "Glasgow", country: "Scotland", lat: 55.8642, lng: -4.2518 },
  { city: "Belgrade", country: "Serbia", lat: 44.7866, lng: 20.4489 }, { city: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { city: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 }, { city: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { city: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 }, { city: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { city: "Kyiv", country: "Ukraine", lat: 50.4501, lng: 30.5234 }, { city: "Cardiff", country: "Wales", lat: 51.4816, lng: -3.1791 }
];

export const clubCityMapping: Record<string, string> = {
  "Arsenal FC": "London", "Chelsea FC": "London", "Manchester United": "Manchester", "Liverpool FC": "Liverpool",
  "Paris Saint-Germain": "Paris", "Olympique Marseille": "Marseille", "Bayern Munich": "Munich", "Borussia Dortmund": "Dortmund",
  "AC Milan": "Milan", "Juventus": "Turin", "AS Roma": "Rome", "Ajax Amsterdam": "Amsterdam", "SL Benfica": "Lisbon",
  "FC Porto": "Porto", "Real Madrid": "Madrid", "FC Barcelona": "Barcelona", "Celtic FC": "Glasgow", "Rangers FC": "Glasgow"
};

export function getClubCoordinates(clubName: string, country: string): { lat: number; lng: number } | null {
  const cityName = clubCityMapping[clubName];
  if (cityName) {
    const cityCoords = europeanCityCoordinates.find(c => c.city === cityName && (c.country === country || c.country.toLowerCase() === country?.toLowerCase()));
    if (cityCoords) return { lat: cityCoords.lat, lng: cityCoords.lng };
    const cityOnlyCoords = europeanCityCoordinates.find(c => c.city === cityName);
    if (cityOnlyCoords) return { lat: cityOnlyCoords.lat, lng: cityOnlyCoords.lng };
  }
  for (const city of europeanCityCoordinates) {
    if (city.country === country || city.country.toLowerCase() === country?.toLowerCase()) {
      if (clubName.toLowerCase().includes(city.city.toLowerCase())) return { lat: city.lat, lng: city.lng };
    }
  }
  return null;
}

export function getCountryCenter(country: string): { lat: number; lng: number } | null {
  const countryCities = europeanCityCoordinates.filter(c => c.country === country || c.country.toLowerCase() === country?.toLowerCase());
  if (countryCities.length === 0) return null;
  const avgLat = countryCities.reduce((sum, c) => sum + c.lat, 0) / countryCities.length;
  const avgLng = countryCities.reduce((sum, c) => sum + c.lng, 0) / countryCities.length;
  return { lat: avgLat, lng: avgLng };
}
