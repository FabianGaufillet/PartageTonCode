import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { User } from '../../interfaces/user';
import { RelationshipsService } from '../../services/relationships.service';
import { MatButtonModule } from '@angular/material/button';
import { map, of, startWith, Subscription, switchMap } from 'rxjs';
import { ApiResponse } from '../../interfaces/api-response';
import { UserService } from '../../services/user.service';
import { Avatar } from 'primeng/avatar';
import { HtmlDecodePipe } from '../../pipes/html-decode.pipe';

@Component({
  selector: 'app-my-friends',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, Avatar],
  templateUrl: './my-friends.component.html',
  styleUrl: './my-friends.component.scss',
})
export class MyFriendsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  private readonly userService = inject(UserService);
  private readonly relationshipsService = inject(RelationshipsService);
  private readonly htmlDecodePipe = inject(HtmlDecodePipe);

  private friendsSubscription?: Subscription;

  public displayedColumns: string[] = ['username', 'name', 'email', 'actions'];
  public isLoadingResults = true;
  public userId: string = '';
  public users: User[] = [];
  public resultsLength = 0;

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.friendsSubscription) {
      this.friendsSubscription.unsubscribe();
    }

    this.friendsSubscription = this.userService
      .userStatus()
      .pipe(
        switchMap((userStatus: ApiResponse) => {
          this.userId = userStatus.data['_id'] as string;
          return (
            this.paginator?.page.pipe(
              startWith({}),
              switchMap(() => {
                const page = this.paginator?.pageIndex as number;
                return this.relationshipsService.getMyFriends(
                  this.userId,
                  page + 1,
                );
              }),
              map((result: ApiResponse) => {
                this.isLoadingResults = false;
                this.resultsLength = result.data['totalDocs'] as number;
                return result.data['docs'];
              }),
            ) || of([])
          );
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.users = response;
        },
        error: () => {
          this.users = [];
          this.resultsLength = 0;
        },
        complete: () => {},
      });
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
    if (this.friendsSubscription) {
      this.friendsSubscription.unsubscribe();
    }
  }
}
