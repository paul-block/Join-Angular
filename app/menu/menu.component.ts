import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  showDropdown: boolean = false;
  mobileView = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    if (event.target.innerWidth < 1000) this.mobileView = true;
    else this.mobileView = false;
  }

  constructor(public auth: AuthenticationService) {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  getInitials() {
    let initials = this.auth.userData.name.split(' ').map((word: string) => word.charAt(0)).join('');
    return initials
  }

  toggleDropdown() {
    this.showDropdown =! this.showDropdown;
  }

  checkScreenSize() {
    if (window.innerWidth <= 1000) this.mobileView = true;
    else this.mobileView = false;
  }

  signOut() {
    this.auth.signOut();
  }
}
