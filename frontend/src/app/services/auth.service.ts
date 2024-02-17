import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { HttpClient } from "@angular/common/http";
import { map, pipe } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private BACK_URL = "https://localhost:3000"
    public currentUser?: User

    constructor(private http : HttpClient){}

    login(user: any){
        return this.http.post(this.BACK_URL+'/api/user/login', user).pipe(
            map((response: any) =>{
                localStorage.setItem("accesToken", response.accesToken)
                localStorage.setItem("refreshToken", response.refreshToken)
                return response.accesToken
            })
        )
    }
}

