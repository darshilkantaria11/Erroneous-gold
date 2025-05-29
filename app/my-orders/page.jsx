"use client";
import { useEffect, useState } from "react";
import { FiPackage, FiCalendar, FiMapPin, FiCreditCard, FiTruck, FiCheckCircle, FiClock, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    async function fetchOrders() {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) return;

        const { phone, token } = JSON.parse(stored);
        if (!phone || !token) return;

        // Verify user
        const verifyRes = await fetch(`/api/verifyuser?number=${phone}&token=${token}`);
        if (!verifyRes.ok) {
          throw new Error("User verification failed");
        }

        // Fetch orders if verified
        const ordersRes = await fetch(`/api/getmyorders?number=${phone}`);
        const ordersData = (await ordersRes.json()).orders || [];
        console.log(ordersData)

        setOrders(ordersData);

        // Fetch all product details
        const allProductIds = Array.from(
          new Set(
            ordersData.flatMap((order) =>
              order.items.map((item) => item.productId)
            )
          )
        );

        const fetchedProducts = {};
        await Promise.all(
          allProductIds.map(async (id) => {
            try {
              const res = await fetch(`/api/products/fetch/${id}`, {
                headers: {
                  "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                },
              });
              const product = await res.json();
              fetchedProducts[id] = product;
            } catch (err) {
              console.log(`Failed to fetch product ${id}`, err);
            }
          })
        );

        setProducts(fetchedProducts);
      } catch (err) {
        console.log("Error verifying user or fetching orders:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);


  const toggleItemExpansion = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };


  const getItemStatus = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          text: "Confirmed",
          color: "bg-yellow-100 text-yellow-800",
          icon: <FiClock className="text-yellow-500" />,
        };
      case "Crafting":
        return {
          text: "Crafting",
          color: "bg-purple-100 text-purple-800",
          icon: <FiPackage className="text-purple-500" />,
        };
      case "Shipped":
        return {
          text: "Shipped",
          color: "bg-blue-100 text-blue-800",
          icon: <FiTruck className="text-blue-500" />,
        };
      case "Delivered":
        return {
          text: "Delivered",
          color: "bg-green-100 text-green-800",
          icon: <FiCheckCircle className="text-green-500" />,
        };
      case "Cancelled":
        return {
          text: "Cancelled by Customer",
          color: "bg-red-100 text-red-800",
          icon: <FiCalendar className="text-red-500" />,
        };
      case "Rejected":
        return {
          text: "Rejected by Store",
          color: "bg-gray-100 text-gray-800",
          icon: <FiCalendar className="text-gray-500" />,
        };
      case "Replaced":
        return {
          text: "Replaced",
          color: "bg-orange-100 text-orange-800",
          icon: <FiTruck className="text-orange-500" />,
        };
      default:
        return {
          text: "Processing",
          color: "bg-yellow-100 text-yellow-800",
          icon: <FiClock className="text-yellow-500" />,
        };
    }
  };


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Create a flattened array of all order items
  const allOrderItems = orders.flatMap(order =>
    order.items.map(item => ({
      ...item,
      ordersId: order.orderId,
      customerName: order.name,
      customerPhone: order.number

    }))
  );

  return (
    <div className="min-h-screen bg-back p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-gray-600">View your order history and track shipments</p>
            <div className="flex items-center gap-2 text-sm">
              {/* <span className="bg-gray-200 rounded-full px-3 py-1">{orders.length} orders</span> */}
              <span className="bg-white rounded-full px-3 py-1">{allOrderItems.length} orders</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-6 bg-gray-200 rounded w-40" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-md" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : allOrderItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto bg-gray-100 rounded-full p-4 w-24 h-24 flex items-center justify-center mb-4">
              <FiPackage className="text-gray-400 text-4xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet</p>
            <Link href="/shop" className="bg-c4 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {allOrderItems.slice().reverse().map((item, index) => {

              const itemKey = `${item.ordersId}-${item.productId}-${index}`;
              const product = products[item.productId];
              const status = getItemStatus(item.orderStatus);
              

              const isExpanded = expandedItems[itemKey];


              return (
                <div key={itemKey} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => toggleItemExpansion(itemKey)}

                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {product ? (
                          <img
                            src={product.img1}
                            alt={product.productName}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="bg-gray-100 border border-gray-200 rounded-lg w-16 h-16 flex items-center justify-center">
                            <FiPackage className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {product ? product.productName : "Product Unavailable"}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <FiCalendar className="text-gray-400" />
                            <span>{formatDate(item.createdAt)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className={`${status.color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
                          {status.icon}
                          <span>{status.text}</span>
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                          ₹{item.amount}
                        </div>
                        <button className="flex items-center text-c4 font-medium">
                          <span>{isExpanded ? "Less details" : "More details"}</span>
                          <FiChevronRight className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiMapPin className="text-gray-500" />
                            Shipping Address
                          </h4>
                          <div className="bg-white rounded-lg p-4 text-sm border border-gray-200">
                            <p className="font-medium">{item.customerName}</p>
                            <p className="text-gray-600">{item.fullAddress}</p>
                            <p className="text-gray-600">{item.city}, {item.state} - {item.pincode}</p>
                            <p className="text-gray-600 mt-2">Phone: {item.customerPhone}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiCreditCard className="text-gray-500" />
                            Payment & Delivery
                          </h4>
                          <div className="bg-white rounded-lg p-4 text-sm border border-gray-200">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Payment Method:</span>
                              <span className="font-medium">{item.method === "cod" ? "Cash on Delivery" : "Prepaid"}</span>
                            </div>
                            {/* <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Delivery Status:</span>
                              <span className={`font-medium ${status.text === "Delivered" ? "text-green-600" : status.text === "Shipped" ? "text-blue-600" : "text-yellow-600"}`}>
                                {status.text}
                              </span>
                            </div> */}
                            <div className="flex justify-between ">
                             <p> Order ID:</p> <p>{item.orderId}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-3">Product Details</h4>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0">
                            {product ? (
                              <img
                                src={product.img1}
                                alt={product.productName}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                            ) : (
                              <div className="bg-gray-100 border border-gray-200 rounded-lg w-20 h-20 flex items-center justify-center">
                                <FiPackage className="text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:justify-between gap-2">
                              <div>
                                <h3 className="font-medium text-gray-800">
                                  {product ? product.productName : "Product Unavailable"}
                                </h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <div className="text-sm  text-c4  rounded">
                                    <div className="flex">
                                      <span className="text-gray-600">Quantity:</span>
                                      <span className="font-medium px-1">{item.quantity}</span>
                                    </div>
                                  </div>
                                  <p className="text-sm  text-c4  rounded">
                                    Product ID: {item.productId}
                                  </p>
                                  <p className="text-sm  text-gray-700 bg-green-50 px-2 py-1 rounded">
                                    MRP: ₹{(product?.originalPrice ?? 0) * (item?.quantity ?? 0)}
                                  </p>

                                </div>
                              </div>
                              <div className="text-right flex justify-center items-center">
                                <p className="text-sm text-gray-600 p-1">Purchased at</p>
                                <p className="font-bold text-lg text-gray-800">₹{item.amount}</p>
                              </div>
                            </div>

                            {item.engravedName && (
                              <div className="mt-3">
                                <p className="text-sm">
                                  <span className="font-medium text-gray-700">Engraved Name:</span>{" "}
                                  <span className="text-c4 font-medium">{item.engravedName}</span>
                                </p>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}