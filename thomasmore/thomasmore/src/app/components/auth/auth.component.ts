import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../modules/auth/services/auth.service";
import {Role} from "../../models/role.enum";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private authService: AuthService) { }


  onComplete: Function;
  onCancel: Function;
  onDestroy: Function;
  requiredRole: Role;
  password: string;
  errors: number = 0;

  ngOnInit() {
  }

  onCompleteAuth(): void {
    this.authService.authenticate(this.requiredRole, this.password).subscribe(success => {
      if(success)
        this.onComplete();
      else
        this.errors++;
    });
  }

  onCancelAuth(): void {
    this.onCancel();
  }

  ngOnDestroy() {
    this.onDestroy();
  }

}
