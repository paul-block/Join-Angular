import { Component } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  showDropdown: boolean = false;

  constructor(public auth: AuthenticationService) {}



  getInitials() {
    let initials = this.auth.userData.name.split(' ').map((word: string) => word.charAt(0)).join('');
    return initials
  }

  toggleDropdown() {
    this.showDropdown =! this.showDropdown;
  }

  signOut() {
    this.auth.signOut();
  }
}
