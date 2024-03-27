import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showLogin: boolean = false;
  rememberMe: boolean = false;
  email: string = '';
  password: string = '';

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    this.clearStorage();
    this.checkRememberMe();
    this.desktopAnimation();
  }

  /**
   * Clears user data from local storage if not already cleared.
   * Sets user data to null in local storage, logs out the user, and sets a session flag to prevent repeated clearing.
   */
  clearStorage() {
    let session = sessionStorage.getItem('clear');
    if (session == null) {
      localStorage.setItem('userData', 'null');
      this.authService.isLoggedIn = false;
      sessionStorage.setItem('clear', 'false');
    }
  }

  /**
   * Checks if 'rememberMe' data exists in local storage and initializes login credentials accordingly.
   */
  checkRememberMe() {
    if ('rememberMe' in localStorage) {
      let object: any = localStorage.getItem('rememberMe');
      let login = JSON.parse(object);
      this.rememberMe = login.rememberMe;
      this.email = login.email;
      this.password = login.password;
    }
  }

  /**
   * Delays showing the login form to trigger an animation effect.
   */
  desktopAnimation() {
    setTimeout(() => {
      this.showLogin = true;
    }, 1500);
  }

  /**
   * Hides the error message after wrong login on inputfield changes.
   */
  resetErrorMsg() {
    this.authService.loginError = false;
  }

  /**
   * Initiates the login process using provided email and password.
   * If 'rememberMe' option is selected, stores login credentials in local storage.
   */
  login() {
    if (this.email.length > 0 && this.password.length > 0) {
      this.authService.loginError = false;
      this.authService.signIn(this.email, this.password);
      if (this.rememberMe) localStorage.setItem('rememberMe', JSON.stringify({ 'rememberMe': 'true', 'email': this.email, 'password': this.password }));
    }
    else this.authService.loginError = true;
  }

  /**
   * Initiates sign-in as a guest.
   */
  guestSignIn() {
    this.authService.guestSignIn();
  }

  /**
   * Updates the 'rememberMe' option based on checkbox state.
   * Removes 'rememberMe' data from local storage if unchecked.
   * @param {any} event - The event object representing the checkbox state change.
   */
  onCheckboxChange(event: any) {
    if (event.target.checked) this.rememberMe = true;
    else {
      this.rememberMe = false;
      localStorage.removeItem('rememberMe');
    }
  }
}
