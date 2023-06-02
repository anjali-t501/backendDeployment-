const Order = require("../models/orderModel");
const Product  =  require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require('../middleware/catchAsyncError');
const sendEmail = require("../utils/sendEmail");


// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      billingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
  
    const order = await Order.create({
      shippingInfo,
      orderItems,
      billingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderedAt: Date.now(),
      user: req.user._id,
    });
  
    // Send email to user with order details
    const message = `
    <html>
      <head>
        <style>
          table {
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 5px;
          }
        </style>
      </head>
      <body style="background-color: #f2f2f2;">
        <h1 style="color: #007bff;">Thank you for your order!</h1>
        <h2>Order details:</h2>
        <table style="width: 100%;">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3">Items price:</td>
              <td style="text-align: right;">$${order.itemsPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3">Tax:</td>
              <td style="text-align: right;">$${order.taxPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3">Shipping:</td>
              <td style="text-align: right;">$${order.shippingPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3"><strong>Total price:</strong></td>
              <td style="text-align: right;"><strong>$${order.totalPrice.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  `;
    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Order confirmation',
        html:message,
        contentType: 'text/html',

      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  
    res.status(201).json({
      success: true,
      order,
    });
  });
  

//get Single Order
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email");
  
    if(!order){
      return next(new ErrorHandler("Order not found with this id",404));
    }
  
    res.status(200).json({
      success:true,
      order,
    })
  })

//get logged in user Order
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find({user: req.user._id});
    //find order where orderSchema (user id)= userSchema (loggedin user id)
  
    res.status(200).json({
      success:true,
      orders,
    })
  })

  //get All orders --Admin
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order)=>{
      totalAmount += order.totalPrice;
    })

    res.status(200).json({
      success:true,
      totalAmount,
      orders,
    })

})


//Update Order status --Admin
exports.updateOrderStatus = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if(order.orderStatus === "Delivered"){
      return next(new ErrorHandler("You have delivered this order",400))
    }
  
    order.orderItems.forEach(async(order)=>{
      await updateStock(order.product,order.quantity);
    });

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
      order.deliveredAt=Date.now()
    }

    await order.save({validateBeforeSave:false})

    res.status(200).json({
      success:true,
   
    })

})


async function updateStock(id,quantity){
  const product = await Product.findById(id);

  product.Stock -=quantity;
  await product.save({validateBeforeSave:false})

}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }else{
        await Order.findByIdAndRemove(req.params.id)
    }
  
    res.status(200).json({
      success: true,
    });
  });
  