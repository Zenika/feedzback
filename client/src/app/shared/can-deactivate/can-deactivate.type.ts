import { Observable } from 'rxjs';

export type CanDeactivateForm = {
  canDeactivate(): boolean | Observable<boolean>;
};
