# Common Components

This directory contains reusable components that can be used throughout the Shinobi Academy admin system.

## ConfirmationModal

A professional, accessible confirmation modal component that replaces browser `window.confirm()` dialogs.

### Features

- ✅ **Professional Design**: Modern, clean UI with smooth animations
- ✅ **Accessibility**: Keyboard navigation (Escape to close)
- ✅ **Click Outside**: Click outside modal to close
- ✅ **Customizable**: Different types, button text, and icons
- ✅ **Responsive**: Mobile-friendly design
- ✅ **TypeScript Ready**: Full prop type definitions

### Usage

```jsx
import ConfirmationModal from '../Common/ConfirmationModal';

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    // Handle confirmation
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Show Confirmation
      </button>

      <ConfirmationModal
        isOpen={showModal}
        title="Confirm Action"
        message="Are you sure you want to proceed? This action cannot be undone."
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText="Proceed"
        cancelText="Cancel"
        type="warning"
        showIcon={true}
      />
    </div>
  );
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |
| `title` | `string` | `''` | Modal title |
| `message` | `string` | `''` | Modal message/description |
| `onConfirm` | `function` | `() => {}` | Called when confirm button is clicked |
| `onCancel` | `function` | `() => {}` | Called when cancel button is clicked |
| `confirmText` | `string` | `'OK'` | Text for confirm button |
| `cancelText` | `string` | `'Cancel'` | Text for cancel button |
| `type` | `'warning' \| 'danger' \| 'success' \| 'info'` | `'warning'` | Modal type (affects button colors) |
| `showIcon` | `boolean` | `true` | Whether to show the type icon |

### Modal Types

- **`warning`** (default): Red/orange theme for cautionary actions
- **`danger`**: Red theme for destructive actions
- **`success`**: Green theme for positive actions
- **`info`**: Blue theme for informational actions

### Examples

#### Delete Confirmation
```jsx
<ConfirmationModal
  isOpen={showDeleteModal}
  title="Delete Item"
  message="Are you sure you want to delete this item? This action cannot be undone."
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteModal(false)}
  confirmText="Delete"
  cancelText="Cancel"
  type="danger"
/>
```

#### Success Confirmation
```jsx
<ConfirmationModal
  isOpen={showSuccessModal}
  title="Operation Complete"
  message="Your changes have been saved successfully!"
  onConfirm={() => setShowSuccessModal(false)}
  onCancel={() => setShowSuccessModal(false)}
  confirmText="OK"
  type="success"
/>
```

#### Info Modal
```jsx
<ConfirmationModal
  isOpen={showInfoModal}
  title="Information"
  message="This feature is currently in development and will be available soon."
  onConfirm={() => setShowInfoModal(false)}
  onCancel={() => setShowInfoModal(false)}
  confirmText="Got it"
  type="info"
/>
```

### Keyboard Shortcuts

- **Escape**: Closes the modal (calls `onCancel`)
- **Tab**: Navigates between buttons
- **Enter**: Activates focused button

### Styling

The component uses CSS custom properties for colors and can be customized by overriding CSS variables:

```css
:root {
  --clr-red: 220 38% 50%;
  --clr-dark: 220 13% 18%;
}
```

### Best Practices

1. **Always provide clear titles and messages**
2. **Use appropriate types for different actions**
3. **Provide meaningful button text**
4. **Handle both confirm and cancel actions**
5. **Use for important actions that need user confirmation**
6. **Don't overuse - only for critical decisions**
