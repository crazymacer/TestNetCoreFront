import { Injectable } from '@angular/core';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private _productService:ProductService ) { }

  get productService(){
    return this._productService;
  }
}
