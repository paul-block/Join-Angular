import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  showDropdown: boolean = false;
  mobileView = false;

  /**
   * Listens for window resize events to adjust the view based on screen width.
   * @param {Event} event - The resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    if (event.target.innerWidth < 1000) this.mobileView = true;
    else this.mobileView = false;
  }

  constructor(public auth: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  /**
   * Checks the screen size to determine if the view is in mobile mode.
   */
  checkScreenSize() {
    if (window.innerWidth <= 1000) this.mobileView = true;
    else this.mobileView = false;
  }

  /**
   * Checks if a user is logged in based on stored user data.
   * @returns {boolean} True if user is logged in, otherwise false.
   */
  isLoggedIn() {
    let userData = localStorage.getItem('userData');
    if (userData !== 'null') return true;
    else return false;
  }

  /**
   * Extracts and returns the initials from the user's name.
   * @returns {string} The initials extracted from the user's name.
   */
  getInitials() {
    let initials = this.auth.userData.name.split(' ').map((word: string) => word.charAt(0)).join('');
    return initials;
  }

  /**
   * Toggles the dropdown menu.
   */
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  /**
   * Signs out the current user.
   */
  signOut() {
    this.auth.signOut();
  }
}
