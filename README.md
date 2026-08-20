# What's My Style

A personal wardrobe and outfit management application that lets you catalog your clothing, create outfit templates, and get random outfit suggestions. All data is stored locally in your browser using localStorage.

## Features

- **Wardrobe Management**: Add, edit, and organize your clothing pieces with photos, names, categories, and tags
- **Templates & Vibes**: Create outfit templates and vibes with specific clothing slots
- **Outfit Wheel**: Spin a wheel to get random outfit suggestions
- **Wear Statistics**: Track which outfits you've worn and get insights into your most-used templates
- **Local Storage**: All data persists in your browser—no server required
- **Responsive Design**: Works on desktop and tablet

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Sidebar.jsx     # Main navigation sidebar
│   └── PageHeader.jsx  # Page title and actions
├── pages/              # Page components
│   ├── Home.jsx        # Dashboard with stats
│   ├── Wardrobe.jsx    # Wardrobe management
│   ├── Templates.jsx   # Templates & Vibes
│   ├── Folders.jsx     # Folders (future feature)
│   ├── Wheel.jsx       # Random outfit wheel
│   └── Statistics.jsx  # Wear history and stats
├── App.jsx             # Main app with routing
├── App.css             # Global modal styles
├── index.css           # Global styles
└── main.jsx            # Entry point

```

## Installation & Running Locally

### Requirements
- Node.js 16+ and npm

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173` and hot-reload on changes.

3. **Build for production**:
   ```bash
   npm run build
   ```

## Data Structure

### Wardrobe Piece
```javascript
{
  id: number,              // Unique timestamp-based ID
  name: string,            // e.g. "Linen blazer"
  category: string,        // "Outfit" | "Clothing Item" | "Accessory"
  tags: string,            // Comma-separated tags
  photoUrl: string         // Base64-encoded image data
}
```

### Template
```javascript
{
  id: number,              // Unique timestamp-based ID
  type: string,            // "Outfit" | "Vibe"
  name: string,            // e.g. "Sunday brunch look"
  description: string,     // Optional description
  tags: string,            // Comma-separated tags
  slots: object,           // { "Hat": null, "Top": null, ... }
  photoUrl: string         // Base64-encoded image data
}
```

### Wear History Entry
```javascript
{
  id: number,              // Unique timestamp-based ID
  templateId: number,      // Reference to Template.id
  templateName: string,    // Cached template name
  date: string,            // ISO timestamp
  notes: string            // Optional notes about the wear
}
```

## Key Pages

### Home
- Dashboard showing stats (pieces, templates, wears)
- Quick action cards to navigate to main features
- Breakdown of templates by type (Outfit vs Vibe)

### Wardrobe
- Browse and search wardrobe pieces
- Filter by category (All, Outfits, Clothing, Accessories)
- Add new pieces with photo and metadata
- Edit and delete existing pieces

### Templates & Vibes
- Create outfit and vibe templates
- Add photos and descriptions
- Select clothing slots (Hat, Top, Jacket, Sweater, Skirt, Jeans, Pants, Tall Shoes, Flat Shoes, Bag, Jewelry, Scarf, Belt, Custom)
- Filter by template type

### IDK WHAT TO WEAR?!
- Spin a random outfit from available templates
- Filter by type (All, Outfits, Vibes)
- Log that you wore an outfit with optional notes

### Statistics
- View total wears and unique templates worn
- See top 5 most-worn templates
- Browse full wear history with dates and notes

### Folders
- Placeholder for future folder organization feature

## Customization

### Styling
All styles are in CSS files (e.g., `Wardrobe.css`, `Templates.css`). The color scheme uses CSS variables in `index.css`:
- `--dark-bg`: Background color
- `--sidebar-bg` / `--sidebar-text`: Sidebar styling
- `--text-primary` / `--text-secondary`: Text colors
- `--button-dark` / `--button-hover`: Button styling

### Adding Features
- **New pages**: Create `.jsx` file in `src/pages/`, add route in `App.jsx`
- **New components**: Create in `src/components/`, import as needed
- **Data persistence**: Modify `App.jsx` to extend the data structure

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with localStorage support

## Notes
- All data is stored in browser localStorage under the key `whatsMyStyleData`
- Image uploads are stored as base64 data within localStorage
- localStorage has a limit (~5-10MB depending on browser), so very large photo collections may need migration to a backend database
- To reset all data: Open DevTools Console and run `localStorage.removeItem('whatsMyStyleData')`

## Future Enhancements
- Backend database for cloud sync
- Outfit recommendations based on weather or occasion
- Social sharing of outfits
- Recurring outfit rotation
- Integration with weather APIs
- Mobile app version
- Dark mode toggle
