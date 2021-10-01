import { useEffect, useState } from "react";
import type { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

type Country = {
  name: string;
};

const fetchCountries = async () => {
  const req = await fetch("https://api.printful.com/countries");
  const asJson = await req.json();
  const mapped = Object.values(asJson.result)
    .map((x: any) => x.name)
    .sort()
    .map((x) => ({ name:x && x.toLowerCase() }));
  return mapped as Country[];
};

export async function getStaticPaths() {
  const countries = await fetchCountries();
  const paths = countries.map((c) => ({
    params: { name: c.name },
  }));
  return { paths, fallback: false };
}

const firstLetter = (country: Country) => {
  return country.name.charAt(0).toLowerCase();
};

export const getStaticProps = async ({ params }: { params: Country }) => {
  const { name } = params;

  const allCountries = await await fetchCountries();

  const letterMatchCountries = allCountries
    .filter((c) => {
      return c.name !== params.name && firstLetter(c) === firstLetter(params);
    })
    .slice(0, 3);

  const matchingCountries = letterMatchCountries.length
    ? letterMatchCountries.slice(0, 3)
    : allCountries.slice(0, 3);

  return {
    props: {
      country: params,
      matchingCountries,
    },
  };
};

const uppercaseFirst = (country: Country) => {
    return country.name.charAt(0).toUpperCase() + country.name.slice(1);
  };

function CountryPage(props: {
  country: Country;
  matchingCountries: Country[];
}) {

  useEffect(() => {
    const last: string[] = JSON.parse(localStorage.getItem('last') || '[]')
    last.unshift(props.country.name);
    if (last.length > 3) {
      last.pop()
    }
    localStorage.setItem('last', JSON.stringify(last))
  }, [props.country.name])

  return (
    <div>
      <h1>{uppercaseFirst(props.country)}</h1>
      <ul>
        {props.matchingCountries.map((c) => (
          <li key={c.name}>
            <Link href={`/countries/${c.name}`}>{uppercaseFirst(c)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CountryPage;
