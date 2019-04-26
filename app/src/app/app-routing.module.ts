import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // Import Router Module
import { VolumesComponent } from './volumes/volumes.component';
import { TocComponent } from './toc/toc.component';
import { SearchComponent } from './search/search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { PageComponent } from './page/page.component';

const appRoutes: Routes = [
  { path: 'volumes', component: VolumesComponent },
  { path: 'toc', component: TocComponent },
  { path: 'search', component: SearchComponent },
  { path: 'searchResults', component: SearchResultsComponent },
  { path: 'page/:name', component: PageComponent },
  { path: '**', redirectTo: 'page/home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}