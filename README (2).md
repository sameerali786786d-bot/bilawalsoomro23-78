# Bilal Mobile Shop - Website

Modern, fully responsive e-commerce website for **Bilal Mobile Shop** with **Login System (Admin + User)**.

## Features

- Fully responsive (Mobile + Desktop)
- Dark Mode support
- **Login / Register system**
- **Admin Panel** – Add, Edit, Delete products
- Working Shopping Cart (per user)
- Brand & Price filters + Sorting
- Live Search
- WhatsApp floating button
- Call Now button
- Trust badges
- Customer testimonials
- Contact form
- Newsletter subscription
- Realistic Pakistani market prices
- Clean modern UI with Tailwind CSS

## Login Credentials (Demo)

| Role  | Email                        | Password  |
|-------|------------------------------|-----------|
| Admin | admin@bilalmobileshop.com    | admin123  |
| User  | user@example.com             | user123   |

You can also **Register** a new customer account.

## How to Use

1. Extract the zip file (or open the folder)
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. That's it! No installation needed.

## Project Structure

```
bilal-mobile-shop/
├── index.html          # Main website file
├── js/
│   └── app.js          # All JavaScript (Auth + Cart + Admin)
├── css/                # (Ready for custom CSS if needed)
└── README.md           # This file
```

## Customization

### Change Phone Number / WhatsApp
- Search for `923001234567` in `index.html` and replace with your number.

### Change Colors
- Primary color: `#0A2540` (Deep Blue)
- Secondary color: `#FF6B00` (Bright Orange)
- You can edit these in the Tailwind config inside `index.html`.

### Add More Products
- Login as **Admin** → Open Admin Panel → Add products
- Or edit the `defaultProducts` array in `js/app.js`

### Deploy Online
You can upload this folder to:
- Netlify
- Vercel
- GitHub Pages
- Any free hosting

Just drag & drop the folder.

## Notes

- This is a **frontend demo**. Data is stored in browser localStorage.
- For real orders, payment integration (JazzCash/EasyPaisa), and backend, further development is required.
- Admin can manage products. Regular users can shop after login.

## Credits

Designed & developed for Bilal Mobile Shop  
Year: 2026
