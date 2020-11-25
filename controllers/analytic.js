const Order = require('../models/Order');
const { all } = require('../routes/analytic');
const errorHandler = require('../utils/errorHandler');
const moment = require('moment');

module.exports.overview = async(request, response) => {
    try {
        const allOrders = await Order.find({
            user: request.user.id
        }).sort({ date: 1 });

        const ordersMap = getOrdersMap(allOrders);
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];
        const yesterdayOrdersNumber = yesterdayOrders.length;
        const totalOrdersNumber = allOrders.length;
        const daysNumber = Object.keys(ordersMap).length;
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
        const totalGain = calculatePrice(allOrders);
        const gainPerDay = totalGain / daysNumber;
        const yesterdayGain = calculatePrice(yesterdayOrders);
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2);
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);

        response.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })
    } catch (e) {
        errorHandler(response, e);
    }
};

module.exports.analytics = async(request, response) => {
    try {
        const allOrders = await Order.find({
            user: request.user.id
        }).sort({ date: 1 });
        const ordersMap = getOrdersMap(allOrders);
        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);
        const chart = Object.keys(ordersMap).map(label => {
            const gain = calculatePrice(ordersMap[label]);
            const order = ordersMap[label].length;
            return {
                label,
                order,
                gain
            }
        });

        response.status(200).json({
            average,
            chart
        });
    } catch (e) {
        errorHandler(response, e);
    }

};

function getOrdersMap(orders = []) {
    const daysOrders = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY');
        if (date === moment().format('DD.MM.YYYY')) {
            return;
        }

        if (!daysOrders[date]) {
            daysOrders[date] = []
        }

        daysOrders[date].push(order);

    });
    return daysOrders;
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity;
        }, 0);
        return total += orderPrice;
    }, 0);
}