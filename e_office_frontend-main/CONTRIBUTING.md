# 🤝 Contributor's Guide

Panduan untuk developer yang ingin berkontribusi di project E-Office Kampus.

---

## Getting Started as a Contributor

### 1. Fork & Clone Repository

```bash
# Fork repository di GitHub (click Fork button)

# Clone ke local
git clone https://github.com/YOUR_USERNAME/e-office-frontend.git
cd e_office_frontend

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/e-office-frontend.git
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start development server
npm run dev
```

---

## Development Workflow

### 1. Create Branch

```bash
# Create feature branch (always from main/master)
git checkout main
git pull upstream main

# Create new branch
git checkout -b feature/add-notification-system
# or
git checkout -b fix/login-page-styling
```

### Branch Naming Convention
- `feature/` - New feature
- `fix/` - Bug fix
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test addition

### 2. Make Changes

```bash
# Edit files

# Check linting
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### 3. Commit Changes

```bash
# Stage changes
git add .

# Commit dengan message yang jelas
git commit -m "feat: add notification system for new letters"
```

### Commit Message Convention
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `test:` - Test addition
- `chore:` - Build/tool changes

**Examples:**
```
feat(surat): add filter by status
fix(navbar): correct user dropdown positioning
docs: update API guide
refactor(components): simplify Button component
```

### 4. Push & Create Pull Request

```bash
# Push ke fork
git push origin feature/add-notification-system

# Go to GitHub dan create Pull Request ke main branch
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Breaking change

## Related Issue
Fixes #(issue number)

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on mobile

## Checklist
- [ ] Code follows style guide
- [ ] Linting passes
- [ ] No console errors
- [ ] Documentation updated
```

---

## Code Style Guide

### Naming Conventions

**Components**
```javascript
// ✅ Good
function DashboardCard() { }
export default DashboardCard;

// ❌ Avoid
function dashboard_card() { }
function dashboardcard() { }
```

**Functions**
```javascript
// ✅ Good
const formatDate = (date) => { };
const isValidEmail = (email) => { };

// ❌ Avoid
const format_date = (date) => { };
const checkEmail = (email) => { };
```

**Constants**
```javascript
// ✅ Good
const API_BASE_URL = 'http://localhost:5000/api';
const MAX_RETRY_COUNT = 3;

// ❌ Avoid
const apiBaseUrl = 'http://localhost:5000/api';
const maxRetryCount = 3;
```

### Code Structure

**Component Structure**
```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { suratService } from '../services';
import { formatDate } from '../utils';

export default function MyPage() {
  // 1. Hooks
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Effects
  useEffect(() => {
    loadData();
  }, []);

  // 3. Handler functions
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await suratService.getMasuk();
      setData(response.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Formatting

Use Prettier untuk auto-formatting:

```bash
npm run lint -- --fix
```

Or configure VS Code to auto-format on save.

---

## Testing Guidelines

### Unit Tests (untuk utils)

```javascript
// formatDate.test.js
import { formatDate } from '../utils';

describe('formatDate', () => {
  test('should format date correctly', () => {
    expect(formatDate('2024-03-20')).toBe('20 Maret 2024');
  });

  test('should handle invalid date', () => {
    expect(formatDate('invalid')).toBe('Invalid Date');
  });
});
```

### Component Testing

```javascript
// Button.test.js
import { render, screen } from '@testing-library/react';
import Button from '../components/Button';

describe('Button Component', () => {
  test('should render button text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('should handle click event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

---

## Performance Considerations

### Do's ✅

```javascript
// ✅ Memoize expensive components
import { memo } from 'react';
const ExpensiveComponent = memo(({ data }) => {
  return <div>{data}</div>;
});

// ✅ Use lazy loading
const TugasAkhir = lazy(() => import('./pages/TugasAkhir'));

// ✅ Optimize re-renders
const handleFilter = useCallback((filter) => {
  setFilteredData(data.filter(/* ... */));
}, [data]);
```

### Don'ts ❌

```javascript
// ❌ Avoid inline functions
<button onClick={() => handleClick()} />

// ❌ Avoid inline objects
<Component style={{ color: 'red' }} />

// ❌ Avoid unnecessary re-renders
function Parent() {
  const [state, setState] = useState();
  return <Child data={state} /> // Bad if Child doesn't need state
}
```

---

## Common Patterns

### Pattern 1: Data Fetching

```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await suratService.getMasuk();
      setData(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### Pattern 2: Form Handling

```javascript
const [formData, setFormData] = useState({
  email: '',
  password: ''
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  // Submit form
};
```

### Pattern 3: Conditional Rendering

```javascript
// ✅ Good
return (
  <>
    {loading && <LoadingSpinner />}
    {error && <ErrorAlert message={error} />}
    {data.length > 0 && <DataTable data={data} />}
  </>
);

// ❌ Avoid
return (
  <div>
    {loading ? (
      <LoadingSpinner />
    ) : error ? (
      <ErrorAlert message={error} />
    ) : data.length > 0 ? (
      <DataTable data={data} />
    ) : (
      <EmptyState />
    )}
  </div>
);
```

---

## Documentation Requirements

### For New Features

1. **Code Comments**
```javascript
// Use JSDoc for functions
/**
 * Format tanggal ke format Indonesia
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (DD Bulan YYYY)
 */
const formatDate = (dateString) => {
  // Implementation
};
```

2. **README Update**
- Add feature di feature list
- Add screenshot jika ada UI changes

3. **API_GUIDE Update** (jika ada API changes)
- Document new endpoints
- Document new services
- Add examples

4. **ARCHITECTURE Update** (jika ada structural changes)
- Update layer descriptions
- Update data flow
- Add patterns/best practices

---

## Before Submitting PR

### Checklist

- [ ] Code follows style guide
- [ ] `npm run lint` passes
- [ ] No console errors/warnings
- [ ] No console.log statements
- [ ] Tested thoroughly
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Branch up-to-date with main
- [ ] Commit messages are clear
- [ ] PR description is complete

### Pre-commit Script

```bash
#!/bin/bash
# .git/hooks/pre-commit

npm run lint
if [ $? -ne 0 ]; then
  echo "ESLint check failed"
  exit 1
fi

npm run build
if [ $? -ne 0 ]; then
  echo "Build failed"
  exit 1
fi
```

---

## Code Review Process

### Reviewer Checklist

- [ ] Code is understandable
- [ ] Follows project conventions
- [ ] No obvious bugs
- [ ] Performance is acceptable
- [ ] No security issues
- [ ] Tests are adequate
- [ ] Documentation is clear

### Common Feedback

**"Consider memoizing this component"**
→ Use `React.memo()` to prevent unnecessary re-renders

**"This function is too long"**
→ Split into smaller functions (max 50 lines)

**"Missing error handling"**
→ Add try-catch or .catch() for promises

**"Inconsistent naming"**
→ Follow naming conventions (see guide above)

---

## Debugging Tips

### Browser DevTools

```javascript
// React DevTools
// 1. Open DevTools (F12)
// 2. Go to React tab
// 3. Inspect components
// 4. Check props/state changes

// Network tab
// Check API requests/responses
// Check for failed requests
// Check response times
```

### Console Debugging

```javascript
// ✅ Good debugging
console.log('Current user:', userData);
console.table(letters); // Table format
console.time('loadData');
// ... code
console.timeEnd('loadData');

// ❌ Avoid
console.log('test');
console.log('x');
```

---

## Common Issues & Solutions

### Issue 1: Import Cycle
```javascript
// ❌ Problem
// component.js imports utils.js
// utils.js imports component.js

// ✅ Solution
// Restructure imports
// Use separate files
```

### Issue 2: Stale Closure
```javascript
// ❌ Problem
useEffect(() => {
  setInterval(() => {
    console.log(count); // Always 0
  }, 1000);
}, []); // Missing count dependency

// ✅ Solution
useEffect(() => {
  setInterval(() => {
    console.log(count);
  }, 1000);
}, [count]);
```

### Issue 3: Memory Leak
```javascript
// ❌ Problem
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);
}); // Missing cleanup

// ✅ Solution
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);
  
  return () => clearInterval(timer); // Cleanup
}, []);
```

---

## When Getting Stuck

1. **Check existing code** - Find similar implementation
2. **Check documentation** - README, API_GUIDE, etc
3. **Search issues** - Someone might have had same problem
4. **Google/StackOverflow** - React/JavaScript specific questions
5. **Ask team** - Create discussion or ask in code review

---

## Merging & Cleanup

```bash
# After PR is merged

# Update local main
git checkout main
git pull upstream main

# Delete local feature branch
git branch -d feature/my-feature

# Delete remote feature branch
git push origin --delete feature/my-feature
```

---

## Tips for Success

1. **Start small** - Fix typos, add documentation
2. **Communicate** - Ask questions, get feedback early
3. **Test thoroughly** - Manual + automated
4. **Write clear commits** - Future you will thank you
5. **Learn from reviews** - Feedback is gift
6. **Have fun!** - Coding should be enjoyable

---

## Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)
- [Git Documentation](https://git-scm.com/doc)

---

## Contact & Support

- Create an issue untuk bugs/suggestions
- Create a discussion untuk questions
- Check existing PRs untuk ongoing work

---

**Thank you for contributing! Every contribution helps make E-Office Kampus better! 🙏**

Happy coding! 🚀