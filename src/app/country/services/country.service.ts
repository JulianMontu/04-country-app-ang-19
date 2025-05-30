import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { catchError, delay, map, of, tap, throwError } from 'rxjs';
import { Country } from '../interfaces/country.interface';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>(); //{}
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<string, Country[]>();


  searchByCapital(query: string) {
    query = query.trim().toLowerCase();
    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }
    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map(CountryMapper.mapToCountries),
      tap(countries => this.queryCacheCapital.set(query, countries)),
      catchError((error) => {
        return throwError(() => new Error(`no se pudo obtener paises con ese query: ${query}`));
      })
    );
  }

  searchByCountry(query: string) {
    query = query.trim().toLowerCase();
    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []).pipe(
        delay(1000)
      );
    }
    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map(CountryMapper.mapToCountries),
      tap(countries => this.queryCacheCountry.set(query, countries)),
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

  searchByRegion(region: string) {
    const url = `${API_URL}/region/${region}`
    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? [])
    }
    return this.http.get<RESTCountry[]>(url).pipe(
      map(CountryMapper.mapToCountries),
      tap(countries => this.queryCacheRegion.set(region, countries)),
      delay(1000),
      catchError((error) => {
        return throwError(() => new Error(`no se pudo obtener paises con esa region: ${region}`));
      })
    );
  }
}
