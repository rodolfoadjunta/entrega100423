const fs = require('fs');

class Producto {
  constructor(nombre, descripcion, codigo, foto, precio, stock) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.codigo = codigo;
    this.foto = foto;
    this.precio = precio;
    this.stock = stock;
  }
}

class Contenedor {
  constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo;
    this.idActual = 1;
    this.data = [];
    this.carga();
  }

  async carga() {
    try {
      const contenido = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
      if (contenido) {
        this.data = JSON.parse(contenido);
        this.idActual = this.data[this.data.length - 1].id + 1;
      }
    } catch (error) {
      console.log('No se pudo leer el archivo', error);
    }
  }

  async save(producto) {
    try {
      producto.id = this.idActual++;
      this.data.push(producto);
      await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(this.data, null, 2));
      return producto.id;
    } catch (error) {
      console.log('No se pudo escribir en el archivo', error);
    }
  }

  async getById(id) {
    try {
      const item = this.data.find((producto) => producto.id === id);
      return item;
    } catch (error) {
      console.log('No se pudo leer el archivo', error);
    }
  }

  async getAll() {
    try {
      return this.data;
    } catch (error) {
      console.log('No se pudo leer el archivo', error);
    }
  }

  async deleteById(id) {
    try {
      this.data = this.data.filter((producto) => producto.id !== id);
      await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.log('No se pudo escribir en el archivo', error);
    }
  }

  async deleteAll() {
    try {
      this.data = [];
      await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.log('No se pudo escribir en el archivo', error);
    }
  }

  async addProduct(nombre, descripcion, codigo, foto, precio, stock) {
    try {
      const producto = new Producto(nombre, descripcion, codigo, foto, precio, stock);
      const productoExistente = this.data.find((p) => p.codigo === codigo);
      if (productoExistente) {
        console.log('El producto ya existe');
        return;
      }
      if (!nombre || !codigo) {
        console.log('Los campos nombre y codigo son obligatorios');
        return;
      }
      await this.save(producto);
      console.log(`Producto agregado con éxito. Id: ${producto.id}`);
      return producto.id;
    } catch (error) {
      console.log('No se pudo agregar el producto', error);
    }
  }
}

module.exports = Contenedor;

// EJEMPLO:

const Contenedor = require('./Contenedor');

// Creamos una instancia de Contenedor
const contenedorProductos = new Contenedor('productos.json');

// Agregamos un nuevo producto
const productoNuevoId = await contenedorProductos.addProduct('Zapatillas', 'Zapatillas deportivas', '0001', 'https://imagen.com', 100, 10);

// Buscamos un producto por su ID
const productoBuscado = await contenedorProductos.getById(productoNuevoId);
console.log(productoBuscado);

// Actualizamos un producto existente
const productoActualizado = await contenedorProductos.updateById(productoNuevoId, {
  nombre: 'Zapatillas Nike',
  descripcion: 'Zapatillas deportivas de marca Nike',
  precio: 150,
  stock: 5
});
console.log(productoActualizado);

// Eliminamos un producto por su ID
await contenedorProductos.deleteById(productoNuevoId);