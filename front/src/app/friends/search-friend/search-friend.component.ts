import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ApiResponse } from '../../interfaces/api-response';
import { User } from '../../interfaces/user';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { HtmlDecodePipe } from '../../pipes/html-decode.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-friend',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    AvatarModule,
    AvatarGroupModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search-friend.component.html',
  styleUrl: './search-friend.component.scss',
})
export class SearchFriendComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  private readonly userService = inject(UserService);
  private readonly htmlDecodePipe = inject(HtmlDecodePipe);

  private userServiceSubscription?: Subscription;
  private searchSubscription?: Subscription;

  public displayedColumns: string[] = ['username', 'name', 'email', 'actions'];
  public isLoadingResults = true;
  public users: User[] = [];
  public resultsLength = 0;
  public searchControl = new FormControl('');

  constructor() {}

  ngOnInit() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    this.searchSubscription = this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe({
        next: (value: string | null) => {
          this.applyFilter(value);
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {},
      });
  }

  ngAfterViewInit() {
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
    }

    this.userServiceSubscription = this.paginator?.page
      .pipe(
        startWith({}),
        switchMap(() => {
          const page = this.paginator?.pageIndex as number;
          return this.userService.getAllUsers(page + 1);
        }),
        map((result: ApiResponse) => {
          this.isLoadingResults = false;
          this.resultsLength = result.data['totalDocs'] as number;
          return result.data['docs'];
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.users = response;
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  applyFilter(filterValue: string | null) {
    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.isLoadingResults = true;
    this.userServiceSubscription = this.userService
      .getAllUsers(1, filterValue ?? '')
      .subscribe({
        next: (response: ApiResponse) => {
          this.isLoadingResults = false;
          this.users = response.data['docs'] as User[];
          this.resultsLength = response.data['totalDocs'] as number;
        },
        error: (error) => {
          this.isLoadingResults = false;
          this.users = [];
          this.resultsLength = 0;
        },
      });
  }

  addFriend(user: User) {
    console.log('add friend');
  }

  formatAvatarUrl(avatar: [string]) {
    if (avatar) {
      return this.htmlDecodePipe
        .transform(decodeURIComponent(avatar[0]))
        .replace(/&#x2F;/g, '/');
    }
    return '';
  }

  getUserInitials(user: User) {
    return `${user.firstname?.charAt(0)}${user.lastname?.charAt(0)}`;
  }

  ngOnDestroy() {
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
