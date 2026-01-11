import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReusableForm from './ReusableForm';

function NewProductForm(props) {
    const [selectedFile, setSelectedFile] = useState(null);

    function handleFileChange(event) {
        setSelectedFile(event.target.files[0]);
    }

    function handleNewProductFormSubmission(event) {
        event.preventDefault();

        // Create a FormData object to send file + product info
        const formData = new FormData();
        formData.append('name', event.target.name.value);
        formData.append('price', event.target.price.value);
        formData.append('description', event.target.description.value);
        formData.append('quantity', event.target.quantity.value);

        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        // Call the parent handler
        props.onNewProductCreation(formData);

        // Reset file input
        setSelectedFile(null);
        event.target.reset();
    }

    return (
        <div className="container product-form">
            <form onSubmit={handleNewProductFormSubmission}>
                <ReusableForm
                    formSubmissionHandler={() => {}}
                    buttonText="Add Product"
                />
                
                <div className="form-group mt-2">
                    <label htmlFor="photo">Upload Product Image:</label>
                    <input
                        type="file"
                        id="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-control"
                    />
                </div>
            </form>
        </div>
    );
}

NewProductForm.propTypes = {
    onNewProductCreation: PropTypes.func.isRequired,
};

export default NewProductForm;
