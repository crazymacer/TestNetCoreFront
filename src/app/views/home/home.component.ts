import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/core/models/producto.model';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  //
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();
  sub4 = new Subscription();
  //
  productoForm: FormGroup;
  productos: Producto[] = [];
  //
  productoActual: Producto = {} as any;
  productId: number = 0;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.productoForm = fb.group({
      nombre: ['', [Validators.required]],
      stock: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAllProducts();

    this.sub4 = this.dataService.productService
      .obtenerProducto$()
      .subscribe((data) => {
        this.productoActual = data;
        this.productoForm.patchValue({
          nombre: this.productoActual.nombre,
          stock: this.productoActual.stock,
        });
        this.productId = this.productoActual.id || 0;
      });
  }

  productFormSubmit() {
    if (this.productId === 0) {
      this.saveProducto();
    } else {
      this.updateProducto();
    }
  }

  saveProducto() {
    const producto: Producto = {
      id: 0,
      nombre: this.productoForm.get('nombre')?.value,
      stock: this.productoForm.get('stock')?.value,
    };

    this.sub1 = this.dataService.productService
      .add(producto)
      .subscribe((data) => {
        console.log('Guardado');
        this.productoForm.reset();
        this.productId = 0;
        this.getAllProducts();
      });
  }

  updateProducto() {
    const producto: Producto = {
      id: this.productoActual.id || 0,
      nombre: this.productoForm.get('nombre')?.value,
      stock: this.productoForm.get('stock')?.value,
    };

    this.sub1 = this.dataService.productService
      .update(this.productId, producto)
      .subscribe((data) => {
        console.log('Actualizado');
        this.productoForm.reset();
        this.productId = 0;
        this.getAllProducts();
      });
  }

  getAllProducts() {
    this.sub3 = this.dataService.productService.getAll().subscribe((data) => {
      console.log(data);
      this.productos = data;
    });
  }

  deleteProduct(id: number) {
    if (id === 0) {
      console.log('Id Inválido');
      return;
    }

    if (confirm('Esta seguro de eliminar?')) {
      this.sub2 = this.dataService.productService
        .delete(id)
        .subscribe((data) => {
          console.log('Producto Eliminado');
          this.getAllProducts();
        });
    }
  }

  editProduct(product: Producto) {
    this.dataService.productService.actualizar(product);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
  }
}
