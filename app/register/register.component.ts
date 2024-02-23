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

  /**
   * Initiates the sign-up process.
   * Validates the form, checks if passwords match, and ensures privacy policy acceptance before signing up.
   * If all conditions are met, initiates the sign-up process.
   * Shows confirmation animation upon successful sign-up.
   * @param {NgForm} form - The form containing sign-up data.
   */
  signUp(form: NgForm) {
    if (form.valid && this.passwordsMatch() && this.privacyPolicyAccepted) {
      this.authService.signUp(this.email, this.password, this.username);
      this.showConfirmationAnimation();
    }
  }

  /**
   * Checks if the entered password matches the confirmation password.
   * @returns {boolean} True if passwords match, otherwise false.
   */
  passwordsMatch() {
    return this.password === this.confirmationPassword;
  }

  /**
   * Shows the confirmation animation and navigates to the home page after a delay.
   */
  showConfirmationAnimation() {
    this.showConfirmation = true;
    setTimeout(() => {
      this.router.navigate(['']);
    }, 1000);
  }
}
