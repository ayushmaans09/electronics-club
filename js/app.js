/**
 * TECHNOVA 2026 - Main Application Logic
 * Initializes interactive features: countdown, dynamic catalog, schedule,
 * FAQ search, mobile drawer, local registration management, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize sample data if empty so the portal looks great on first load
  StorageManager.seedDefaultIfEmpty();

  // Core subsystems
  initNavbar();
  initCountdown();
  initEventsCatalog();
  initSchedule();
  initFAQ();
  initContactForm();
  initRegistrationsView();
  initModals();
  initOrganiserConsole();

  // Listen for storage updates
  window.addEventListener('technova:registrations-updated', () => {
    updateNavRegistrationCount();
    renderRegistrationsList();
    renderOrganiserView();
    refreshEventCardButtons();
  });

  // Initial count update
  updateNavRegistrationCount();
});

/* ==========================================================================
   1. Toast Notification Utility
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconSvg = type === 'success' 
    ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-text">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   2. Navbar, Mobile Drawer & Scroll Spy
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggleBtn = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileMenuDrawer');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && mobileDrawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      toggleBtn.classList.toggle('active', !isOpen);
      mobileDrawer.classList.toggle('open', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close mobile drawer when clicking any link
    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active section indicator / Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const isNearBottom = (window.innerHeight + window.pageYOffset) >= (document.documentElement.scrollHeight - 60);
    if (isNearBottom && sections.length > 0) {
      const lastSection = sections[sections.length - 1];
      const lastId = lastSection.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${lastId}`);
      });
      return;
    }

    const scrollY = window.pageYOffset + 130;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }, { passive: true });
}

function updateNavRegistrationCount() {
  const count = StorageManager.getRegistrations().length;
  const badge = document.getElementById('navRegCount');
  if (badge) {
    badge.textContent = count;
  }
}

/* ==========================================================================
   3. Live Countdown Timer & Completed-Event State Manager
   ========================================================================== */
// Clearly defined event target date in code (Nov 20, 2026, 09:00 AM IST)
const EVENT_TARGET_DATE_ISO = TECHNOVA_DATA.eventMeta.targetDateISO;
let isSimulatedCompleted = false;

function initCountdown() {
  const simToggleBtn = document.getElementById('toggleCompletedStateBtn');
  const heroRegisterBtn = document.getElementById('heroRegisterBtn');
  const heroSecRegisterBtn = document.getElementById('heroSecRegisterBtn');
  const liveWrap = document.getElementById('countdownLiveWrapper');
  const completedWrap = document.getElementById('countdownCompletedWrapper');

  // Interactive toggle to test active countdown vs completed-event state
  if (simToggleBtn) {
    simToggleBtn.addEventListener('click', () => {
      isSimulatedCompleted = !isSimulatedCompleted;
      simToggleBtn.textContent = isSimulatedCompleted ? '↺ View Live Countdown' : '⚡ Simulate Completed State';
      simToggleBtn.classList.toggle('active', isSimulatedCompleted);
      updateCountdown();
      showToast(isSimulatedCompleted ? 'Displaying Sensible Completed-Event State' : 'Restored Active Live Countdown', 'info');
    });
  }

  function updateCountdown() {
    const targetDate = new Date(EVENT_TARGET_DATE_ISO).getTime();
    // In simulation mode, set effective time past the target date
    const now = isSimulatedCompleted ? (targetDate + 1000 * 60 * 60 * 24 * 3) : new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      // SENSIBLE COMPLETED-EVENT STATE
      if (liveWrap) liveWrap.style.display = 'none';
      if (completedWrap) {
        completedWrap.style.display = 'block';
      }

      // Update Hero Register CTA to reflect post-event mode
      if (heroRegisterBtn) {
        heroRegisterBtn.innerHTML = `
          <span>Explore Event Highlights & Winners</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        `;
        heroRegisterBtn.href = '#events';
      }

      if (heroSecRegisterBtn) {
        heroSecRegisterBtn.textContent = 'View Symposium Highlights';
      }
      return;
    }

    // ACTIVE LIVE COUNTDOWN STATE
    if (liveWrap) liveWrap.style.display = 'block';
    if (completedWrap) completedWrap.style.display = 'none';

    if (heroRegisterBtn) {
      heroRegisterBtn.innerHTML = `
        <span>Register for Events</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
      `;
      heroRegisterBtn.href = '#events';
    }

    if (heroSecRegisterBtn) {
      heroSecRegisterBtn.textContent = 'View 3-Day Schedule';
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   4. Events Catalog & Filter System
   ========================================================================== */
let activeCategoryFilter = 'all';

function initEventsCatalog() {
  renderCategoryFilterPills();
  renderEventCards();
}

function renderCategoryFilterPills() {
  const container = document.getElementById('eventsFilterBar');
  if (!container) return;

  container.innerHTML = TECHNOVA_DATA.categories.map(cat => `
    <button class="filter-pill ${cat.id === activeCategoryFilter ? 'active' : ''}" data-category="${cat.id}">
      <span>${cat.name}</span>
    </button>
  `).join('');

  container.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      container.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      activeCategoryFilter = target.getAttribute('data-category');
      renderEventCards();
    });
  });
}

function renderEventCards() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  const filtered = activeCategoryFilter === 'all'
    ? TECHNOVA_DATA.events
    : TECHNOVA_DATA.events.filter(ev => ev.category === activeCategoryFilter);

  grid.innerHTML = filtered.map(ev => {
    const isRegistered = StorageManager.isRegistered(ev.id);
    const badgeColorClass = ev.badgeType === 'hot' ? 'badge-amber' : ev.badgeType === 'featured' ? 'badge-cyan' : 'badge-violet';
    const isSolo = ev.participationType === 'Individual';

    return `
      <article class="event-card" data-event-id="${ev.id}">
        <div class="event-card-header">
          <span class="badge ${badgeColorClass}">${ev.tag}</span>
          <span class="badge badge-emerald">${ev.prizePool} Prizes</span>
        </div>

        <div class="event-card-body">
          <div class="event-specs-strip">
            <span class="event-participation-pill">
              ${isSolo ? '👤 Individual (Solo)' : `👥 Team (${ev.maxTeamSize})`}
            </span>
            <span class="event-deadline-pill" title="Registration closes strictly on this date">
              ⏳ Deadline: ${ev.regDeadline.split('•')[0].trim()}
            </span>
          </div>

          <h3 class="event-title">${ev.title}</h3>
          <p class="event-desc">${ev.shortDesc}</p>

          <!-- On-Card Key Rules Box -->
          <div class="card-rules-box">
            <div class="card-rules-heading">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              Key Rules & Constraints:
            </div>
            <ul class="card-rules-list">
              ${ev.rules.slice(0, 2).map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>

          <div class="event-meta-grid">
            <div class="event-meta-item">
              <span class="meta-key">Participation</span>
              <span class="meta-val">${ev.teamSize}</span>
            </div>
            <div class="event-meta-item">
              <span class="meta-key">Venue</span>
              <span class="meta-val" title="${ev.venue}">${ev.venue.split('(')[0].trim()}</span>
            </div>
            <div class="event-meta-item">
              <span class="meta-key">Event Date</span>
              <span class="meta-val">${ev.date}</span>
            </div>
            <div class="event-meta-item">
              <span class="meta-key">1st Prize</span>
              <span class="meta-val prize-highlight">${ev.firstPrize}</span>
            </div>
          </div>
        </div>

        <div class="event-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="openEventDetailsModal('${ev.id}')">
            View Rules & Details
          </button>
          ${isRegistered ? `
            <button class="btn btn-sm btn-registered" onclick="scrollToRegistrations()">
              ✓ Registered (View Pass)
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="openRegistrationModal('${ev.id}')">
              Register for Event →
            </button>
          `}
        </div>
      </article>
    `;
  }).join('');
}

function refreshEventCardButtons() {
  renderEventCards();
}

/* ==========================================================================
   4b. HTML Sanitizer & File Downloader Utility
   ========================================================================== */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function downloadFile(filename, content, type = 'text/plain;charset=utf-8;') {
  try {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('File download failed', err);
  }
}

/* ==========================================================================
   5. Schedule & Track Filter System
   ========================================================================== */
let activeScheduleDay = 'day1';
let activeTrackFilter = 'all';

function initSchedule() {
  const dayButtons = document.querySelectorAll('.schedule-tab-btn');
  dayButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      dayButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      const target = e.currentTarget;
      target.classList.add('active');
      target.setAttribute('aria-selected', 'true');
      activeScheduleDay = target.getAttribute('data-day');
      renderScheduleTimeline();
    });
  });

  const trackButtons = document.querySelectorAll('.track-filter-btn');
  trackButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      trackButtons.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      activeTrackFilter = target.getAttribute('data-track');
      renderScheduleTimeline();
    });
  });

  // Master Schedule ICS Export button
  const exportBtn = document.getElementById('exportScheduleIcsBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportMasterScheduleICS();
    });
  }

  renderScheduleTimeline();
}

/**
 * Helper to return themed CSS badge class by track name
 */
function getTrackBadgeClass(track) {
  const t = (track || '').toLowerCase();
  if (t.includes('keynote')) return 'badge-purple';
  if (t.includes('competition')) return 'badge-cyan';
  if (t.includes('hackathon')) return 'badge-emerald';
  if (t.includes('robotics')) return 'badge-rose';
  if (t.includes('paper')) return 'badge-blue';
  return 'badge-amber';
}

function renderScheduleTimeline() {
  const container = document.getElementById('scheduleTimeline');
  if (!container) return;

  const dayData = TECHNOVA_DATA.schedule[activeScheduleDay];
  if (!dayData) return;

  let items = dayData.events;
  if (activeTrackFilter !== 'all') {
    items = items.filter(item => item.track.toLowerCase() === activeTrackFilter.toLowerCase());
  }

  if (items.length === 0) {
    // Determine which other day features this track
    let altDay = null;
    let altDayName = '';
    const trackLower = activeTrackFilter.toLowerCase();
    
    for (const [dKey, dObj] of Object.entries(TECHNOVA_DATA.schedule)) {
      if (dKey !== activeScheduleDay && dObj.events.some(ev => ev.track.toLowerCase() === trackLower)) {
        altDay = dKey;
        altDayName = dKey === 'day1' ? 'Day 1 (Nov 20)' : (dKey === 'day2' ? 'Day 2 (Nov 21)' : 'Day 3 (Nov 22)');
        break;
      }
    }

    container.innerHTML = `
      <div class="schedule-empty-state">
        <div class="schedule-empty-icon">🗓️</div>
        <h4 class="schedule-empty-title">No ${escapeHtml(activeTrackFilter)} sessions on ${activeScheduleDay === 'day1' ? 'Day 1' : (activeScheduleDay === 'day2' ? 'Day 2' : 'Day 3')}</h4>
        <p class="schedule-empty-desc">
          ${altDay ? `Sessions for <strong>${escapeHtml(activeTrackFilter)}</strong> are scheduled on <strong>${altDayName}</strong>.` : `No sessions match this filter on the selected day.`}
        </p>
        <div class="schedule-empty-actions">
          ${altDay ? `<button class="btn btn-outline-cyan btn-sm" onclick="switchScheduleDay('${altDay}')">Switch to ${altDayName} →</button>` : ''}
          <button class="btn btn-secondary btn-sm" onclick="resetTrackFilter()">View All Sessions for This Day</button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map((slot, index) => {
    const badgeClass = getTrackBadgeClass(slot.track);
    return `
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-card">
          <div class="timeline-meta-bar">
            <div class="timeline-time-group">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span class="timeline-time">${slot.time}</span>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              ${slot.tag ? `<span class="badge badge-subtle" style="font-size: 0.72rem; padding: 0.15rem 0.5rem;">${slot.tag}</span>` : ''}
              <span class="badge ${badgeClass}">${slot.track}</span>
            </div>
          </div>
          <h4 class="timeline-title">${slot.title}</h4>
          <p class="timeline-desc">${slot.desc}</p>
          <div class="timeline-footer">
            <span class="timeline-venue" title="Venue location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${slot.venue}
            </span>
            <span class="timeline-speaker" title="Speaker / Session Mentor">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              ${slot.speaker}
            </span>
            <div class="timeline-card-actions">
              <button class="timeline-action-btn" onclick="copySessionDetails('${activeScheduleDay}', '${slot.id || index}')" title="Copy session details to clipboard">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span>Copy</span>
              </button>
              <button class="timeline-action-btn" onclick="downloadSingleSessionICS('${activeScheduleDay}', '${slot.id || index}')" title="Download calendar invite (.ics)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>+ Cal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Switch schedule day programmatically
 */
function switchScheduleDay(dayKey) {
  const dayButtons = document.querySelectorAll('.schedule-tab-btn');
  dayButtons.forEach(btn => {
    const matches = btn.getAttribute('data-day') === dayKey;
    btn.classList.toggle('active', matches);
    btn.setAttribute('aria-selected', matches ? 'true' : 'false');
  });
  activeScheduleDay = dayKey;
  renderScheduleTimeline();
}

/**
 * Reset track filter to 'all'
 */
function resetTrackFilter() {
  const trackButtons = document.querySelectorAll('.track-filter-btn');
  trackButtons.forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-track') === 'all');
  });
  activeTrackFilter = 'all';
  renderScheduleTimeline();
}

/**
 * Copy session info to clipboard
 */
function copySessionDetails(dayKey, slotIdentifier) {
  const day = TECHNOVA_DATA.schedule[dayKey];
  if (!day) return;
  const slot = day.events.find(e => e.id === slotIdentifier) || day.events[slotIdentifier];
  if (!slot) return;

  const text = `TECHNOVA 2026: ${slot.title}\nTime: ${slot.time} (${day.date})\nVenue: ${slot.venue}\nTrack: ${slot.track}\nSpeaker: ${slot.speaker}\n\nDetails: ${slot.desc}`;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Session details copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Session copied: ' + slot.title, 'info');
    });
  } else {
    showToast('Session details copied!', 'info');
  }
}

/**
 * Download a single session as an .ics file
 */
function downloadSingleSessionICS(dayKey, slotIdentifier) {
  const day = TECHNOVA_DATA.schedule[dayKey];
  if (!day) return;
  const slot = day.events.find(e => e.id === slotIdentifier) || day.events[slotIdentifier];
  if (!slot) return;

  const dateMap = {
    day1: '20261120',
    day2: '20261121',
    day3: '20261122'
  };
  const dtStamp = dateMap[dayKey] || '20261120';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Apex Electronics Club//TECHNOVA 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:technova-2026-${dayKey}-${slot.id || 'slot'}@apex-electronics.edu`,
    `DTSTAMP:${dtStamp}T090000Z`,
    `DTSTART;TZID=Asia/Kolkata:${dtStamp}T090000`,
    `DTEND;TZID=Asia/Kolkata:${dtStamp}T180000`,
    `SUMMARY:TECHNOVA 2026: ${slot.title}`,
    `DESCRIPTION:${slot.desc.replace(/,/g, '\\,')} | Speaker: ${slot.speaker}`,
    `LOCATION:${slot.venue}\\, Apex Institute of Technology\\, Bengaluru`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  downloadFile('technova_2026_' + (slot.id || 'session') + '.ics', icsContent, 'text/calendar;charset=utf-8');
  showToast('Calendar invite (.ics) downloaded!', 'success');
}

/**
 * Export complete 3-day schedule as an .ics calendar file
 */
function exportMasterScheduleICS() {
  const dateMap = {
    day1: '20261120',
    day2: '20261121',
    day3: '20261122'
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Apex Electronics Club//TECHNOVA 2026 Master Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:TECHNOVA 2026 Master Schedule'
  ];

  for (const [dayKey, dayObj] of Object.entries(TECHNOVA_DATA.schedule)) {
    const dt = dateMap[dayKey] || '20261120';
    dayObj.events.forEach((slot, idx) => {
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:tnv-2026-${dayKey}-${idx}@apex-electronics.edu`);
      lines.push(`DTSTAMP:${dt}T090000Z`);
      lines.push(`DTSTART;TZID=Asia/Kolkata:${dt}T090000`);
      lines.push(`DTEND;TZID=Asia/Kolkata:${dt}T180000`);
      lines.push(`SUMMARY:TECHNOVA: ${slot.title}`);
      lines.push(`DESCRIPTION:${slot.time} - ${slot.desc.replace(/,/g, '\\,')} [Speaker: ${slot.speaker}]`);
      lines.push(`LOCATION:${slot.venue}\\, Apex Institute\\, Bengaluru`);
      lines.push('STATUS:CONFIRMED');
      lines.push('END:VEVENT');
    });
  }

  lines.push('END:VCALENDAR');
  downloadFile('technova_2026_master_schedule.ics', lines.join('\r\n'), 'text/calendar;charset=utf-8');
  showToast('TECHNOVA 2026 Master Schedule (.ics) downloaded!', 'success');
}

/* ==========================================================================
   6. FAQ Accordion & Search Filter System
   ========================================================================== */
let activeFaqCategory = 'all';

function initFAQ() {
  const container = document.getElementById('faqContainer');
  const searchInput = document.getElementById('faqSearchInput');
  const clearBtn = document.getElementById('faqSearchClearBtn');
  const countEl = document.getElementById('faqCountSummary');
  const categoryButtons = document.querySelectorAll('.faq-category-pill');

  function highlightMatch(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="faq-highlight">$1</mark>');
  }

  function render(query = '') {
    if (!container) return;
    const lower = query.toLowerCase().trim();

    // Show/hide clear button
    if (clearBtn) {
      clearBtn.style.display = lower ? 'flex' : 'none';
    }

    // Filter by category and search query
    let filtered = TECHNOVA_DATA.faqs;
    if (activeFaqCategory !== 'all') {
      filtered = filtered.filter(f => f.category === activeFaqCategory);
    }
    if (lower) {
      filtered = filtered.filter(f => 
        f.question.toLowerCase().includes(lower) || 
        f.answer.toLowerCase().includes(lower) ||
        (f.categoryName && f.categoryName.toLowerCase().includes(lower))
      );
    }

    // Update count summary
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${TECHNOVA_DATA.faqs.length} questions${activeFaqCategory !== 'all' ? ` in this category` : ''}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="faq-empty-state">
          <div class="faq-empty-icon">🔍</div>
          <h4 class="faq-empty-title">No matching questions found</h4>
          <p class="faq-empty-desc">
            We couldn't find any FAQs matching "<strong>${escapeHtml(query)}</strong>" in this category.
          </p>
          <div class="faq-empty-actions">
            <button class="btn btn-secondary btn-sm" onclick="resetFaqFilters()">Reset FAQ Filters</button>
            <a href="#contact" class="btn btn-primary btn-sm">Ask AERC Support Desk →</a>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((faq, idx) => {
      const isExpanded = lower ? true : (idx === 0 && activeFaqCategory === 'all' && !lower);
      const highlightedQ = highlightMatch(escapeHtml(faq.question), lower);
      const highlightedA = highlightMatch(escapeHtml(faq.answer), lower);

      return `
        <div class="faq-item ${isExpanded ? 'active' : ''}" data-category="${faq.category}">
          <button class="faq-trigger" aria-expanded="${isExpanded ? 'true' : 'false'}">
            <div class="faq-trigger-left">
              <span class="faq-category-tag">${faq.categoryName || 'General'}</span>
              <span class="faq-question-text">${highlightedQ}</span>
            </div>
            <svg class="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="faq-content">
            <p>${highlightedA}</p>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to accordion triggers
    container.querySelectorAll('.faq-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close other items when not actively searching
        if (!lower) {
          container.querySelectorAll('.faq-item').forEach(it => {
            if (it !== item) {
              it.classList.remove('active');
              const btn = it.querySelector('.faq-trigger');
              if (btn) btn.setAttribute('aria-expanded', 'false');
            }
          });
        }

        item.classList.toggle('active', !isActive);
        trigger.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      });
    });
  }

  // Category filter clicks
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      activeFaqCategory = target.getAttribute('data-category');
      render(searchInput ? searchInput.value : '');
    });
  });

  // Search input typing
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      render(e.target.value);
    });
  }

  // Clear search button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      render('');
    });
  }

  render();
}

/**
 * Reset all FAQ search and category filters
 */
function resetFaqFilters() {
  activeFaqCategory = 'all';
  const categoryButtons = document.querySelectorAll('.faq-category-pill');
  categoryButtons.forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-category') === 'all');
  });
  const searchInput = document.getElementById('faqSearchInput');
  if (searchInput) {
    searchInput.value = '';
  }
  const clearBtn = document.getElementById('faqSearchClearBtn');
  if (clearBtn) clearBtn.style.display = 'none';
  
  initFAQ();
}

/* ==========================================================================
   7. Contact Form & Coordinator Directory
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successCard = document.getElementById('contactSuccessCard');
  const resetBtn = document.getElementById('contactResetBtn');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');

  const nameError = document.getElementById('contactNameError');
  const emailError = document.getElementById('contactEmailError');
  const messageError = document.getElementById('contactMessageError');

  // Clear errors on input
  [nameInput, emailInput, messageInput].forEach(inp => {
    if (!inp) return;
    inp.addEventListener('input', () => {
      inp.classList.remove('input-error');
      const errEl = document.getElementById(inp.id + 'Error');
      if (errEl) errEl.classList.remove('visible');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = messageInput.value.trim();

    let isValid = true;

    // Validate Name
    if (!name || name.length < 2) {
      isValid = false;
      nameInput.classList.add('input-error');
      if (nameError) {
        nameError.textContent = 'Please enter your full name (at least 2 letters).';
        nameError.classList.add('visible');
      }
    } else {
      nameInput.classList.remove('input-error');
      if (nameError) nameError.classList.remove('visible');
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      isValid = false;
      emailInput.classList.add('input-error');
      if (emailError) {
        emailError.textContent = 'Please enter a valid college or personal email address.';
        emailError.classList.add('visible');
      }
    } else {
      emailInput.classList.remove('input-error');
      if (emailError) emailError.classList.remove('visible');
    }

    // Validate Message
    if (!message || message.length < 10) {
      isValid = false;
      messageInput.classList.add('input-error');
      if (messageError) {
        messageError.textContent = 'Please detail your question (minimum 10 characters).';
        messageError.classList.add('visible');
      }
    } else {
      messageInput.classList.remove('input-error');
      if (messageError) messageError.classList.remove('visible');
    }

    if (!isValid) {
      showToast('Please correct highlighted fields before submitting.', 'warning');
      return;
    }

    // Generate unique inquiry ticket
    const ticketId = 'INQ-2026-' + Math.floor(1000 + Math.random() * 9000);

    // Save to storage
    StorageManager.saveInquiry({
      ticketId,
      name,
      email,
      subject,
      message,
      status: 'Received',
      submittedAt: new Date().toISOString()
    });

    // Display in-place success confirmation
    if (successCard) {
      const ticketEl = document.getElementById('contactTicketId');
      const msgEl = document.getElementById('contactSuccessMessage');
      if (ticketEl) ticketEl.textContent = '#' + ticketId;
      if (msgEl) {
        msgEl.innerHTML = `
          Thank you, <strong>${escapeHtml(name)}</strong>! Your inquiry regarding "<strong>${escapeHtml(subject)}</strong>" has been logged under ticket <strong style="color: var(--cyan-light);">#${ticketId}</strong>. Our student coordinator desk (AERC) will reply to <strong>${escapeHtml(email)}</strong> within 24 hours.
        `;
      }

      form.style.display = 'none';
      successCard.style.display = 'block';
    }

    showToast(`Inquiry #${ticketId} submitted successfully!`, 'success');
  });

  // Handle "Send Another Inquiry"
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      [nameInput, emailInput, messageInput].forEach(inp => {
        if (inp) inp.classList.remove('input-error');
      });
      [nameError, emailError, messageError].forEach(err => {
        if (err) err.classList.remove('visible');
      });
      if (successCard) successCard.style.display = 'none';
      form.style.display = 'block';
    });
  }
}

/* ==========================================================================
   8. "My Registrations" Student Pass View & Lookup Portal
   ========================================================================== */
let currentRegSearchQuery = '';

function initRegistrationsView() {
  const searchInput = document.getElementById('regSearchInput');
  const searchForm = document.getElementById('regSearchForm');
  const searchBtn = document.getElementById('regSearchBtn');
  const clearBtn = document.getElementById('regSearchClearBtn');
  const showAllBtn = document.getElementById('regShowAllBtn');
  const feedbackEl = document.getElementById('regSearchFeedback');

  if (searchInput) {
    // Real-time live search filter as student types
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = val ? 'flex' : 'none';
      }
      if (feedbackEl) {
        feedbackEl.style.display = 'none';
      }
      searchInput.classList.remove('input-error');

      currentRegSearchQuery = val;
      renderRegistrationsList(currentRegSearchQuery);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });
  }

  function performSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim();

    if (!query) {
      if (feedbackEl) {
        feedbackEl.innerHTML = `<span>⚠️ Please enter your registered student email or a Registration ID (e.g. <code>TNV-2026-XXXXXX</code>) to look up your passes.</span>`;
        feedbackEl.style.display = 'flex';
      }
      searchInput.classList.add('input-error');
      searchInput.focus();
      currentRegSearchQuery = '';
      renderRegistrationsList('');
      return;
    }

    if (feedbackEl) {
      feedbackEl.style.display = 'none';
    }
    searchInput.classList.remove('input-error');
    currentRegSearchQuery = query;
    renderRegistrationsList(query);
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      performSearch();
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      performSearch();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      resetRegistrationsSearch();
    });
  }

  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      resetRegistrationsSearch();
    });
  }

  renderRegistrationsList();
}

function resetRegistrationsSearch() {
  currentRegSearchQuery = '';
  const searchInput = document.getElementById('regSearchInput');
  const clearBtn = document.getElementById('regSearchClearBtn');
  const feedbackEl = document.getElementById('regSearchFeedback');

  if (searchInput) {
    searchInput.value = '';
    searchInput.classList.remove('input-error');
  }
  if (clearBtn) {
    clearBtn.style.display = 'none';
  }
  if (feedbackEl) {
    feedbackEl.style.display = 'none';
  }

  renderRegistrationsList('');
}

function updateQuickSearchChips(registrations) {
  const container = document.getElementById('regQuickChipsContainer');
  const listEl = document.getElementById('regQuickChipsList');
  if (!container || !listEl) return;

  if (!registrations || registrations.length === 0) {
    container.style.display = 'none';
    return;
  }

  const chips = [];
  registrations.forEach(r => {
    if (r.participantEmail && !chips.includes(r.participantEmail)) {
      chips.push(r.participantEmail);
    }
    if (r.regId && !chips.includes(r.regId)) {
      chips.push(r.regId);
    }
  });

  if (chips.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  listEl.innerHTML = chips.slice(0, 4).map(chip => `
    <button type="button" class="quick-chip" onclick="applyQuickSearch('${chip}')">
      ${chip}
    </button>
  `).join('');
}

function applyQuickSearch(query) {
  const searchInput = document.getElementById('regSearchInput');
  const clearBtn = document.getElementById('regSearchClearBtn');
  const feedbackEl = document.getElementById('regSearchFeedback');

  if (searchInput) {
    searchInput.value = query;
    searchInput.classList.remove('input-error');
    if (clearBtn) clearBtn.style.display = 'flex';
  }
  if (feedbackEl) feedbackEl.style.display = 'none';

  currentRegSearchQuery = query;
  renderRegistrationsList(query);
}

function renderRegistrationsList(searchQuery = currentRegSearchQuery) {
  const container = document.getElementById('registrationsGrid');
  const countIndicator = document.getElementById('registrationsCountIndicator');
  const activeSearchTag = document.getElementById('activeSearchTag');
  const activeSearchTagText = document.getElementById('activeSearchTagText');
  if (!container) return;

  const allRegistrations = StorageManager.getRegistrations();

  // Populate quick lookup suggestion chips
  updateQuickSearchChips(allRegistrations);

  // Case 1: Browser storage has zero registrations overall
  if (allRegistrations.length === 0) {
    if (countIndicator) {
      countIndicator.textContent = 'No active registrations found';
    }
    if (activeSearchTag) {
      activeSearchTag.style.display = 'none';
    }
    container.innerHTML = `
      <div class="reg-empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <h3 class="empty-title">No Active Registrations</h3>
        <p class="empty-desc">You haven't registered for any events yet. Explore our technical tracks, hackathons, and hardware challenges to claim your delegate pass.</p>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <a href="#events" class="btn btn-primary">Browse Event Tracks</a>
          <button class="btn btn-secondary" onclick="seedSampleRegistration()">Load Sample Pass</button>
        </div>
      </div>
    `;
    return;
  }

  const query = (searchQuery || '').trim();
  const filtered = query ? StorageManager.lookupRegistrations(query) : allRegistrations;

  // Update active filter badge in toolbar
  if (activeSearchTag && activeSearchTagText) {
    if (query) {
      activeSearchTagText.textContent = `Search: "${query}"`;
      activeSearchTag.style.display = 'inline-flex';
    } else {
      activeSearchTag.style.display = 'none';
    }
  }

  // Case 2: User searched for a query but NO matching registrations found
  if (query && filtered.length === 0) {
    if (countIndicator) {
      countIndicator.textContent = `No registrations found matching "${query}"`;
    }
    container.innerHTML = `
      <div class="reg-empty-search-state" style="grid-column: 1 / -1;">
        <div class="empty-search-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h3 class="empty-search-title">No Registrations Found</h3>
        <p class="empty-search-desc">
          We could not find any active delegate passes matching <span class="highlight-query">"${query}"</span> in your browser storage.
        </p>
        <div class="empty-search-tips">
          <div class="tips-title">Helpful Verification Tips:</div>
          <ul>
            <li><strong>Check Email Spelling:</strong> Verify the exact college email address entered when submitting your registration (e.g. <code>name@campus.edu</code>).</li>
            <li><strong>Registration ID Format:</strong> TECHNOVA IDs follow the format <code>TNV-2026-XXXXXX</code> (e.g., <code>TNV-2026-627755</code>).</li>
            <li><strong>Local Device Storage:</strong> TECHNOVA stores passes in your local browser store without external server transmission. If you registered on another device or private browsing window, your pass is stored on that session.</li>
          </ul>
        </div>
        <div class="empty-search-actions">
          <button type="button" class="btn btn-outline-cyan" onclick="resetRegistrationsSearch()">
            Show All ${allRegistrations.length} Passes
          </button>
          <a href="#events" class="btn btn-primary">
            Browse & Register for Events →
          </a>
        </div>
      </div>
    `;
    return;
  }

  // Case 3: Matching registrations found
  if (countIndicator) {
    if (query) {
      countIndicator.textContent = `Found ${filtered.length} matching event ${filtered.length === 1 ? 'pass' : 'passes'} for "${query}"`;
    } else {
      countIndicator.textContent = `Showing all ${filtered.length} confirmed event ${filtered.length === 1 ? 'pass' : 'passes'}`;
    }
  }

  container.innerHTML = filtered.map(reg => {
    const isTeam = reg.participationType === 'Team';
    const teammatesList = Array.isArray(reg.teammates) && reg.teammates.length > 0 
      ? reg.teammates.join(', ') 
      : null;

    return `
    <div class="reg-pass-card" id="pass-${reg.regId}">
      <div class="pass-header">
        <div>
          <div class="pass-reg-id">${reg.regId} • ${reg.passCode}</div>
          <h4 class="pass-event-title">${reg.eventTitle}</h4>
        </div>
        <span class="badge ${isTeam ? 'badge-violet' : 'badge-cyan'}">${reg.participationType}</span>
      </div>

      <div class="pass-content-split">
        <div class="pass-details-list">
          <div class="pass-field">
            <span class="pass-field-label">Lead Delegate / Squad</span>
            <span class="pass-field-val">${reg.participantName} ${isTeam ? `(${reg.teamName})` : '<span style="color: var(--cyan-light); font-size: 0.8rem;">[Solo Participant]</span>'}</span>
          </div>
          <div class="pass-field">
            <span class="pass-field-label">College / Department</span>
            <span class="pass-field-val">${reg.participantCollege} • ${reg.participantDept} (${reg.participantYear})</span>
          </div>
          <div class="pass-field">
            <span class="pass-field-label">Contact Verification</span>
            <span class="pass-field-val" style="font-family: var(--font-mono); font-size: 0.82rem;">${reg.participantEmail} • ${reg.participantPhone}</span>
          </div>
          ${isTeam ? `
          <div class="pass-field">
            <span class="pass-field-label">Squad Roster (${reg.teamSizeCount} Members)</span>
            <span class="pass-field-val" style="color: var(--cyan-light); font-size: 0.84rem;">
              ${teammatesList ? `Lead: ${reg.participantName}, Teammates: ${teammatesList}` : `Lead: ${reg.participantName}`}
            </span>
          </div>
          ` : `
          <div class="pass-field">
            <span class="pass-field-label">Participation Format</span>
            <span class="pass-field-val" style="color: var(--text-secondary); font-size: 0.84rem;">Individual Solo Entry (Single Workstation)</span>
          </div>
          `}
          <div class="pass-field">
            <span class="pass-field-label">Schedule & Allocated Venue</span>
            <span class="pass-field-val">${reg.date} • ${reg.time} — ${reg.venue}</span>
          </div>
        </div>

        <div class="pass-qr-box" title="Scan at check-in desk: ${reg.regId}">
          <!-- Cyber SVG QR Code Pattern -->
          <svg class="pass-qr-svg" viewBox="0 0 100 100" fill="#0f172a">
            <!-- Corner Finder 1 -->
            <rect x="5" y="5" width="28" height="28" rx="2" fill="none" stroke="#0f172a" stroke-width="4"/>
            <rect x="12" y="12" width="14" height="14" fill="#0f172a"/>
            <!-- Corner Finder 2 -->
            <rect x="67" y="5" width="28" height="28" rx="2" fill="none" stroke="#0f172a" stroke-width="4"/>
            <rect x="74" y="12" width="14" height="14" fill="#0f172a"/>
            <!-- Corner Finder 3 -->
            <rect x="5" y="67" width="28" height="28" rx="2" fill="none" stroke="#0f172a" stroke-width="4"/>
            <rect x="12" y="74" width="14" height="14" fill="#0f172a"/>
            <!-- Internal Data Matrix Blocks -->
            <rect x="42" y="8" width="6" height="6"/>
            <rect x="52" y="18" width="6" height="6"/>
            <rect x="42" y="28" width="6" height="6"/>
            <rect x="10" y="42" width="6" height="6"/>
            <rect x="25" y="48" width="6" height="6"/>
            <rect x="42" y="42" width="16" height="16"/>
            <rect x="68" y="45" width="8" height="6"/>
            <rect x="85" y="42" width="6" height="6"/>
            <rect x="45" y="70" width="8" height="8"/>
            <rect x="60" y="65" width="6" height="6"/>
            <rect x="75" y="72" width="15" height="6"/>
            <rect x="65" y="85" width="8" height="8"/>
            <rect x="82" y="82" width="8" height="8"/>
          </svg>
        </div>
      </div>

      <div class="pass-footer-actions">
        <span class="pass-status-pill">Delegate Verified • Pass Active</span>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-outline-cyan btn-sm" onclick="copyRegistrationId('${reg.regId}')" title="Copy Registration ID">
            📋 ${reg.regId}
          </button>
          <button class="btn btn-outline-cyan btn-sm" onclick="printPass('${reg.regId}')">
            Download Pass
          </button>
          <button class="btn btn-secondary btn-sm" style="color: var(--rose-primary);" onclick="cancelRegistrationPrompt('${reg.regId}', '${reg.eventTitle}')">
            Cancel
          </button>
        </div>
      </div>
    </div>
    `;
  }).join('');
}

function seedSampleRegistration() {
  StorageManager.seedDefaultIfEmpty();
  showToast('Sample registration pass generated!', 'success');
}

function cancelRegistrationPrompt(regId, title) {
  if (confirm(`Are you sure you want to cancel your registration for "${title}"?`)) {
    StorageManager.cancelRegistration(regId);
    showToast(`Registration for ${title} has been cancelled.`, 'info');
  }
}

function printPass(regId) {
  const passEl = document.getElementById(`pass-${regId}`);
  if (!passEl) return;
  window.print();
}

/* ==========================================================================
   9. Registration Form Validation & Modal Management
   ========================================================================== */
let pendingRegisterEventId = null;

/**
 * Show a clear field-level error message and apply input error highlight
 */
function showFieldError(fieldId, errorMsg) {
  const errContainer = document.getElementById(`err-${fieldId}`);
  const inputEl = document.getElementById(fieldId);

  if (errContainer) {
    errContainer.textContent = errorMsg;
    errContainer.classList.add('visible');
  }

  if (inputEl) {
    inputEl.classList.add('input-error');
    inputEl.setAttribute('aria-invalid', 'true');
  }
}

/**
 * Clear a specific field-level error
 */
function clearFieldError(fieldId) {
  const errContainer = document.getElementById(`err-${fieldId}`);
  const inputEl = document.getElementById(fieldId);

  if (errContainer) {
    errContainer.textContent = '';
    errContainer.classList.remove('visible');
  }

  if (inputEl) {
    inputEl.classList.remove('input-error');
    inputEl.removeAttribute('aria-invalid');
  }
}

/**
 * Clear all visible field errors from the form
 */
function clearAllFormErrors() {
  document.querySelectorAll('.form-field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });

  document.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('input-error');
    el.removeAttribute('aria-invalid');
  });
}

/**
 * Extract integer maximum team members count from event object
 */
function getMaxTeamCount(ev) {
  if (!ev || ev.participationType === 'Individual') return 1;
  const match = (ev.maxTeamSize || ev.teamSize || '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 4;
}

/**
 * Dynamically render additional teammate name inputs based on team size
 */
function updateTeammateInputs(totalCount) {
  const container = document.getElementById('teammatesInputsContainer');
  if (!container) return;

  const additionalCount = totalCount - 1; // excluding lead delegate
  if (additionalCount <= 0) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  for (let i = 2; i <= totalCount; i++) {
    html += `
      <div class="teammate-input-row" id="teammateRow-${i}">
        <div class="teammate-label-row">
          <label for="teammate-${i}" class="form-label" style="margin-bottom: 0;">Teammate #${i} Full Name <span class="req-star">*</span></label>
          <span class="teammate-member-num">Member 0${i}</span>
        </div>
        <input type="text" id="teammate-${i}" class="form-input teammate-name-input" placeholder="e.g. Teammate ${i} Name" autocomplete="name" required>
        <div class="form-field-error" id="err-teammate-${i}"></div>
      </div>
    `;
  }
  container.innerHTML = html;

  // Attach real-time validation to dynamically created teammate inputs
  for (let i = 2; i <= totalCount; i++) {
    const inp = document.getElementById(`teammate-${i}`);
    if (inp) {
      inp.addEventListener('input', () => {
        if (inp.value.trim().length >= 2) {
          clearFieldError(`teammate-${i}`);
        }
      });
      inp.addEventListener('blur', () => {
        validateSingleField(`teammate-${i}`);
      });
    }
  }
}

/**
 * Populate event select dropdown options
 */
function populateRegistrationEventSelect() {
  const select = document.getElementById('regEventSelect');
  if (!select || select.options.length > 0) return;

  select.innerHTML = TECHNOVA_DATA.events.map(ev => `
    <option value="${ev.id}">
      ${ev.title} — ${ev.participationType} (${ev.maxTeamSize})
    </option>
  `).join('');
}

/**
 * Synchronize the registration modal when an event is selected
 */
function syncRegistrationModalEvent(eventId) {
  pendingRegisterEventId = eventId;
  const ev = TECHNOVA_DATA.events.find(x => x.id === eventId);
  if (!ev) return;

  // Clear previous errors when switching events
  clearAllFormErrors();

  const select = document.getElementById('regEventSelect');
  if (select && select.value !== eventId) {
    select.value = eventId;
  }

  const targetLabel = document.getElementById('regEventTargetTitle');
  if (targetLabel) {
    targetLabel.textContent = `Registering for: ${ev.title} (${ev.participationType} • ${ev.maxTeamSize})`;
  }

  const snapshot = document.getElementById('modalEventSnapshot');
  if (snapshot) {
    snapshot.innerHTML = `
      <div class="snapshot-header">
        <span class="snapshot-title">${ev.title}</span>
        <span class="badge badge-emerald">${ev.prizePool} Prizes</span>
      </div>
      <div class="snapshot-meta-row">
        <span class="snapshot-chip">👥 ${ev.participationType} (${ev.maxTeamSize})</span>
        <span class="snapshot-chip snapshot-deadline">⏳ Closes: ${ev.regDeadline}</span>
        <span class="snapshot-chip">📍 ${ev.venue.split('(')[0].trim()}</span>
        <span class="snapshot-chip">🗓️ ${ev.date}</span>
      </div>
    `;
  }

  // Update Participation Format display & hidden field
  const badge = document.getElementById('regParticipationBadge');
  const desc = document.getElementById('regParticipationDesc');
  const typeHidden = document.getElementById('regParticipationType');
  const teamBadge = document.getElementById('teamSizeBadge');
  const isTeam = ev.participationType === 'Team';

  if (typeHidden) typeHidden.value = ev.participationType;

  if (badge) {
    badge.textContent = `${ev.participationType} Track`;
    badge.className = isTeam ? 'badge badge-violet' : 'badge badge-cyan';
  }

  if (desc) {
    desc.textContent = isTeam 
      ? `Collaborative squad format (${ev.maxTeamSize})` 
      : `Solo individual competition (1 workstation per delegate)`;
  }

  if (teamBadge) {
    teamBadge.textContent = ev.maxTeamSize;
  }

  const teamFieldsContainer = document.getElementById('teamFieldsContainer');
  const soloNoticeContainer = document.getElementById('soloNoticeContainer');
  const teamSizeSelect = document.getElementById('regTeamSizeSelect');

  if (isTeam) {
    if (teamFieldsContainer) teamFieldsContainer.style.display = 'block';
    if (soloNoticeContainer) soloNoticeContainer.style.display = 'none';

    // Populate team size selector according to event max team size
    const maxCount = getMaxTeamCount(ev);
    if (teamSizeSelect) {
      let options = '';
      for (let n = 2; n <= maxCount; n++) {
        options += `<option value="${n}">${n} Members (Lead + ${n - 1})</option>`;
      }
      teamSizeSelect.innerHTML = options;
      teamSizeSelect.value = "2"; // Default to 2 members
      updateTeammateInputs(2);
    }
  } else {
    if (teamFieldsContainer) teamFieldsContainer.style.display = 'none';
    if (soloNoticeContainer) soloNoticeContainer.style.display = 'flex';
    const teammatesContainer = document.getElementById('teammatesInputsContainer');
    if (teammatesContainer) teammatesContainer.innerHTML = '';
  }

  // If email was already filled in, re-check duplicate validity for this newly selected event
  const emailInput = document.getElementById('regEmail');
  if (emailInput && emailInput.value.trim()) {
    validateSingleField('regEmail');
  }
}

/**
 * Validate a single field by ID
 */
function validateSingleField(fieldId) {
  const chosenEventId = document.getElementById('regEventSelect') 
    ? document.getElementById('regEventSelect').value 
    : pendingRegisterEventId;
  const ev = TECHNOVA_DATA.events.find(x => x.id === chosenEventId);
  const isTeam = ev && ev.participationType === 'Team';

  switch (fieldId) {
    case 'regName': {
      const el = document.getElementById('regName');
      const val = el ? el.value.trim() : '';
      if (!val) {
        showFieldError('regName', 'Lead participant full name is required.');
        return false;
      }
      if (val.length < 2) {
        showFieldError('regName', 'Full name must be at least 2 characters.');
        return false;
      }
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) {
        showFieldError('regName', 'Name can only contain letters, spaces, hyphens, and periods.');
        return false;
      }
      clearFieldError('regName');
      return true;
    }

    case 'regEmail': {
      const el = document.getElementById('regEmail');
      const val = el ? el.value.trim().toLowerCase() : '';
      if (!val) {
        showFieldError('regEmail', 'College or student email address is required.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showFieldError('regEmail', 'Please enter a valid email address (e.g. name@campus.edu).');
        return false;
      }
      // Duplicate Registration Check: prevent duplicate registrations using the same email for the same event
      if (ev && StorageManager.isRegistered(ev.id, val)) {
        showFieldError('regEmail', `This email (${val}) is already registered for "${ev.title}". Each participant can only register once per event.`);
        return false;
      }
      clearFieldError('regEmail');
      return true;
    }

    case 'regPhone': {
      const el = document.getElementById('regPhone');
      const raw = el ? el.value.trim() : '';
      const digits = raw.replace(/\D/g, '');
      if (!raw) {
        showFieldError('regPhone', 'Contact mobile number is required.');
        return false;
      }
      if (digits.length !== 10) {
        showFieldError('regPhone', 'Please enter a valid 10-digit mobile number.');
        return false;
      }
      if (!/^[6-9]\d{9}$/.test(digits)) {
        showFieldError('regPhone', 'Mobile number should be a valid 10-digit Indian number (starts with 6, 7, 8, or 9).');
        return false;
      }
      clearFieldError('regPhone');
      return true;
    }

    case 'regDept': {
      const el = document.getElementById('regDept');
      const val = el ? el.value : '';
      if (!val) {
        showFieldError('regDept', 'Please select your academic department.');
        return false;
      }
      clearFieldError('regDept');
      return true;
    }

    case 'regYear': {
      const el = document.getElementById('regYear');
      const val = el ? el.value : '';
      if (!val) {
        showFieldError('regYear', 'Please select your academic year.');
        return false;
      }
      clearFieldError('regYear');
      return true;
    }

    case 'regCollege': {
      const el = document.getElementById('regCollege');
      const val = el ? el.value.trim() : '';
      if (!val) {
        showFieldError('regCollege', 'College or institution name is required.');
        return false;
      }
      if (val.length < 3) {
        showFieldError('regCollege', 'Please enter your full college or institution name (minimum 3 characters).');
        return false;
      }
      clearFieldError('regCollege');
      return true;
    }

    case 'regTeam': {
      if (!isTeam) {
        clearFieldError('regTeam');
        return true;
      }
      const el = document.getElementById('regTeam');
      const val = el ? el.value.trim() : '';
      if (!val) {
        showFieldError('regTeam', 'Team name is required for team competitions.');
        return false;
      }
      if (val.length < 2) {
        showFieldError('regTeam', 'Team name must be at least 2 characters.');
        return false;
      }
      clearFieldError('regTeam');
      return true;
    }

    default: {
      // Dynamic teammate inputs (teammate-2, teammate-3, etc.)
      if (fieldId.startsWith('teammate-')) {
        const el = document.getElementById(fieldId);
        const val = el ? el.value.trim() : '';
        const memberNum = fieldId.split('-')[1];
        if (!val) {
          showFieldError(fieldId, `Teammate #${memberNum} full name is required.`);
          return false;
        }
        if (val.length < 2) {
          showFieldError(fieldId, `Teammate #${memberNum} name must be at least 2 characters.`);
          return false;
        }
        if (!/^[a-zA-Z\s.'-]+$/.test(val)) {
          showFieldError(fieldId, `Teammate #${memberNum} name can only contain letters and spaces.`);
          return false;
        }
        clearFieldError(fieldId);
        return true;
      }
      return true;
    }
  }
}

/**
 * Validate the entire registration form on submit
 */
function validateRegistrationForm() {
  const chosenEventId = document.getElementById('regEventSelect') 
    ? document.getElementById('regEventSelect').value 
    : pendingRegisterEventId;
  const ev = TECHNOVA_DATA.events.find(x => x.id === chosenEventId);
  const isTeam = ev && ev.participationType === 'Team';

  let isValid = true;
  let firstInvalidEl = null;

  const fieldsToCheck = [
    'regName',
    'regEmail',
    'regPhone',
    'regDept',
    'regYear',
    'regCollege'
  ];

  if (isTeam) {
    fieldsToCheck.push('regTeam');
    // Check all dynamic teammate inputs currently in DOM
    const teamSizeSelect = document.getElementById('regTeamSizeSelect');
    const totalCount = teamSizeSelect ? parseInt(teamSizeSelect.value, 10) : 2;
    for (let i = 2; i <= totalCount; i++) {
      fieldsToCheck.push(`teammate-${i}`);
    }
  }

  fieldsToCheck.forEach(id => {
    const ok = validateSingleField(id);
    if (!ok) {
      isValid = false;
      if (!firstInvalidEl) {
        firstInvalidEl = document.getElementById(id);
      }
    }
  });

  if (!isValid && firstInvalidEl) {
    firstInvalidEl.focus();
  }

  return isValid;
}

/**
 * Reset modal views back to initial input form state
 */
function resetRegistrationFormView() {
  const regFormView = document.getElementById('regFormView');
  const regSuccessView = document.getElementById('regSuccessView');
  const regForm = document.getElementById('eventRegistrationForm');

  if (regFormView) regFormView.style.display = 'block';
  if (regSuccessView) regSuccessView.style.display = 'none';

  clearAllFormErrors();

  if (regForm) {
    // Preserve lead delegate contact if desired or reset
    // Reset specific team inputs
    const teamInput = document.getElementById('regTeam');
    if (teamInput) teamInput.value = '';
    const teamSizeSelect = document.getElementById('regTeamSizeSelect');
    if (teamSizeSelect) {
      teamSizeSelect.value = '2';
      updateTeammateInputs(2);
    }
  }
}

/**
 * Copy registration ID to clipboard with tactile feedback
 */
function copyRegistrationId(regId) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(regId).then(() => {
      onCopySuccess();
    }).catch(() => {
      fallbackCopy(regId);
    });
  } else {
    fallbackCopy(regId);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    onCopySuccess();
  } catch (e) {
    showToast(`Registration ID: ${text}`, 'info');
  }
  document.body.removeChild(ta);
}

function onCopySuccess() {
  const copyBtnText = document.getElementById('copyRegIdText');
  if (copyBtnText) {
    copyBtnText.textContent = '✓ Copied to Clipboard!';
    setTimeout(() => {
      copyBtnText.textContent = 'Copy Registration ID';
    }, 2200);
  }
  showToast('Registration ID copied to clipboard!', 'info');
}

/**
 * Initialize all modals and form interaction events
 */
function initModals() {
  populateRegistrationEventSelect();

  // Handle select change inside registration modal
  const eventSelect = document.getElementById('regEventSelect');
  if (eventSelect) {
    eventSelect.addEventListener('change', (e) => {
      syncRegistrationModalEvent(e.target.value);
    });
  }

  // Handle team size dropdown change
  const teamSizeSelect = document.getElementById('regTeamSizeSelect');
  if (teamSizeSelect) {
    teamSizeSelect.addEventListener('change', (e) => {
      const count = parseInt(e.target.value, 10);
      updateTeammateInputs(count);
    });
  }

  // Real-time validation listeners on all main input fields
  const watchedFields = [
    'regName',
    'regEmail',
    'regPhone',
    'regDept',
    'regYear',
    'regCollege',
    'regTeam'
  ];

  watchedFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', () => {
      // Clear error immediately when user begins correcting
      const errEl = document.getElementById(`err-${id}`);
      if (errEl && errEl.classList.contains('visible')) {
        validateSingleField(id);
      }
    });

    el.addEventListener('blur', () => {
      validateSingleField(id);
    });

    if (el.tagName === 'SELECT') {
      el.addEventListener('change', () => {
        validateSingleField(id);
      });
    }
  });

  // Close buttons and overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Handle registration modal submit with strict validation & duplicate check
  const regForm = document.getElementById('eventRegistrationForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const chosenEventId = document.getElementById('regEventSelect') 
        ? document.getElementById('regEventSelect').value 
        : pendingRegisterEventId;
      const ev = TECHNOVA_DATA.events.find(x => x.id === chosenEventId);

      if (!ev) {
        showToast('Please select a valid event track.', 'warning');
        return;
      }

      // Execute full client-side validation
      const isFormValid = validateRegistrationForm();
      if (!isFormValid) {
        showToast('Please correct the highlighted form errors before submitting.', 'warning');
        return;
      }

      // Gather form values
      const fullName = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const dept = document.getElementById('regDept').value;
      const year = document.getElementById('regYear').value;
      const college = document.getElementById('regCollege').value.trim();

      const isTeam = ev.participationType === 'Team';
      const teamName = isTeam ? document.getElementById('regTeam').value.trim() : `${fullName} (Solo)`;

      const teammatesList = [];
      let teamSizeCount = 1;

      if (isTeam) {
        const teamSizeSelectEl = document.getElementById('regTeamSizeSelect');
        teamSizeCount = teamSizeSelectEl ? parseInt(teamSizeSelectEl.value, 10) : 2;
        for (let i = 2; i <= teamSizeCount; i++) {
          const tInput = document.getElementById(`teammate-${i}`);
          if (tInput && tInput.value.trim()) {
            teammatesList.push(tInput.value.trim());
          }
        }
      }

      // Register into browser storage
      const res = StorageManager.registerEvent(ev, {
        fullName,
        email,
        phone,
        dept,
        year,
        college,
        teamName,
        teamSizeCount,
        teammates: teammatesList
      });

      if (!res.success) {
        if (res.code === 'DUPLICATE_EMAIL_EVENT') {
          showFieldError('regEmail', res.message);
          document.getElementById('regEmail').focus();
          showToast(res.message, 'warning');
        } else {
          showToast(res.message || 'Registration failed. Please check your details.', 'warning');
        }
        return;
      }

      // On successful registration:
      const record = res.record;

      // Populate Success Confirmation View
      const successRegIdEl = document.getElementById('successRegId');
      const successPassCodeEl = document.getElementById('successPassCode');
      const successEventTitleEl = document.getElementById('successEventTitle');
      const successParticipationEl = document.getElementById('successParticipation');
      const successLeadNameEl = document.getElementById('successLeadName');
      const successEmailEl = document.getElementById('successEmail');
      const successPhoneEl = document.getElementById('successPhone');
      const successDeptYearEl = document.getElementById('successDeptYear');
      const successCollegeEl = document.getElementById('successCollege');
      const successVenueScheduleEl = document.getElementById('successVenueSchedule');
      const successTeammatesRow = document.getElementById('successTeammatesRow');
      const successTeammatesList = document.getElementById('successTeammatesList');

      if (successRegIdEl) successRegIdEl.textContent = record.regId;
      if (successPassCodeEl) successPassCodeEl.textContent = record.passCode;
      if (successEventTitleEl) successEventTitleEl.textContent = record.eventTitle;
      if (successParticipationEl) {
        successParticipationEl.textContent = isTeam 
          ? `Team (${record.teamName} • ${record.teamSizeCount} Members)` 
          : `Individual (Solo Participant)`;
      }
      if (successLeadNameEl) successLeadNameEl.textContent = record.participantName;
      if (successEmailEl) successEmailEl.textContent = record.participantEmail;
      if (successPhoneEl) successPhoneEl.textContent = record.participantPhone;
      if (successDeptYearEl) successDeptYearEl.textContent = `${record.participantDept} • ${record.participantYear}`;
      if (successCollegeEl) successCollegeEl.textContent = record.participantCollege;
      if (successVenueScheduleEl) {
        successVenueScheduleEl.textContent = `${record.venue} • ${record.date} (${record.time})`;
      }

      if (isTeam && record.teammates && record.teammates.length > 0) {
        if (successTeammatesRow) successTeammatesRow.style.display = 'flex';
        if (successTeammatesList) successTeammatesList.textContent = record.teammates.join(', ');
      } else {
        if (successTeammatesRow) successTeammatesRow.style.display = 'none';
      }

      // Setup Copy ID button
      const copyBtn = document.getElementById('copyRegIdBtn');
      if (copyBtn) {
        copyBtn.onclick = () => copyRegistrationId(record.regId);
      }

      // Setup "View Delegate Pass in My Registrations" button
      const viewPassBtn = document.getElementById('viewPassInMyRegistrationsBtn');
      if (viewPassBtn) {
        viewPassBtn.onclick = () => {
          closeAllModals();
          scrollToRegistrations(record.regId);
        };
      }

      // Setup "Register Another Event" button
      const registerAnotherBtn = document.getElementById('registerAnotherEventBtn');
      if (registerAnotherBtn) {
        registerAnotherBtn.onclick = () => {
          resetRegistrationFormView();
          // Pick the next unregistered event if available
          const allEvents = TECHNOVA_DATA.events;
          const nextEv = allEvents.find(e => !StorageManager.isRegistered(e.id, email)) || allEvents[0];
          syncRegistrationModalEvent(nextEv.id);
        };
      }

      // Switch view inside modal
      const regFormView = document.getElementById('regFormView');
      const regSuccessView = document.getElementById('regSuccessView');
      if (regFormView) regFormView.style.display = 'none';
      if (regSuccessView) regSuccessView.style.display = 'block';

      showToast(`Registration Confirmed! Reg ID: ${record.regId}`, 'success');

      // Refresh My Registrations grid
      renderRegistrationsList();
    });
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

function openEventDetailsModal(eventId) {
  const ev = TECHNOVA_DATA.events.find(x => x.id === eventId);
  if (!ev) return;

  const modal = document.getElementById('eventDetailsModal');
  const content = document.getElementById('eventDetailsContent');
  const footerBtn = document.getElementById('detailsModalActionBtn');

  if (!modal || !content) return;

  const isReg = StorageManager.isRegistered(ev.id);

  content.innerHTML = `
    <div class="modal-detail-tag">
      <span class="badge badge-cyan">${ev.tag}</span>
      <span class="badge badge-emerald">${ev.prizePool} Prizes</span>
      <span class="badge badge-violet">${ev.participationType} (${ev.maxTeamSize})</span>
    </div>

    <h2 class="modal-title">${ev.title}</h2>
    <p style="margin-bottom: 1.25rem; font-size: 1rem; color: var(--text-secondary);">${ev.fullDesc}</p>

    <div class="event-meta-grid" style="margin-bottom: 1.5rem;">
      <div class="event-meta-item">
        <span class="meta-key">Participation</span>
        <span class="meta-val">${ev.participationType} (${ev.maxTeamSize})</span>
      </div>
      <div class="event-meta-item">
        <span class="meta-key">Registration Deadline</span>
        <span class="meta-val" style="color: var(--amber-light);">${ev.regDeadline}</span>
      </div>
      <div class="event-meta-item">
        <span class="meta-key">Venue Location</span>
        <span class="meta-val">${ev.venue}</span>
      </div>
      <div class="event-meta-item">
        <span class="meta-key">Prizes Breakdown</span>
        <span class="meta-val prize-highlight">1st: ${ev.firstPrize} | 2nd: ${ev.secondPrize}</span>
      </div>
    </div>

    <h4 class="modal-section-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      Official Competition Rules & Scrutiny
    </h4>
    <ul class="rules-list">
      ${ev.rules.map(r => `<li>${r}</li>`).join('')}
    </ul>

    <h4 class="modal-section-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
      Rounds & Operational Schedule
    </h4>
    <ul class="rounds-list">
      ${ev.rounds.map(r => `<li>${r}</li>`).join('')}
    </ul>

    <div style="margin-top: 1.5rem; padding: 0.85rem; background: rgba(8, 13, 26, 0.7); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 0.85rem; color: var(--text-secondary);">
      <strong>Lead Coordinator:</strong> ${ev.coordinator}
    </div>
  `;

  if (footerBtn) {
    if (isReg) {
      footerBtn.textContent = 'Already Registered (View Pass)';
      footerBtn.className = 'btn btn-registered';
      footerBtn.disabled = false;
      footerBtn.onclick = () => {
        closeAllModals();
        scrollToRegistrations();
      };
    } else {
      footerBtn.textContent = 'Register for this Event →';
      footerBtn.className = 'btn btn-primary';
      footerBtn.disabled = false;
      footerBtn.onclick = () => {
        closeAllModals();
        openRegistrationModal(ev.id);
      };
    }
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openRegistrationModal(eventId) {
  resetRegistrationFormView();
  populateRegistrationEventSelect();
  syncRegistrationModalEvent(eventId);

  const modal = document.getElementById('registrationModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function scrollToRegistrations(targetRegId = null) {
  const el = document.getElementById('registrations');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  if (targetRegId) {
    setTimeout(() => {
      const passEl = document.getElementById(`pass-${targetRegId}`);
      if (passEl) {
        passEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        passEl.classList.add('pass-highlight-active');
        setTimeout(() => {
          passEl.classList.remove('pass-highlight-active');
        }, 4000);
      }
    }, 400);
  }
}

/* ==========================================================================
   10. Organiser Console: Demo Registration Audit & CSV Export
   ========================================================================== */
let orgSearchQuery = '';
let orgSelectedEvent = 'all';
let orgViewMode = 'table'; // 'table' or 'cards'

function getOrganiserFilteredRegistrations() {
  const registrations = StorageManager.getRegistrations();
  const query = (orgSearchQuery || '').trim().toLowerCase();
  const eventFilter = orgSelectedEvent;

  return registrations.filter(r => {
    // 1. Filter by event
    if (eventFilter !== 'all' && r.eventId !== eventFilter) {
      return false;
    }

    // 2. Filter by search query
    if (query) {
      const name = (r.participantName || '').toLowerCase();
      const email = (r.participantEmail || '').toLowerCase();
      const phone = (r.participantPhone || '').toLowerCase();
      const college = (r.participantCollege || '').toLowerCase();
      const dept = (r.participantDept || '').toLowerCase();
      const team = (r.teamName || '').toLowerCase();
      const regId = (r.regId || '').toLowerCase();
      const passCode = (r.passCode || '').toLowerCase();
      const eventTitle = (r.eventTitle || '').toLowerCase();
      const teammates = Array.isArray(r.teammates) ? r.teammates.join(' ').toLowerCase() : '';

      const match = name.includes(query) ||
                    email.includes(query) ||
                    phone.includes(query) ||
                    college.includes(query) ||
                    dept.includes(query) ||
                    team.includes(query) ||
                    regId.includes(query) ||
                    passCode.includes(query) ||
                    eventTitle.includes(query) ||
                    teammates.includes(query);

      if (!match) return false;
    }

    return true;
  });
}

function updateOrganiserMetrics() {
  const all = StorageManager.getRegistrations();
  const filtered = getOrganiserFilteredRegistrations();

  const totalEl = document.getElementById('orgTotalCount');
  const showingEl = document.getElementById('orgShowingCount');
  const breakdownEl = document.getElementById('orgFormatBreakdown');
  const tracksEl = document.getElementById('orgActiveTracksCount');

  if (totalEl) totalEl.textContent = all.length;
  if (showingEl) {
    if (all.length === filtered.length) {
      showingEl.textContent = `All ${all.length} registered delegates`;
    } else {
      showingEl.textContent = `Filtered: ${filtered.length} of ${all.length}`;
    }
  }

  if (breakdownEl) {
    const teams = all.filter(r => r.participationType === 'Team').length;
    const solo = all.filter(r => r.participationType === 'Individual').length;
    breakdownEl.textContent = `${teams} Teams • ${solo} Solo`;
  }

  if (tracksEl) {
    const uniqueTracks = new Set(all.map(r => r.eventId));
    tracksEl.textContent = `${uniqueTracks.size} / 6`;
  }
}

function renderOrganiserView() {
  updateOrganiserMetrics();

  const tbody = document.getElementById('organiserTableBody');
  const cardsGrid = document.getElementById('organiserCardsGrid');
  const tableInfo = document.getElementById('orgTableInfo');

  const all = StorageManager.getRegistrations();
  const filtered = getOrganiserFilteredRegistrations();

  if (tableInfo) {
    const isFiltered = orgSearchQuery.trim() !== '' || orgSelectedEvent !== 'all';
    if (isFiltered) {
      tableInfo.textContent = `Displaying ${filtered.length} of ${all.length} registrations matching active filter`;
    } else {
      tableInfo.textContent = `Showing all ${all.length} confirmed event registrations`;
    }
  }

  // Render Table View
  if (tbody) {
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 3.5rem 1rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
            <h4 style="font-size: 1.15rem; margin-bottom: 0.4rem; color: var(--text-primary);">No Matching Registrations Found</h4>
            <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.25rem auto;">
              ${all.length === 0 
                ? 'There are currently no registrations stored in this browser session. You can click "+ Seed Demo Data" below to load sample registrations for testing.' 
                : 'No delegates matched your active search query and event filter.'}
            </p>
            <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
              ${all.length > 0 ? '<button type="button" class="btn btn-outline-cyan btn-sm" onclick="resetOrganiserFilters()">Reset Filters</button>' : ''}
              <button type="button" class="btn btn-primary btn-sm" onclick="StorageManager.seedDemoDataset(); showToast('Demo delegates added!', 'success');">Load Demo Dataset</button>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = filtered.map(reg => {
        const isTeam = reg.participationType === 'Team';
        const teammatesStr = Array.isArray(reg.teammates) && reg.teammates.length > 0 
          ? reg.teammates.join(', ') 
          : '';

        return `
          <tr id="org-row-${reg.regId}">
            <td>
              <div class="table-reg-id">${reg.regId}</div>
              <div class="table-pass-code">${reg.passCode}</div>
            </td>
            <td>
              <div class="table-event-name">${reg.eventTitle}</div>
              <span class="badge ${isTeam ? 'badge-violet' : 'badge-cyan'}" style="font-size: 0.68rem; padding: 0.15rem 0.4rem; margin-top: 3px;">
                ${reg.participationType}
              </span>
            </td>
            <td>
              ${isTeam ? `
                <div class="table-squad-name">👥 ${reg.teamName}</div>
                <div class="table-meta-sub">${reg.teamSizeCount} Members</div>
                ${teammatesStr ? `<div class="table-teammates-sub" title="${teammatesStr}">Roster: ${teammatesStr}</div>` : ''}
              ` : `
                <div style="color: var(--text-secondary); font-size: 0.82rem;">👤 Solo Entry</div>
                <div class="table-meta-sub">Single Workstation</div>
              `}
            </td>
            <td>
              <div class="table-delegate-name">${reg.participantName}</div>
              <div class="table-meta-sub">${reg.participantYear}</div>
            </td>
            <td>
              <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-light);">${reg.participantEmail}</div>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${reg.participantPhone}</div>
            </td>
            <td>
              <div style="font-weight: 500; font-size: 0.84rem;">${reg.participantCollege}</div>
              <div class="table-meta-sub">${reg.participantDept}</div>
            </td>
            <td>
              <div style="font-size: 0.82rem;">${reg.venue.split('(')[0].trim()}</div>
              <div class="table-meta-sub">${reg.date} • ${reg.time}</div>
            </td>
            <td style="text-align: right;">
              <div class="table-btn-group">
                <button type="button" class="btn btn-outline-cyan btn-sm" onclick="copyRegistrationId('${reg.regId}')" title="Copy Registration ID" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;">
                  Copy ID
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="scrollToRegistrations('${reg.regId}')" title="Inspect Digital Pass" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;">
                  Pass
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="cancelRegistrationPrompt('${reg.regId}', '${reg.eventTitle}')" title="Delete record" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; color: var(--rose-primary);">
                  ✕
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Render Compact Cards View (Mobile alternative)
  if (cardsGrid) {
    if (filtered.length === 0) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; background: rgba(14, 23, 42, 0.6); border-radius: var(--radius-md); border: 1px dashed var(--border-medium);">
          <div style="font-size: 1.8rem; margin-bottom: 0.4rem;">🔍</div>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">No registrations match your search filters.</p>
        </div>
      `;
    } else {
      cardsGrid.innerHTML = filtered.map(reg => {
        const isTeam = reg.participationType === 'Team';
        const teammatesStr = Array.isArray(reg.teammates) && reg.teammates.length > 0 
          ? reg.teammates.join(', ') 
          : '';

        return `
          <div class="org-card-item">
            <div class="org-card-header">
              <div>
                <span class="table-reg-id">${reg.regId}</span>
                <span style="font-size: 0.72rem; color: var(--cyan-light); font-family: var(--font-mono); margin-left: 0.4rem;">${reg.passCode}</span>
                <h4 style="font-size: 1rem; font-weight: 700; margin-top: 0.2rem;">${reg.eventTitle}</h4>
              </div>
              <span class="badge ${isTeam ? 'badge-violet' : 'badge-cyan'}">${reg.participationType}</span>
            </div>
            <div class="org-card-body">
              <div><strong>Lead:</strong> ${reg.participantName} (${reg.participantYear})</div>
              <div><strong>Email:</strong> <span style="font-family: var(--font-mono); color: var(--cyan-light);">${reg.participantEmail}</span></div>
              <div><strong>Mobile:</strong> <span style="font-family: var(--font-mono);">${reg.participantPhone}</span></div>
              <div><strong>College:</strong> ${reg.participantCollege}</div>
              <div><strong>Department:</strong> ${reg.participantDept}</div>
              ${isTeam ? `
                <div style="padding-top: 0.4rem; border-top: 1px dashed var(--border-subtle); color: var(--cyan-light);">
                  <strong>Squad:</strong> ${reg.teamName} (${reg.teamSizeCount} Members)
                  ${teammatesStr ? `<div style="font-size: 0.78rem; color: var(--text-muted);">Teammates: ${teammatesStr}</div>` : ''}
                </div>
              ` : `
                <div style="font-size: 0.8rem; color: var(--text-muted);">Format: Solo Individual Workstation</div>
              `}
              <div style="font-size: 0.8rem; color: var(--text-muted);">
                <strong>Venue:</strong> ${reg.venue} • ${reg.date}
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end; padding-top: 0.6rem; border-top: 1px solid var(--border-subtle);">
              <button type="button" class="btn btn-outline-cyan btn-sm" onclick="copyRegistrationId('${reg.regId}')">Copy ID</button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="scrollToRegistrations('${reg.regId}')">View Pass</button>
              <button type="button" class="btn btn-secondary btn-sm" style="color: var(--rose-primary);" onclick="cancelRegistrationPrompt('${reg.regId}', '${reg.eventTitle}')">Remove</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function resetOrganiserFilters() {
  orgSearchQuery = '';
  orgSelectedEvent = 'all';

  const searchInput = document.getElementById('orgSearchInput');
  const clearBtn = document.getElementById('orgSearchClearBtn');
  const eventFilter = document.getElementById('orgEventFilter');

  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  if (eventFilter) eventFilter.value = 'all';

  renderOrganiserView();
}

function exportRegistrationsToCSV() {
  const registrations = StorageManager.getRegistrations();
  if (registrations.length === 0) {
    showToast('No registrations in storage to export. Please register or seed sample data first.', 'warning');
    return;
  }

  // Export currently filtered list or full list
  const filtered = getOrganiserFilteredRegistrations();
  const listToExport = filtered.length > 0 ? filtered : registrations;

  const headers = [
    'Registration ID',
    'Pass Code',
    'Event ID',
    'Event Title',
    'Category',
    'Participation Format',
    'Max Team Size',
    'Lead Participant Name',
    'College Email',
    'Contact Number',
    'Department',
    'Academic Year',
    'College or University',
    'Team Name',
    'Total Team Members',
    'Teammates Roster',
    'Allocated Venue',
    'Event Date',
    'Event Time',
    'Registration Timestamp',
    'Status'
  ];

  function escapeCSV(val) {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  const rows = listToExport.map(r => {
    const teammatesStr = Array.isArray(r.teammates) ? r.teammates.join('; ') : '';
    return [
      escapeCSV(r.regId),
      escapeCSV(r.passCode),
      escapeCSV(r.eventId),
      escapeCSV(r.eventTitle),
      escapeCSV(r.category),
      escapeCSV(r.participationType),
      escapeCSV(r.maxTeamSize),
      escapeCSV(r.participantName),
      escapeCSV(r.participantEmail),
      escapeCSV(r.participantPhone),
      escapeCSV(r.participantDept),
      escapeCSV(r.participantYear),
      escapeCSV(r.participantCollege),
      escapeCSV(r.teamName),
      escapeCSV(r.teamSizeCount),
      escapeCSV(teammatesStr),
      escapeCSV(r.venue),
      escapeCSV(r.date),
      escapeCSV(r.time),
      escapeCSV(r.registeredAt),
      escapeCSV(r.status || 'Confirmed')
    ].join(',');
  });

  // Prefix UTF-8 BOM so Microsoft Excel & LibreOffice parse special characters correctly
  const csvContent = '\uFEFF' + headers.join(',') + '\r\n' + rows.join('\r\n');

  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `technova_2026_registrations_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Exported ${listToExport.length} registrations to CSV successfully!`, 'success');
  } catch (err) {
    console.error('Failed to export CSV', err);
    showToast('Failed to export CSV file.', 'warning');
  }
}

function initOrganiserConsole() {
  const searchInput = document.getElementById('orgSearchInput');
  const clearBtn = document.getElementById('orgSearchClearBtn');
  const eventFilter = document.getElementById('orgEventFilter');
  const exportBtn = document.getElementById('orgExportCsvBtn');
  const seedBtn = document.getElementById('orgSeedDemoBtn');
  const clearBtnData = document.getElementById('orgClearDataBtn');
  const viewModeTable = document.getElementById('orgViewModeTable');
  const viewModeCards = document.getElementById('orgViewModeCards');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      orgSearchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = orgSearchQuery ? 'flex' : 'none';
      }
      renderOrganiserView();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      clearBtn.style.display = 'none';
      orgSearchQuery = '';
      renderOrganiserView();
    });
  }

  if (eventFilter) {
    eventFilter.addEventListener('change', (e) => {
      orgSelectedEvent = e.target.value;
      renderOrganiserView();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportRegistrationsToCSV();
    });
  }

  if (seedBtn) {
    seedBtn.addEventListener('click', () => {
      const added = StorageManager.seedDemoDataset();
      if (added > 0) {
        showToast(`Added ${added} demo registrations across diverse tracks!`, 'success');
      } else {
        showToast('Demo registrations are already loaded in storage.', 'info');
      }
      renderOrganiserView();
    });
  }

  if (clearBtnData) {
    clearBtnData.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all locally stored demo registrations?')) {
        StorageManager.clearAllRegistrations();
        showToast('All local registrations have been cleared.', 'info');
        renderOrganiserView();
      }
    });
  }

  // View Mode Buttons (Table vs Cards)
  if (viewModeTable && viewModeCards) {
    const tableContainer = document.getElementById('orgTableContainer');
    const cardsContainer = document.getElementById('orgCardsContainer');

    viewModeTable.addEventListener('click', () => {
      orgViewMode = 'table';
      viewModeTable.classList.add('active');
      viewModeCards.classList.remove('active');
      if (tableContainer) tableContainer.style.display = 'block';
      if (cardsContainer) cardsContainer.style.display = 'none';
    });

    viewModeCards.addEventListener('click', () => {
      orgViewMode = 'cards';
      viewModeCards.classList.add('active');
      viewModeTable.classList.remove('active');
      if (tableContainer) tableContainer.style.display = 'none';
      if (cardsContainer) cardsContainer.style.display = 'block';
    });
  }

  renderOrganiserView();
}
