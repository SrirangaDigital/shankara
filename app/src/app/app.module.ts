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
import { TocComponent } from './toc/toc.component';
import { VolumesComponent } from './volumes/volumes.component';
import { SearchComponent } from './search/search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { PageComponent } from './page/page.component';

// Custom Pipes
import { RlzeroPipe } from './custom-pipes/rlzero.pipe';
import { ToDevanagariPipe } from './custom-pipes/toDevanagari.pipe';
import { MonthToDevanagariPipe } from './custom-pipes/monthToDevanagari.pipe';
import { SafePipe } from './custom-pipes/safe.pipe';
import { LinkPDFPipe } from './custom-pipes/linkPDF.pipe';
import { SafeHTMLPipe } from './custom-pipes/safeHTML.pipe';
import { StrReplacePipe } from './custom-pipes/strReplace.pipe';

// Viewer
import { ViewerDirectiveModule } from './viewer.directive';

// Angular material
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    TocComponent,
    VolumesComponent,
    SearchComponent,
    SearchResultsComponent,
    PageComponent,
    RlzeroPipe,
    ToDevanagariPipe,
    MonthToDevanagariPipe,
    SafePipe,
    LinkPDFPipe,
    SafeHTMLPipe,
    StrReplacePipe
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
