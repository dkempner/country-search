import { useEffect, useState } from "react";
import type { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { fetchCountries } from "../../utilities/fetchCountries";

type Country = {
  name: string;
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
            <li key={c}>{uppercaseFirst({ name: c })}</li>
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
