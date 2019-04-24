import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // Import Router Module
import { VolumesComponent } from './volumes/volumes.component';
import { ArticlesComponent } from './articles/articles.component';
import { TocComponent } from './toc/toc.component';
import { TranslatorsComponent } from './translators/translators.component';
import { FeatureComponent } from './feature/feature.component';
import { SeriesComponent } from './series/series.component';
import { SearchComponent } from './search/search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { PageComponent } from './page/page.component';
import { CoversComponent } from './covers/covers.component';

const appRoutes: Routes = [
  { path: 'volumes', component: VolumesComponent },
  { path: 'toc', component: TocComponent },
  { path: 'articles/:articleListType', component: ArticlesComponent },
  { path: 'articles', redirectTo: '/articles/articlesLetterWise?title=@^अ', pathMatch: 'full' },
  { path: 'translators', component: TranslatorsComponent },
  { path: 'features', component: FeatureComponent },
  { path: 'series', component: SeriesComponent },
  { path: 'search', component: SearchComponent },
  { path: 'searchResults', component: SearchResultsComponent },
  { path: 'page/:name', component: PageComponent },
  { path: 'covers', component: CoversComponent },
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