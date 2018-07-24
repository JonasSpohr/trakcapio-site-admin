import { Component, OnInit } from '@angular/core';
import { SharedService } from "../../shared/services/shared.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss'
  ]
})
export class HeaderComponent implements OnInit {
  messagesData: Array<any>;
  tasksData: Array<any>;
  maThemeModel: string = 'blue-grey';

  setTheme() {
    this.sharedService.setTheme(this.maThemeModel)
  }

  constructor(private sharedService: SharedService) {
    sharedService.maThemeSubject.subscribe((value) => {
      this.maThemeModel = value
    });
  }

  ngOnInit() {

  }
}