import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {VideogameListComponent} from './videogame-list/videogame-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VideogameListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VideogamesAngular';
}
