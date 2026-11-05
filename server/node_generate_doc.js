const fs = require('fs');
const path = require('path');
const docx = require('docx');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType, WidthType, ShadingType, BorderStyle } = docx;

const tableBorderNone = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const boxBorder = {
  top: { style: BorderStyle.SINGLE, size: 12, color: "1A56A0" },
  bottom: { style: BorderStyle.SINGLE, size: 12, color: "1A56A0" },
  left: { style: BorderStyle.SINGLE, size: 12, color: "1A56A0" },
  right: { style: BorderStyle.SINGLE, size: 12, color: "1A56A0" },
};

function makeBoxCell(title, subtitle, bgColor = "EBF8FF", borderColor = "1A56A0") {
  return new TableCell({
    shading: { fill: bgColor, type: ShadingType.CLEAR, color: "auto" },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 12, color: borderColor },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: borderColor },
      left: { style: BorderStyle.SINGLE, size: 12, color: borderColor },
      right: { style: BorderStyle.SINGLE, size: 12, color: borderColor },
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: title, bold: true, size: 24, color: borderColor })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: subtitle, size: 20, color: "4A5568" })],
      }),
    ],
  });
}

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      // Main Document Title
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

      // ================= SECTION 1: ARCHITECTURE =================
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "1. System Architecture Diagram", bold: true, color: "1A56A0" })],
      }),
      new Paragraph({
        children: [
          new TextRun("The College Staff Management System follows a modern 3-Tier Client-Server Architecture. The system is logically separated into Presentation Layer (Frontend SPA), Service & API Layer (Backend REST Server), and Data Storage Layer (MongoDB & File System)."),
        ],
      }),
      new Paragraph({ text: "" }),

      // Architecture Box Diagram Table
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [makeBoxCell("CLIENT LAYER (FRONTEND UI)", "React 18 Single Page App  |  Tailwind CSS  |  Lucide Icons  |  Axios Client", "EBF8FF", "2B6CB0")],
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: tableBorderNone,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "│  ↓  (REST API Calls / JSON Payload)      (Multipart File Uploads)  ↓  │", bold: true, color: "4A5568", size: 20 })],
                  }),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [makeBoxCell("SERVICE / API LAYER (BACKEND SERVER)", "Express.js Web Server (Port 5000)  |  JWT Authentication  |  Role Guard Middleware  |  Multer Upload Engine", "FAF5FF", "6B46C1")],
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: tableBorderNone,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "│  ↓  (Mongoose Schema Driver)            (Physical File Storage Disk I/O)  ↓  │", bold: true, color: "4A5568", size: 20 })],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              makeBoxCell("DATABASE STORAGE LAYER", "MongoDB Database ('college-staff-db')", "F0FDF4", "15803D"),
              makeBoxCell("FILE SYSTEM STORAGE", "Server /uploads/ Directory", "F0FDFA", "0D9488"),
            ],
          }),
        ],
      }),

      new Paragraph({ text: "" }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "Layer Descriptions:", bold: true })],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• Presentation Layer: ", bold: true }),
          new TextRun("React 18 Single Page Application styled with Tailwind CSS, utilizing Axios for asynchronous HTTP communications.\n"),
          new TextRun({ text: "• Application Service Layer: ", bold: true }),
          new TextRun("Node.js & Express web server running on port 5000, enforcing JWT authentication, role authorization, RESTful CRUD endpoints, and Multer physical file management.\n"),
          new TextRun({ text: "• Data Storage Layer: ", bold: true }),
          new TextRun("MongoDB document database storing User, Staff, Student, Timetable, and Task collections, alongside a dedicated server directory (/uploads/) for file attachments."),
        ],
      }),

      // ================= SECTION 2: DFD =================
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "2. Data Flow Diagrams (DFD)", bold: true, color: "1A56A0" })],
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "2.1 DFD Level 0 (Context Diagram)", bold: true })],
      }),
      new Paragraph({
        children: [new TextRun("The Level 0 Context Diagram establishes system boundaries and external entity interactions (Admin, Staff, Student).")],
      }),
      new Paragraph({ text: "" }),

      // DFD Level 0 Box Diagram
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              makeBoxCell("[ SYSTEM ADMIN ]", "Faculty Details, Task Assignments, Timetables ──►\n◄── Analytics Stats, Task Reports, Staff Overview", "FEF2F2", "DC2626"),
              makeBoxCell("0.0 COLLEGE STAFF MANAGEMENT SYSTEM", "Central Application Core & Request Handler", "EFF6FF", "1D4ED8"),
            ],
          }),
          new TableRow({
            children: [
              makeBoxCell("[ STAFF MEMBER ]", "Attendance Toggle, Task Submissions & Files ──►\n◄── Assigned Tasks, Daily Period Schedule", "F0FDF4", "16A34A"),
              makeBoxCell("[ STUDENT ]", "Search & Department Filters ──►\n◄── Live Staff Presence & Current Class Location", "F5F3FF", "7C3AED"),
            ],
          }),
        ],
      }),

      new Paragraph({ text: "" }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "2.2 DFD Level 1 (System Decomposition)", bold: true })],
      }),
      new Paragraph({
        children: [new TextRun("Decomposes system operations into 5 major core processes and 5 primary data stores:")],
      }),
      new Paragraph({ text: "" }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              makeBoxCell("Process 1.0", "Auth & Token Verification Guard", "EFF6FF", "1D4ED8"),
              makeBoxCell("Data Store D1", "D1: Users Collection", "E2E8F0", "475569"),
            ],
          }),
          new TableRow({
            children: [
              makeBoxCell("Process 2.0", "Staff Onboarding & Deletion", "F0FDF4", "15803D"),
              makeBoxCell("Data Store D2", "D2: Staff Profile Collection", "E2E8F0", "475569"),
            ],
          }),
          new TableRow({
            children: [
              makeBoxCell("Process 3.0", "Timetable & Period Scheduling", "FAF5FF", "6B46C1"),
              makeBoxCell("Data Store D3", "D3: Timetable Slot Collection", "E2E8F0", "475569"),
            ],
          }),
          new TableRow({
            children: [
              makeBoxCell("Process 4.0", "Task Allocation & File Uploads", "FFFBEB", "D97706"),
              makeBoxCell("Data Store D4 / D5", "D4: Tasks Store  |  D5: Uploads Folder", "E2E8F0", "475569"),
            ],
          }),
          new TableRow({
            children: [
              makeBoxCell("Process 5.0", "Live Activity & Status Calculation", "F0FDFA", "0D9488"),
              makeBoxCell("Real-Time Output", "Student Live Presence & Classroom Finder", "E2E8F0", "475569"),
            ],
          }),
        ],
      }),

      new Paragraph({ text: "" }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "2.3 DFD Level 2 (Task Allocation & File Upload Process)", bold: true })],
      }),
      new Paragraph({
        children: [new TextRun("Detailed lifecycle diagram showing Task Allocation, Multer File Upload, Server Storage, and Admin Review:")],
      }),
      new Paragraph({ text: "" }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [makeBoxCell("Step 1: Admin Creates Task", "Title, Staff ID, Priority, Deadline ──► Written to D4 Tasks Store", "EFF6FF", "2563EB")],
          }),
          new TableRow({
            children: [makeBoxCell("Step 2: Staff Fetches Tasks", "Staff requests assigned task list ◄── Read from D4 Tasks Store", "FAF5FF", "7C3AED")],
          }),
          new TableRow({
            children: [makeBoxCell("Step 3: Staff Uploads Submission File", "Selected file processed by 4.3 Multer Engine ──► Saved in D5 File Storage (/uploads/)", "FFFBEB", "D97706")],
          }),
          new TableRow({
            children: [makeBoxCell("Step 4: Status Updated to 'Completed'", "Task status set to Completed with File Download URL ──► Updated in D4 Tasks Store", "F0FDF4", "16A34A")],
          }),
          new TableRow({
            children: [makeBoxCell("Step 5: Admin Reviews Submission", "Admin opens Completed Tasks card ──► Clicks file download link to view work", "F0FDFA", "0D9488")],
          }),
        ],
      }),

      // ================= SECTION 3: INPUT DESIGN =================
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "3. Input Design Specification", bold: true, color: "1A56A0" })],
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

      // ================= SECTION 4: OUTPUT DESIGN =================
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "4. Output Design Specification", bold: true, color: "1A56A0" })],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• Admin Portal: ", bold: true }),
          new TextRun("Interactive Stat Cards (Clickable Popups for Total Staff, Present, On Leave, Online, Pending, Completed Tasks), Completed Submission File Viewer with Direct Download Links, and Staff Management Table.\n"),
          new TextRun({ text: "• Staff Portal: ", bold: true }),
          new TextRun("Live Attendance Toggle Control (Mark Present / On Leave), Assigned Task Cards, File Upload Selector, and Submitted File View Link.\n"),
          new TextRun({ text: "• Student Portal: ", bold: true }),
          new TextRun("Staff Status Cards (Present/Online, Present/Offline, On Leave), Search Bar, and Live Activity & Classroom Location Tracker."),
        ],
      }),
    ],
  }],
});

const outputPath = path.join(__dirname, '..', 'System_Design_Specification_With_Diagrams.docx');
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`SUCCESS: Native Word DOCX created at ${outputPath}`);
});
