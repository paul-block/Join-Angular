import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'join';
  showMenu = false;

  constructor(public auth: AuthenticationService, private router: Router) {}

  isLoggedIn() {
    if (localStorage.getItem('curentUser') !== null || undefined) this.auth.isLoggedIn = true;
    else this.auth.isLoggedIn = false;
  }

  shouldAddContentClass() {
    const currentRoute = this.router.url;
    return currentRoute !== '/' && currentRoute !== '/register';
  }
}
