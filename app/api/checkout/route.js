// app/api/checkout/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { name, email, phone, address, city, state, pincode, cart, totals } = await request.json();

        // Validate required fields
        const requiredFields = { name, email, phone, address, city, state, pincode };
        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) throw new Error(`Missing required field: ${field}`);
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const companyName = "Erroneous Gold";
        const companyAddress ="Erroneous Gold, India, Gujarat - 360002";
        const supportEmail = "contact.erroneousgold24@gmail.com";

        const orderItemsHTML = cart.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price}</td>
                ${item.name ? `<td style="padding: 10px; border-bottom: 1px solid #eee;">Engraved: ${item.name}</td>` : ''}
            </tr>
        `).join('');

        // Customer Email HTML
        const customerHTML = `
            <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
                <h2 style="color:#2B6EB6;">Thank you for your order, ${name}!</h2>

                <div style="background:#f8f9fa;padding:20px;border-radius:8px;">
                    <h3>Order Details</h3>
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th style="text-align:left;padding:8px;">Product</th>
                                <th style="text-align:center;padding:8px;">Qty</th>
                                <th style="text-align:right;padding:8px;">Price</th>
                                ${cart.some(item => item.name) ? '<th style="padding:8px;">Personalization</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItemsHTML}
                        </tbody>
                    </table>
                    <hr style="margin:20px 0;">
                    <p><strong>Subtotal:</strong> Rs. ${totals.subtotal}</p>
                    <p><strong>Shipping:</strong> ${totals.shipping === 0 ? 'FREE' : `Rs. ${totals.shipping}`}</p>
                    <p style="font-size:18px;"><strong>Total:</strong> Rs. ${totals.total}</p>
                </div>

                <div style="margin-top:30px;">
                    <h3>Shipping Address</h3>
                    <p>${address}</p>
                    <p>${city}, ${state} - ${pincode}</p>
                    <p>Phone: ${phone}</p>
                </div>

                <footer style="margin-top:40px;font-size:12px;color:#888;text-align:center;">
                    <p>${companyName}</p>
                    <p>${companyAddress}</p>
                    <p>Contact support: <a href="mailto:${supportEmail}">${supportEmail}</a></p>
                </footer>
            </div>
        `;

        // Admin Email HTML
        const adminHTML = `
            <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
                <h2 style="color:#dc3545;">New Order Received</h2>

                <div style="background:#f8f9fa;padding:20px;border-radius:8px;">
                    <h3>Customer Details</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Address:</strong> ${address}, ${city}, ${state} - ${pincode}</p>
                </div>

                <div style="margin-top:30px;">
                    <h3>Order Summary</h3>
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th style="text-align:left;padding:8px;">Product</th>
                                <th style="text-align:center;padding:8px;">Qty</th>
                                <th style="text-align:right;padding:8px;">Price</th>
                                ${cart.some(item => item.name) ? '<th style="padding:8px;">Personalization</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItemsHTML}
                        </tbody>
                    </table>
                    <hr style="margin:20px 0;">
                    <p style="font-size:18px;"><strong>Total:</strong> Rs. ${totals.total}</p>
                </div>

                <footer style="margin-top:40px;font-size:12px;color:#888;text-align:center;">
                    <p>${companyName}</p>
                </footer>
            </div>
        `;

        // Send customer email
        await transporter.sendMail({
            from: `"${companyName}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `✅ Your Order Confirmation #${Date.now()}`,
            html: customerHTML
        });

        // Send admin email
        await transporter.sendMail({
            from: `"${companyName} Orders" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `🛒 New Order from ${name}`,
            html: adminHTML
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message || 'Failed to process order' }, { status: 500 });
    }
}
