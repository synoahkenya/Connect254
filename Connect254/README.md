# Connect254 - Chat, Earn & Travel

## 💰 Platform Overview

Connect254 is a platform where Kenyans can chat with verified Wazungu (foreigners), earn **$10-$20 per day**, and win **passport travel vouchers**!

## 🚀 Features

- **12+ Wazungu Profiles** - Each with different earning rates ($10-$20/day)
- **Pay KSh 300 Once** - Unlocks ALL profiles for 24 hours
- **Real-time Earnings Tracker** - Watch your money grow as you chat
- **24-Hour Chat Access** - Unlimited messages with any Wazungu
- **Travel Rewards** - Top earners win passports + flight tickets
- **No Login Required** - Just phone number and payment

## 📁 Folder Structure

```
Connect254/
├── index.html           # Main entry point
├── css/
│   └── style.css       # Custom styles
├── js/
│   └── app.js          # Main application logic
└── .gitignore          # Git ignore patterns
```

## 🔧 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS (CDN)
- **Payment**: Paystack Integration
- **Storage**: LocalStorage for user data
- **Hosting**: Vercel (Static Site)

## ⚡ Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/synoahkenya/Connect254.git
cd Connect254
```

2. Open `index.html` in your browser (or use a local server):
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

3. Navigate to `http://localhost:8000/Connect254/`

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy from the repository root:
```bash
vercel
```

3. Follow the prompts and select:
   - Project name: `connect254`
   - Root directory: `./Connect254`

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub (already done ✓)
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your `Connect254` repository
5. Configure:
   - **Framework**: None (Static)
   - **Root Directory**: `Connect254`
   - **Build Command**: Leave empty (it's a static site)
   - **Output Directory**: Leave empty
6. Click "Deploy"

### Option 3: Deploy via Git Push

The `vercel.json` is already configured for automatic deployments:
```bash
git push origin main
```
Vercel will automatically deploy your changes.

## 🔐 Security & Configuration

### Before Going Live ⚠️

1. **Replace Paystack Test Key** in `js/app.js`:
```javascript
// Current (TEST MODE - Replace before production!)
const PAYSTACK_PUBLIC_KEY = 'pk_test_d0df49836e9b84a2a1e0e1e8e4e5e6e7e8e9e0e1';

// Production (Get from Paystack Dashboard)
const PAYSTACK_PUBLIC_KEY = 'pk_live_YOUR_ACTUAL_KEY';
```

2. **Update CNAME** (Custom Domain):
   - Already set to `connect254kenya.com`
   - Configure DNS records at your domain registrar

3. **Add Environment Variables** (if needed):
   - Create `.env.local` (never commit this)
   - Use Vercel Dashboard → Settings → Environment Variables

## 📊 File Sizes & Performance

- **index.html**: ~9.7 KB
- **style.css**: ~2.6 KB
- **app.js**: ~18 KB
- **Total**: ~30 KB (before gzip: ~12 KB)

## 🎯 Features Overview

### Payment Integration
- Paystack integration for KSh 300 payment
- Phone number validation (Kenyan format)
- Real-time payment processing
- Session management with 24-hour access

### User Experience
- Floating hearts animation
- Real-time earnings tracker
- Message filtering for inappropriate content
- Chat simulation with AI-like responses
- Responsive design (mobile-first)

## 🐛 Troubleshooting

### Issue: Paystack payment not working
**Solution**: Verify Paystack Public Key is correct and in LIVE mode

### Issue: Files not found (404)
**Solution**: Ensure the `outputDirectory` in `vercel.json` points to `Connect254`

### Issue: Styles not loading
**Solution**: Clear browser cache, or use Ctrl+Shift+R (force refresh)

### Issue: LocalStorage quota exceeded
**Solution**: Clear browser data or reduce stored chat history

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔄 Updating the Site

### Add New Profile
Edit `js/app.js` and add to `wazunguProfiles` array:
```javascript
{ 
  id: 13, 
  name: "New Person", 
  age: 25, 
  country: "🇿🇦 Cape Town, South Africa", 
  bio: "Your bio here", 
  interests: ["Interest1", "Interest2"],
  avatar: "https://image-url.jpg",
  online: true,
  dailyEarning: 15,
  hourlyRate: 1.25
}
```

### Modify Earnings Rates
Update the `dailyEarning` and `hourlyRate` fields in profile objects

### Change Colors/Styling
Edit `css/style.css` or use Tailwind classes in HTML

## 📈 Analytics & Monitoring

### Vercel Analytics
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. View Analytics tab for:
   - Page views
   - Response times
   - Deployment history

### Google Analytics (Optional)
Add to `<head>` of `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🚨 Important Notes

⚠️ **Test Mode**: Currently in Paystack test mode
- Replace `pk_test_*` with `pk_live_*` before accepting real payments
- Test payments will not actually deduct funds

⚠️ **Data Storage**: Uses browser LocalStorage
- Data persists only on the same device/browser
- No backend database (currently)
- Clear browser data = lose all chat history

⚠️ **Content**: Keep conversations family-friendly
- Message filtering active for inappropriate content
- Moderation system should be implemented for production

## 🤝 Support & Contact

For issues or feature requests:
- Create an issue on GitHub
- Email: contact@connect254kenya.com
- Visit: connect254kenya.com

## 📄 License

This project is proprietary. All rights reserved.

---

**Last Updated**: June 15, 2026
**Version**: 1.0.0
**Status**: ✅ Ready for Vercel Deployment
