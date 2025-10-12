import React, { useEffect, useState, useRef } from 'react';
import './TestimonialsManager.css';
import logo from '../../assets/logos/logo.png';
import { useNavigate } from 'react-router-dom';
import { testimonialsAPI } from '../../services/api';
import ConfirmationModal from '../Common/ConfirmationModal';

// Toast Notification Component
const Toast = ({ message, type = 'success', onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                <span className="toast-icon">
                    {type === 'success' && '✅'}
                    {type === 'error' && '❌'}
                    {type === 'info' && 'ℹ️'}
                </span>
                <span className="toast-message">{message}</span>
                <button className="toast-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

const fallbackTestimonials = [
    {
        name: "Sarah O'Connor",
        rank: 'Purple Belt',
        image: '🥋',
        text: "Shinobi Academy transformed my life. The coaches here don't just teach techniques - they build character. I've gained confidence, discipline, and a second family. The training is intense but always safe and supportive.",
        rating: 5,
        isActive: true
    },
    {
        name: 'Marcus Rodriguez',
        rank: 'Black Belt',
        image: '🥋',
        text: "After 8 years of training here, I can honestly say this is the best martial arts academy I've ever been to. The level of instruction is world-class, and the community is incredible. I've competed internationally and always felt prepared.",
        rating: 5,
        isActive: true
    },
    {
        name: 'Emma Thompson',
        rank: 'Blue Belt',
        image: '🥋',
        text: "As a beginner, I was nervous about starting martial arts, but the team here made me feel welcome from day one. The classes are challenging but accessible, and I've seen amazing progress in just 6 months.",
        rating: 5,
        isActive: true
    },
    {
        name: 'David Chen',
        rank: 'Brown Belt',
        image: '🥋',
        text: "The attention to detail in technique is outstanding. Every class I learn something new, and the coaches are always pushing us to be better versions of ourselves. This place is more than a gym - it's a way of life.",
        rating: 5,
        isActive: true
    }
];

const emptyItem = { name: '', rank: '', image: '', text: '', rating: 5, isActive: true };

const TestimonialsManager = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
    const [confirmMode, setConfirmMode] = useState(null); // 'delete' | 'reset' | null
    const initialItemsRef = useRef(null);

    // Toasts
    const [toasts, setToasts] = useState([]);
    const addToast = (message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
    };
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    useEffect(() => {
        const load = async () => {
            try {
                const adminData = await testimonialsAPI.getAdminTestimonials();
                if (Array.isArray(adminData) && adminData.length) {
                    setItems(adminData);
                    if (!initialItemsRef.current) initialItemsRef.current = adminData.map(x => ({ ...x }));
                } else {
                    const publicData = await testimonialsAPI.getTestimonials();
                    if (Array.isArray(publicData) && publicData.length) {
                        const mapped = publicData.map(t => ({
                            _id: t._id,
                            name: t.name,
                            rank: t.rank || '',
                            image: t.image || '',
                            text: t.text || '',
                            rating: t.rating || 5,
                            isActive: true
                        }));
                        setItems(mapped);
                        if (!initialItemsRef.current) initialItemsRef.current = mapped.map(x => ({ ...x }));
                    } else {
                        const mappedFallback = fallbackTestimonials.map(t => ({ ...t, image: '' }));
                        setItems(mappedFallback);
                        if (!initialItemsRef.current) initialItemsRef.current = mappedFallback.map(x => ({ ...x }));
                    }
                }
            } catch (e) {
                const mappedFallback = fallbackTestimonials.map(t => ({ ...t, image: '' }));
                setItems(mappedFallback);
                if (!initialItemsRef.current) initialItemsRef.current = mappedFallback.map(x => ({ ...x }));
                setError(e.message || 'Failed to load testimonials');
                addToast('Failed to load testimonials', 'error');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleBack = () => navigate('/admin/dashboard');

    const handleChange = (index, field, value) => {
        setItems(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it));
    };

    const handleAdd = () => setItems(prev => [...prev, { ...emptyItem }]);

    const handleDelete = async (index) => {
        const item = items[index];
        if (item._id) {
            try { await testimonialsAPI.deleteTestimonial(item._id); } catch (e) { /* ignore */ }
        }
        setItems(prev => prev.filter((_, i) => i !== index));
        addToast('Testimonial removed');
    };

    const requestDelete = (index) => {
        setPendingDeleteIndex(index);
        setConfirmMode('delete');
        setShowConfirm(true);
    };

    const requestReset = () => {
        setConfirmMode('reset');
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (pendingDeleteIndex !== null) {
            await handleDelete(pendingDeleteIndex);
        }
        setShowConfirm(false);
        setPendingDeleteIndex(null);
        setConfirmMode(null);
    };

    const confirmReset = async () => {
        setSaving(true);
        try {
            const current = await testimonialsAPI.getAdminTestimonials();
            for (const t of current) {
                try { await testimonialsAPI.deleteTestimonial(t._id); } catch (e) { /* ignore */ }
            }
            const snapshot = (initialItemsRef.current || []).map(x => ({ ...x }));
            for (const [order, it] of snapshot.entries()) {
                const payload = { name: it.name, rank: it.rank || '', image: it.image || '', text: it.text || '', rating: it.rating || 5, isActive: it.isActive !== false, order };
                await testimonialsAPI.createTestimonial(payload);
            }
            const reloaded = await testimonialsAPI.getAdminTestimonials();
            setItems(reloaded);
            addToast('Testimonials reset to original', 'success');
        } catch (e) {
            setError(e.message || 'Failed to reset testimonials');
            addToast('Failed to reset testimonials', 'error');
        } finally {
            setSaving(false);
            setShowConfirm(false);
            setConfirmMode(null);
        }
    };

    const onConfirmModal = async () => {
        if (confirmMode === 'delete') return confirmDelete();
        if (confirmMode === 'reset') return confirmReset();
        setShowConfirm(false);
        setConfirmMode(null);
    };

    const onCancelModal = () => {
        setShowConfirm(false);
        setPendingDeleteIndex(null);
        setConfirmMode(null);
    };

    const handleSaveItem = async (index) => {
        setSaving(true);
        setError('');
        try {
            const it = items[index];
            const payload = { ...it, order: index };
            if (it._id) {
                await testimonialsAPI.updateTestimonial(it._id, payload);
            } else {
                const created = await testimonialsAPI.createTestimonial(payload);
                setItems(prev => prev.map((x, i) => i === index ? { ...x, _id: created._id } : x));
            }
            const order = (items.map((x, i) => ({ id: x._id, order: i }))).filter(o => !!o.id);
            if (order.length) {
                await testimonialsAPI.reorderTestimonials(order);
            }
            addToast('Testimonial saved', 'success');
        } catch (e) {
            setError(e.message || 'Failed to save');
            addToast('Failed to save testimonial', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className='content-manager'><div className='loading-message'><p>Loading testimonials...</p></div></div>;
    }

    return (
        <div className='content-manager'>
            <header className='manager-header'>
                <div className='manager-header-content'>
                    <div className='manager-logo'>
                        <img src={logo} alt='Shinobi Academy Logo' className='manager-logo-img' />
                        <h1 className='manager-title'>Testimonials Manager</h1>
                    </div>
                    <button onClick={handleBack} className='back-btn'>← Back to Dashboard</button>
                </div>
            </header>
            <main className='manager-main'>
                <div className='manager-container'>
                    <div className='section-header'>
                        <h2 className='section-title text-red'>Manage Testimonials</h2>
                        <p className='section-subtitle text-dark'>Create, edit, reorder, and remove testimonials.</p>
                    </div>
                    {error && <div className='error-message'>{error}</div>}
                    <div className='testimonials-editor'>
                        {items.map((it, index) => (
                            <div key={it._id || index} className='testimonial-editor-card shadowed-box'>
                                <div className='form-row'>
                                    <div className='form-group'>
                                        <label className='form-label text-dark'>Name</label>
                                        <input className='form-input' value={it.name} onChange={(e) => handleChange(index, 'name', e.target.value)} maxLength={100} />
                                    </div>
                                    <div className='form-group'>
                                        <label className='form-label text-dark'>Rank</label>
                                        <input className='form-input' value={it.rank} onChange={(e) => handleChange(index, 'rank', e.target.value)} maxLength={60} />
                                    </div>
                                    <div className='form-group'>
                                        <label className='form-label text-dark'>Icon (Image URL or Upload)</label>
                                        <div className='file-upload-container'>
                                            <div className='url-input-container'>
                                                <input
                                                    type='url'
                                                    className='form-input'
                                                    placeholder='Enter image URL (https://...)'
                                                    value={it.image?.startsWith('http') ? it.image : ''}
                                                    onChange={(e) => handleChange(index, 'image', e.target.value)}
                                                />
                                                {it.image?.startsWith('http') && (
                                                    <div className='url-image-preview'>
                                                        <img
                                                            src={it.image}
                                                            alt='Icon preview'
                                                            className='preview-image'
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'block';
                                                            }}
                                                        />
                                                        <div className='preview-error' style={{ display: 'none' }}>
                                                            <span className='error-icon'>⚠️</span>
                                                            <small className='error-text'>Unable to load image from URL</small>
                                                        </div>
                                                        <small className='preview-text'>URL image preview</small>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='upload-controls'>
                                                <input
                                                    type='file'
                                                    accept='image/*'
                                                    className='file-input'
                                                    id={`testimonial-icon-upload-${index}`}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => handleChange(index, 'image', ev.target?.result);
                                                        reader.readAsDataURL(file);
                                                    }}
                                                />
                                                <label htmlFor={`testimonial-icon-upload-${index}`} className='file-upload-label'>
                                                    <span className='upload-icon'>📁</span>
                                                    <span>Upload Image</span>
                                                </label>
                                            </div>
                                            {it.image?.startsWith('data:') && (
                                                <div className='uploaded-image-preview'>
                                                    <img src={it.image} alt='Uploaded icon' className='preview-image' />
                                                    <small className='preview-text'>Uploaded image preview</small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label className='form-label text-dark'>Rating</label>
                                        <input type='number' min='1' max='5' className='form-input' value={it.rating} onChange={(e) => handleChange(index, 'rating', Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label className='form-label text-dark'>Text</label>
                                    <textarea className='form-textarea' rows={4} value={it.text} onChange={(e) => handleChange(index, 'text', e.target.value)} maxLength={1000} />
                                </div>
                                <div className='form-row actions'>
                                    <button type='button' className='btn-primary' onClick={() => requestDelete(index)}>Remove</button>
                                    <button type='button' className='btn-secondary' onClick={() => handleSaveItem(index)} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='action-buttons'>
                        <button type='button' className='btn-secondary' onClick={handleAdd}>+ Add Testimonial</button>
                        <button type='button' className='btn-primary' onClick={requestReset} disabled={saving}>Reset to Original</button>
                    </div>
                </div>

                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </main>
            <ConfirmationModal
                isOpen={showConfirm}
                title={confirmMode === 'reset' ? 'Confirm Reset' : 'Confirm Deletion'}
                message={confirmMode === 'reset' ? 'Reset testimonials to the original session state? This cannot be undone.' : 'Are you sure you want to delete this testimonial? This action cannot be undone.'}
                onConfirm={onConfirmModal}
                onCancel={onCancelModal}
                confirmText={confirmMode === 'reset' ? 'Reset' : 'Delete'}
                cancelText='Cancel'
                type='warning'
            />
        </div>
    );
};

export default TestimonialsManager;


