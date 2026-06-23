import nodemailer from 'nodemailer';


export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anujgodhani76842@gmail.com",
      pass: "ooqtscggkfxzgcga"
    }
  });

export async function sendOrderConfirmation({ to, order }) {
  if (!to) return;

  const customer = order?.shipping || {};
  const address = [
    customer.addressLine1,
    customer.addressLine2,
    [customer.city, customer.state, customer.postalCode].filter(Boolean).join(' '),
    customer.country,
  ]
    .filter(Boolean)
    .join(', ');

  const subject = `Order Confirmed`;
  const items = Array.isArray(order.items) ? order.items : [];
  const rows = items.map((it) => {
    const title = it.title || (it.product && it.product.title) || 'Product';
    const qty = it.quantity || 0;
    const price = typeof it.price === 'number' ? it.price : 0;
    const lineTotal = price * qty;
    return `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${title}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${qty}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${price}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${lineTotal}</td>
      </tr>`;
  }).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
      <h2 style="color:#4d4033;">Thank you for your order, ${customer.name || 'Customer'}!</h2>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Order Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleString()}</p>
      <p><strong>Payment Method:</strong> ${order.payment?.method || 'COD'}</p>
      <p><strong>Payment Status:</strong> ${order.payment?.paid ? 'Paid' : 'Cash on Delivery'}</p>
      ${(customer.phone || customer.email) ? `<p><strong>Contact:</strong> ${[customer.phone, customer.email].filter(Boolean).join(' • ')}</p>` : ''}
      <div style="margin:16px 0;">
        <h3 style="margin:0 0 8px 0;color:#4d4033;">Items</h3>
        <table style="width:100%;border-collapse:collapse;background:#fafafa;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Product</th>
              <th style="text-align:center;padding:8px;border-bottom:2px solid #ddd;">Qty</th>
              <th style="text-align:right;padding:8px;border-bottom:2px solid #ddd;">Price</th>
              <th style="text-align:right;padding:8px;border-bottom:2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding:8px;text-align:right;font-weight:bold;">Subtotal</td>
              <td style="padding:8px;text-align:right;font-weight:bold;">₹${order.subtotal || 0}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding:8px;text-align:right;">Shipping</td>
              <td style="padding:8px;text-align:right;">₹${order.shippingFee || 0}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding:8px;text-align:right;font-size:16px;font-weight:bold;">Grand Total</td>
              <td style="padding:8px;text-align:right;font-size:16px;font-weight:bold;">₹${order.total || 0}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div style="margin:16px 0;">
        <h3 style="margin:0 0 8px 0;color:#4d4033;">Shipping Address</h3>
        <p style="margin:0;">${address}</p>
      </div>
      ${order.notes ? `<div style=\"margin:16px 0;\"><h3 style=\"margin:0 0 8px 0;color:#4d4033;\">Order Notes</h3><p style=\"margin:0;\">${order.notes}</p></div>` : ''}
      <p style="color:#666;">We will notify you when your order ships.</p>
    </div>
  `;

  await transporter.sendMail({ from: "anujgodhani76842@gmail.com", to, subject, html });
}


