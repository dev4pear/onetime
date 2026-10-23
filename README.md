# ONETIME

**One launch. Every chain.**

ONETIME is a production-quality crypto token launchpad that enables creators to launch tokens once on Ethereum and expand to multiple chains with the same name and symbol. Inspired by the multichain future, built for the present.

## 🌟 Brand Vision

ONETIME solves the problem of fragmented token launches and copycat deployments. Launch your token once on Ethereum, reserve your name across all supported chains, and expand when you're ready. No split liquidity, no confusion, no copycats.

### Phase 1 (Current)
- ✅ **Ethereum Only** - Live Uniswap v4-style launches on Ethereum mainnet
- ✅ Name reservation across all supported chains
- ✅ Unified liquidity architecture

### Phase 2 (Coming Soon)
- ⏳ **Base** - Coinbase's Layer 2
- ⏳ **Robinhood Chain** - Robinhood's blockchain
- ⏳ **BSC** - Binance Smart Chain  
- ⏳ **Solana** - High-performance blockchain

## 🎨 Design

- **Dark Mode First** - Premium, high-contrast crypto-native UI
- **Brand Colors** - Electric violet (#8b5cf6) + ethereal cyan (#06b6d4)
- **Motion** - Subtle CSS animations and transitions
- **Glass Effects** - Glowing accents and gradient borders
- **Responsive** - Desktop and mobile optimized

## 📁 Site Structure

### `/` - Landing Page
Cinematic hero section with ONETIME branding, chain nodes visualization (Ethereum lit, others coming soon), problem/solution narrative, and clear CTAs.

### `/launch` - Token Creation
Full-featured form to create tokens with:
- Token details (name, symbol, description)
- Optional image upload (UI only)
- Social links (website, X, Telegram)
- Chain selector (Ethereum enabled, others locked)
- Fee estimate and launch flow
- Success state with mock transaction details

### `/explore` - Token Discovery
Grid of example tokens with:
- Mock data showcasing different token types
- ETH live badge on all tokens
- Filter chips (Ethereum enabled, others disabled)
- Market cap and holder counts
- Hover effects and polish

### `/docs` - Documentation
Comprehensive markdown-style docs covering:
- How ONETIME works (Phase 1 & 2)
- Technical architecture (Uniswap v4 + LayerZero OFT)
- Fee structure and breakdown
- Roadmap with quarterly milestones
- FAQ section

## 🛠️ Tech Stack

- **Next.js 15** - App Router with TypeScript
- **Tailwind CSS v4** - Utility-first styling with custom theme
- **Geist Font** - Modern sans-serif typography
- **React 19** - Latest React features
- **No external dependencies** - Pure Next.js + Tailwind

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000` (or your configured port).

## 📦 Project Structure

```
/app
  /components
    Navigation.tsx      # Global navigation bar
    Footer.tsx          # Site footer
    ChainBadge.tsx      # Chain status badges & selector
  /launch
    page.tsx           # Token creation form
  /explore  
    page.tsx           # Token discovery grid
  /docs
    page.tsx           # Documentation
  page.tsx             # Landing page
  layout.tsx           # Root layout
  globals.css          # Global styles & theme
  icon.svg             # ONETIME favicon
```

## 🎯 Features

### ✅ Implemented
- Cinematic landing page with animated gradients
- Full token creation flow (UI complete, no wallet required for v1)
- Chain selector with live/coming soon states
- Mock token discovery grid with filtering
- Comprehensive documentation
- Responsive navigation and footer
- Custom brand theme and components
- Connect Wallet placeholder for future integration
- Success toasts and loading states

### 🔜 Future Enhancements
- Wallet connection (MetaMask, WalletConnect)
- Real smart contract deployment
- On-chain transaction signing
- LayerZero cross-chain bridging
- Live token data from subgraphs
- User profiles and token management
- Advanced analytics dashboard

## 🎨 Design Philosophy

ONETIME's visual identity is built around:
- **Unity** - One brand, one interface, many chains
- **Clarity** - Clear distinction between live and coming soon features  
- **Premium** - High-quality, polished UI that inspires confidence
- **Motion** - Subtle animations that guide attention without distraction
- **Accessibility** - Clear focus states and semantic HTML

## 🌈 Color Palette

```css
Primary Gradient: violet (#8b5cf6) → cyan (#06b6d4)
Background: Pure black (#000000)
Foreground: White (#ffffff)
Borders: White/10 opacity
Glass Effects: White/5 opacity
Success: Green (#22c55e)
Warning: Yellow (#eab308)
```

## 📝 License

This is a demonstration project. Feel free to use as inspiration for your own projects.

## 🤝 Contributing

This is a showcase project. For production use, add:
- Real wallet integration
- Smart contract audits
- Proper error handling
- Rate limiting
- Security best practices
- Environment variable management

---

Built with ⚡ by the ONETIME team
