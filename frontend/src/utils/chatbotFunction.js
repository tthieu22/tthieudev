function handleOrderMessage(data, state) {
    const order = data.order;
    if (!order) {
    state.messages.push({
        id: Date.now() + 4,
        role: "bot",
        type: "text",
        content: data.message,
    });
    return;
    }

    const orderProducts = order.products?.map(item => ({
    title: item.product?.title,
    brand: item.product?.brand,
    count: item.count,
    color: item.color?.title,
    price: item.price,
    })) || [];

    state.messages.push({
    id: Date.now() + 1,
    role: "bot",
    type: "order_info",
    content: {
        orderCode: order.orderCode,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        deliveryFee: order.deliveryFee,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        payDate: order.paymentDetails?.payDate,
        items: orderProducts,
    },
    });

    if (data.summary?.parts?.[0]?.text) {
    state.messages.push({
        id: Date.now() + 3,
        role: "bot",
        type: "text",
        content: data.summary.parts[0].text,
    });
    }
}

export { handleOrderMessage };