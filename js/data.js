/**
 * TECHNOVA 2026 - Master Event Data Store
 * Realistic dataset for College Electronics Club Symposium
 */

const TECHNOVA_DATA = {
  eventMeta: {
    name: "TECHNOVA 2026",
    edition: "14th National Annual Edition",
    tagline: "Blueprinting the Connected Future",
    subTagline: "Where Silicon Architecture Meets Physical Intelligence",
    club: "Apex Electronics & Robotics Club (AERC)",
    department: "Department of Electronics & Communication Engineering",
    institution: "Apex Institute of Technology, Innovation Campus",
    dates: "November 20 - 22, 2026",
    timeDetail: "Starts Friday 09:00 AM IST • 3-Day Technical Symposium",
    // Clearly defined event date in code (November 20, 2026, 09:00:00 IST)
    targetDateISO: "2026-11-20T09:00:00+05:30",
    endDateISO: "2026-11-22T19:00:00+05:30",
    venue: "Advanced VLSI & IoT Innovation Center, Apex Institute of Technology, Bengaluru",
    venueShort: "Innovation Quadrangle, Level 2, Bengaluru",
    venueAddress: "Electronic City Phase 1, Bengaluru 560100",
    contactEmail: "technova@apex-electronics.edu",
    contactPhone: "+91 98765 43210",
    prizePool: "₹3,00,000+",
    prizeDetail: "Cash Prizes, Hardware Dev Kits & Incubation Grants",
    flagship: "36-Hr Hardware Hackathon (Hack-A-Silicon)",
    eligibility: "All UG/PG & Polytechnic Students (Inter-college squads welcome)",
    expectedAttendees: "1,400+",
    institutions: "80+ Colleges",
    completedMeta: {
      headline: "TECHNOVA 2026 Has Successfully Concluded!",
      message: "The 14th edition of our national electronics symposium has wrapped up. Over 1,400+ student delegates converged to solder, design 4-layer PCBs, deploy TinyML nodes, and battle combat robots.",
      highlights: [
        "40 Hardware Prototypes Bench-Tested",
        "₹3,00,000+ Awarded in Direct Grants & Cash",
        "80+ Universities & Institutions Represented",
        "Proceedings Indexed with IEEE Student Chapter"
      ]
    }
  },

  categories: [
    { id: "all", name: "All Events", icon: "cpu" },
    { id: "robotics", name: "Robotics (Robo Wars)", icon: "bot" },
    { id: "hackathon", name: "Coding & Firmware (Code Clash)", icon: "terminal" },
    { id: "vlsi", name: "Hardware & Circuits (Circuitrix)", icon: "activity" },
    { id: "paper", name: "Tech Quiz & Papers", icon: "book-open" },
    { id: "iot", name: "IoT & Edge AI", icon: "wifi" }
  ],

  events: [
    {
      id: "robo-wars",
      title: "Robo Wars",
      category: "robotics",
      tag: "Combat Arena",
      badgeType: "hot",
      participationType: "Team",
      maxTeamSize: "Max 4 Members",
      teamSize: "2 - 4 Members",
      regDeadline: "Nov 18, 2026 • 11:59 PM IST",
      regDeadlineISO: "2026-11-18T23:59:59+05:30",
      shortDesc: "High-voltage combat robotics showdown. 15kg wired and wireless machines clash inside a heavy-duty polycarbonate arena with active spinning drums, pneumatic flippers, and wedge lifters.",
      fullDesc: "Enter the premier combat robot championship of TECHNOVA 2026. Teams design, fabricate, and pilot custom 15kg combat machines inside an enclosed 16x16 ft steel-floored arena with active floor hazards. Matches last 3 minutes and are judged on aggression, damage, and control according to international SPARC combat guidelines.",
      prizePool: "₹50,000",
      firstPrize: "₹30,000",
      secondPrize: "₹15,000",
      thirdPrize: "₹5,000",
      date: "Nov 21, 2026",
      time: "11:30 AM - 04:30 PM",
      venue: "Central Open-Air Arena Ground & Quad",
      coordinator: "Karan Verma (Mob: +91 98765 22334)",
      rounds: [
        "Round 1: Technical Scrutineering, Weight & Radio Failsafe Inspection",
        "Round 2: Group Stage 3-Minute Knockout Matches",
        "Round 3: Semifinals & Championship Cage Battle"
      ],
      rules: [
        "Maximum robot weight: 15.0 kg (with a 5% margin for wireless radio gear).",
        "Weapons permitted: spinning drums, blades, pneumatic flippers (max 100 PSI), lifters. No fire, chemicals, liquids, or EMF jamming.",
        "A physical, accessible fail-safe power cut-off switch is compulsory for pit safety.",
        "Transmitters must operate on 2.4 GHz digital spread-spectrum spectrum.",
        "Scoring based on SPARC combat rules (Damage: 5 pts, Aggression: 3 pts, Control: 3 pts)."
      ],
      image: "robot-arm"
    },
    {
      id: "code-clash",
      title: "Code Clash",
      category: "hackathon",
      tag: "Firmware & DSP",
      badgeType: "featured",
      participationType: "Individual",
      maxTeamSize: "Individual (1 Member)",
      teamSize: "Individual (Solo)",
      regDeadline: "Nov 19, 2026 • 06:00 PM IST",
      regDeadlineISO: "2026-11-19T18:00:00+05:30",
      shortDesc: "Competitive low-level firmware and DSP speed-coding sprint. Implement performance-critical C/C++ algorithms, DMA ring buffers, and fixed-point filters for ARM Cortex-M4 and RISC-V targets.",
      fullDesc: "Strip away heavy frameworks and code directly against silicon. Code Clash challenges participants with algorithmic engineering under stringent clock-cycle and memory bounds. Given simulated hardware peripheral registers and audio/sensor streams, developers craft optimal C/C++ routines evaluated for latency, memory footprint, and numerical accuracy.",
      prizePool: "₹35,000",
      firstPrize: "₹20,000",
      secondPrize: "₹10,000",
      thirdPrize: "₹5,000",
      date: "Nov 20, 2026",
      time: "02:30 PM - 05:30 PM",
      venue: "High-Performance Embedded Systems Lab 2 (Room 304)",
      coordinator: "Rohan Saxena (Mob: +91 98765 44321)",
      rounds: [
        "Round 1: Warmup - Fixed-Point Arithmetic & Bitwise Logic Sprint (45 mins)",
        "Round 2: Core Sprint - DSP Filter & Peripheral Driver Optimization (2 hours)",
        "Round 3: Automated Silicon Benchmark & Code Review"
      ],
      rules: [
        "Participation is strictly Individual (1 member per workstation).",
        "Permitted languages: C99 / C11 / C++17 compiled via GCC 12 ARM/RISC-V cross-toolchains.",
        "No external internet, AI copilot tools, or external package libraries allowed; CMSIS and standard libc provided.",
        "Code solutions are benchmarked automatically for execution cycle-count and RAM footprint.",
        "Memory leaks, bus faults, or segmentation faults incur an automatic 25% point deduction."
      ],
      image: "terminal"
    },
    {
      id: "circuitrix",
      title: "Circuitrix",
      category: "vlsi",
      tag: "Hardware Debug Relay",
      badgeType: "standard",
      participationType: "Team",
      maxTeamSize: "Max 2 Members",
      teamSize: "1 - 2 Members",
      regDeadline: "Nov 19, 2026 • 11:59 PM IST",
      regDeadlineISO: "2026-11-19T23:59:59+05:30",
      shortDesc: "Hardware diagnostics and breadboard relay. Use digital oscilloscopes, logic analyzers, and multimeters to isolate intentional circuit faults, reverse-engineer schematics, and solder fixes.",
      fullDesc: "Test your fundamental circuit intuition. In Circuitrix, squads face physical breadboard and PCB modules intentionally loaded with subtle anomalies: op-amp latch-up, ground loops, floating CMOS gates, broken feedback loops, and incorrect passive ratings. Diagnose the fault using bench instruments, trace the schematic, and repair the circuit before the clock expires.",
      prizePool: "₹30,000",
      firstPrize: "₹18,000",
      secondPrize: "₹12,000",
      thirdPrize: "Lab Component Kits",
      date: "Nov 22, 2026",
      time: "10:30 AM - 01:30 PM",
      venue: "Analog Devices Benchmark & Testing Lab (Hall B)",
      coordinator: "Tanmay Deshmukh (Mob: +91 98765 55667)",
      rounds: [
        "Round 1: Oscilloscope Waveform & Signal Anomaly Decryption (30 mins)",
        "Round 2: Hands-on Fault Isolation, Breadboard Solder Repair & Tuning (90 mins)"
      ],
      rules: [
        "Teams consist of 1 or 2 participants from an accredited institution.",
        "Bench equipment provided: Rigol 100MHz 4-channel digital oscilloscopes, DMMs, and function generators.",
        "Protective safety goggles are mandatory during live bench testing and soldering.",
        "Evaluation criteria: speed of fault diagnosis, schematic accuracy, and clear root-cause justification.",
        "Shorting power supply rails or burning components incurs immediate penalty deductions."
      ],
      image: "oscilloscope"
    },
    {
      id: "tech-quiz",
      title: "Tech Quiz",
      category: "paper",
      tag: "Buzzer Stage Finals",
      badgeType: "standard",
      participationType: "Team",
      maxTeamSize: "Max 2 Members",
      teamSize: "2 Members",
      regDeadline: "Nov 19, 2026 • 08:00 PM IST",
      regDeadlineISO: "2026-11-19T20:00:00+05:30",
      shortDesc: "Electrifying technical quiz spanning semiconductor milestones, Moore's Law history, RISC architectures, quantum computing lore, and pop-tech trivia with a live stage buzzer finale.",
      fullDesc: "Gather your sharpest lab partner for the ultimate battle of technological wits. Tech Quiz explores the pioneers, milestones, and breakthroughs of electronics: from Shockley and Bell Labs to modern EUV photolithography, RISC-V open silicon, and famous hardware bugs. A written prelim selects the top 6 squads for a live electronic buzzer finale.",
      prizePool: "₹25,000",
      firstPrize: "₹15,000",
      secondPrize: "₹10,000",
      thirdPrize: "Curated Technical Books & Swag",
      date: "Nov 20, 2026",
      time: "04:30 PM - 07:00 PM",
      venue: "Sir C.V. Raman Main Auditorium",
      coordinator: "Siddharth Joshi (Mob: +91 98765 88990)",
      rounds: [
        "Round 1: Written Optical Prelims (30 Questions, 25 Minutes)",
        "Round 2: Rapid-Fire Audio-Visual Clue Round",
        "Round 3: Live Electronic Buzzer Stage Finale (Top 6 Finalist Teams)"
      ],
      rules: [
        "Teams of up to 2 participants. Inter-departmental and cross-college teams are welcome.",
        "No smart devices, smartwatches, or external references permitted during prelims or finals.",
        "Final stage round incorporates negative scoring on incorrect buzzer attempts.",
        "Quizmaster's ruling on answer validity and buzzer timing is final and binding."
      ],
      image: "quiz"
    },
    {
      id: "hack-a-silicon",
      title: "Hack-A-Silicon: 36-Hr Hardware Hackathon",
      category: "hackathon",
      tag: "Flagship Hackathon",
      badgeType: "hot",
      participationType: "Team",
      maxTeamSize: "Max 4 Members",
      teamSize: "2 - 4 Members",
      regDeadline: "Nov 17, 2026 • 11:59 PM IST",
      regDeadlineISO: "2026-11-17T23:59:59+05:30",
      shortDesc: "36-hour non-stop national hardware sprint to prototype breakthrough edge AI devices, renewable sensor nodes, or RISC-V accelerators with on-site dev kits and maker labs.",
      fullDesc: "Hack-A-Silicon is our premier hardware hackathon. 40 shortlisted squads build physical prototypes addressing real-world challenges in Industrial IoT, Biomedical Instrumentation, Clean Energy, and Edge Vision. Full kits (STM32, ESP32-S3, Raspberry Pi Pico, sensors, and passives) along with 3D printers and soldering stations are provided on-site.",
      prizePool: "₹75,000",
      firstPrize: "₹45,000",
      secondPrize: "₹20,000",
      thirdPrize: "₹10,000",
      date: "Nov 20 - Nov 21, 2026",
      time: "10:00 AM (Nov 20) to 10:00 PM (Nov 21)",
      venue: "Core Innovation Quadrangle (Building C, Level 2)",
      coordinator: "Ananya Sharma (Mob: +91 98765 11221)",
      rounds: [
        "Phase 1: Abstract & Architecture Design Screening (Pre-event)",
        "Phase 2: 36-Hour Continuous Hardware Prototyping & Checkpoints",
        "Phase 3: Live Bench Demonstration & Jury Evaluation"
      ],
      rules: [
        "Teams of 2 to 4 members. Hardware dev kits provided upon check-in.",
        "Custom PCBs are allowed if designed and documented by team members.",
        "Overnight stay inside designated maker labs with meals and coffee stations provided.",
        "Plagiarism in firmware or hardware designs leads to immediate disqualification."
      ],
      image: "circuit-board"
    },
    {
      id: "edge-ai-iot",
      title: "EdgeIoT Nexus: Smart Campus Solutions",
      category: "iot",
      tag: "Edge AI & Embedded",
      badgeType: "featured",
      participationType: "Team",
      maxTeamSize: "Max 3 Members",
      teamSize: "2 - 3 Members",
      regDeadline: "Nov 18, 2026 • 11:59 PM IST",
      regDeadlineISO: "2026-11-18T23:59:59+05:30",
      shortDesc: "Deploy on-device TinyML neural network models onto resource-constrained microcontrollers for ambient sensing, anomaly detection, or energy load prediction.",
      fullDesc: "Bridge machine learning and embedded hardware. Participants deploy quantized neural networks (TensorFlow Lite for Microcontrollers / Edge Impulse) onto Cortex-M4 or ESP32-S3 boards to solve real tasks like real-time acoustic anomaly detection or gesture recognition without cloud round-trips.",
      prizePool: "₹40,000",
      firstPrize: "₹24,000",
      secondPrize: "₹16,000",
      thirdPrize: "Tech Kits & Goodies",
      date: "Nov 21, 2026",
      time: "01:30 PM - 06:00 PM",
      venue: "IoT Innovation Pavilion (Room 402)",
      coordinator: "Pooja Hegde (Mob: +91 98765 44556)",
      rounds: [
        "Round 1: Offline Model Training & Quantization Benchmark",
        "Round 2: On-Target Deployment & Latency/Power Optimization",
        "Round 3: Live Demonstration with Dynamic Test Datasets"
      ],
      rules: [
        "Model binary size must fit within 256KB SRAM and 1MB Flash limits.",
        "Inference latency measured on hardware accounts for 30% of overall score."
      ],
      image: "iot-device"
    }
  ],

  schedule: {
    day1: {
      date: "Friday, November 20, 2026",
      title: "Inauguration, Keynotes & 36H Hack Kickoff",
      events: [
        {
          id: "d1-01",
          time: "08:30 AM - 09:45 AM",
          title: "Delegate Check-in, Hardware Dispensary & Badge Activation",
          venue: "Welcome Atrium, Silicon Block (Ground Floor)",
          track: "General",
          speaker: "AERC Volunteer & Help Desk Team",
          desc: "Collect your NFC delegate badges, official TECHNOVA 2026 hardware kits, RFID tags, and lab access tokens.",
          tag: "Check-in"
        },
        {
          id: "d1-02",
          time: "10:00 AM - 11:30 AM",
          title: "Inaugural Ceremony & Keynote: 'Next-Gen 2nm FinFET & GAA Frontiers'",
          venue: "Sir C.V. Raman Main Auditorium",
          track: "Keynote",
          speaker: "Dr. Arvind Natarajan & Chief Scientist, Intel Labs India",
          desc: "Lighting of the Silicon Lamp, opening presidential address, and deep-dive keynote on Gate-All-Around transistor scaling.",
          tag: "Flagship Keynote"
        },
        {
          id: "d1-03",
          time: "11:45 AM",
          title: "Hack-A-Silicon (36H): Problem Statements Release & Hack Sprint Kickoff",
          venue: "Core Innovation Quadrangle (Level 2)",
          track: "Hackathon",
          speaker: "Hackathon Technical Jury & Mentors",
          desc: "Hardware kits distributed to 40 teams; problem statements across Edge AI and Silicon Design unsealed. 36-hour sprint starts.",
          tag: "Sprint Launch"
        },
        {
          id: "d1-04",
          time: "02:00 PM - 04:00 PM",
          title: "Robo Wars: Technical Scrutiny & Radio Failsafe Safety Verification",
          venue: "Combat Arena Paddock, Open-Air Quad",
          track: "Robotics",
          speaker: "Chief Arena Marshals & Safety Referees",
          desc: "Mandatory dimension checks, weight calibration (15kg limit), remote kill-switch verification, and weapon spin-up lockouts.",
          tag: "Safety Inspection"
        },
        {
          id: "d1-05",
          time: "02:30 PM - 05:30 PM",
          title: "Code Clash: Bare-Metal Firmware & DSP Algorithm Sprint",
          venue: "Embedded Systems Computing Lab (Room 304)",
          track: "Competitions",
          speaker: "Firmware Scrutiny Jury & Embedded Systems Engineers",
          desc: "Individual timed programming battle optimizing low-level C/C++ firmware, DMA peripherals, and DSP filters on ARM Cortex-M4 and RISC-V targets.",
          tag: "Firmware Battle"
        },
        {
          id: "d1-06",
          time: "05:30 PM - 07:30 PM",
          title: "Tech Quiz: Silicon, Bits & Byte Clash (Prelims to Buzzer Finals)",
          venue: "Sir C.V. Raman Main Auditorium",
          track: "Competitions",
          speaker: "Quizmaster Siddharth Joshi & AERC Panel",
          desc: "Collegiate squads battle through written optical prelims down to 6 stage finalist squads on electronic buzzer lockouts.",
          tag: "Buzzer Round"
        },
        {
          id: "d1-07",
          time: "08:30 PM - 10:00 PM",
          title: "Hackathon Midnight Milestone Checkpoint 1 & Mentor Review",
          venue: "Core Innovation Quadrangle (Level 2)",
          track: "Hackathon",
          speaker: "Industry Technical Mentors & Venture Scouts",
          desc: "Jury review of schematic designs, sensor calibrations, component power budgets, accompanied by midnight energy drinks and pizza.",
          tag: "Sprint Milestone"
        }
      ]
    },
    day2: {
      date: "Saturday, November 21, 2026",
      title: "Robo Wars, Hackathon Sprint & Edge AI",
      events: [
        {
          id: "d2-01",
          time: "09:00 AM - 10:30 AM",
          title: "Keynote: 'TinyML - Quantized Deep Neural Nets on Ultra-Low Power Microcontrollers'",
          venue: "Seminar Hall Alpha (Silicon Block, 2nd Floor)",
          track: "Keynote",
          speaker: "Dr. Suniti Rao (Principal Edge Architect, Texas Instruments)",
          desc: "Live bench demonstration of running quantized 8-bit convolutional vision networks on sub-50mW ARM Cortex-M microcontrollers.",
          tag: "Edge AI Session"
        },
        {
          id: "d2-02",
          time: "10:45 AM - 01:00 PM",
          title: "Robo Wars: Preliminary 15kg Cage Clashes & Qualifier Bouts",
          venue: "Central Enclosed Steel Arena, Innovation Ground",
          track: "Robotics",
          speaker: "Arena Marshals & Safety Referees",
          desc: "High-octane robotic clashes, spinning kinetic drums, and pneumatic flipper rounds inside the polycarbonate steel cage.",
          tag: "Combat Round 1"
        },
        {
          id: "d2-03",
          time: "01:30 PM - 05:30 PM",
          title: "EdgeIoT Nexus: Real-Time Smart Campus Deployments & Live Telemetry",
          venue: "IoT Innovation Pavilion (Room 402)",
          track: "Competitions",
          speaker: "Embedded IoT Technical Jury",
          desc: "Teams deploy wireless edge sensor nodes across campus nodes; scored on latency, MQTT throughput, and sensor calibration.",
          tag: "Live Field Test"
        },
        {
          id: "d2-04",
          time: "02:30 PM - 05:30 PM",
          title: "Circuitrix Prelims: Circuit Debugging & Oscilloscope Probing Relay",
          venue: "Analog Devices Test & Bench Lab (Hall B)",
          track: "Competitions",
          speaker: "VLSI & Hardware Debug Marshals",
          desc: "Rapid fault isolation, oscilloscope waveform diagnostics, and precision component solder fixes under time pressure.",
          tag: "Hardware Debug"
        },
        {
          id: "d2-05",
          time: "03:30 PM - 07:00 PM",
          title: "AeroX: Autonomous Micro-Drone Obstacle Arena Dash",
          venue: "Indoor Flight Dome (Sports Complex)",
          track: "Robotics",
          speaker: "Avionics Society Flight Marshals",
          desc: "Laser-lit drone flight cage challenges testing optical flow, PID stability, autonomous gate navigation, and pilot reflexes.",
          tag: "Flight Arena"
        },
        {
          id: "d2-06",
          time: "07:00 PM - 09:30 PM",
          title: "Robo Wars: Semi-Finals & Sudden-Death Destruction Rumbles",
          venue: "Central Enclosed Steel Arena, Innovation Ground",
          track: "Robotics",
          speaker: "Combat Arena Judges",
          desc: "Top 8 combat bots clash in elimination bouts. Armor-piercing kinetic spinners and high-pressure pneumatic flippers.",
          tag: "Main Event"
        },
        {
          id: "d2-07",
          time: "10:00 PM",
          title: "Hack-A-Silicon 36H: Solder & Code Freeze (Testing Commences)",
          venue: "Core Innovation Quadrangle (Level 2)",
          track: "Hackathon",
          speaker: "Hackathon Technical Jury",
          desc: "Official solder freeze! All hardware benches power down for overnight stability burn-in tests and bench code scrutiny.",
          tag: "Hard Freeze"
        }
      ]
    },
    day3: {
      date: "Sunday, November 22, 2026",
      title: "Research Colloquium, Pitch Demos & Valedictory",
      events: [
        {
          id: "d3-01",
          time: "09:30 AM - 01:00 PM",
          title: "Silicon Colloquium: National Tech Paper Presentations & Oral Defenses",
          venue: "Auditorium Annex & Conference Hall 1",
          track: "Paper",
          speaker: "IEEE Technical Advisory Committee & Faculty Panel",
          desc: "Peer-reviewed collegiate research presentations on 2nm lithography, RISC-V compute accelerators, and biomedical microfluidics.",
          tag: "IEEE Colloquium"
        },
        {
          id: "d3-02",
          time: "10:00 AM - 01:00 PM",
          title: "Hack-A-Silicon: Top 10 Finalist Stage Pitches & Live Working Demos",
          venue: "Sir C.V. Raman Main Auditorium",
          track: "Hackathon",
          speaker: "Grand Jury Panel & Deep-Tech Venture Scouts",
          desc: "Top 10 hardware teams present 7-minute functional bench demos and field rigorous technical Q&A before industry jurors.",
          tag: "Finalist Pitches"
        },
        {
          id: "d3-03",
          time: "10:30 AM - 01:30 PM",
          title: "Circuitrix Finals: Hardware Reverse Engineering & Micro-Solder Relay",
          venue: "Analog Devices Test & Bench Lab (Hall B)",
          track: "Competitions",
          speaker: "VLSI Senior Engineers & Marshals",
          desc: "Finalist showdown in blind black-box reverse engineering, SMD soldering, logic analyzer timing extraction, and bug eradication.",
          tag: "Championship Round"
        },
        {
          id: "d3-04",
          time: "01:30 PM - 02:45 PM",
          title: "Robo Wars: Grand Championship Finals & Champion Bout",
          venue: "Central Enclosed Steel Arena",
          track: "Robotics",
          speaker: "Arena Marshals & Safety Referees",
          desc: "The two undefeated collegiate combat heavyweights battle in a 5-minute final match for the ₹75,000 championship purse.",
          tag: "Grand Championship"
        },
        {
          id: "d3-05",
          time: "02:30 PM - 04:15 PM",
          title: "Hardware Startup Showcase & Student Prototype Maker Expo",
          venue: "Central Exhibition Plaza & Open Atrium",
          track: "General",
          speaker: "Student Makers, Incubator Heads & Industry Scouts",
          desc: "Open expo of 50+ student hardware innovations, IoT prototypes, robotic arms, and startup seed funding scouting.",
          tag: "Innovation Expo"
        },
        {
          id: "d3-06",
          time: "04:30 PM - 06:30 PM",
          title: "Grand Valedictory Ceremony & ₹3,00,000 Prize Distribution",
          venue: "Sir C.V. Raman Main Auditorium",
          track: "Keynote",
          speaker: "Distinguished Guests, IEEE Chairs, Faculty Patron Dr. Arvind Natarajan",
          desc: "Trophy handovers, ₹3,00,000 cash prize disbursements, sponsor hardware toolkits, and concluding celebration.",
          tag: "Awards Ceremony"
        }
      ]
    }
  },

  faqs: [
    {
      id: "faq-01",
      category: "eligibility",
      categoryName: "Eligibility & Teams",
      question: "Who is eligible to participate in TECHNOVA 2026?",
      answer: "TECHNOVA 2026 is open to all enrolled undergraduate, postgraduate, and polytechnic diploma students from any recognized university or college across India. While events focus on Electronics, Electrical, Computer Science, and Robotics, students from all engineering and science disciplines with a passion for hardware are warmly welcomed. A valid college student ID card must be presented during physical badge verification."
    },
    {
      id: "faq-02",
      category: "eligibility",
      categoryName: "Eligibility & Teams",
      question: "Are inter-college or cross-disciplinary teams allowed?",
      answer: "Yes, absolutely! We strongly support multidisciplinary collaboration. Your team members can be from different academic years, departments, or even different colleges. You simply need to produce valid student ID cards during physical check-in."
    },
    {
      id: "faq-03",
      category: "eligibility",
      categoryName: "Eligibility & Teams",
      question: "Can I register for multiple events across the 3 days?",
      answer: "Yes, you can register for multiple events as long as their operational schedules do not directly conflict. Note that participants in the 36-Hour Hack-A-Silicon will be primarily stationed in the hackathon quad, though team members may briefly rotate to attend paper presentations or quizzes."
    },
    {
      id: "faq-04",
      category: "eligibility",
      categoryName: "Eligibility & Teams",
      question: "Can team members be modified or substituted after completing registration?",
      answer: "Yes. Team rosters can be amended up to 24 hours prior to the symposium start (by Nov 19, 2026, 09:00 AM IST). You can look up your registration in the 'My Registrations' section of this portal or email our delegate desk at technova@apex-electronics.edu with your unique Registration ID (TNV-2026-XXXXXX)."
    },
    {
      id: "faq-05",
      category: "hardware",
      categoryName: "Hardware & Labs",
      question: "What lab instruments, testing benches, and tools are provided on campus?",
      answer: "Our labs are equipped with Rigol 100MHz 4-channel digital storage oscilloscopes (DSOs), regulated dual-output DC power supplies (0-30V, 5A), Arbitrary Waveform Generators, temperature-controlled Hakko soldering stations, hot air rework stations, logic analyzers, and digital multimeters. For Hack-A-Silicon, an official development hardware kit is provided to each shortlisted squad."
    },
    {
      id: "faq-06",
      category: "hardware",
      categoryName: "Hardware & Labs",
      question: "Can teams bring their own custom dev boards, sensors, and tools?",
      answer: "For hackathons and robotics arenas, off-the-shelf breakout boards (I2C/SPI sensors, motor drivers, ESP32, STM32, Raspberry Pi, Arduino) and personal labeled hand tools or laptops are permitted subject to pre-approval at the Technical Scrutiny Desk on Day 1. Pre-assembled turnkey commercial robots or fully pre-soldered application boards are strictly prohibited."
    },
    {
      id: "faq-07",
      category: "hardware",
      categoryName: "Hardware & Labs",
      question: "What microcontrollers and FPGA kits are supported in Hack-A-Silicon?",
      answer: "The official hardware dispensary stocks ESP32-S3 boards, STM32 Nucleo boards, Raspberry Pi Pico RP2040, and Xilinx Spartan-7 FPGA evaluation modules. Teams may request additional sensor breakouts (IMUs, gas sensors, LiDAR modules, ultrasonic transducers) from the AERC Hardware Dispensary during the sprint."
    },
    {
      id: "faq-08",
      category: "logistics",
      categoryName: "Hostel & Logistics",
      question: "Is overnight hostel accommodation available for outstation participants?",
      answer: "Yes! Subsidized campus hostel accommodation (separate secure wings for male and female participants) is available on a first-come, first-served basis for delegates traveling from outside Bengaluru. Bedding, secure lockers, campus Wi-Fi, and 24/7 security are included. You can indicate your accommodation requirement during event check-in."
    },
    {
      id: "faq-09",
      category: "logistics",
      categoryName: "Hostel & Logistics",
      question: "Are meals and refreshments provided during the 36-Hour Hackathon?",
      answer: "Yes. All registered Hack-A-Silicon participants will be provided with breakfast, lunch, dinner, midnight snacks, and continuous coffee/tea counters inside the innovation hub for the duration of the hackathon."
    },
    {
      id: "faq-10",
      category: "fees",
      categoryName: "Fees & Prizes",
      question: "Is there any registration fee for TECHNOVA 2026?",
      answer: "Attendance to all Keynotes, Tech Expos, and the Paper Colloquium is 100% FREE. Certain flagship competitive events have nominal team delegate pass fees (₹200 - ₹500 per team) to offset component kit costs. IEEE and AERC club members receive a 50% fee concession."
    },
    {
      id: "faq-11",
      category: "fees",
      categoryName: "Fees & Prizes",
      question: "How and when will the cash prizes and certificates be issued?",
      answer: "Cash prizes are disbursed via direct bank transfer or UPI within 5 working days following the Grand Valedictory on Nov 22. All registered attendees who complete rounds receive verifiable digital certificates signed by IEEE and Apex Institute."
    },
    {
      id: "faq-12",
      category: "rules",
      categoryName: "Rules & Safety",
      question: "What safety regulations and gear are required in Robo Wars and lab bays?",
      answer: "Safety is our topmost priority. Mandatory safety goggles (provided free by AERC) must be worn at all times inside the combat robot arena perimeter and soldering stations. All combat robots must incorporate an easily accessible physical power isolation switch, a radio failsafe that disables drive and weapons within 1 second of transmitter signal loss, and non-flammable lithium battery containment."
    }
  ],

  team: [
    {
      name: "Dr. Arvind Natarajan",
      role: "Faculty Patron & Club Advisor",
      dept: "Professor & Head of Microelectronics, Dept of ECE",
      email: "arvind.natarajan@apex-electronics.edu",
      phone: "+91 80 2345 6789",
      office: "Cabin C-308, Silicon Block",
      credentials: "Ph.D. (IISc Bangalore), Senior Member IEEE",
      avatar: "👨‍🏫"
    },
    {
      name: "Prof. M. Soundarya",
      role: "Associate Faculty Coordinator",
      dept: "Assistant Professor, Embedded Systems & IoT",
      email: "soundarya.m@apex-electronics.edu",
      phone: "+91 80 2345 6790",
      office: "Cabin C-312, Silicon Block",
      credentials: "M.Tech (VLSI & Embedded Systems), IETE Fellow",
      avatar: "👩‍🏫"
    },
    {
      name: "Rohit Nair",
      role: "Student Convener & President, AERC",
      dept: "Final Year B.Tech ECE",
      email: "rohit.nair.aerc@apex.edu",
      phone: "+91 98765 10001",
      office: "Room C-302, AERC Club Lab",
      credentials: "IEEE Student Chair",
      avatar: "👨‍💻"
    },
    {
      name: "Ananya Sharma",
      role: "Vice President & Hackathon Chair",
      dept: "Pre-Final Year B.Tech Robotics & ECE",
      email: "ananya.sharma.aerc@apex.edu",
      phone: "+91 98765 10002",
      office: "Room C-302, AERC Club Lab",
      credentials: "Hardware Hack Lead",
      avatar: "👩‍💻"
    },
    {
      name: "Devashish Sengupta",
      role: "Technical Head & Lab Infrastructure Lead",
      dept: "Third Year B.Tech Embedded Systems",
      email: "devashish.s.aerc@apex.edu",
      phone: "+91 98765 10003",
      office: "Room C-302, AERC Club Lab",
      credentials: "Circuitrix Lead",
      avatar: "👨‍🔧"
    },
    {
      name: "Kavya Patel",
      role: "Delegate Hospitality & Accommodations Lead",
      dept: "Third Year B.Tech ECE",
      email: "kavya.patel.aerc@apex.edu",
      phone: "+91 98765 10004",
      office: "Room C-302, AERC Club Lab",
      credentials: "Logistics Coordinator",
      avatar: "👩‍💼"
    }
  ],

  clubDetails: {
    fullName: "Apex Electronics & Robotics Club (AERC)",
    shortName: "AERC",
    foundedYear: 2014,
    motto: "Where Silicon Architecture Meets Physical Intelligence",
    parentDepartment: "Department of Electronics & Communication Engineering (ECE)",
    institution: "Apex Institute of Technology, Innovation Campus",
    chapterAffiliation: "IEEE Student Branch Chapter (STB64921) & IETE Student Forum",
    officeLocation: {
      lab: "Advanced VLSI & Embedded Systems Innovation Center, Room C-302, 3rd Floor, Silicon Block",
      workshop: "Robotics Fabrication Bay & Mechatronics Cell, Ground Floor, Workshop Wing",
      campus: "Apex Institute of Technology, Innovation Campus, Electronic City Phase 1, Hosur Road, Bengaluru 560100",
      gps: { lat: 12.9716, lng: 77.5946, display: "12.9716° N, 77.5946° E" }
    },
    hours: [
      { days: "Monday – Friday", timing: "09:00 AM – 07:00 PM", note: "Lab Open & Walk-in Desk" },
      { days: "Saturday", timing: "10:00 AM – 04:00 PM", note: "Hands-on Workshops & Scrutiny" },
      { days: "Event Days (Nov 20-22)", timing: "24 Hours Active", note: "Continuous Lab & Help Desk" }
    ],
    contactInfo: {
      emailClub: "aerc.club@apex.edu",
      emailFest: "technova@apex-electronics.edu",
      phoneHelpline: "+91 98765 43210",
      whatsappSupport: "+91 98765 43210",
      discord: "https://discord.gg/technova2026",
      github: "https://github.com/aerc-apex"
    },
    transitOptions: [
      { title: "Namma Metro", desc: "Yellow Line to Electronic City Station (1.2 km). Free university EV shuttles run every 15 minutes." },
      { title: "BMTC City Bus", desc: "Direct Volvo buses 356C, 360B, and V-356 from Kempegowda Bus Station (Majestic) stop right at Campus Gate 1." },
      { title: "Outstation Cloakroom", desc: "Safe luggage locker room and 24/7 delegate check-in lounge situated at Block A Atrium." }
    ]
  }
};
