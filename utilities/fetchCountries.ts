import fs from 'fs-extra'
import path from "path";

type Country = {
  name: string;
};

const CACHE_FILE_PATH = path.join(process.cwd(), ".cache", "countries.json");

export async function fetchCountries() {
  if (fs.existsSync(CACHE_FILE_PATH)) {
    return JSON.parse(fs.readFileSync(CACHE_FILE_PATH, "utf-8")) as Country[];
  }
  const req = await fetch("https://api.printful.com/countries");
  const asJson = await req.json();
  const mapped = Object.values(asJson.result)
    .map((x: any) => x.name)
    .sort()
    .map((x) => ({ name: x && x.toLowerCase() }));

  fs.outputFileSync(CACHE_FILE_PATH, JSON.stringify(mapped));

  return mapped as Country[];
}
