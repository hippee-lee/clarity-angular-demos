import { Component } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { FetchResult, Inventory } from './utils/inventory';
import { User } from './utils/user';
import { COLORS } from './utils/values';

@Component({
  selector: 'app-root',
  providers: [Inventory],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gh5621';
  users: User[];
  total: number;
  loading = true;
  allColors = COLORS;
  clrDgPageInputDisabled = false;

  constructor(private inventory: Inventory) {
    inventory.size = 103;
    inventory.reset();
    this.users = inventory.all;
  }

  pageChange(pageNumber: number) {
    console.log(pageNumber);
  }

  refresh(state: ClrDatagridStateInterface<User>) {
    this.loading = true;
    const filters: { [prop: string]: any[] } = {};
    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = filter;
        filters[property] = [value];
      }
    }
    this.inventory
      .filter(filters)
      .sort(state.sort as { by: string; reverse: boolean })
      .fetch(state.page.size * (state.page.current - 1), state.page.size)
      .then((result: FetchResult) => {
        this.users = result.users;
        this.total = result.length;
        this.loading = false;
      });
  }
}
