import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { map, startWith, Subscription, switchMap } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ApiResponse } from '../../interfaces/api-response';
import { User } from '../../interfaces/user';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { HtmlDecodePipe } from '../../pipes/html-decode.pipe';

@Component({
  selector: 'app-search-friend',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    AvatarModule,
    AvatarGroupModule,
  ],
  templateUrl: './search-friend.component.html',
  styleUrl: './search-friend.component.scss',
})
export class SearchFriendComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  private readonly userService = inject(UserService);
  private readonly htmlDecodePipe = inject(HtmlDecodePipe);

  private userServiceSubscription?: Subscription;

  public displayedColumns: string[] = ['username', 'name', 'email', 'actions'];
  public isLoadingResults = true;
  public users: User[] = [];
  public resultsLength = 0;

  constructor() {}

  ngOnInit() {}

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
  }
}
