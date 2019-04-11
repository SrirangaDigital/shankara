import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, PopStateEvent } from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor(public router: Router, private location: Location) { }

  // https://stackoverflow.com/a/44372167

  ngOnInit() {
    this.location.subscribe((ev:PopStateEvent) => {
        this.lastPoppedUrl = ev.url;
    });

    this.router.events.subscribe((ev:any) => {
      if (ev instanceof NavigationStart) {
      
        if (ev.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      }
      else if (ev instanceof NavigationEnd) {

        if (ev.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        }
        else
          window.scrollTo(0, 0);
      }
    });
  }  

  onClick() {

    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}
