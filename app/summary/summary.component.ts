import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  greetingPhrase: string | undefined = this.getGreetingPhrase();
  upcomingDeadline: string | undefined;
  mobileView:boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
  if (event.target.innerWidth < 1200) this.mobileView = true;
  else this.mobileView = false;
}
  
  constructor(public auth: AuthenticationService, public taskService: TaskService) {

  }

  async ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.checkIfUserAlreadyGreeted();
      await this.taskService.getAllTasksForCurrentUser();
      this.taskService.filterTasksByCategory();
      console.log(this.taskService.tasks)
      this.getUpcomingDeadline()
    }
    if (window.innerWidth < 1200){
      this.mobileView = true;
      this.userGreeted();
    } 
  }

  getGreetingPhrase() {
    let date = new Date();
    let currentHour = date.getHours();
    if (currentHour < 12 && currentHour > 0 ) return "Good Morning"
    if (currentHour >= 12 && currentHour < 18) return "Good Afternoon"
    if (currentHour >= 18 && currentHour <= 24 ) return "Good Evening"
    else return "Good day"
  }

  getUpcomingDeadline(){
  //  let dateParse = this.taskService.tasks.map(task => Date.parse(task.dueDate));
  let urgentTasks = this.taskService.tasks.filter(task => task.prio === 'urgent');
  let dueDatesInMilliseconds = urgentTasks.map(task => Date.parse(task.dueDate));
  console.log(dueDatesInMilliseconds);
   let nextDeadline = Math.min(...dueDatesInMilliseconds);
   console.log(nextDeadline)
   let date = new Date(nextDeadline).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
   });
   return date;
  }

  checkIfUserAlreadyGreeted() {
    let greeted = localStorage.getItem('greetingLoaded');
    if(greeted === 'true') this.auth.greetingLoaded = true;
    else this.auth.greetingLoaded = false;
  }

  userGreeted(){
    setTimeout(() => {
      this.auth.greetingLoaded = true
      localStorage.setItem('greetingLoaded', JSON.stringify(this.auth.greetingLoaded));
    }, 2500);
  }

}
