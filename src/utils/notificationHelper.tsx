// utils/notificationHelper.ts
// Import this in your checkout screen and order service

import { useNotifications } from '../context/NotificationContext';

export const createOrderNotification = async (
  addNotification: any,
  orderNumber: string,
  orderId: string
) => {
  await addNotification({
    type: 'order',
    orderId: orderId,
    orderNumber: orderNumber,
    message: `Your order #${orderNumber} has been placed successfully!`,
    status: 'pending',
  });
};

export const createStatusUpdateNotification = async (
  addNotification: any,
  orderNumber: string,
  orderId: string,
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled'
) => {
  const messages = {
    pending: `Your order #${orderNumber} is being processed`,
    confirmed: `Your order #${orderNumber} has been confirmed!`,
    dispatched: `Your order #${orderNumber} has been dispatched and is on its way!`,
    delivered: `Your order #${orderNumber} has been delivered. Enjoy your meal!`,
    cancelled: `Your order #${orderNumber} has been cancelled`,
  };

  await addNotification({
    type: 'status_update',
    orderId: orderId,
    orderNumber: orderNumber,
    message: messages[status],
    status: status,
  });
};

export const createAdminMessageNotification = async (
  addNotification: any,
  message: string
) => {
  await addNotification({
    type: 'admin_message',
    message: message,
  });
};

export const createPromotionalNotification = async (
  addNotification: any,
  message: string
) => {
  await addNotification({
    type: 'promotional',
    message: message,
  });
};