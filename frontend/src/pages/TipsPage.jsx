// src/pages/TipsPage.js

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import './TipsPage.css';
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { Lightbulb, MessageSquare, CornerDownRight, Zap, Filter, ArrowDownWideNarrow, Heart, Edit3, Trash2 } from "lucide-react"; 

// Initialize i18n (KEPT FOR TRANSLATION LOGIC)
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        smart_farming_community: "Smart Farming Community",
        share_tip: "Share your farming tip...",
        your_name: "Your Name",
        add_tip: "Add Tip",
        reply: "Reply",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        back_to_dashboard: "Back to Dashboard",
        filter_by_category: "Filter by Category",
        all_categories: "All Categories",
        sort_by: "Sort By:",
        newest: "Newest",
        oldest: "Oldest",
        posted_by: "Posted by",
        no_tips: "No tips found in this category. Be the first to share!",
        tip_too_short: "Tip cannot be empty and should be descriptive (min 10 characters).",
        set_your_name: "Set your name to post/reply"
      }
    },
    ta: {
      translation: {
        smart_farming_community: "ஸ்மார்ட் விவசாய சமூகம்",
        share_tip: "உங்கள் விவசாய குறிப்பு பகிரவும்...",
        your_name: "உங்கள் பெயர்",
        add_tip: "குறிப்பு சேர்",
        reply: "பதில்",
        edit: "திருத்து",
        delete: "நீக்கு",
        save: "சேமி",
        cancel: "ரத்து செய்",
        back_to_dashboard: "டாஷ்போர்டுக்கு திரும்பவும்",
        filter_by_category: "வகை மூலம் வடிகட்டவும்",
        all_categories: "அனைத்து வகைகள்",
        sort_by: "வரிசைப்படுத்து:",
        newest: "புதியது",
        oldest: "பழையது",
        posted_by: "இடுகையிட்டவர்",
        no_tips: "இந்த வகைகளில் குறிப்புகள் இல்லை. முதலில் பகிரவும்!",
        tip_too_short: "குறிப்பு காலியாக இருக்கக்கூடாது மற்றும் விளக்கமாக இருக்க வேண்டும் (குறைந்தது 10 எழுத்துக்கள்).",
        set_your_name: "இடுகையிட/பதிலளிக்க உங்கள் பெயரை உள்ளிடவும்"
      }
    }
  },
  // Setting default language to 'en'
  lng: "en", 
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

// Calculate timestamps for realistic dummy data
const ONE_DAY = 86400000;
const now = Date.now();

// Expanded Dummy tips with 10 entries and diverse categories
const EXPANDED_DUMMY_TIPS = [
  { id: 1, user: 'John', category: 'Crops', timestamp: now - ONE_DAY * 10, likes: 15, replies: [], 
    text: { en: 'Use crop rotation to improve soil health by preventing nutrient depletion.', ta: 'ஊட்டச்சத்து குறைவதைத் தடுக்க பயிர் சுழற்சி பயன்படுத்தவும்.' } 
  },
  { id: 2, user: 'Alice', category: 'Fertilizers', timestamp: now - ONE_DAY * 8, likes: 8, replies: [], 
    text: { en: 'Organic fertilizers like compost and manure always provide better long-term yield.', ta: 'உயர்ந்த விளைவுக்காக கார்ப்பிக் உரங்கள் நீண்ட காலத்திற்கு சிறப்பாக செயல்படுகின்றன.' } 
  },
  { id: 3, user: 'Bob', category: 'Pests', timestamp: now - ONE_DAY * 6, likes: 22, replies: [], 
    text: { en: 'Neem oil mixed with mild soap water works well as a general repellent against most soft-bodied pests.', ta: 'பூச்சிகளுக்கு நிம் எண்ணெய் மற்றும் மிதமான சோப்பு நீர் சிறப்பாக வேலை செய்கிறது.' } 
  },
  { id: 4, user: 'Priya', category: 'Crops', timestamp: now - ONE_DAY * 4, likes: 5, replies: [], 
    text: { en: 'Pruning plants regularly, especially tomatoes and fruit trees, can significantly improve growth and yield.', ta: 'வளர்ச்சியை மேம்படுத்த செடிகளை செறுக்கவும். இது தக்காளி மற்றும் பழ மரங்களுக்கு சிறந்தது.' } 
  },
  { id: 5, user: 'Rajesh', category: 'Livestock', timestamp: now - ONE_DAY * 3, likes: 12, replies: [], 
    text: { en: 'Ensure your livestock shelter has proper ventilation to prevent respiratory diseases, especially during summer.', ta: 'கோடை காலத்தில் சுவாச நோய்களைத் தடுக்க உங்கள் கால்நடை கொட்டகையில் சரியான காற்றோட்டம் இருக்க வேண்டும்.' } 
  },
  { id: 6, user: 'Karthik', category: 'General', timestamp: now - ONE_DAY * 2, likes: 7, replies: [], 
    text: { en: 'Keep detailed records of your planting and harvesting dates. This data is key for future planning.', ta: 'உங்கள் நடவு மற்றும் அறுவடை தேதிகளை விரிவாக பதிவு செய்யுங்கள். இது எதிர்கால திட்டமிடலுக்கு முக்கியமானது.' } 
  },
  { id: 7, user: 'Sathya', category: 'Crops', timestamp: now - ONE_DAY * 1, likes: 19, replies: [], 
    text: { en: 'Water your crops deeply but infrequently to encourage deep root growth, making plants more drought-resistant.', ta: 'ஆழமான வேர் வளர்ச்சியை ஊக்குவிக்க உங்கள் பயிர்களுக்கு ஆழமாக, ஆனால் குறைவாக நீர்ப்பாசனம் செய்யுங்கள்.' } 
  },
  { id: 8, user: 'Ganesh', category: 'Fertilizers', timestamp: now - ONE_DAY * 0.5, likes: 10, replies: [], 
    text: { en: 'A foliar feed (spraying liquid fertilizer directly on leaves) can quickly correct nutrient deficiencies in plants.', ta: 'இலைகளில் திரவ உரத்தை தெளிப்பது ஊட்டச்சத்து குறைபாடுகளை விரைவாக சரிசெய்யும்.' } 
  },
  { id: 9, user: 'Hema', category: 'Pests', timestamp: now - 3600000 * 4, likes: 4, replies: [], 
    text: { en: 'Companion planting is an effective natural pest control method. Marigolds deter many insects.', ta: 'துணைப் பயிர் நடவு என்பது பூச்சி கட்டுப்பாடுக்கு ஒரு நல்ல இயற்கையான முறை. சாமந்தி பூ பல பூச்சிகளை விரட்டுகிறது.' } 
  },
  { id: 10, user: 'Mohan', category: 'Livestock', timestamp: now - 3600000 * 1, likes: 14, replies: [], 
    text: { en: 'Regular deworming of farm animals is crucial for maintaining their health and productivity.', ta: 'கால்நடைகளின் ஆரோக்கியத்தையும் உற்பத்தித்திறனையும் பராமரிக்க வழக்கமான குடல் புழு நீக்கம் அவசியம்.' } 
  },
];

function TipsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Removed languages array as the selection buttons are removed
  const categories = ['Crops', 'Fertilizers', 'Pests', 'Livestock', 'General'];

  // Language state is still needed to render the correct tip text
  const [language, setLanguage] = useState(i18n.language || 'en'); 
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortOrder, setSortOrder] = useState('newest');
  const [newTip, setNewTip] = useState('');
  const [tips, setTips] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [userName, setUserName] = useState(localStorage.getItem('tipUserName') || '');
  const [likedTips, setLikedTips] = useState(JSON.parse(localStorage.getItem('likedTips')) || {});
  const [editingTipId, setEditingTipId] = useState(null);
  const [editingTipText, setEditingTipText] = useState('');

  // Load Tips
  useEffect(() => {
    const savedTips = localStorage.getItem("farmingTips");
    // Use the EXPANDED_DUMMY_TIPS as the initial state
    if (savedTips) setTips(JSON.parse(savedTips));
    else setTips(EXPANDED_DUMMY_TIPS); 
  }, []);

  // Save Tips & Likes
  useEffect(() => {
    // Only save if tips exist, to avoid saving an empty array on first load before dummy data is set
    if (tips.length > 0) localStorage.setItem("farmingTips", JSON.stringify(tips));
    localStorage.setItem('likedTips', JSON.stringify(likedTips));
  }, [tips, likedTips]);

  // Save User Name
  useEffect(() => {
    localStorage.setItem('tipUserName', userName);
  }, [userName]);

  // Removed handleLanguageChange logic as buttons are gone.
  // We'll keep the language fixed to 'en' or rely on the default i18n setting.
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleAddTip = () => {
    if (!userName.trim()) { alert(t('set_your_name')); return; }
    // Check for minimum length of 10 characters
    if (newTip.trim().length < 10) { alert(t('tip_too_short')); return; }

    const tipObj = {
      id: Date.now(),
      user: userName,
      // Default to the first category if 'All Categories' is selected when posting
      category: selectedCategory === 'All Categories' ? categories[0] : selectedCategory,
      timestamp: Date.now(),
      // Save the tip text in both languages for consistency/future language toggle use
      text: { en: newTip, ta: newTip }, 
      replies: [],
      likes: 0
    };
    setTips([tipObj, ...tips]);
    setNewTip('');
  };

  const handleAddReply = (id) => {
    const text = replyText[id];
    if (!userName.trim()) { alert(t('set_your_name')); return; }
    if (!text || !text.trim()) return;

    const updatedTips = [...tips];
    const tipIndex = updatedTips.findIndex(t => t.id === id);
    if (tipIndex !== -1) {
      updatedTips[tipIndex].replies.push({
        user: userName,
        text: text,
        timestamp: Date.now()
      });
      setTips(updatedTips);
      setReplyText({ ...replyText, [id]: '' });
    }
  };

  // Handle Heart Like
  const handleLikeTip = (id) => {
    if (!userName.trim()) { alert(t('set_your_name')); return; }

    const hasLiked = likedTips[id];
    const updatedTips = tips.map(tip => tip.id === id ? { ...tip, likes: tip.likes + (hasLiked ? -1 : 1) } : tip);
    setTips(updatedTips);
    setLikedTips(prev => ({ ...prev, [id]: !hasLiked }));

    const el = document.getElementById(`heart-${id}`);
    if (el) {
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
    }
  };

  // Edit Tip
  const startEditingTip = (tip) => {
    setEditingTipId(tip.id);
    setEditingTipText(tip.text[language]);
  };

  const saveEditedTip = (id) => {
    if (editingTipText.trim().length < 10) { alert(t('tip_too_short')); return; }
    // Update both English and Tamil text fields with the edited content
    const updatedTips = tips.map(tip => tip.id === id ? { ...tip, text: { en: editingTipText, ta: editingTipText } } : tip);
    setTips(updatedTips);
    setEditingTipId(null);
    setEditingTipText('');
  };

  const cancelEditing = () => {
    setEditingTipId(null);
    setEditingTipText('');
  };

  // Delete Tip
  const deleteTip = (id) => {
    if (window.confirm("Are you sure you want to delete this tip?")) {
      setTips(tips.filter(tip => tip.id !== id));
    }
  };

  // Filter & Sort
  const filteredAndSortedTips = useMemo(() => {
    let result = tips;
    if (selectedCategory !== 'All Categories') result = result.filter(tip => tip.category === selectedCategory);
    result.sort((a, b) => sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
    return result;
  }, [tips, selectedCategory, sortOrder]);

  const categoryColors = { Crops: 'success', Fertilizers: 'warning', Pests: 'danger', Livestock: 'primary', General: 'secondary' };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    const langCode = i18n.language;
    if (diffInDays === 0) return date.toLocaleTimeString(langCode, { hour: '2-digit', minute: '2-digit' });
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString(langCode);
  };

  return (
    <div className="container my-5">
      <h2 className="text-success fw-bold text-center mb-4">
        <Lightbulb className="me-2" /> {t('smart_farming_community')}
      </h2>

      {/* Language Buttons REMOVED as requested */}

      {/* User Name Input */}
      <div className="card shadow-sm p-3 mb-4 bg-light">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <label className="form-label small text-muted d-block">{t('your_name')}</label>
            <input
              type="text"
              className="form-control"
              placeholder="E.g., Farmer Raj, Crop Expert"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Add Tip */}
      <div className={`card shadow-sm p-3 mb-4 ${!userName.trim() ? 'border-danger' : 'tip-form-card'}`}>
        <h5 className="mb-3 text-success">Share a Tip</h5>
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label small text-muted">Category</label>
            <select
              className="form-select"
              value={selectedCategory === 'All Categories' ? categories[0] : selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted">{t('share_tip')}</label>
            <textarea
              className="form-control"
              rows="2"
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              placeholder={t('share_tip')}
              disabled={!userName.trim()}
            />
            {!userName.trim() && <small className="text-danger">{t('set_your_name')}</small>}
          </div>
          <div className="col-md-3">
            <button 
              className="btn btn-success w-100 h-100" 
              onClick={handleAddTip}
              disabled={!userName.trim() || newTip.trim().length < 10}
            >
              <Zap size={16} className="me-1"/> {t('add_tip')}
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Sort */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <Filter size={20} className="text-success" />
          <label className="form-label mb-0 fw-bold">{t('filter_by_category')}:</label>
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All Categories">{t('all_categories')}</option>
            {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="d-flex align-items-center gap-2">
          <ArrowDownWideNarrow size={20} className="text-success" />
          <label className="form-label mb-0 fw-bold">{t('sort_by')}</label>
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">{t('newest')}</option>
            <option value="oldest">{t('oldest')}</option>
          </select>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="row g-4">
        {filteredAndSortedTips.length === 0 ? (
          <p className="text-center text-muted mt-5">{t('no_tips')}</p>
        ) : (
          filteredAndSortedTips.map((tip) => (
            <div key={tip.id} className="col-12 col-md-6 col-lg-4 d-flex">
              <div className="tip-card shadow-sm">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className={`badge bg-${categoryColors[tip.category]}`}>{tip.category}</span>
                  <small className="text-muted">{formatTimestamp(tip.timestamp)}</small>
                </div>
                
                {/* Tip Content */}
                {editingTipId === tip.id ? (
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    value={editingTipText}
                    onChange={(e) => setEditingTipText(e.target.value)}
                  />
                ) : (
                  <p className="tip-text">{tip.text[language]}</p>
                )}

                <p className="small text-muted mb-2">
                  <strong className="text-success">{t('posted_by')}:</strong> {tip.user}
                </p>

                {/* Edit/Delete Buttons */}
                {tip.user === userName && (
                  <div className="d-flex gap-2 mb-2">
                    {editingTipId === tip.id ? (
                      <>
                        <button className="btn btn-sm btn-success" onClick={() => saveEditedTip(tip.id)}>{t('save')}</button>
                        <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>{t('cancel')}</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => startEditingTip(tip)}><Edit3 size={14} className="me-1" /> {t('edit')}</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTip(tip.id)}><Trash2 size={14} className="me-1" /> {t('delete')}</button>
                      </>
                    )}
                  </div>
                )}

                {/* Heart Like Button */}
                <div className="d-flex justify-content-between align-items-center border-top pt-2">
                  <button 
                    id={`heart-${tip.id}`}
                    className={`btn btn-sm ${likedTips[tip.id] ? 'btn-danger' : 'btn-outline-danger'}`} 
                    onClick={() => handleLikeTip(tip.id)}
                    disabled={!userName.trim()}
                  >
                    <Heart size={14} className="me-1"/> 
                    {tip.likes}
                  </button>
                  <span className="text-muted small">
                    <MessageSquare size={14} className="me-1"/> {tip.replies.length}
                  </span>
                </div>

                {/* Replies */}
                {tip.replies.length > 0 && (
                  <div className="replies mt-3 pt-2">
                    <p className="small fw-bold mb-1">{tip.replies.length} {t('reply')}(s):</p>
                    {tip.replies.map((r, ri) => (
                      <p key={ri} className="reply mb-1 small d-flex align-items-center">
                        <CornerDownRight size={12} className="me-1 text-primary" />
                        <span className="me-2 fw-bold">{r.user}:</span>
                        {r.text}
                        <small className="ms-auto text-muted">{formatTimestamp(r.timestamp)}</small>
                      </p>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <div className="input-group input-group-sm mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`${t('reply')}...`}
                    value={replyText[tip.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [tip.id]: e.target.value })}
                    disabled={!userName.trim()}
                  />
                  <button className="btn btn-outline-success" onClick={() => handleAddReply(tip.id)} disabled={!userName.trim()}>
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Back Button */}
      <div className="text-center mt-5">
        <button
          className="btn btn-success px-4 py-2"
          onClick={() => navigate('/dashboard')}
        >
          ⬅ {t('back_to_dashboard')}
        </button>
      </div>
    </div>
  );
}

export default TipsPage;