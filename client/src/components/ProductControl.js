// Fixed API URL on Jan 11 2026
import React, { Component } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import NewProductForm from './NewProductForm';
import ProductDetail from './ProductDetail';
import AddProduct from './AddProduct';
import EditProductForm from './EditProductForm';

// Import local product images
import tshirt from '../images/products/tshirt.png';
import backpack from '../images/products/backpack.png';
import pants from '../images/products/pants.png';
import trekkingshoes from '../images/products/trekkingshoes.png';
import giacket from '../images/products/giacket.png';
import tshirt_ladies from '../images/products/tshirt_ladies.png';
import Default_image from '../images/product_image.jpeg';

class ProductControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formVisibleOnPage: false,
            actualProductList: [],
            selectedProduct: null,
            editProduct: false
        };
    }

    componentDidMount() {
        axios.get('http://192.168.56.10:5000/api/products')
            .then(res => {
                const imageMap = {
                    'T-Shirt': tshirt,
                    'BackPack': backpack,
                    'Pants': pants,
                    'Trekking Shoes': trekkingshoes,
                    'Jacket': giacket,
                    'T-Shirt Ladies': tshirt_ladies
                };

                // Attach photo to each product
                const productsWithImages = res.data.map(product => ({
                    ...product,
                    photo: imageMap[product.name] || Default_image
                }));

                this.setState({ actualProductList: productsWithImages });
            })
            .catch(err => console.log(err));
    }

    handleEditProductClick = () => {
        this.setState({ editProduct: true });
    }

    handleAddButtonClick = (id) => {
        const BuyProduct = this.state.actualProductList.find(p => p._id === id);
        BuyProduct.quantity = BuyProduct.quantity - 1;
        if (BuyProduct.quantity <= 0) BuyProduct.quantity = "Product is not Available";

        this.setState({ selectedProduct: BuyProduct });
    }

    handleClick = () => {
        if (this.state.editProduct) {
            this.setState({ editProduct: false });
        } else if (this.state.selectedProduct != null) {
            this.setState({ formVisibleOnPage: false, selectedProduct: null });
        } else {
            this.setState(prevState => ({ formVisibleOnPage: !prevState.formVisibleOnPage }));
        }
    }

    handleAddingNewProduct = (newProduct) => {
        axios.post('http://192.168.56.10:5000/api/products', newProduct)
            .then(res => console.log(res.data));

        this.setState({ formVisibleOnPage: false });
    }

    handleDeletingProduct = (id) => {
        axios.delete(`http://192.168.56.10:5000/api/products/${id}`)
            .then(res => console.log(res.data))
            .catch(error => console.log(error));

        this.setState({
            actualProductList: this.state.actualProductList.filter(product => product._id !== id),
            formVisibleOnPage: false,
            selectedProduct: null
        });
    }

    handleChangingSelectedProduct = (id) => {
        const selectedProduct = this.state.actualProductList.find(p => p._id === id);
        this.setState({ selectedProduct });
    }

    handleEditingProduct = (editedProduct) => {
        axios.put(`http://192.168.56.10:5000/api/products/${this.state.selectedProduct._id}`, editedProduct)
            .then(res => console.log(res.data));

        this.setState({ editProduct: false, formVisibleOnPage: false });
        window.location = '/';
    }

    render() {
        let currentlyVisibleState = null;
        let buttonText = null;

        if (this.state.editProduct) {
            currentlyVisibleState = <EditProductForm product={this.state.selectedProduct} onEditProduct={this.handleEditingProduct} />;
            buttonText = "Back to Product Detail";
        } else if (this.state.selectedProduct != null) {
            currentlyVisibleState = <ProductDetail
                product={this.state.selectedProduct}
                onBuyButtonClick={this.handleAddButtonClick}
                onDeleteProduct={this.handleDeletingProduct}
                onEditProductClick={this.handleEditProductClick}
            />;
            buttonText = "Back to product list";
        } else if (this.state.formVisibleOnPage) {
            currentlyVisibleState = <NewProductForm onNewProductCreation={this.handleAddingNewProduct} />;
            buttonText = "Back to product list";
        } else {
            currentlyVisibleState = <ProductList
                productList={this.state.actualProductList}
                onProductSelection={this.handleChangingSelectedProduct}
            />;
            buttonText = "Add a product";
        }

        return (
            <React.Fragment>
                <AddProduct buttonText={buttonText} whenButtonClicked={this.handleClick} />
                {currentlyVisibleState}
            </React.Fragment>
        );
    }
}

export default ProductControl;
