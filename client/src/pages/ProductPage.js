import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import AddToCartButton from "../components/AddToCartButton";
import Modal from "../components/Modal";
import PageNotFound from "./PageNotFound";
import serverURL from "../GetServerURL";

const renderContent = (product, quantity, setQuantity, openModal) => {
  return (
    <div className="product-page-container">
      <img
        src={product.image}
        className="product-image"
        onClick={() => openModal(product.image)}
        alt=""
      />
      <div className="product-page__info">
        <div
          className="header"
          style={{ borderBottom: "1px solid grey", paddingBottom: "20px" }}
        >
          {product.title}
        </div>
        <div className="price">${product.price}</div>
        <div className="paragraph">{product.shortDesc}</div>
        <input
          className="quantity-input"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min={1}
          max={99}
        />
        <AddToCartButton id={product.id} quantity={quantity} />
      </div>
    </div>
  );
};

const Product = () => {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  useEffect(() => {
    fetch(`${serverURL}/api/product/` + productSlug)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => {
        console.error("Error loading product: ", error);
      });
  }, [productSlug]);

  if (product !== null && product.error) {
    return <PageNotFound />;
  }

  return (
    <div className="page-column">
      <PageHeader>
        <a href="/store" className="simple-link">
          Store
        </a>
      </PageHeader>

      {product !== null ? (
        renderContent(product, quantity, setQuantity, openModal)
      ) : (
        <p>Loading...</p>
      )}
      {modalImage && <Modal image={modalImage} closeModal={closeModal} />}
    </div>
  );
};

export default Product;
