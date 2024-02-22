import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  showConfirmation: boolean = false;

  username: string = '';
  email: string = '';
  password: string = '';
  confirmationPassword: string = '';
  privacyPolicyAccepted: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router) { }

  signUp(form: NgForm) {
    if (form.valid && this.passwordsMatch() && this.privacyPolicyAccepted) {
      this.authService.signUp(this.email, this.password, this.username);
      this.showConfirmationAnimation();
    }
  }

  passwordsMatch() {
    return this.password === this.confirmationPassword;
  }

  showConfirmationAnimation() {
    this.showConfirmation = true;
    setTimeout(() => {
      this.router.navigate(['']);
    }, 1000);
  }
}
