import { GoogleApiService } from "ng-gapi/GoogleApiService";

export class FooService {
    constructor(gapiService: GoogleApiService) {
        gapiService.onLoad().subscribe(()=> {
           // Here we can use gapi
           console.log('heyoooooo')
           
        });
    }
}