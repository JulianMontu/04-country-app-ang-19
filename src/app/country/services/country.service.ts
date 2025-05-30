import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { catchError, delay, map, throwError } from 'rxjs';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string) {
    query = query.trim().toLowerCase();
    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map(CountryMapper.mapToCountries),
      catchError((error) => {
        return throwError(() => new Error(`no se pudo obtener paises con ese query: ${query}`));
      })
    );
  }

  searchByCountry(query: string) {
    query = query.trim().toLowerCase();
    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map(CountryMapper.mapToCountries),
      delay(1000),
      catchError((error) => {
        return throwError(() => new Error(`no se pudo obtener paises con ese query: ${query}`));
      })
    );
  }

  searchCountryByAlphaCode(code: string) {
    const url = `${API_URL}/alpha/${code}`
    return this.http.get<RESTCountry[]>(url).pipe(
      map(CountryMapper.mapToCountries),
      map(countries => countries.at(0)), 
      delay(1000),
      catchError((error) => {
        return throwError(() => new Error(`no se pudo obtener paises con ese codigo: ${code}`));
      })
    );
  }
}
