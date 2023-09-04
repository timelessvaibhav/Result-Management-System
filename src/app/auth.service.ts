import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})

export class AuthService{
    isAuthenticated(role:string):boolean{
        const storedRole = localStorage.getItem('role');
        if(role!=storedRole){
            return false;
        }
        else return true;
    }
}