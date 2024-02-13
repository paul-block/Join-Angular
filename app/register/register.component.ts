import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  showConfirmation:boolean = false;

  accountForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    acceptPrivacyPolicy: new FormControl(false, [Validators.requiredTrue])
  });

  constructor (private authService: AuthenticationService, private router: Router) {}

  signUp() {
    if (this.accountForm.invalid || this.passwordsDontMatch()) {
      console.log('Check your password and all fields required');
      return 
    } else {
      const email = this.accountForm.get('email')?.value;
      const password = this.accountForm.get('password')?.value;
      const username = this.accountForm.get('name')?.value;
      if (email && password && username) {
      this.authService.signUp(email, password, username);
      this.showConfirmationAnimation()
    } 
  }
}

  passwordsDontMatch() {
    const password = this.accountForm.get('password')?.value;
    const confirmPassword = this.accountForm.get('confirmPassword')?.value;
    return password !== confirmPassword;
  }

  showConfirmationAnimation() {
    this.showConfirmation = true;
    setTimeout(() => {
      this.router.navigate(['']);
    }, 1000);
  }
}
