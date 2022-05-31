import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabLinkComponent } from '../tab-link/tab-link.component';
import { TabsComponent } from './tabs.component';

@Component({
  template: `
    <app-tabs>
        <app-tab-link tabTitle="Feedzbacks reçus">
          <span id="content1">content 1</span>
        </app-tab-link>
        <app-tab-link tabTitle="Feedzbacks envoyés">
          <span id="content2">content 2</span>
        </app-tab-link>
    </app-tabs>
      `
})
class WrapperComponent {
  @ViewChild(TabsComponent) tabs!: TabsComponent;
}

describe('TabsComponent', () => {
  let component: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TabsComponent,
        WrapperComponent,
        TabLinkComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.tabs).toBeTruthy();
  });

  it('should contain 2 tabs', () => {
    expect(component.tabs.tabs.length).toBe(2)
  })

  it('should have the first tab active', () => {
    let activeTab = component.tabs.tabs.filter((tab) => tab.active);

    expect(activeTab).toBeDefined()
    expect(activeTab[0]).toBeDefined()
    expect(activeTab[0]).toBe(component.tabs.tabs.get(0)!)

    const contentSpans = fixture.debugElement.queryAll(By.css('.content'));
    expect(contentSpans[0].properties['hidden']).toBe(false)
    expect(contentSpans[1].properties['hidden']).toBe(true)
  })

  it('should have the second tab active', () => {
    component.tabs.selectTab(component.tabs.tabs.get(1)!)
    let activeTab = component.tabs.tabs.filter((tab) => tab.active);
    fixture.detectChanges();

    expect(activeTab).toBeDefined()
    expect(activeTab[0]).toBeDefined()
    expect(activeTab[0]).toBe(component.tabs.tabs.get(1)!)

    const contentSpans = fixture.debugElement.queryAll(By.css('.content'));
    expect(contentSpans[0].properties['hidden']).toBe(true)
    expect(contentSpans[1].properties['hidden']).toBe(false)
  })
});
