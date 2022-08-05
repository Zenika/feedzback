import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { TabLinkComponent } from '../tab-link/tab-link.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabLinkComponent) tabs!: QueryList<TabLinkComponent>;
  type!: String
  constructor(public activateRouter: ActivatedRoute) {}

  ngOnInit() {
    this.type = this.activateRouter.snapshot.paramMap.get('type')!
  }
  ngAfterContentInit() {
    let activeTabs = this.tabs.filter((tab) => tab.active);
    if (this.type !== null && this.type === 'Received') {
      this.selectTab(this.tabs.last)
    } else if (this.type !== null && this.type === 'Sent' || activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    } 
  }

  selectTab(tab: TabLinkComponent) {
    this.tabs.toArray().forEach(tab => tab.active = false);
    tab.active = true;
  }
}
