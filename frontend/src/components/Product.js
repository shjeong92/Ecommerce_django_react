import React from "react";
import { Card } from "react-bootstrap";
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const Product = ({ product }) => {
  return (
    <Card className="my-3 py-3 rounded">
      <a href={`/product/${product._id}`}>
        <Card.Img src={product.image} />
      </a>
      <Card.Body>
        <a href={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </a>
        <Card.Text>
          <div className="my-3">
            {product.rating}{product.rating>1? " stars" : " star"} from {product.numReviews} {product.numReviews>1? "people" : "person"}
          </div>
        </Card.Text>
        <Card.Text as="h3">{numberWithCommas(product.price)}₩</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
