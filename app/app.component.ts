import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth: AuthenticationService, public router: Router) { }

  checkUrl() {
    const currentRoute = this.router.url;
    return currentRoute !== '/' && currentRoute !== '/register';
  }

  showMenu() {
    if (this.auth.isLoggedIn || this.router.url === '/legal-notice') return true;
    else return false;
  }
}
