<<<<<<< HEAD
# Port San Antonio Resort Menu

A production-quality interactive resort menu prototype built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Features a responsive design, long-press interactions, admin panel, and live updates.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd port-san-antonio-resort-menu

# Install dependencies
npm install

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🍽️ Features

### User Experience
- **Animated Home Page**: Cinematic Ken Burns effect with smooth text animations
- **Interactive Menu**: Category-based navigation with search and filtering
- **Long-press Modal**: 3-second press on dish cards opens detailed view
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Accessibility**: Keyboard navigation, ARIA labels, and screen reader support

### Menu Categories
- **Starters**: Appetizers and small plates
- **Salads**: Fresh and healthy options
- **Pizza**: Traditional and specialty pizzas
- **Burgers**: Classic and gourmet burgers
- **Sandwiches**: Deli-style sandwiches and wraps
- **Platters**: Complete meal combinations
- **Drinks**: Soft drinks, juices, and hot beverages
- **Beers**: Local and imported beers
- **Arak**: Traditional Lebanese spirit
- **Prosecco & Couvent**: Sparkling wine options
- **Wine**: Red and white wine selections
- **Signature Cocktails**: House specialty drinks

### Admin Panel
- **Secure Access**: Password-protected (`admin123`)
- **Menu Management**: Add, edit, delete dishes and categories
- **Live Updates**: Changes reflect immediately on the menu
- **Content Control**: Manage availability, pricing, and descriptions

## 🛠️ Technical Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion with custom easing curves
- **Icons**: Lucide React
- **Data**: Local JSON with API endpoints
- **Images**: SVG placeholders with responsive optimization

## 📁 Project Structure

```
port-san-antonio-resort-menu/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx        # Home page with hero animation
│   │   ├── menu/           # Menu page with filtering
│   │   ├── admin/          # Admin panel
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── DishCard.tsx   # Dish display with long-press
│   │   ├── DishModal.tsx  # Detailed dish view
│   │   ├── CategoryStrip.tsx # Category navigation
│   │   ├── FilterChips.tsx # Dietary filters
│   │   ├── SideRail.tsx   # Desktop advertisement
│   │   ├── MobileBanner.tsx # Mobile advertisement
│   │   └── admin/         # Admin components
│   ├── types/             # TypeScript interfaces
│   └── lib/              # Utility functions
├── data/                  # JSON data files
├── public/seed/          # Image placeholders
├── scripts/              # Data seeding scripts
└── docs/                 # Documentation
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

### Data Management
The application uses a local JSON file (`data/dishes.json`) as the data source. The seed script generates:
- Sample menu items across all categories
- SVG placeholder images for each dish
- Proper data structure with variants for drinks

### Adding New Dishes
1. Edit `data/dishes.json`
2. Add corresponding image to `public/seed/`
3. Restart the development server

## 🎨 Customization

### Colors and Themes
- Primary colors defined in `tailwind.config.js`
- Custom animations in `globals.css`
- Component-specific styling in individual files

### Animations
- Home page: Ken Burns effect, text slide-in, CTA pulse
- Menu: Staggered card reveals, hover effects
- Long-press: Circular progress indicator
- Modal: Scale and fade transitions

### Images
- Replace SVG placeholders in `public/seed/` with real images
- Update image paths in `data/dishes.json`
- Optimize for web with appropriate formats (WebP, AVIF)

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
- No sensitive data in the current prototype
- Configure image domains in `next.config.js` for production

### Database Migration
The prototype uses local JSON files. For production:
1. Replace JSON with database (PostgreSQL, MongoDB)
2. Update API routes to use database connections
3. Implement proper authentication for admin panel

## 🧪 Testing

### Manual Testing Checklist
- [ ] Home page animations load smoothly
- [ ] Navigation to menu works correctly
- [ ] Category filtering functions properly
- [ ] Search functionality works
- [ ] Long-press triggers after 3 seconds
- [ ] Modal opens and closes correctly
- [ ] Admin login works with `admin123`
- [ ] Admin changes reflect on menu page
- [ ] Responsive design works on all screen sizes

### Automated Testing
```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📱 Responsive Design

- **Desktop (≥1024px)**: Full layout with side rail
- **Tablet (768px-1023px)**: Adjusted grid layout
- **Mobile (<768px)**: Single column with sticky banner

## ♿ Accessibility Features

- ARIA labels and descriptions
- Keyboard navigation support
- Focus management in modals
- Screen reader compatibility
- High contrast color schemes
- Alternative text for images

## 🔮 Future Enhancements

### High Priority
- [ ] Real image integration (Cloudinary, AWS S3)
- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] User authentication system
- [ ] Order management system
- [ ] Payment integration

### Medium Priority
- [ ] Real-time updates (WebSocket)
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Favorites system

### Low Priority
- [ ] PWA capabilities
- [ ] Offline support
- [ ] Push notifications
- [ ] Social media integration
- [ ] Customer reviews

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions or issues:
1. Check the [FAQ](docs/FAQ.md)
2. Search existing [issues](../../issues)
3. Create a new issue with detailed description

---

**Built with ❤️ for Port San Antonio Resort**
=======
# Port-San-Antonio
>>>>>>> 2529a03cdf9e4009b14feadb982fb98b050bab94
