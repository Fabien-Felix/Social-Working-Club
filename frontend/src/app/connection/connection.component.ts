import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserFormValue } from '../services/auth.service';


@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})

export class ConnectionComponent implements OnInit {

  public loginForm!: FormGroup;


  constructor(private formBuilder: FormBuilder,
              private router : Router,
              private authService : AuthService){}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ["junior@gmail.com"],
      password: ["junior124"],
    })
  }
  goHome(): void {
    this.authService.login(this.loginForm.value).subscribe(
      (res:any)=>{
        if(res){
          this.authService.currentUser = res.user
          this.router.navigateByUrl('/home')
        } else {
          console.log("err");
          
        }
      }
    )
  }
}
