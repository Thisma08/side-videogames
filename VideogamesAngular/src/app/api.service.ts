import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';

export interface Videogame {
  id: number;
  title: string;
  publisher: string;
  support: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5000/api/Videogame';

  constructor(private http: HttpClient) { }

  getVideogames(): Observable<Videogame[]> {
    return this.http.get<Videogame[]>(this.apiUrl);
  }

  getVideogame(id: number): Observable<Videogame> {
    return this.http.get<Videogame>(`${this.apiUrl}/${id}`);
  }

  createVideogame(videogame: Videogame): Observable<Videogame> {
    return this.http.post<Videogame>(this.apiUrl, videogame);
  }
}
