import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { Row, Col } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import Product from "../components/Product";

const HoomScreen = ({ history }) => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);

  const { error, loading, products, page, pages } = productList;
  let keyword = history.location.search;

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <div>
      {!keyword && <ProductCarousel />}

      <h1>MD's Pick</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
          <Paginate pages={pages} page={page} keyword={keyword}></Paginate>
        </div>
      )}
    </div>
  );
};

export default HoomScreen;
