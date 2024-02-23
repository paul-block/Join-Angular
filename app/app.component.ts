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

  /**
   * Checks if the current URL is neither the home page nor the registration page.
   * @returns {boolean} True if the current URL is different from '/' and '/register', otherwise false.
   */
  checkUrl() {
    const currentRoute = this.router.url;
    return currentRoute !== '/' && currentRoute !== '/register';
  }

  /**
   * Determines whether to show the menu based on user authentication status and current URL.
   * The menu is shown if the user is logged in or if the current URL is '/legal-notice'.
   * @returns {boolean} True if the menu should be shown, otherwise false.
   */
  showMenu() {
    if (this.auth.isLoggedIn || this.router.url === '/legal-notice') return true;
    else return false;
  }
}
