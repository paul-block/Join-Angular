import { Component } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  showDropdown: boolean = false;

  constructor( private auth: AuthenticationService ) {

  }

  toggleDropdown() {
    this.showDropdown =! this.showDropdown;
  }

  signOut() {
    this.auth.signOut();
  }
}
