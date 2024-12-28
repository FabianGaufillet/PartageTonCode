import { Component } from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  imports: [SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
