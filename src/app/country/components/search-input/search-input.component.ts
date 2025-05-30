import { ChangeDetectionStrategy, Component, effect, EventEmitter, input, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  value = output<string>();
  placeHolder = input.required<string>();
  inputValue = signal<string>('');

  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();
    const timeout = setTimeout(() => {
      this.value.emit(value);
    }, 500)

    onCleanup(() => {
      clearTimeout(timeout);
    })
  })
}
