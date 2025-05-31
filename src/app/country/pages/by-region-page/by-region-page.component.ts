import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Region } from '../../interfaces/region.type';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

function validateQueryParam(value: string): Region {
  value = value.trim().toLowerCase();
 const validRegions: Record<string, Region> = {
  'africa': 'Africa',
  'americas': 'Americas',
  'asia': 'Asia',
  'europe': 'Europe',
  'oceania': 'Oceania',
  'antarctic': 'Antarctic',
 };

 return validRegions[value.toLowerCase()] ?? 'Americas';

}
@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByRegionPageComponent {
  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';
  selectedRegion = linkedSignal<Region>(()=> validateQueryParam(this.queryParam));
  private countryService = inject(CountryService);
  countryResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {
      if (!request.region) return of([]);

      this.router.navigate(['/country/by-region'], {
        queryParams: { query: request.region },
      });

      return this.countryService.searchByRegion(request.region);
    }
  });

}
