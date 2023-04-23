const fs = require('fs');
class ProductManager{
     //creo variable privada
  #id = 0;
  
    constructor (path){
        this.path = path;
		fs.promises.writeFile(this.path, JSON.stringify([]));
    }
    #readFile = async () => {
        const readProduct = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(readProduct);
    };

    //creo metodo para agregarproductos
    addProduct = async (title, description, price, thumbnail, code, stock) => {
        // valido que todos los campos sean obligatorios
        if (title && description && price && thumbnail && code && stock) {
          // valido que el campo code no se repita
          const products = await this.#readFile();
          const validacion = products.find((product) => product.code === code);
          if (validacion) {
            console.log("El Code ya existe");
            // creo el producto
          } else {
            const product = {
              title,
              description,
              price,
              thumbnail,
              code,
              stock,
            };
            // agrego un campo a mi producto (ID) y luego incremeto con metodo privado de abajo
            product.id = this.#incrementId();
            // subo el producto al arreglo
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            console.log(products);
            return products;
          }
        } else {
          console.log("Faltan datos");
        }
      };
  // Incremento mi variable privada en 1 cada vez que sumo un producto
    #incrementId() {
    this.#id++;
    return this.#id;
    }
  // Metodo para mostrar la listas de producto
  getProducts = async () => {
    const products = await this.#readFile();
    console.log (products);
    return products;
    
    };
// Metodo para mostrar la listas de producto por ID   
    getProductById = async (id) => {
        // Lee el archivo y busca el idex para comparar con el ID y mostrar el array en consola
        const products = await this.#readFile();
        const index = products.findIndex((product) => product.id === id);
        if (index !== -1) {
          console.log(products[index]);
        } else {
          console.log("Producto inexistente");
        }
      }
      // Metodo para modificar campos del producto y no el ID
      updateProduct = async (id, updatedProduct) => {
        const products = await this.#readFile();
        const index = products.findIndex((product) => product.id === id);
        if (index !== -1) {
          // Si se encontró el producto, actualiza el objeto completo del producto
          products[index] = {
            ...products[index],
            ...updatedProduct,
            id // no se borra
          };
          // aca vuelve a sobre escribir el archivo y muestra por consola cual ID se modifico
          await fs.promises.writeFile(this.path, JSON.stringify(products));
          console.log(`Producto con ID ${id} actualizado`);
          console.log(products[index]);
          return products[index];
        } else {
          // Si no encuentra el ID arroja el error  
          console.log("Is de producto no encontrado");
        }
      };
      // Metodo para eliminar un producto
      deleteProduct = async (id) => {
        const products = await this.#readFile();
        const index = products.findIndex((product) => product.id === id);
        // Si encuentra el id lo borra de productos
        if (index !== -1) {
          products.splice(index, 1);
          //aca sobreescribe el archivo despues de eliminar el producto
          await fs.promises.writeFile(this.path, JSON.stringify(products));
          console.log(`Producto con ID ${id} eliminado`);
        } else {
          // si no encuentra el ID arroja que no lo encontro   
          console.log("ID no encontrado");
        }
      };  
}
// Pruebas
const prueba = new ProductManager('./productos');
const test = async () => {
	try {
        // Se prueba la vizualizacion del arreglo vacio
		await prueba.getProducts();
        // Se agrega un producto 
		await prueba.addProduct(
			'producto prueba',
			'Este es un producto prueba',
			200,
			'Sin imagen',
			'abc123',
			25
		);
        // Se prueba carga de mismo Codigo para validad error
		await prueba.addProduct(
			'producto prueba 2',
			'Este es un producto prueba',
			200,
			'Sin imagen',
			'abc123',
			25
		);
		await prueba.addProduct(
			'producto prueba 2',
			'Este es un producto prueba',
			200,
			'Sin imagen',
			'abc12345',
			25
		);
        // Se prueba la busqueda por ID
        await prueba.getProductById(2);
        // Se prueba el erro cuando no hay ID en products
        await prueba.getProductById(4);
        // Se prueba modifica el ID 1 conservando el ID
		await prueba.updateProduct(1, 
            { title: 'prueba3', description: 'prueba3', price: 1000, thumbnail: 'prueba3', code: 500, stock:20});
        // Se prueba eliminar el ID 1 del archivo de productos     
        await prueba.deleteProduct(1)
        // Se prueba eliminar un ID inexistente o producto inexistente
        await prueba.deleteProduct(5)     
	} catch (error) {
		console.log('error en codigo');
	}
};

test();
