import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FocusContentService {
  targetElement?: HTMLElement;

  focusTarget() {
    this.targetElement?.focus();
  }
}
