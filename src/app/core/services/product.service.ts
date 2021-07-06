import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private actualizarFormulario = new BehaviorSubject<Producto>({} as any);

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Producto[]>(`${environment.apiUrl}/Producto`);
  }

  getById(id: number) {
    return this.http.get<Producto>(`${environment.apiUrl}/Producto/${id}`);
  }

  add(model: Producto) {
    return this.http.post<Producto>(`${environment.apiUrl}/Producto/`, model);
  }

  update(id: number, model: Producto) {
    return this.http.put<Producto>(
      `${environment.apiUrl}/Producto/${id}`,
      model
    );
  }

  delete(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/Producto/${id}`);
  }

  actualizar(producto: any) {
    this.actualizarFormulario.next(producto);
  }

  obtenerProducto$():Observable<Producto>{
    return this.actualizarFormulario.asObservable();
  }
}
