import { useEffect, useState } from "react";
import type { InferGetStaticPropsType } from "next";
import Link from "next/link";

type Country = {
  name: string;
};

const fetchCountries = async () => {
  const req = await fetch("https://api.printful.com/countries");
  const asJson = await req.json();
  const mapped = Object.values(asJson.result)
    .map((x: any) => x.name)
    .sort()
    .map((x) => ({ name: x.toLowerCase() }));
  return mapped as Country[];
};

export const getStaticProps = async () => {
  const countries = await fetchCountries();
  return {
    props: {
      countries,
    },
  };
};

const uppercaseFirst = (country: Country) => {
  return country.name.charAt(0).toUpperCase() + country.name.slice(1);
};

function Countries({
  countries,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [search, setSearch] = useState("");
  const [lastCountries, setLastCountries] = useState<string[]>([]);

  useEffect(() => {
    setLastCountries(JSON.parse(localStorage.getItem("last") || "[]"));
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div>
        <ul>
          {lastCountries.map((c) => (
            <li key={c}>{uppercaseFirst({name: c})}</li>
          ))}
        </ul>
      </div>
      <label htmlFor="country-search">Search:</label>
      <input
        id="country-search"
        type="search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <hr />
      <table>
        <tbody>
          {filteredCountries.map((country) => (
            <tr key={country.name}>
              <td>
                <Link href={`/countries/${country.name}`}>
                  {uppercaseFirst(country)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Countries;
