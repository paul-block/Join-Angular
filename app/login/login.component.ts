import { Component } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showLogin:boolean = false;
  loginError:boolean = false;
  rememberMe:boolean = false;
  email:string = '';
  password:string = '';

  constructor(private authService: AuthenticationService) {
    if ('rememberMe' in localStorage) {
      let object:any = localStorage.getItem('rememberMe');
      let login = JSON.parse(object);
      this.rememberMe = login.rememberMe;
      this.email = login.email;
      this.password = login.password;
      }
    this.desktopAnimation();
  }

  desktopAnimation() {
    setTimeout(() => {
      this.showLogin = true;
    }, 1500);
  }

  login() {
    if (this.email.length > 0 && this.password.length > 0) {
      this.authService.signIn(this.email, this.password);
      if (this.rememberMe) localStorage.setItem('rememberMe', JSON.stringify({'rememberMe': 'true', 'email': this.email, 'password': this.password}));
    }
    else this.loginError = true;
  }

  guestSignIn() {
    this.authService.guestSignIn();
  }

  onCheckboxChange(event: any) {
    if (event.target.checked) this.rememberMe = true;
    else {
      this.rememberMe = false;
      localStorage.removeItem('rememberMe');
    }}
}
