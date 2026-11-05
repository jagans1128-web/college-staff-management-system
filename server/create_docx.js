const fs = require('fs');
const path = require('path');
const docx = require('docx');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType, WidthType, ShadingType } = docx;

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "College Staff Management System", bold: true, size: 48, color: "1A56A0" }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "System Design & Architecture Specification Document", italics: true, size: 28, color: "646464" }),
        ],
      }),
      new Paragraph({ text: "" }),

      // --- SECTION 1 ---
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "1. System Architecture Diagram", bold: true, color: "1A56A0" })],
      }),
      new Paragraph({
        children: [
          new TextRun("The College Staff Management System follows a modern 3-Tier Client-Server Architecture. The system is logically separated into Presentation Layer (Frontend SPA), Service & API Layer (Backend REST Server), and Data Storage Layer (Database & Physical Storage)."),
        ],
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new TextRun({ text: "┌─────────────────────────────────────────────────────────────┐\n", bold: true }),
          new TextRun({ text: "│                  CLIENT LAYER (FRONTEND)                    │\n", bold: true }),
          new TextRun({ text: "│  React.js (SPA) | Tailwind CSS | Lucide Icons | Axios       │\n", bold: true }),
          new TextRun({ text: "└──────────────────────────────┬──────────────────────────────┘\n", bold: true }),
          new TextRun({ text: "                               │ (REST API & Multipart Uploads)\n", italics: true }),
          new TextRun({ text: "┌──────────────────────────────▼──────────────────────────────┐\n", bold: true }),
          new TextRun({ text: "│             SERVICE / API LAYER (BACKEND)                   │\n", bold: true }),
          new TextRun({ text: "│  Express.js Server (Port 5000) | JWT Auth & Role Security    │\n", bold: true }),
          new TextRun({ text: "│  Multer Upload Engine | Real-Time Schedule Logic            │\n", bold: true }),
          new TextRun({ text: "└──────────────────────────────┬──────────────────────────────┘\n", bold: true }),
          new TextRun({ text: "                               │ (Mongoose & Disk I/O)\n", italics: true }),
          new TextRun({ text: "┌──────────────────────────────▼──────────────────────────────┐\n", bold: true }),
          new TextRun({ text: "│                 DATA & STORAGE LAYER                        │\n", bold: true }),
          new TextRun({ text: "│  MongoDB ('college-staff-db')  |  /uploads/ Storage Directory│\n", bold: true }),
          new TextRun({ text: "└─────────────────────────────────────────────────────────────┘", bold: true }),
        ],
      }),

      // --- SECTION 2 ---
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "2. Data Flow Diagrams (DFD)", bold: true, color: "1A56A0" })],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "2.1 DFD Level 0 (Context Diagram)", bold: true })],
      }),
      new Paragraph({
        children: [
          new TextRun("The Level 0 Context Diagram defines overall system boundaries and external entity flows:\n"),
          new TextRun({ text: "• System Admin: ", bold: true }),
          new TextRun("Sends Staff Details, Task Assignments, Timetable Slots -> Receives Analytics Stats & Task Reports.\n"),
          new TextRun({ text: "• Staff Member: ", bold: true }),
          new TextRun("Sends Attendance Toggle, Task Submissions & Upload Files -> Receives Assigned Tasks & Daily Timetable.\n"),
          new TextRun({ text: "• Student: ", bold: true }),
          new TextRun("Sends Filter & Search Queries -> Receives Live Staff Presence & Classroom Location."),
        ],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "2.2 DFD Level 1 (System Decomposition)", bold: true })],
      }),
      new Paragraph({
        children: [
          new TextRun("1.0 Authentication & Authorization (Token & password verification)\n"),
          new TextRun("2.0 Staff Management (Faculty onboarding & deletion)\n"),
          new TextRun("3.0 Timetable Scheduling (Classroom & period allocation)\n"),
          new TextRun("4.0 Task Allocation & Submission (Task creation & Multer file uploads)\n"),
          new TextRun("5.0 Live Activity Calculation (Real-time student room tracker)"),
        ],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "2.3 DFD Level 2 (Task Allocation & File Upload Process)", bold: true })],
      }),
      new Paragraph({
        children: [
          new TextRun("1. Admin creates Task (Title, Staff ID, Priority, Deadline) -> Saved in D4 Tasks Store.\n"),
          new TextRun("2. Staff fetches assigned tasks -> Read from D4 Tasks Store.\n"),
          new TextRun("3. Staff uploads submission file -> Processed by 4.3 Multer Engine -> Saved in D5 Storage (/uploads/).\n"),
          new TextRun("4. Task status updated to 'Completed' with File URL -> Saved in D4 Tasks Store.\n"),
          new TextRun("5. Admin reviews completed task -> Opens submission file directly via download URL."),
        ],
      }),

      // --- SECTION 3 ---
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "3. Input Design Specification", bold: true, color: "1A56A0" })],
      }),
      new Paragraph({
        children: [new TextRun("Comprehensive input field specifications, input controls, and validation rules:")],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "3.1 Add Staff Form Specifications (POST /api/admin/staff)", bold: true })],
      }),
      new Paragraph({
        children: [
          new TextRun("• name: Text Input | Required, Non-empty string | Full name of faculty member\n"),
          new TextRun("• email: Email Input | Required, Unique in DB | Official college email address\n"),
          new TextRun("• password: Password Input | Required | Account access password\n"),
          new TextRun("• department: Dropdown | Enum (CSE, IT, ECE, EEE, MECH) | Academic department\n"),
          new TextRun("• designation: Text Input | Required | e.g., Assistant Professor\n"),
          new TextRun("• subjects: Text Input | Comma-separated strings | Subjects taught\n"),
          new TextRun("• assignedYears: Text Input | Comma-separated strings | Target student years"),
        ],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "3.2 Task File Upload Submission (POST /api/staff/tasks/:id/upload)", bold: true })],
      }),
      new Paragraph({
        children: [
          new TextRun("• file: File Picker (Multipart) | Max 50MB (PDF, DOCX, ZIP, Images) | Task work submission file\n"),
          new TextRun("• submission: Text Input | Optional string | Additional comments or reference URL"),
        ],
      }),

      // --- SECTION 4 ---
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "4. Output Design Specification", bold: true, color: "1A56A0" })],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• Admin Portal Layout: ", bold: true }),
          new TextRun("Interactive Stat Cards (Clickable Popups for Total Staff, Present, On Leave, Online, Pending, Completed Tasks), Completed Submission File Viewer with Direct Download Links, and Staff Management Table.\n"),
          new TextRun({ text: "• Staff Portal Layout: ", bold: true }),
          new TextRun("Live Attendance Toggle Control (Mark Present / On Leave), Assigned Task Cards, File Upload Selector, and Submitted File View Link.\n"),
          new TextRun({ text: "• Student Portal Layout: ", bold: true }),
          new TextRun("Staff Status Cards (Present/Online, Present/Offline, On Leave), Search Bar, and Live Activity & Classroom Location Tracker."),
        ],
      }),
    ],
  }],
});

const outputPath = path.join(__dirname, '..', 'System_Design_Specification.docx');
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`SUCCESS: Word document created at ${outputPath}`);
});
