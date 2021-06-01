import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './service/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'doodle-chat-application';
  loader = false;
  loadSubscription: Subscription;

  constructor(
    private loaderService: LoaderService
  ) {
    this.loadSubscription = this.loaderService.loader.subscribe(
      (response: boolean) => {
        this.loader = response;
      }
    )
  }

  ngOnDestroy(): void {
    this.loadSubscription.unsubscribe();
  }
}
