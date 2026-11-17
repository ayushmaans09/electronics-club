/**
 * TECHNOVA 2026 - Browser Storage & Client State Manager
 * Handles local persistence of user event registrations and mock passes.
 */

const STORAGE_KEYS = {
  REGISTRATIONS: 'technova_2026_registrations',
  SAVED_INQUIRIES: 'technova_2026_inquiries',
  PREFERENCES: 'technova_2026_prefs'
};

const StorageManager = {
  /**
   * Fetch all registered events for the current browser session
   */
  getRegistrations() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read registrations from localStorage', e);
      return [];
    }
  },

  /**
   * Save registration array
   */
  saveRegistrations(registrations) {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
      window.dispatchEvent(new CustomEvent('technova:registrations-updated', { detail: registrations }));
      return true;
    } catch (e) {
      console.error('Failed to save registrations to localStorage', e);
      return false;
    }
  },

  /**
   * Check if an event is already registered (optionally checking by email)
   */
  isRegistered(eventId, email = null) {
    const list = this.getRegistrations();
    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      return list.some(item => item.eventId === eventId && item.participantEmail.toLowerCase() === cleanEmail);
    }
    return list.some(item => item.eventId === eventId);
  },

  /**
   * Look up registrations by email, registration ID, pass code, participant name, or team
   */
  lookupRegistrations(query) {
    const list = this.getRegistrations();
    if (!query || !query.trim()) return list;

    const clean = query.trim().toLowerCase();
    const cleanDigits = clean.replace(/\D/g, '');

    return list.filter(item => {
      // 1. Email match (case-insensitive substring)
      const email = (item.participantEmail || '').toLowerCase();
      if (email.includes(clean)) return true;

      // 2. Registration ID match (e.g. TNV-2026-XXXXXX or numeric part)
      const regId = (item.regId || '').toLowerCase();
      if (regId.includes(clean)) return true;

      // 3. Pass Code match (e.g. TN26-ROB-XXXX)
      const passCode = (item.passCode || '').toLowerCase();
      if (passCode.includes(clean)) return true;

      // 4. Participant Name match
      const name = (item.participantName || '').toLowerCase();
      if (name.includes(clean)) return true;

      // 5. Team Name match
      const team = (item.teamName || '').toLowerCase();
      if (team.includes(clean)) return true;

      // 6. Teammates match
      if (Array.isArray(item.teammates) && item.teammates.some(t => t.toLowerCase().includes(clean))) {
        return true;
      }

      // 7. Event Title match
      const eventTitle = (item.eventTitle || '').toLowerCase();
      if (eventTitle.includes(clean)) return true;

      // 8. Phone number match if at least 4 digits provided
      if (cleanDigits.length >= 4) {
        const phoneDigits = (item.participantPhone || '').replace(/\D/g, '');
        if (phoneDigits.includes(cleanDigits)) return true;
      }

      return false;
    });
  },

  /**
   * Register for an event with duplicate check by email & unique ID generation
   */
  registerEvent(eventObj, participantData = {}) {
    const registrations = this.getRegistrations();
    const userEmail = (participantData.email || '').trim().toLowerCase();

    // Prevent duplicate registrations using the same email for the same event
    const existingIndex = registrations.findIndex(item => 
      item.eventId === eventObj.id && item.participantEmail.toLowerCase() === userEmail
    );

    if (existingIndex !== -1) {
      return { 
        success: false, 
        code: 'DUPLICATE_EMAIL_EVENT',
        message: `A registration for "${eventObj.title}" already exists for ${participantData.email}. Each participant can only register once per event.` 
      };
    }

    // Generate guaranteed unique registration ID
    let registrationId;
    do {
      const randNum = Math.floor(100000 + Math.random() * 900000);
      registrationId = `TNV-2026-${randNum}`;
    } while (registrations.some(r => r.regId === registrationId));

    const catPrefix = (eventObj.category || 'GEN').toUpperCase().slice(0, 3);
    const passCode = `TN26-${catPrefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const isIndividual = eventObj.participationType === 'Individual' || (eventObj.teamSize && eventObj.teamSize.includes('Individual'));

    const newRecord = {
      regId: registrationId,
      passCode: passCode,
      eventId: eventObj.id,
      eventTitle: eventObj.title,
      category: eventObj.category,
      venue: eventObj.venue,
      date: eventObj.date,
      time: eventObj.time,
      prizePool: eventObj.prizePool,
      teamSize: eventObj.teamSize,
      participationType: eventObj.participationType || (isIndividual ? 'Individual' : 'Team'),
      maxTeamSize: eventObj.maxTeamSize || eventObj.teamSize || 'Team',
      regDeadline: eventObj.regDeadline || 'Nov 18, 2026 • 11:59 PM',
      participantName: participantData.fullName || 'Lead Delegate',
      participantEmail: participantData.email || 'delegate@campus.edu',
      participantPhone: participantData.phone || '+91 98765 00000',
      participantDept: participantData.dept || 'Electronics & Communication',
      participantYear: participantData.year || '3rd Year',
      participantCollege: participantData.college || 'Apex Institute of Technology',
      teamName: isIndividual ? 'Solo Participant' : (participantData.teamName || 'Silicon Innovators'),
      teamSizeCount: isIndividual ? 1 : (participantData.teamSizeCount || 2),
      teammates: isIndividual ? [] : (participantData.teammates || []),
      registeredAt: new Date().toISOString(),
      status: 'Confirmed'
    };

    registrations.unshift(newRecord);
    this.saveRegistrations(registrations);
    return { success: true, record: newRecord };
  },

  /**
   * Remove a registration
   */
  cancelRegistration(regId) {
    let list = this.getRegistrations();
    const beforeCount = list.length;
    list = list.filter(item => item.regId !== regId);
    
    if (list.length < beforeCount) {
      this.saveRegistrations(list);
      return true;
    }
    return false;
  },

  /**
   * Initialize with 1 default mock registration so the user can see the UI populated immediately
   */
  seedDefaultIfEmpty() {
    const current = this.getRegistrations();
    if (current.length === 0 && typeof TECHNOVA_DATA !== 'undefined' && TECHNOVA_DATA.events.length > 0) {
      const flagship = TECHNOVA_DATA.events[0]; // Robo Wars or Hack-A-Silicon
      this.registerEvent(flagship, {
        fullName: "Aarav Sharma",
        email: "aarav.sharma@apex.edu",
        phone: "9876543210",
        dept: "Electronics & Communication (ECE)",
        year: "3rd Year",
        college: "Apex Institute of Technology",
        teamName: "Neural Circuitry Guild",
        teamSizeCount: 3,
        teammates: ["Nikhil Rao", "Kavya Suresh"]
      });
    }
  },

  /**
   * Seed a comprehensive set of multi-college demo registrations for testing organizer tools
   */
  seedDemoDataset() {
    if (typeof TECHNOVA_DATA === 'undefined') return 0;

    const demoDelegates = [
      {
        eventId: "robo-wars",
        fullName: "Aarav Sharma",
        email: "aarav.sharma@apex.edu",
        phone: "9876543210",
        dept: "Electronics & Communication Engineering (ECE)",
        year: "3rd Year",
        college: "Apex Institute of Technology",
        teamName: "Neural Circuitry Guild",
        teamSizeCount: 3,
        teammates: ["Nikhil Rao", "Kavya Suresh"]
      },
      {
        eventId: "code-clash",
        fullName: "Priya Nair",
        email: "priya.nair@rvce.edu",
        phone: "9876543211",
        dept: "Computer Science & Engineering (CSE)",
        year: "3rd Year",
        college: "RV College of Engineering",
        teamName: "Solo Participant",
        teamSizeCount: 1,
        teammates: []
      },
      {
        eventId: "circuitrix",
        fullName: "Riya Sen",
        email: "riya.sen@iisc.ac.in",
        phone: "9123456780",
        dept: "Electrical & Electronics Engineering (EEE)",
        year: "4th Year",
        college: "Indian Institute of Science (IISc)",
        teamName: "Quantum Solder Squad",
        teamSizeCount: 2,
        teammates: ["Manish Kumar"]
      },
      {
        eventId: "hack-a-silicon",
        fullName: "Karan Malhotra",
        email: "karan.m@pes.edu",
        phone: "9876512345",
        dept: "Mechanical & Mechatronics",
        year: "2nd Year",
        college: "PES University",
        teamName: "Silicon Makers Guild",
        teamSizeCount: 4,
        teammates: ["Sneha Roy", "Rahul Verma", "Rohit Joshi"]
      },
      {
        eventId: "tech-quiz",
        fullName: "Aditya Iyer",
        email: "aditya.iyer@bmsce.ac.in",
        phone: "9845012345",
        dept: "Electronics & Communication (ECE)",
        year: "1st Year",
        college: "BMS College of Engineering",
        teamName: "Buzzer Titans",
        teamSizeCount: 2,
        teammates: ["Sandeep Patil"]
      },
      {
        eventId: "edge-ai-iot",
        fullName: "Neha Deshmukh",
        email: "neha.d@msrit.edu",
        phone: "9812345678",
        dept: "Information Technology & AI",
        year: "3rd Year",
        college: "Ramaiah Institute of Technology",
        teamName: "TinyML Edge Pioneers",
        teamSizeCount: 3,
        teammates: ["Tarun Gowda", "Anika Jain"]
      }
    ];

    let addedCount = 0;
    demoDelegates.forEach(delegate => {
      const ev = TECHNOVA_DATA.events.find(e => e.id === delegate.eventId);
      if (ev && !this.isRegistered(ev.id, delegate.email)) {
        this.registerEvent(ev, delegate);
        addedCount++;
      }
    });

    return addedCount;
  },

  /**
   * Clear all local registrations (for organizer testing/reset)
   */
  clearAllRegistrations() {
    try {
      localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
      window.dispatchEvent(new CustomEvent('technova:registrations-updated', { detail: [] }));
      return true;
    } catch (e) {
      console.error('Failed to clear registrations', e);
      return false;
    }
  },

  /**
   * Retrieve all contact inquiries from browser storage
   */
  getInquiries() {
    try {
      const key = STORAGE_KEYS.SAVED_INQUIRIES;
      return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
    } catch (e) {
      console.error('Failed to get inquiries', e);
      return [];
    }
  },

  /**
   * Save a contact form inquiry into browser storage
   */
  saveInquiry(inquiry) {
    try {
      const key = STORAGE_KEYS.SAVED_INQUIRIES;
      const existing = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
      existing.unshift({
        id: inquiry.ticketId || ('INQ-' + Date.now()),
        date: new Date().toISOString(),
        ...inquiry
      });
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    } catch (e) {
      console.error('Failed to store inquiry', e);
      return false;
    }
  }
};
