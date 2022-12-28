import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FacesService } from '../services/faces.service';

@Injectable({
  providedIn: 'root'
})
export class OtherGuard implements CanActivate {
  constructor(
    public router: Router,
    public facesService: FacesService
  ){ }
  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.facesService.isLoggedIn !== true) {
            // window.location.reload()
            return this.router.navigate(['/pages/sign-in'])
      } 
      this.facesService.mess().subscribe(
        res => {
          // console.log(res)
        },
        err => {
          console.log(err)
            window.localStorage.clear();
            window.sessionStorage.clear();
            window.location.reload()
            this.router.navigate(['/pages'])
            window.alert("Your session has expired, please log in again.");
        }
      )
    return true;
    }
}
