import React from 'react';
import PropTypes from 'prop-types';
import Product from './Product';

function ProductList(props) {
    return (
        <div className="container" id="products">
            <div className="row pdg-line">
                <div className="col-4"><div className="abt-top-border"></div></div>
                <div className="col-4"><p className="product-title text-center">PRODUCTS</p></div>
                <div className="col-4"><div className="abt-top-border"></div></div>
            </div>

            <div className="men-products">
                <div className="row">
                    {props.productList.map(product => (
                        <Product
                            key={product._id}
                            id={product._id}
                            name={product.name}
                            price={product.price}
                            photo={product.photo}
                            whenProductClicked={props.onProductSelection}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

ProductList.propTypes = {
    productList: PropTypes.array.isRequired,
    onProductSelection: PropTypes.func.isRequired
};

export default ProductList;
