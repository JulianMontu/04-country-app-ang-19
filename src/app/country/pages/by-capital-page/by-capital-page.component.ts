import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { RESTCountry } from '../../interfaces/rest-country.interface';
import { CountryMapper } from '../../mappers/country.mapper';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCapitalPageComponent { 

  private countryService = inject(CountryService);
  isLoading = signal(false);
  isError = signal<string|null>(null);
  countries = signal<Country[]>([]);

  onSearch(query: string){
    if(this.isLoading()) return;
    this.isLoading.set(true);
    this.isError.set(null);
    this.countryService.searchByCapital(query).subscribe(
      (countries) => {
        this.countries.set(countries);
        this.isLoading.set(false);
      },
      (error) => {
        this.isLoading.set(false);
        this.isError.set(error.message || 'An error occurred while fetching countries');
        this.countries.set([]);
        console.error('Error fetching countries:', error);
      }
    );
  }
}
