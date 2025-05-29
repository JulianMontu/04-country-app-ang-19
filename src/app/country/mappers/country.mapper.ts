import { Country } from "../interfaces/country.interface";
import { RESTCountry } from "../interfaces/rest-country.interface";

export class CountryMapper {
    static mapToCountry(data: RESTCountry): Country {
        return {
            cca2: data.cca2,
            flag: data.flags.png,
            flagSvg: data.flags.svg,
            name: data.name.common,
            capital: data.capital.join(", "),
            population: data.population
        };
    }

    static mapToCountries(data: RESTCountry[]): Country[] {
        return data.map(CountryMapper.mapToCountry);
    }
}