import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent {

  constructor(private location: Location) { }

  /**
   * Navigates back to the previous page in the browser history.
   */
  backToLastPage() {
    this.location.back();
  }

}
