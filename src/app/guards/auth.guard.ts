import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  // Mock authentication - always logged in for demo
  private isLoggedIn = true;

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.isLoggedIn) return true;
    this.router.navigate(['/tasks']);
    return false;
  }
}