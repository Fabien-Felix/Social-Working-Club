import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { HttpClient } from "@angular/common/http";
import { map, pipe } from "rxjs";
import { AbstractControl } from "@angular/forms";

export interface UserFormValue {
    username:string,
    password:string 
}
@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private BACK_URL = "http://localhost:3000"
    public currentUser?: User

    constructor(private http : HttpClient){}

    login(user: UserFormValue){
        return this.http.post(this.BACK_URL+'/api/user/login', this.mapUserFrontToBack(user)).pipe(
            map((response: any) =>{
                console.log();
                
                localStorage.setItem("accesToken", response.accesToken)
                localStorage.setItem("refreshToken", response.refreshToken)
                return response
            })
        )
    }

    mapUserFrontToBack(user:UserFormValue):User {
        return {
            email: user.username,
            password: user.password
        }
    }

}

