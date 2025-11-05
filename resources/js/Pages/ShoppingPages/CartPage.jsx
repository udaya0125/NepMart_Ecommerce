import React, { useState } from "react";
import { Heart, Trash2, Plus, Minus } from "lucide-react";
import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";
import { useCart } from "../../Contexts/CartContext";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, getCartTotalPrice } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [voucherCode, setVoucherCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const { auth } = usePage().props;

    const toggleLike = (id) => {
        console.log("Toggle like for item:", id);
    };

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity > 0) {
            updateQuantity(id, newQuantity);
        }
    };

    const handleRemoveItem = (id) => {
        removeFromCart(id);
    };

    const handleClearCart = () => {
        clearCart();
    };

    const handleApplyVoucher = () => {
        console.log("Applying voucher:", voucherCode);
    };

    // Store COD order in database
    const storeCODOrder = async () => {
        if (cart.items.length === 0) {
            alert("No items in cart");
            return;
        }

        setIsProcessing(true);

        try {
            const subtotal = getCartTotalPrice();
            const shipping = calculateShippingFee();
            const total = subtotal + shipping;

            // Prepare order items data - FIXED: Use auth.user.name instead of auth.name.user
            const orderItemsData = cart.items.map(item => ({
                user_name: auth.user?.name ,
                product_name: item.name,
                short_description: item.shortDescription || "",
                payment: "COD",
                features: item.features || "",
                sku: item.sku || "",
                brand: item.brand || "",
                price: item.price,
                discounted_price: item.discountedPrice || item.price,
                quantity: item.quantity,
                size: item.size || "",
                color: item.color || "",
            }));

            // Send each order item to the backend
            const orderPromises = orderItemsData.map(orderItem => 
                axios.post(route('ourorder.store'), orderItem)
            );

            await Promise.all(orderPromises);
            
            // Clear cart after successful order placement
            clearCart();
            
            alert(`COD Order placed successfully! Total: Rs. ${total}`);
            
            // Redirect to success page or orders page
            window.location.href = '/';

        } catch (error) {
            console.error("Error placing COD order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Shipping fee calculation
    const calculateShippingFee = () => {
        if (paymentMethod === 'cod') {
            return 100;
        }
        return 0;
    };

    const subtotal = getCartTotalPrice();
    const shipping = calculateShippingFee();
    const total = subtotal + shipping;

    return (
        <div>
            <Navbar />
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 overflow-hidden mb-8">
                <img
                    src="https://images.pexels.com/photos-1525612/pexels-photo-1525612.jpeg"
                    alt="Shopping hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                        Shopping Cart
                    </h1>
                    <p className="text-xl md:text-2xl text-center max-w-2xl">
                        Review and manage your selected items
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 sticky top-20 self-start">
                        <div className="bg-white rounded-lg p-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Cart Items ({cart.totalItems})
                                </h2>
                                {cart.items.length > 0 && (
                                    <button 
                                        onClick={handleClearCart}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        CLEAR ALL
                                    </button>
                                )}
                            </div>

                            {cart.items.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">
                                        Your cart is empty
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border border-gray-200 rounded-lg p-4 flex gap-4"
                                        >
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 mt-1"
                                            />

                                            <img
                                                src={item.images?.[0]}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded"
                                            />

                                            <div className="flex-1">
                                                <a
                                                    href="#"
                                                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm mb-1 block"
                                                >
                                                    {item.brand}
                                                </a>
                                                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {item.color} • Ends at{" "}
                                                    {item.endTime}
                                                </p>

                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-lg font-bold text-orange-500">
                                                            Rs.{" "}
                                                            {item.currentPrice || item.price}
                                                        </p>
                                                        <p className="text-sm text-gray-400 line-through">
                                                            Rs.{" "}
                                                            {item.originalPrice}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center border border-gray-300 rounded">
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item.id,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            className="p-1 hover:bg-gray-100"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="px-3 py-1 font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item.id,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            className="p-1 hover:bg-gray-100"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() =>
                                                        toggleLike(item.id)
                                                    }
                                                    className="p-2 hover:bg-gray-100 rounded"
                                                >
                                                    <Heart
                                                        size={20}
                                                        fill={
                                                            item.liked
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                        className={
                                                            item.liked
                                                                ? "text-red-500"
                                                                : "text-gray-400"
                                                        }
                                                    />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveItem(item.id)
                                                    }
                                                    className="p-2 hover:bg-red-50 rounded text-red-500"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 sticky top-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            {/* Payment Method Selection */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Payment Method
                                </h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-orange-500"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">
                                                Cash On Delivery
                                            </span>
                                            <p className="text-sm text-gray-500">
                                                Pay when you receive the order
                                            </p>
                                            {shipping > 0 && (
                                                <p className="text-sm text-red-500 font-medium">
                                                    + Rs. {shipping} shipping fee
                                                </p>
                                            )}
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-orange-500"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">
                                                Online Payment (eSewa)
                                            </span>
                                            <p className="text-sm text-gray-500">
                                                Secure payment via eSewa
                                            </p>
                                            {shipping === 0 && (
                                                <p className="text-sm text-green-500 font-medium">
                                                    Free shipping
                                                </p>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal ({cart.totalItems} items)
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        Rs. {subtotal}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Shipping Fee
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {shipping === 0 ? (
                                            <span className="text-green-500">FREE</span>
                                        ) : (
                                            `Rs. ${shipping}`
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Enter Voucher Code"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
                                />
                                <button 
                                    onClick={handleApplyVoucher}
                                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg"
                                >
                                    APPLY
                                </button>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-xl font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-orange-500">
                                        Rs. {total}
                                    </span>
                                </div>
                            </div>

                            {/* Conditional Checkout Button */}
                            {paymentMethod === 'online' ? (
                                <Link 
                                    href={'/check-out'} 
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-center block"
                                >
                                    PROCEED TO CHECKOUT ({cart.totalItems})
                                </Link>
                            ) : (
                                <button 
                                    onClick={storeCODOrder}
                                    disabled={isProcessing || cart.items.length === 0}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        `PLACE ORDER (COD) - Rs. ${total}`
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;



// import React, { useState } from "react";
// import { Heart, Trash2, Plus, Minus } from "lucide-react";
// import Footer from "@/ContentWrapper/Footer";
// import Navbar from "@/ContentWrapper/Navbar";
// import { useCart } from "../../Contexts/CartContext";
// import { Link } from "@inertiajs/react";

// const CartPage = () => {
//     const { cart, updateQuantity, removeFromCart, clearCart, getCartTotalPrice } = useCart();
//     const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'
//     const [voucherCode, setVoucherCode] = useState('');

//     const toggleLike = (id) => {
//         console.log("Toggle like for item:", id);
//     };

//     const handleUpdateQuantity = (id, newQuantity) => {
//         if (newQuantity > 0) {
//             updateQuantity(id, newQuantity);
//         }
//     };

//     const handleRemoveItem = (id) => {
//         removeFromCart(id);
//     };

//     const handleClearCart = () => {
//         clearCart();
//     };

//     const handleApplyVoucher = () => {
//         // Add voucher logic here
//         console.log("Applying voucher:", voucherCode);
//     };

//     // Shipping fee calculation
//     const calculateShippingFee = () => {
//         if (paymentMethod === 'cod') {
//             return 100; // Rs. 100 shipping fee for COD
//         }
//         return 0; // Free shipping for online payment
//     };

//     const subtotal = getCartTotalPrice();
//     const shipping = calculateShippingFee();
//     const total = subtotal + shipping;

//     return (
//         <div>
//             <Navbar />
//             {/* Hero Section */}
//             <div className="relative h-64 md:h-80 overflow-hidden mb-8">
//                 <img
//                     src="https://images.pexels.com/photos-1525612/pexels-photo-1525612.jpeg"
//                     alt="Shopping hero"
//                     className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/40"></div>
//                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
//                     <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
//                         Shopping Cart
//                     </h1>
//                     <p className="text-xl md:text-2xl text-center max-w-2xl">
//                         Review and manage your selected items
//                     </p>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-4 pb-12">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Cart Items */}
//                     <div className="lg:col-span-2 sticky top-20 self-start">
//                         <div className="bg-white rounded-lg p-4">
//                             <div className="flex justify-between items-center mb-6">
//                                 <h2 className="text-2xl font-bold text-gray-900">
//                                     Cart Items ({cart.totalItems})
//                                 </h2>
//                                 {cart.items.length > 0 && (
//                                     <button 
//                                         onClick={handleClearCart}
//                                         className="text-red-500 hover:text-red-700 text-sm font-medium"
//                                     >
//                                         CLEAR ALL
//                                     </button>
//                                 )}
//                             </div>

//                             {cart.items.length === 0 ? (
//                                 <div className="text-center py-12">
//                                     <p className="text-gray-500 text-lg">
//                                         Your cart is empty
//                                     </p>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-4">
//                                     {cart.items.map((item) => (
//                                         <div
//                                             key={item.id}
//                                             className="border border-gray-200 rounded-lg p-4 flex gap-4"
//                                         >
//                                             <input
//                                                 type="checkbox"
//                                                 className="w-5 h-5 mt-1"
//                                             />

//                                             <img
//                                                 src={item.images?.[0]}
//                                                 alt={item.name}
//                                                 className="w-24 h-24 object-cover rounded"
//                                             />

//                                             <div className="flex-1">
//                                                 <a
//                                                     href="#"
//                                                     className="text-blue-600 hover:text-blue-800 font-semibold text-sm mb-1 block"
//                                                 >
//                                                     {item.brand}
//                                                 </a>
//                                                 <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
//                                                     {item.name}
//                                                 </h3>
//                                                 <p className="text-xs text-gray-500 mb-2">
//                                                     {item.color} • Ends at{" "}
//                                                     {item.endTime}
//                                                 </p>

//                                                 <div className="flex items-center gap-4">
//                                                     <div>
//                                                         <p className="text-lg font-bold text-orange-500">
//                                                             Rs.{" "}
//                                                             {item.currentPrice || item.price}
//                                                         </p>
//                                                         <p className="text-sm text-gray-400 line-through">
//                                                             Rs.{" "}
//                                                             {item.originalPrice}
//                                                         </p>
//                                                     </div>

//                                                     <div className="flex items-center border border-gray-300 rounded">
//                                                         <button
//                                                             onClick={() =>
//                                                                 handleUpdateQuantity(
//                                                                     item.id,
//                                                                     item.quantity - 1
//                                                                 )
//                                                             }
//                                                             className="p-1 hover:bg-gray-100"
//                                                         >
//                                                             <Minus size={16} />
//                                                         </button>
//                                                         <span className="px-3 py-1 font-medium">
//                                                             {item.quantity}
//                                                         </span>
//                                                         <button
//                                                             onClick={() =>
//                                                                 handleUpdateQuantity(
//                                                                     item.id,
//                                                                     item.quantity + 1
//                                                                 )
//                                                             }
//                                                             className="p-1 hover:bg-gray-100"
//                                                         >
//                                                             <Plus size={16} />
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="flex flex-col gap-2">
//                                                 <button
//                                                     onClick={() =>
//                                                         toggleLike(item.id)
//                                                     }
//                                                     className="p-2 hover:bg-gray-100 rounded"
//                                                 >
//                                                     <Heart
//                                                         size={20}
//                                                         fill={
//                                                             item.liked
//                                                                 ? "currentColor"
//                                                                 : "none"
//                                                         }
//                                                         className={
//                                                             item.liked
//                                                                 ? "text-red-500"
//                                                                 : "text-gray-400"
//                                                         }
//                                                     />
//                                                 </button>
//                                                 <button
//                                                     onClick={() =>
//                                                         handleRemoveItem(item.id)
//                                                     }
//                                                     className="p-2 hover:bg-red-50 rounded text-red-500"
//                                                 >
//                                                     <Trash2 size={20} />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Order Summary */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-white rounded-lg p-6 sticky top-4">
//                             <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                                 Order Summary
//                             </h2>

//                             {/* Payment Method Selection */}
//                             <div className="mb-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                                     Payment Method
//                                 </h3>
//                                 <div className="space-y-3">
//                                     <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
//                                         <input
//                                             type="radio"
//                                             name="paymentMethod"
//                                             value="cod"
//                                             checked={paymentMethod === 'cod'}
//                                             onChange={(e) => setPaymentMethod(e.target.value)}
//                                             className="w-4 h-4 text-orange-500"
//                                         />
//                                         <div className="flex-1">
//                                             <span className="font-medium text-gray-900">
//                                                 Cash On Delivery
//                                             </span>
//                                             <p className="text-sm text-gray-500">
//                                                 Pay when you receive the order
//                                             </p>
//                                             {shipping > 0 && (
//                                                 <p className="text-sm text-red-500 font-medium">
//                                                     + Rs. {shipping} shipping fee
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </label>

//                                     <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
//                                         <input
//                                             type="radio"
//                                             name="paymentMethod"
//                                             value="online"
//                                             checked={paymentMethod === 'online'}
//                                             onChange={(e) => setPaymentMethod(e.target.value)}
//                                             className="w-4 h-4 text-orange-500"
//                                         />
//                                         <div className="flex-1">
//                                             <span className="font-medium text-gray-900">
//                                                 Online Payment (eSewa)
//                                             </span>
//                                             <p className="text-sm text-gray-500">
//                                                 Secure payment via eSewa
//                                             </p>
//                                             {shipping === 0 && (
//                                                 <p className="text-sm text-green-500 font-medium">
//                                                     Free shipping
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </label>
//                                 </div>
//                             </div>

//                             <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">
//                                         Subtotal ({cart.totalItems} items)
//                                     </span>
//                                     <span className="font-semibold text-gray-900">
//                                         Rs. {subtotal}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">
//                                         Shipping Fee
//                                     </span>
//                                     <span className="font-semibold text-gray-900">
//                                         {shipping === 0 ? (
//                                             <span className="text-green-500">FREE</span>
//                                         ) : (
//                                             `Rs. ${shipping}`
//                                         )}
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="mb-6">
//                                 <input
//                                     type="text"
//                                     placeholder="Enter Voucher Code"
//                                     value={voucherCode}
//                                     onChange={(e) => setVoucherCode(e.target.value)}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
//                                 />
//                                 <button 
//                                     onClick={handleApplyVoucher}
//                                     className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg"
//                                 >
//                                     APPLY
//                                 </button>
//                             </div>

//                             <div className="mb-6 pb-6 border-b border-gray-200">
//                                 <div className="flex justify-between">
//                                     <span className="text-xl font-bold text-gray-900">
//                                         Total
//                                     </span>
//                                     <span className="text-2xl font-bold text-orange-500">
//                                         Rs. {total}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Conditional Checkout Button */}
//                             {paymentMethod === 'online' ? (
//                                 <Link 
//                                     href={'/check-out'} 
//                                     className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-center block"
//                                 >
//                                     PROCEED TO CHECKOUT ({cart.totalItems})
//                                 </Link>
//                             ) : (
//                                 <button 
//                                     onClick={() => {
//                                         // Handle COD order placement
//                                         console.log("Placing COD order with total:", total);
//                                         // Add your COD order logic here
//                                         alert(`COD Order placed! Total: Rs. ${total}`);
//                                     }}
//                                     className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg"
//                                 >
//                                     PLACE ORDER (COD) - Rs. {total}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default CartPage;