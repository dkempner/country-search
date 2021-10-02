import { useEffect } from "react";
import Link from "next/link";
import { fetchCountries } from "../../utilities/fetchCountries";

type Country = {
  name: string;
};

export async function getStaticPaths() {
  const countries = await fetchCountries();
  const paths = countries.map((c) => ({
    params: { name: c.name },
  }));
  return { paths, fallback: "blocking" };
}

const firstLetter = (country: Country) => {
  return country.name.charAt(0).toLowerCase();
};

export const getStaticProps = async ({ params }: { params: Country }) => {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 100);
  });
  const { name } = params;

  const allCountries = await fetchCountries();

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
    const last: string[] = JSON.parse(localStorage.getItem("last") || "[]");
    last.unshift(props.country.name);
    if (last.length > 3) {
      last.pop();
    }
    localStorage.setItem("last", JSON.stringify(last));
  }, [props.country.name]);

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
