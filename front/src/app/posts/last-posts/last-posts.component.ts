import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PostsService } from '../../services/posts.service';
import { of, Subscription, switchMap } from 'rxjs';
import { ApiResponse } from '../../interfaces/api-response';
import { UserService } from '../../services/user.service';
import { Post } from '../../interfaces/post';
import { HtmlDecodeAndSanitizePipe } from '../../pipes/html-decode-and-sanitize.pipe';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-last-posts',
  imports: [MatCardModule, MatDividerModule, HtmlDecodeAndSanitizePipe],
  templateUrl: './last-posts.component.html',
  styleUrl: './last-posts.component.scss',
})
export class LastPostsComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly postsService = inject(PostsService);

  private postsSubscription?: Subscription;

  public posts: Post[] = [];

  constructor() {}

  ngOnInit() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }

    this.postsSubscription = this.userService
      .userStatus()
      .pipe(
        switchMap((userStatus: ApiResponse) => {
          if (!userStatus.data['authenticated']) {
            return of({ message: '', data: {} });
          }
          return this.postsService.getAllPosts(String(userStatus.data['_id']));
        }),
      )
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.data['docs']) {
            this.posts = response.data['docs'] as Post[];
          }
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  ngOnDestroy() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
}
