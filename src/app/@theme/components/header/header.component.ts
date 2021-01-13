import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { first, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Observable, of } from 'rxjs';
import { catchError, share, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AdminService } from '../../../services/admin.service';
@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  userToken$: Observable<NbAuthToken>;
  isAuthenticated$: Observable<boolean>;

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  adminInfo: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private authService: NbAuthService,
    private router: Router,
    private _localStorage: LocalStorageService,
    private _adminService: AdminService,
  ) {
    this.userToken$ = this.authService.onTokenChange();
    this.isAuthenticated$ = this.authService.isAuthenticated();

    console.log(this.userToken$, this.isAuthenticated$)
  }

  ngOnInit() {
    of(this._localStorage.getAdminItem('admin_info')).subscribe(data => {
      this.adminInfo = data;
    });


    this.userToken$ = this.authService.onTokenChange();
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.isAuthenticated$.pipe(
      first()
    ).subscribe(
      res => {
        console.log(res)
        this.userToken$.pipe(
          first()
        ).subscribe(
          user => {
            console.log(user)
            console.log(user.getPayload().user_id)
            this._adminService.getAdminInfo(user.getPayload().user_id).valueChanges()
              .pipe()
              .subscribe(
                data => {
                  this.adminInfo = data;
                }
              )
          }
        )
      }
    )

    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });
  }

  onContecxtItemSelection(title: string) {
    if (title.includes('Log out')) {
      localStorage.removeItem('admin_info');
      localStorage.removeItem('restaurantBranchIdSelected');
      this.logout();
    } else if (title.includes('Profile')) {
      this.router.navigate(['pages/admin-profile']);
    }
    console.log('click', title);
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  logout() {
    this.router.navigate(['auth/logout']);
  }

  login() {
    this.router.navigate(['auth/login']);
  }

  resetPassword() {
    this.router.navigate(['auth/reset-password']);
  }
}
