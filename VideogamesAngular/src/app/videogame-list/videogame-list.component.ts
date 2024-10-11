import {Component, OnInit} from '@angular/core';
import {ApiService, Videogame} from '../api.service';

@Component({
  selector: 'app-videogame-list',
  standalone: true,
  imports: [],
  templateUrl: './videogame-list.component.html',
  styleUrl: './videogame-list.component.css'
})
export class VideogameListComponent implements OnInit {
  videogames: Videogame[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getVideogames().subscribe(data => {
      this.videogames = data;
    });
  }

}
