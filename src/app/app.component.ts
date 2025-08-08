
import { Component, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SHARED_IMPORTS } from './shared-imports';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SHARED_IMPORTS],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Smart-Assistance-AI';
  isMobile: boolean = false;
  private router = inject(Router);

  // Option A: direct click se close
  closeIfMobile(sidenav: import('@angular/material/sidenav').MatSidenav) {
    if (this.isMobile) sidenav.close();
  }

  ngOnInit() {
    this.checkScreen();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        // Agar aapke paas sidenav reference yahan available ho, tab:
        // if (this.isMobile && this.sidenav?.opened) this.sidenav.close();
        // Ya phir ViewChild use karo:
      });
  }

  @HostListener('window:resize', [])
  checkScreen() {
    this.isMobile = window.innerWidth < 1024
  }

}
