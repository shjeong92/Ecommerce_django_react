import axios from 'axios'
import React, { useState, useEffect } from "react";
import {  Row, Col, ListGroup, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { numberWithCommas } from "../components/Product";
import {getOrderDetails, payOrder } from "../actions/orderActions";
import { PayPalButton } from "react-paypal-button-v2";
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;
  const dispatch = useDispatch();
  const [currency, setCurrency] = useState(1)
  const [sdkReady, setSdkReady] = useState(false)

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector(state => state.orderPay)
  const { loading: loadingPay, success: successPay  } = orderPay;
  

  if (!loading && !error) {
    order.itemsPrice = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
  }
  // AXhsqH7TPynD38tmyhHUlFi1vtwm2kvOxUwb3ziaGK_h1I9v8FHqPo96aMUucPiOiODB180tyiOX0Xdk
  const addPayPalScript = () => {
    const script = document.createElement('script')
    script.type ='text/javascript'
    script.src = 'https://www.paypal.com/sdk/js?client-id=AXhsqH7TPynD38tmyhHUlFi1vtwm2kvOxUwb3ziaGK_h1I9v8FHqPo96aMUucPiOiODB180tyiOX0Xdk'
    script.async = true
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }
  useEffect(() => {
    const getCurrency = async () => {
      const currency = await axios.get('https://free.currconv.com/api/v7/convert?q=USD_KRW&compact=ultra&apiKey=81ca22f58c9ca51f6d04')
      setCurrency(currency.data.USD_KRW)
    }
    getCurrency()
  },[])
  useEffect(() => {
    if (!order || successPay || order._id   !== Number(orderId)) {
      dispatch({type: ORDER_PAY_RESET})
      dispatch(getOrderDetails(orderId));
    } else if(!order.isPaid) {
      if(!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [order, orderId, dispatch, successPay]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }

  return loading ? (
      <Loader/>
  ) : error ? (
      <Message variant='danger'>{error}</Message>
  ) : (
    <div>
      <h1>Order: {order._id} </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping To</h2>
              <p><strong>Name: {order.user.name}</strong></p>
              <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},
                {"  "}
                {order.shippingAddress.postalCode},{"  "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered? (
                  <Message variant='success'>Delivered on {order.deliveredAt}</Message>
              ) : (
                <Message variant='warning'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid? (
                  <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='warning'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Item</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X {numberWithCommas(item.price)}₩ ={" "}
                          {numberWithCommas(item.qty * item.price)}₩
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Item:</Col>
                  <Col>{order.itemsPrice * 0.9} ₩</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>{order.shippingPrice} ₩</Col>
                </Row>
                {order.itemsPrice >= 100000 && (
                  <Row>
                    <Col className="mt-3">
                      <h6>10만원 이상 무료배송</h6>{" "}
                    </Col>
                  </Row>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>VAT ( 10% ):</Col>
                  <Col>{order.itemsPrice * 0.1} ₩</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col className="m">{order.itemsPrice} ₩</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader/>}

                  {!sdkReady ? (<Loader/>) :
                  (<PayPalButton 
                    amount={(order.itemsPrice/currency).toFixed(2)}
                    onSuccess={successPaymentHandler}
                  />)}
                </ListGroup.Item>
              )}

            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
