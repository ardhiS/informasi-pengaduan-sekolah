# Frontend Documentation

## Website Pengaduan SMP PLUS AT-THAHIRIN

### 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### 🎨 Design System

#### Colors (Tailwind Config)

```javascript
primary: {
  500: '#22c55e', // Hijau utama
  600: '#16a34a', // Hijau gelap
}
secondary: {
  500: '#3b82f6', // Biru utama
  600: '#2563eb', // Biru gelap
}
accent: {
  500: '#eab308', // Kuning utama
  600: '#ca8a04', // Kuning gelap
}
```

#### Typography

- **Font**: Inter (system fonts fallback)
- **Heading**: font-semibold, text-gray-900
- **Body**: font-normal, text-gray-600
- **Small**: text-sm, text-gray-500

### 📁 Component Structure

#### Layout Components

```
components/Layout/
├── Header.jsx              # Top navigation bar
├── Sidebar.jsx             # Side navigation menu
└── Layout.jsx              # Main layout wrapper
```

#### Feature Components

```
components/
├── AtThahirinLogo.jsx      # Logo sekolah (SVG)
├── LoadingSpinner.jsx      # Loading indicator
├── Modal.jsx               # Modal wrapper
└── Button.jsx              # Button component
```

### 🔧 Services (API Integration)

#### Complaints Service

```javascript
// src/services/complaintsService.js
export const complaintsService = {
  // Get all complaints with filters
  getComplaints: (filters) => Promise<{data: Complaint[]}>

  // Get complaint statistics
  getStats: () => Promise<{data: Stats}>

  // Create new complaint
  create: (complaintData) => Promise<{data: {id: string}}>

  // Update complaint
  update: (id, data) => Promise<{data: Complaint}>

  // Delete complaint
  delete: (id) => Promise<void>
}
```

#### Authentication Service

```javascript
// src/services/authService.js
export const authService = {
  login: (credentials) => Promise<{token: string, user: User}>
  register: (userData) => Promise<{data: {userId: string}}>
  logout: () => Promise<void>
  getCurrentUser: () => User | null
}
```

### 📄 Pages Documentation

#### 1. Welcome Page (`src/pages/Welcome.jsx`)

**Purpose**: Landing page dengan informasi sekolah dan CTA

**Features**:

- Hero section dengan logo dan headline
- Fitur utama sistem pengaduan
- Statistik pengaduan terkini
- Call-to-action untuk mulai menggunakan

**Props**: None
**State**:

- `stats` - statistik pengaduan dari API

#### 2. Complaints Page (`src/pages/Complaints.jsx`)

**Purpose**: Halaman utama manajemen pengaduan

**Features**:

- List pengaduan dengan pagination
- Filter berdasarkan status, kategori, prioritas
- Search functionality
- Modal untuk create/edit pengaduan
- Modal untuk view detail
- Bulk actions (coming soon)

**Props**: None
**State**:

- `complaints` - array pengaduan
- `filters` - object filter aktif
- `showModal` - boolean modal visibility
- `selectedComplaint` - pengaduan yang dipilih
- `loading` - loading state

### 🎯 Component Patterns

#### 1. Modal Pattern

```jsx
const [showModal, setShowModal] = useState(false);
const [modalType, setModalType] = useState('create'); // 'create' | 'edit' | 'view'
const [selectedItem, setSelectedItem] = useState(null);

// Usage
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title={modalType === 'create' ? 'Buat Pengaduan' : 'Edit Pengaduan'}
>
  <ComplaintForm
    data={selectedItem}
    onSubmit={handleSubmit}
    onCancel={() => setShowModal(false)}
  />
</Modal>;
```

#### 2. Loading Pattern

```jsx
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await api.getData();
    setData(response.data);
  } catch (error) {
    toast.error('Gagal memuat data');
  } finally {
    setLoading(false);
  }
};

// In render
{
  loading ? <LoadingSpinner /> : <DataComponent data={data} />;
}
```

#### 3. Form Handling Pattern

```jsx
const [formData, setFormData] = useState({
  title: '',
  description: '',
  category: '',
  priority: 'medium',
});

const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await complaintsService.create(formData);
    toast.success('Pengaduan berhasil dibuat');
    onSuccess();
  } catch (error) {
    toast.error('Gagal membuat pengaduan');
  }
};
```

### 🔄 State Management

#### Local State (useState)

- Component-specific data
- Form inputs
- UI state (modals, loading, etc.)

#### Context API (when needed)

```javascript
// AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth methods
  const login = async (credentials) => {
    /* ... */
  };
  const logout = () => {
    /* ... */
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 🎨 Styling Guidelines

#### Tailwind Classes Convention

```javascript
// Consistent spacing
const spacing = 'p-4 m-4 space-y-4';

// Color usage
const colors = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  success: 'bg-primary-500 text-white hover:bg-primary-600',
};

// Typography
const typography = {
  heading: 'text-2xl font-semibold text-gray-900',
  subheading: 'text-lg font-medium text-gray-700',
  body: 'text-base text-gray-600',
  small: 'text-sm text-gray-500',
};
```

#### Component Composition

```jsx
// Good - Reusable components
<Button variant="primary" size="lg" onClick={handleClick}>
  Submit
</Button>

// Good - Consistent card layout
<Card className="p-6">
  <Card.Header>
    <Card.Title>Pengaduan #1234</Card.Title>
    <Card.Badge variant="pending">Pending</Card.Badge>
  </Card.Header>
  <Card.Content>
    {/* Content */}
  </Card.Content>
</Card>
```

### 🔧 Development Guidelines

#### Code Organization

```
// File naming: PascalCase for components, camelCase for utilities
Component.jsx
utilityFunction.js

// Import order
1. React/external libraries
2. Internal components
3. Services/utilities
4. Types/constants
```

#### Error Handling

```javascript
// Use try-catch with user-friendly messages
try {
  await api.call();
  toast.success('Berhasil!');
} catch (error) {
  const message = error.response?.data?.message || 'Terjadi kesalahan';
  toast.error(message);
  console.error('API Error:', error);
}
```

#### Performance Optimization

```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Heavy rendering */}</div>;
});

// Use useMemo for expensive calculations
const computedValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Use useCallback for stable function references
const handleClick = useCallback(() => {
  doSomething(prop);
}, [prop]);
```

### 🧪 Testing (Recommended)

#### Component Testing

```javascript
// Using React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import ComplaintForm from './ComplaintForm';

test('should submit form with valid data', async () => {
  const mockSubmit = jest.fn();
  render(<ComplaintForm onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByLabelText('Judul'), {
    target: { value: 'Test Complaint' },
  });

  fireEvent.click(screen.getByText('Submit'));

  expect(mockSubmit).toHaveBeenCalledWith({
    title: 'Test Complaint',
    // ...
  });
});
```

### 🚀 Deployment

#### Build Process

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

#### Environment Variables

```javascript
// .env.local
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME="Website Pengaduan SMP AT-THAHIRIN"
```

### 📱 Responsive Design

#### Breakpoints (Tailwind)

```javascript
sm: '640px',   // Small devices
md: '768px',   // Medium devices
lg: '1024px',  // Large devices
xl: '1280px',  // Extra large devices
```

#### Mobile-First Approach

```jsx
<div
  className='
  p-4           // Mobile: padding 1rem
  md:p-6        // Tablet: padding 1.5rem  
  lg:p-8        // Desktop: padding 2rem
  
  text-sm       // Mobile: small text
  md:text-base  // Tablet+: normal text
'
>
  Content
</div>
```

### 🔍 Debugging Tips

#### React DevTools

- Install React Developer Tools browser extension
- Use Components tab to inspect component tree
- Use Profiler tab to identify performance issues

#### Console Debugging

```javascript
// Structured logging
console.group('API Call: getComplaints');
console.log('Request:', params);
console.log('Response:', response);
console.groupEnd();

// Conditional logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```
