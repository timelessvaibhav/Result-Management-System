import { Injectable } from "@angular/core";
import {CanActivate,Router} from '@angular/router'
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuardTeacher implements CanActivate{
    constructor(private router: Router, private authService: AuthService){}

    canActivate():boolean{
        if(this.authService.isAuthenticated("teacher")){
            return true;
        }
        this.router.navigate(['/teacherlogin']);
        return false;
    }
}