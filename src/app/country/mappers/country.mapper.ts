import { Country } from "../interfaces/country.interface";
import { RESTCountry } from "../interfaces/rest-country.interface";

export class CountryMapper {
    static mapToCountry(data: RESTCountry): Country {
        return {
            cca2: data.cca2,
            flag: data.flags.png,
            flagSvg: data.flags.svg,
            name: data.translations["spa"].common ?? 'no spanish translation',
            capital: data.capital.join(", "),
            population: data.population,
            region: data.region,
            subRegion: data.subregion ?? 'no subregion',
        };
    }

    static mapToCountries(data: RESTCountry[]): Country[] {
        return data.map(CountryMapper.mapToCountry);
    }
}