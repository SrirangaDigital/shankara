import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Api service
import { DataService } from './data.service';

import { AppComponent } from './app.component';

// Routing Module
import { AppRoutingModule } from './app-routing.module';

// Components
import { ArticlesComponent } from './articles/articles.component';
import { AuthorsComponent } from './authors/authors.component';
import { TranslatorsComponent } from './translators/translators.component';
import { FeatureComponent } from './feature/feature.component';
import { SeriesComponent } from './series/series.component';
import { YearsComponent } from './years/years.component';
import { SearchComponent } from './search/search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { PageComponent } from './page/page.component';
import { CoversComponent } from './covers/covers.component';

// Custom Pipes
import { RlzeroPipe } from './custom-pipes/rlzero.pipe';
import { ToDevanagariPipe } from './custom-pipes/toDevanagari.pipe';
import { MonthToDevanagariPipe } from './custom-pipes/monthToDevanagari.pipe';

// Viewer
import { ViewerDirectiveModule } from './viewer.directive';

// Angular material
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    AuthorsComponent,
    TranslatorsComponent,
    FeatureComponent,
    SeriesComponent,
    YearsComponent,
    SearchComponent,
    SearchResultsComponent,
    PageComponent,
    RlzeroPipe,
    ToDevanagariPipe,
    MonthToDevanagariPipe,
    CoversComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, 
    ViewerDirectiveModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})

export class AppModule { }
