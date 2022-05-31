import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FeedbackType } from '../enum/feedback-type';
import { Feedback } from '../model/feedback';
import { Nl2brPipe } from '../pipe/nl2br/nl2br.pipe';

import { FeedbackListComponent } from './feedback-list.component';

describe('FeedbackListComponent', () => {
  let component: FeedbackListComponent;
  let fixture: ComponentFixture<FeedbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FeedbackListComponent,
        Nl2brPipe
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackListComponent);
    component = fixture.componentInstance;
    component.type = FeedbackType.Received
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "From:" if type is "Received"', () => {
    component.feedbacks = [new Feedback("John", "john@example.com", "Steve", "steve@example.com", "Very good", "Wack af", "Good evening")]
    component.type = FeedbackType.Received
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("p").textContent).toContain('De:');
  })

  it('should display "To:" if type is "Sent"', () => {
    component.feedbacks = [new Feedback("John", "john@example.com", "Steve", "steve@example.com", "Very good", "Wack af", "Good evening")]
    component.type = FeedbackType.Sent
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("p").textContent).toContain('À:');
  })

  it('should display a message when the list is empty', () => {
    expect(fixture.nativeElement.querySelector("span").textContent).toContain('Aucun FeedzBack');
  })

  it('should display a list with multiple feedbacks', () => {
    component.feedbacks = [
      new Feedback("John", "john@example.com", "Steve", "steve@example.com", "Very good", "Wack af", "Good evening", "1654007139829"),
      new Feedback("Frank", "franck@example.com", "Marie", "marie@example.com", "yes", "no", "why not", "1654007116872"),
      new Feedback("Paulette", "paulette@example.com", "Thierry", "thierry@example.com", "très bien", "pas top ", "à plus", "1654007115662")
    ];
    component.type = FeedbackType.Received
    fixture.detectChanges();

    const ulContent = fixture.debugElement.queryAll(By.css('li'));
    expect(ulContent.length).toBe(3);

    for (var i = 0; i < component.feedbacks.length; i++) {
      const textContent = ulContent[i].nativeElement.textContent;
      expect(textContent).toContain(component.feedbacks[i].senderName)
      expect(textContent).toContain(component.feedbacks[i].senderEmail)
      expect(textContent).toContain("5/31/22")
    }
  })
});
