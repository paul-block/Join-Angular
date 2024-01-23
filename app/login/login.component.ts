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
  email:string = '';
  password:string = '';

  constructor(private authService: AuthenticationService) {
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
      console.log('login () ausgeführt');
    }
    else this.loginError = true;
  }
}
