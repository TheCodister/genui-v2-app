import useSWR from "swr";

interface WeatherProps {
  city: string;
  unit: "C" | "F";
}

interface WeatherData {
  temperature: number;
  unit: string;
  description: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Weather({ city, unit }: WeatherProps) {
  const { data, error } = useSWR<WeatherData>(
    `https://api.example.com/weather?city=${city}&unit=${unit}`,
    fetcher
  );

  if (error) {
    return <div>Error loading weather data.</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>{data.temperature}</div>
      <div>{data.unit}</div>
      <div>{data.description}</div>
    </div>
  );
}
