import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { FeedbackType } from '../shared/feedback/feedback.types';
import FeedbackDetailsComponent from './feedback-details.component';


describe('FeedbackDetailsComponent', () => {
    let component: FeedbackDetailsComponent;
    let fixture: ComponentFixture<FeedbackDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeedbackDetailsComponent, RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();

        fixture = TestBed.createComponent(FeedbackDetailsComponent);
        component = fixture.componentInstance;

        component.feedbackDetails = {
            feedback: {
                id: "id",
                giverEmail: "giverEmail",
                receiverEmail: "receiverEmail",
                positive: "positive",
                negative: "negative",
                comment: "comment",
                message: "message",
                shared: false,
                status: 'done',
                createdAt: 0,
                updatedAt: 0,
            },
            type: FeedbackType.given,
        };

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});