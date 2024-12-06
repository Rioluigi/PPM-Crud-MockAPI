import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

// Tipe data produk
type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
};

const API_URL = 'https://672395ab493fac3cf24b843a.mockapi.io/products'; // Ganti dengan URL MockAPI Anda

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Fungsi untuk mengambil data produk
  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fungsi untuk menambah produk
  const addProduct = async () => {
    try {
      const newProduct = { name: productName, price: productPrice, description: productDescription };
      await axios.post(API_URL, newProduct);
      setProductName('');
      setProductPrice('');
      setProductDescription('');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Fungsi untuk memperbarui produk
  const updateProduct = async () => {
    if (selectedProductId) {
      try {
        const updatedProduct = { name: productName, price: productPrice, description: productDescription };
        
        // Log untuk memastikan URL endpoint benar
        console.log(`Updating product at: ${API_URL}/${selectedProductId}`);
        
        await axios.put(`${API_URL}/${selectedProductId}`, updatedProduct);
        
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        setSelectedProductId(null);
        fetchProducts();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts(); 
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Mengambil data produk saat komponen pertama kali dirender
  useEffect(() => {
    fetchProducts();
  }, []);

  // Render
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Outdoor</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        onChangeText={setProductName}
        value={productName}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        onChangeText={setProductPrice}
        value={productPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Product Description"
        onChangeText={setProductDescription}
        value={productDescription}
      />
      <Button
        title={selectedProductId ? 'Update Product' : 'Add Product'}
        onPress={selectedProductId ? updateProduct : addProduct}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>{item.name} - ${item.price}</Text>
            <Text>Description: {item.description}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Edit" onPress={() => {
                setProductName(item.name);
                setProductPrice(item.price);
                setProductDescription(item.description);
                setSelectedProductId(item.id);
              }} />
              <Button title="Delete" onPress={() => deleteProduct(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  productItem: {
    padding: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default App;
