import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { NewPostComponent } from './new-post/new-post.component';
import { LastPostsComponent } from './last-posts/last-posts.component';

@Component({
  selector: 'app-posts',
  imports: [
    MatTabsModule,
    MatButtonModule,
    NewPostComponent,
    LastPostsComponent,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
