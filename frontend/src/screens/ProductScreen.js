import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card} from 'react-bootstrap';
import Rating from '../components/Rating';
import products from '../products';
import { numberWithCommas } from '../components/Product';

const ProductScreen = ({ match }) => {

    const [product, setProduct] = useState([])
    useEffect(() => {
        const fetchProduct = async () => {
            const {data} = await axios.get(`/api/products/${match.params.id}`)
            console.log(data);
            setProduct(data)
        } 
        fetchProduct();
        
    
    }, [])


    // const product = products.find((p) => p._id === match.params.id)
    return (
        <div>
            <Link to="/" className="btn btn-light my-3">Go Back</Link>
            <Row>
                <Col md={6}>
                    <Image src={product.image} alt={product.name} fluid /> 
                </Col>
                
                <Col md={3}>
                    <ListGroup variant="flush">
                        
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Price: {numberWithCommas(product.price)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Description: ${product.description}
                        </ListGroup.Item>

                    </ListGroup>
                </Col>

                <Col md={3}>
                    <Card>
                        <ListGroup variant="flush"> 
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Price:
                                    </Col>
                                    <Col>
                                        <strong>{numberWithCommas(product.price)}₩</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Status
                                    </Col>
                                    <Col>
                                        {product.countInStock > 0 ? "In Stock" : 'Out of Stock'}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button className="btn btn-block" disabled={product.countInStock === 0} type="button">Add to Cart</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProductScreen
