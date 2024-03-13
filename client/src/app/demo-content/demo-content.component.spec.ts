import { ComponentFixture, TestBed } from '@angular/core/testing';

import DemoContentComponent from './demo-content.component';

describe('DemoContentComponent', () => {
  let component: DemoContentComponent;
  let fixture: ComponentFixture<DemoContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define property', () => {
    expect(component.loremIpsum).toBe('Lorem ipsum');
  });

  it('should render property', () => {
    expect((fixture.nativeElement as HTMLElement).querySelector('[data-test-id="lorem-ipsum"')?.textContent).toContain(
      'Lorem ipsum dolor sit amet',
    );
  });
});
