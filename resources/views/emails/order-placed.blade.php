<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #4CAF50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #4CAF50;
            margin: 0;
            font-size: 28px;
        }
        .success-icon {
            font-size: 48px;
            color: #4CAF50;
            margin-bottom: 10px;
        }
        .order-info {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 25px;
        }
        .order-info h2 {
            color: #333;
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: bold;
            color: #555;
        }
        .info-value {
            color: #333;
            text-align: right;
        }
        .product-details {
            margin: 25px 0;
        }
        .product-details h3 {
            color: #333;
            font-size: 18px;
            margin-bottom: 15px;
        }
        .product-card {
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 20px;
            background-color: #fafafa;
        }
        .price-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
        }
        .total-price {
            font-size: 24px;
            color: #4CAF50;
            font-weight: bold;
            text-align: right;
        }
        .original-price {
            text-decoration: line-through;
            color: #999;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #777;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
        }
        @media only screen and (max-width: 600px) {
            .info-row {
                flex-direction: column;
            }
            .info-value {
                text-align: left;
                margin-top: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✓</div>
            <h1>Order Confirmed!</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Thank you for your purchase</p>
        </div>

        <p>Hi {{ $order->user_name }},</p>
        <p>Thank you for your order! We're pleased to confirm that we've received your order and it's being processed.</p>

        <div class="order-info">
            <h2>Order Information</h2>
            <div class="info-row">
                <span class="info-label">Order ID:</span>
                <span class="info-value">{{ $order->order_id }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Order Date:</span>
                <span class="info-value">{{ $order->created_at->format('F d, Y') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">{{ ucfirst($order->payment_method) }}</span>
            </div>
        </div>

        <div class="product-details">
            <h3>Product Details</h3>
            <div class="product-card">
                <div class="info-row">
                    <span class="info-label">Product:</span>
                    <span class="info-value">{{ $order->product_name }}</span>
                </div>
                @if($order->product_brand)
                <div class="info-row">
                    <span class="info-label">Brand:</span>
                    <span class="info-value">{{ $order->product_brand }}</span>
                </div>
                @endif
                <div class="info-row">
                    <span class="info-label">SKU:</span>
                    <span class="info-value">{{ $order->product_sku }}</span>
                </div>
                @if($order->size)
                <div class="info-row">
                    <span class="info-label">Size:</span>
                    <span class="info-value">{{ $order->size }}</span>
                </div>
                @endif
                @if($order->color)
                <div class="info-row">
                    <span class="info-label">Color:</span>
                    <span class="info-value">{{ $order->color }}</span>
                </div>
                @endif
                <div class="info-row">
                    <span class="info-label">Quantity:</span>
                    <span class="info-value">{{ $order->quantity }}</span>
                </div>

                <div class="price-section">
                    @if($order->discounted_price)
                    <div class="info-row">
                        <span class="info-label">Unit Price:</span>
                        <span class="info-value original-price">${{ number_format($order->price, 2) }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Discounted Price:</span>
                        <span class="info-value">${{ number_format($order->discounted_price, 2) }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total:</span>
                        <span class="total-price">${{ number_format($order->discounted_price * $order->quantity, 2) }}</span>
                    </div>
                    @else
                    <div class="info-row">
                        <span class="info-label">Unit Price:</span>
                        <span class="info-value">${{ number_format($order->price, 2) }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total:</span>
                        <span class="total-price">${{ number_format($order->price * $order->quantity, 2) }}</span>
                    </div>
                    @endif
                </div>
            </div>
        </div>

        <p style="margin-top: 30px;">We'll send you another email once your order has been shipped.</p>

        <div class="footer">
            <p>If you have any questions about your order, please don't hesitate to contact us.</p>
            <p style="margin-top: 15px;">Thank you for shopping with us!</p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
                This is an automated email. Please do not reply directly to this message.
            </p>
        </div>
    </div>
</body>
</html>