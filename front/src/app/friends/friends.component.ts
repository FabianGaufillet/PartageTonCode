import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MyFriendsComponent } from './my-friends/my-friends.component';
import { PendingRequestsComponent } from './pending-requests/pending-requests.component';
import { SuggestedFriendsComponent } from './suggested-friends/suggested-friends.component';
import { SearchFriendComponent } from './search-friend/search-friend.component';

@Component({
  selector: 'app-friends',
  imports: [
    MatTabsModule,
    MyFriendsComponent,
    PendingRequestsComponent,
    SuggestedFriendsComponent,
    SearchFriendComponent,
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent {}
