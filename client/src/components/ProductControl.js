import React, { Component } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import NewProductForm from './NewProductForm';
import ProductDetail from './ProductDetail';
import AddProduct from './AddProduct';
import EditProductForm from './EditProductForm';
import Default_image from '../images/product_image.jpeg';

class ProductControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formVisibleOnPage: false,
            actualProductList: [],
            selectedProduct: null,
            editProduct: false,
        };
    }

    componentDidMount() {
        axios.get('http://192.168.56.10:5000/api/products')
            .then(res => {
                this.setState({ actualProductList: res.data });
            })
            .catch(err => console.log(err));
    }

    handleEditProductClick = () => {
        this.setState({ editProduct: true });
    }

    handleClick = () => {
        if (this.state.editProduct) {
            this.setState({ editProduct: false });
        } else if (this.state.selectedProduct) {
            this.setState({
                formVisibleOnPage: false,
                selectedProduct: null
            });
        } else {
            this.setState(prevState => ({
                formVisibleOnPage: !prevState.formVisibleOnPage
            }));
        }
    }

    handleAddingNewProduct = (formData) => {
        // formData includes the file and other product info
        axios.post('http://192.168.56.10:5000/api/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
            // Update product list with newly added product
            this.setState(prevState => ({
                actualProductList: [...prevState.actualProductList, res.data],
                formVisibleOnPage: false
            }));
        })
        .catch(err => console.log(err));
    }

    handleDeletingProduct = (id) => {
        axios.delete(`http://192.168.56.10:5000/api/products/${id}`)
            .then(() => {
                this.setState(prevState => ({
                    actualProductList: prevState.actualProductList.filter(p => p._id !== id),
                    formVisibleOnPage: false,
                    selectedProduct: null
                }));
            })
            .catch(err => console.log(err));
    }

    handleChangingSelectedProduct = (id) => {
        const selectedProduct = this.state.actualProductList.find(p => p._id === id);
        this.setState({ selectedProduct });
    }

    handleEditingProduct = (editedProduct) => {
        axios.put(`http://192.168.56.10:5000/api/products/${this.state.selectedProduct._id}`, editedProduct)
            .then(res => {
                this.setState(prevState => ({
                    actualProductList: prevState.actualProductList.map(p =>
                        p._id === res.data._id ? res.data : p
                    ),
                    editProduct: false,
                    formVisibleOnPage: false,
                    selectedProduct: null
                }));
            })
            .catch(err => console.log(err));
    }

    render() {
        let currentlyVisibleState = null;
        let buttonText = null;

        if (this.state.editProduct) {
            currentlyVisibleState = <EditProductForm
                product={this.state.selectedProduct}
                onEditProduct={this.handleEditingProduct}
            />;
            buttonText = "Back to Product Detail";
        } else if (this.state.selectedProduct) {
            currentlyVisibleState = <ProductDetail
                product={this.state.selectedProduct}
                onBuyButtonClick={() => {}}
                onDeleteProduct={this.handleDeletingProduct}
                onEditProductClick={this.handleEditProductClick}
            />;
            buttonText = "Back to Product List";
        } else if (this.state.formVisibleOnPage) {
            currentlyVisibleState = <NewProductForm
                onNewProductCreation={this.handleAddingNewProduct}
            />;
            buttonText = "Back to Product List";
        } else {
            currentlyVisibleState = <ProductList
                productList={this.state.actualProductList}
                onProductSelection={this.handleChangingSelectedProduct}
            />;
            buttonText = "Add a Product";
        }

        return (
            <React.Fragment>
                <AddProduct
                    buttonText={buttonText}
                    whenButtonClicked={this.handleClick}
                />
                {currentlyVisibleState}
            </React.Fragment>
        );
    }
}

export default ProductControl;
