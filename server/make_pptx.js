const pptxgen = require('pptxgenjs');
const path = require('path');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// Theme Colors
const COLOR_PRIMARY = '1A56A0';
const COLOR_ACCENT = '0D9488';
const COLOR_BG_DARK = '0F172A';
const COLOR_CARD_BG = 'F8FAFC';
const COLOR_BORDER = 'CBD5E1';

function addSlideHeader(slide, titleText, catText = "COLLEGE STAFF MANAGEMENT SYSTEM") {
  // Top Banner
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: 1.1, fill: { color: COLOR_PRIMARY } });
  slide.addText(catText.toUpperCase(), { x: 0.5, y: 0.15, w: 12, h: 0.3, fontSize: 10, bold: true, color: 'C8E1FF' });
  slide.addText(titleText, { x: 0.5, y: 0.45, w: 12, h: 0.5, fontSize: 22, bold: true, color: 'FFFFFF' });
}

// ================= SLIDE 1: TITLE SLIDE =================
const slide1 = pptx.addSlide();
slide1.background = { color: COLOR_BG_DARK };

slide1.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 1.2, w: 11.333, h: 5.1, fill: { color: '1E293B' }, line: { color: '334155', width: 2 } });
slide1.addText("COLLEGE STAFF MANAGEMENT SYSTEM", { x: 1.8, y: 2.0, w: 9.7, h: 0.4, fontSize: 14, bold: true, color: '38BDF8' });
slide1.addText("System Architecture & Design Specifications", { x: 1.8, y: 2.5, w: 9.7, h: 0.8, fontSize: 32, bold: true, color: 'FFFFFF' });
slide1.addText("Data Flow Diagrams (DFD Level 0, 1, 2)  |  Input Schemas  |  Output UI Specifications", { x: 1.8, y: 3.5, w: 9.7, h: 0.5, fontSize: 16, italic: true, color: 'CBD5E1' });
slide1.addText("Tech Stack: React 18  •  Tailwind CSS  •  Node.js  •  Express  •  MongoDB  •  JWT  •  Multer", { x: 1.8, y: 4.8, w: 9.7, h: 0.5, fontSize: 13, color: '94A3B8' });

// ================= SLIDE 2: SYSTEM ARCHITECTURE =================
const slide2 = pptx.addSlide();
addSlideHeader(slide2, "1. 3-Tier System Architecture Diagram");

// Client Layer
slide2.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 1.4, w: 11.733, h: 1.3, fill: { color: 'EBF8FF' }, line: { color: '2B6CB0', width: 2 } });
slide2.addText("CLIENT LAYER (FRONTEND UI)", { x: 1.1, y: 1.55, w: 11, h: 0.35, fontSize: 16, bold: true, color: '1A56A0' });
slide2.addText("React 18 Single Page Application  |  Tailwind CSS Framework  |  Lucide Icons  |  Axios HTTP Client", { x: 1.1, y: 1.95, w: 11, h: 0.4, fontSize: 13, color: '2C5282' });

// Service Layer
slide2.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 3.2, w: 11.733, h: 1.3, fill: { color: 'FAF5FF' }, line: { color: '6B46C1', width: 2 } });
slide2.addText("SERVICE / API LAYER (BACKEND SERVER)", { x: 1.1, y: 3.35, w: 11, h: 0.35, fontSize: 16, bold: true, color: '6B46C1' });
slide2.addText("Express.js Web Server (Port 5000)  |  JWT Authentication  |  Role Guard Middleware  |  Multer Upload Engine", { x: 1.1, y: 3.75, w: 11, h: 0.4, fontSize: 13, color: '553C9A' });

// Data Layer
slide2.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 5.0, w: 5.7, h: 1.5, fill: { color: 'F0FDF4' }, line: { color: '15803D', width: 2 } });
slide2.addText("DATABASE STORAGE LAYER", { x: 1.1, y: 5.15, w: 5.1, h: 0.35, fontSize: 15, bold: true, color: '15803D' });
slide2.addText("MongoDB Document Database\n('college-staff-db')", { x: 1.1, y: 5.55, w: 5.1, h: 0.6, fontSize: 12, color: '166534' });

slide2.addShape(pptx.shapes.RECTANGLE, { x: 6.833, y: 5.0, w: 5.7, h: 1.5, fill: { color: 'F0FDFA' }, line: { color: '0D9488', width: 2 } });
slide2.addText("FILE SYSTEM STORAGE", { x: 7.133, y: 5.15, w: 5.1, h: 0.35, fontSize: 15, bold: true, color: '0D9488' });
slide2.addText("Server /uploads/ Directory\n(Task Submissions)", { x: 7.133, y: 5.55, w: 5.1, h: 0.6, fontSize: 12, color: '0F766E' });

// ================= SLIDE 3: DFD LEVEL 0 =================
const slide3 = pptx.addSlide();
addSlideHeader(slide3, "2.1 DFD Level 0 (Context Diagram)");

const entities = [
  { title: "[ SYSTEM ADMIN ]", text: "Faculty Details, Task Assignments, Timetables ──►\n◄── Dashboard Stats, Reports, Task Overview", x: 0.8, y: 1.5, bg: 'FEF2F2', border: 'DC2626' },
  { title: "[ STAFF MEMBER ]", text: "Attendance Toggle, Task Submissions & Files ──►\n◄── Assigned Tasks, Daily Class Timetable", x: 0.8, y: 3.3, bg: 'F0FDF4', border: '16A34A' },
  { title: "[ STUDENT ]", text: "Search & Department Filter Queries ──►\n◄── Live Staff Presence & Current Room Location", x: 0.8, y: 5.1, bg: 'F5F3FF', border: '7C3AED' }
];

entities.forEach(e => {
  slide3.addShape(pptx.shapes.RECTANGLE, { x: e.x, y: e.y, w: 5.5, h: 1.5, fill: { color: e.bg }, line: { color: e.border, width: 2 } });
  slide3.addText(e.title, { x: e.x + 0.3, y: e.y + 0.15, w: 5.0, h: 0.35, fontSize: 15, bold: true, color: e.border });
  slide3.addText(e.text, { x: e.x + 0.3, y: e.y + 0.55, w: 5.0, h: 0.7, fontSize: 11, color: '334155' });
});

slide3.addShape(pptx.shapes.RECTANGLE, { x: 6.8, y: 1.5, w: 5.7, h: 5.1, fill: { color: 'EFF6FF' }, line: { color: '1D4ED8', width: 3 } });
slide3.addText("0.0 COLLEGE STAFF\nMANAGEMENT SYSTEM", { x: 7.0, y: 3.2, w: 5.3, h: 1.0, fontSize: 24, bold: true, color: '1E3A8A', align: 'center' });
slide3.addText("Central Application Core & Request Handler", { x: 7.0, y: 4.2, w: 5.3, h: 0.5, fontSize: 14, italic: true, color: '475569', align: 'center' });

// ================= SLIDE 4: DFD LEVEL 1 =================
const slide4 = pptx.addSlide();
addSlideHeader(slide4, "2.2 DFD Level 1 (System Decomposition)");

const processes = [
  { title: "Process 1.0", sub: "Authentication & JWT Guard", store: "Data Store D1: Users Collection", border: '1D4ED8' },
  { title: "Process 2.0", sub: "Staff Management Module", store: "Data Store D2: Staff Profile Collection", border: '15803D' },
  { title: "Process 3.0", sub: "Timetable & Slot Scheduling", store: "Data Store D3: Timetable Slot Collection", border: '6B46C1' },
  { title: "Process 4.0", sub: "Task Allocation & Uploads", store: "Data Store D4 / D5: Tasks & Uploads", border: 'D97706' },
  { title: "Process 5.0", sub: "Live Activity & Room Tracker", store: "Real-Time Student Location Output", border: '0D9488' }
];

processes.forEach((p, idx) => {
  const y = 1.4 + (idx * 1.1);
  // Process Box
  slide4.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: y, w: 5.5, h: 0.9, fill: { color: 'F8FAFC' }, line: { color: p.border, width: 2 } });
  slide4.addText(p.title, { x: 1.1, y: y + 0.1, w: 5.0, h: 0.3, fontSize: 14, bold: true, color: p.border });
  slide4.addText(p.sub, { x: 1.1, y: y + 0.45, w: 5.0, h: 0.35, fontSize: 11, color: '475569' });

  // Store Box
  slide4.addShape(pptx.shapes.RECTANGLE, { x: 6.8, y: y, w: 5.7, h: 0.9, fill: { color: 'F1F5F9' }, line: { color: '64748B', width: 2 } });
  slide4.addText(p.store, { x: 7.1, y: y + 0.25, w: 5.1, h: 0.4, fontSize: 13, bold: true, color: '1E293B' });
});

// ================= SLIDE 5: DFD LEVEL 2 =================
const slide5 = pptx.addSlide();
addSlideHeader(slide5, "2.3 DFD Level 2 (Task Allocation & File Upload Lifecycle)");

const steps = [
  { title: "Step 1: Task Allocation", text: "Admin assigns task (Title, Staff ID, Priority, Deadline) ──► Written to D4 Tasks Store", border: '2563EB' },
  { title: "Step 2: Task Retrieval", text: "Faculty member fetches assigned tasks list ◄── Read from D4 Tasks Store", border: '7C3AED' },
  { title: "Step 3: Multer File Upload", text: "Staff selects file -> 4.3 Multer Engine saves physical file ──► Saved in D5 (/uploads/)", border: 'D97706' },
  { title: "Step 4: Status Updated", text: "Task status updated to 'Completed' with File Download URL ──► Saved in D4 Tasks Store", border: '16A34A' },
  { title: "Step 5: Admin Submission Review", text: "Admin opens Completed Tasks card ──► Clicks file download link to view/download work", border: '0D9488' }
];

steps.forEach((s, idx) => {
  const y = 1.4 + (idx * 1.1);
  slide5.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: y, w: 11.733, h: 0.9, fill: { color: 'F8FAFC' }, line: { color: s.border, width: 2 } });
  slide5.addText(s.title, { x: 1.1, y: y + 0.1, w: 11.0, h: 0.3, fontSize: 14, bold: true, color: s.border });
  slide5.addText(s.text, { x: 1.1, y: y + 0.45, w: 11.0, h: 0.35, fontSize: 11, color: '334155' });
});

// ================= SLIDE 6: INPUT DESIGN =================
const slide6 = pptx.addSlide();
addSlideHeader(slide6, "3. Input Design Specifications");

const inputCards = [
  { title: "Add Staff Form", endpoint: "POST /api/admin/staff", fields: "• name: Text Input (Required)\n• email: Unique Email Input\n• password: Password Input\n• department: Enum Dropdown\n• designation: Text Input\n• subjects: Comma-separated\n• assignedYears: Target years" },
  { title: "Task File Upload", endpoint: "POST /api/staff/tasks/:id/upload", fields: "• file: File Picker (Multipart)\n• Max File Size: 50MB\n• Accepted: PDF, DOCX, ZIP, Images\n• submission: Optional note/URL\n• Auto-sets status to Completed" },
  { title: "Timetable Slot Form", endpoint: "POST /api/admin/timetable", fields: "• day: Enum (Monday - Saturday)\n• startTime/endTime: HH:mm\n• subject: Text Input\n• classroom: Room / Lab number\n• department, year, section: Text\n• Conflict validation rules" }
];

inputCards.forEach((c, idx) => {
  const x = 0.5 + (idx * 4.2);
  slide6.addShape(pptx.shapes.RECTANGLE, { x: x, y: 1.3, w: 3.9, h: 5.7, fill: { color: 'F8FAFC' }, line: { color: 'CBD5E1', width: 2 } });
  slide6.addText(c.title, { x: x + 0.3, y: 1.5, w: 3.3, h: 0.4, fontSize: 16, bold: true, color: '1A56A0' });
  slide6.addText(c.endpoint, { x: x + 0.3, y: 1.9, w: 3.3, h: 0.3, fontSize: 10, bold: true, color: '0D9488' });
  slide6.addText(c.fields, { x: x + 0.3, y: 2.3, w: 3.3, h: 4.4, fontSize: 11, color: '334155' });
});

// ================= SLIDE 7: OUTPUT DESIGN =================
const slide7 = pptx.addSlide();
addSlideHeader(slide7, "4. Output Design & Portal UI Layouts");

const outputCards = [
  { title: "Admin Portal", items: "✔ Interactive Stat Cards with Clickable Popups\n\n✔ Completed Task File Submission Viewer\n\n✔ Staff Management Table with search & actions\n\n✔ Individual Staff Timetable Configurator" },
  { title: "Staff Portal", items: "✔ Live Attendance Toggle (Mark Present / On Leave)\n\n✔ My Assigned Task Cards with status badges\n\n✔ Multipart File Upload Control for task work\n\n✔ Submitted File View & Download link" },
  { title: "Student Portal", items: "✔ Real-Time Faculty Status Badges\n\n✔ Dynamic Current Activity & Room Tracker\n\n✔ Department Filter Search Bar\n\n✔ Auto-calculated period subject location" }
];

outputCards.forEach((c, idx) => {
  const x = 0.5 + (idx * 4.2);
  slide7.addShape(pptx.shapes.RECTANGLE, { x: x, y: 1.3, w: 3.9, h: 5.7, fill: { color: 'F8FAFC' }, line: { color: 'CBD5E1', width: 2 } });
  slide7.addText(c.title, { x: x + 0.3, y: 1.5, w: 3.3, h: 0.4, fontSize: 16, bold: true, color: '1A56A0' });
  slide7.addText(c.items, { x: x + 0.3, y: 2.2, w: 3.3, h: 4.5, fontSize: 12, color: '1E293B' });
});

// Save presentation to main project root folder
const outputPath = path.join(__dirname, '..', 'College_Staff_Management_Presentation.pptx');
pptx.writeFile({ fileName: outputPath }).then(fileName => {
  console.log(`SUCCESS: PowerPoint presentation created at ${fileName}`);
});
