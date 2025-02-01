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
import { RelationshipsService } from '../../services/relationships.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private readonly relationshipsService = inject(RelationshipsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly htmlDecodePipe = inject(HtmlDecodePipe);

  private userServiceSubscription?: Subscription;
  private searchSubscription?: Subscription;
  private friendshipSubscription?: Subscription;

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
          return this.userService.allPotentialFriends(page + 1);
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
        error: () => {
          this.isLoadingResults = false;
          this.users = [];
          this.resultsLength = 0;
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
      .allPotentialFriends(1, filterValue ?? '')
      .subscribe({
        next: (response: ApiResponse) => {
          this.isLoadingResults = false;
          this.users = response.data['docs'] as User[];
          this.resultsLength = response.data['totalDocs'] as number;
        },
        error: () => {
          this.isLoadingResults = false;
          this.users = [];
          this.resultsLength = 0;
        },
      });
  }

  addFriend(userId: string) {
    if (this.friendshipSubscription) {
      this.friendshipSubscription.unsubscribe();
    }

    this.friendshipSubscription = this.relationshipsService
      .askForFriendship(userId)
      .subscribe({
        next: () => {
          this.snackBar.open("Demande d'ami envoyée avec succès !", 'OK', {
            duration: 2000,
          });
        },
        error: () => {
          this.snackBar.open('Désole, une erreur est survenue', 'OK', {
            duration: 2000,
          });
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
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.friendshipSubscription) {
      this.friendshipSubscription.unsubscribe();
    }
  }
}
