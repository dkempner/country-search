import { useState } from "react";
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
    .map((x) => ({ name: x }));
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

function Countries({
  countries,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [search, setSearch] = useState("");

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
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
              <td>{country.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Countries;
