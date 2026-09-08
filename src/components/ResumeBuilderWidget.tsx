"use client";

import { useState } from "react";
import { Download, Loader2, Plus, Trash2, User, Eye, Sparkles } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  dates: string;
  description: string;
}

interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
  details: string;
}

const SAMPLE_RESUME = {
  fullName: "Alex Morgan",
  title: "Senior Full-Stack Engineer",
  email: "alex.morgan@email.com",
  phone: "+1 (555) 349-8821",
  location: "San Francisco, CA",
  website: "alexmorgan.dev",
  summary:
    "Product-minded software engineer with 6+ years of experience building high-scale web platforms, distributed systems, and modern frontends. Passionate about developer tooling, performance optimization, and clean architecture.",
  skills: "TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Redis, Docker, AWS, GraphQL, TailwindCSS, CI/CD",
  experiences: [
    {
      id: "exp-1",
      role: "Lead Frontend Engineer",
      company: "Vanguard Tech Labs",
      location: "San Francisco, CA",
      dates: "2023 - Present",
      description:
        "Architected next-generation analytics dashboard serving 120k+ daily active users.\nReduced bundle size by 42% and improved Core Web Vitals across the platform.\nMentored junior engineers and led weekly architecture reviews.",
    },
    {
      id: "exp-2",
      role: "Software Engineer",
      company: "Nexus Cloud Systems",
      location: "Austin, TX",
      dates: "2020 - 2023",
      description:
        "Built resilient microservices handling 15M requests/day using Node.js and Redis.\nImplemented real-time streaming pipelines with WebSockets and Kafka.\nCollaborated closely with product designers to ship 14 major feature releases.",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      school: "University of California, Berkeley",
      year: "2016 - 2020",
      details: "Graduated with Honors (Magna Cum Laude). Dean's Honor List.",
    },
  ],
};

export function ResumeBuilderWidget() {
  const [fullName, setFullName] = useState(SAMPLE_RESUME.fullName);
  const [title, setTitle] = useState(SAMPLE_RESUME.title);
  const [email, setEmail] = useState(SAMPLE_RESUME.email);
  const [phone, setPhone] = useState(SAMPLE_RESUME.phone);
  const [location, setLocation] = useState(SAMPLE_RESUME.location);
  const [website, setWebsite] = useState(SAMPLE_RESUME.website);
  const [summary, setSummary] = useState(SAMPLE_RESUME.summary);
  const [skills, setSkills] = useState(SAMPLE_RESUME.skills);

  const [experiences, setExperiences] = useState<ExperienceItem[]>(SAMPLE_RESUME.experiences);
  const [education, setEducation] = useState<EducationItem[]>(SAMPLE_RESUME.education);

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        role: "",
        company: "",
        location: "",
        dates: "",
        description: "",
      },
    ]);
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    setExperiences((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeExperience = (id: string) => {
    if (experiences.length <= 1) return;
    setExperiences((prev) => prev.filter((i) => i.id !== id));
  };

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        degree: "",
        school: "",
        year: "",
        details: "",
      },
    ]);
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setEducation((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeEducation = (id: string) => {
    if (education.length <= 1) return;
    setEducation((prev) => prev.filter((i) => i.id !== id));
  };

  const loadSampleData = () => {
    setFullName(SAMPLE_RESUME.fullName);
    setTitle(SAMPLE_RESUME.title);
    setEmail(SAMPLE_RESUME.email);
    setPhone(SAMPLE_RESUME.phone);
    setLocation(SAMPLE_RESUME.location);
    setWebsite(SAMPLE_RESUME.website);
    setSummary(SAMPLE_RESUME.summary);
    setSkills(SAMPLE_RESUME.skills);
    setExperiences(SAMPLE_RESUME.experiences);
    setEducation(SAMPLE_RESUME.education);
  };

  const generateResumePdf = async () => {
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
      const { width, height } = page.getSize();

      const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      const margin = 44;
      const contentWidth = width - margin * 2;
      let y = height - margin;

      const primaryColor = rgb(0.12, 0.16, 0.22); // deep slate ink
      const accentColor = rgb(0.15, 0.35, 0.6); // subtle navy
      const mutedColor = rgb(0.35, 0.4, 0.45);
      const ruleColor = rgb(0.82, 0.85, 0.88);

      // Helper to wrap text into multiple lines
      const wrapText = (text: string, maxWidth: number, font: typeof fontNormal, size: number) => {
        const words = text.split(/\s+/);
        const lines: string[] = [];
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = font.widthOfTextAtSize(testLine, size);
          if (testWidth <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
      };

      // Header: Full Name
      page.drawText(fullName.toUpperCase() || "YOUR NAME", {
        x: margin,
        y,
        size: 20,
        font: fontBold,
        color: primaryColor,
      });
      y -= 18;

      // Header: Professional Title
      if (title.trim()) {
        page.drawText(title, {
          x: margin,
          y,
          size: 11,
          font: fontBold,
          color: accentColor,
        });
        y -= 15;
      }

      // Contact Line
      const contactParts = [email, phone, location, website].filter(Boolean);
      const contactStr = contactParts.join("   |   ");
      page.drawText(contactStr, {
        x: margin,
        y,
        size: 8.5,
        font: fontNormal,
        color: mutedColor,
      });
      y -= 16;

      // Divider line
      page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1.2,
        color: primaryColor,
      });
      y -= 18;

      // Section Renderer Helper
      const drawSectionTitle = (titleText: string) => {
        page.drawText(titleText.toUpperCase(), {
          x: margin,
          y,
          size: 10,
          font: fontBold,
          color: primaryColor,
        });
        y -= 4;
        page.drawLine({
          start: { x: margin, y },
          end: { x: width - margin, y },
          thickness: 0.5,
          color: ruleColor,
        });
        y -= 12;
      };

      // 1. Professional Summary
      if (summary.trim()) {
        drawSectionTitle("Professional Summary");
        const summaryLines = wrapText(summary.trim(), contentWidth, fontNormal, 9);
        for (const line of summaryLines) {
          page.drawText(line, {
            x: margin,
            y,
            size: 9,
            font: fontNormal,
            color: primaryColor,
          });
          y -= 13;
        }
        y -= 10;
      }

      // 2. Work Experience
      if (experiences.length > 0 && experiences[0].company.trim()) {
        drawSectionTitle("Work Experience");
        for (const exp of experiences) {
          // Role and Dates
          page.drawText(exp.role || "Role", {
            x: margin,
            y,
            size: 10,
            font: fontBold,
            color: primaryColor,
          });

          if (exp.dates) {
            const dateWidth = fontBold.widthOfTextAtSize(exp.dates, 9);
            page.drawText(exp.dates, {
              x: width - margin - dateWidth,
              y,
              size: 9,
              font: fontBold,
              color: mutedColor,
            });
          }
          y -= 13;

          // Company & Location
          const compLoc = [exp.company, exp.location].filter(Boolean).join("  —  ");
          page.drawText(compLoc, {
            x: margin,
            y,
            size: 9,
            font: fontOblique,
            color: accentColor,
          });
          y -= 13;

          // Bullet lines / description
          if (exp.description) {
            const lines = exp.description.split("\n").filter((l) => l.trim().length > 0);
            for (const itemLine of lines) {
              const cleaned = itemLine.replace(/^[•\-\*]\s*/, "");
              const wrapped = wrapText(cleaned, contentWidth - 14, fontNormal, 8.5);
              wrapped.forEach((wl, idx) => {
                if (idx === 0) {
                  page.drawText("•", {
                    x: margin + 3,
                    y,
                    size: 9,
                    font: fontNormal,
                    color: mutedColor,
                  });
                }
                page.drawText(wl, {
                  x: margin + 14,
                  y,
                  size: 8.5,
                  font: fontNormal,
                  color: primaryColor,
                });
                y -= 12;
              });
            }
          }
          y -= 6;
        }
        y -= 6;
      }

      // 3. Education
      if (education.length > 0 && education[0].school.trim()) {
        drawSectionTitle("Education");
        for (const edu of education) {
          page.drawText(edu.degree || "Degree", {
            x: margin,
            y,
            size: 9.5,
            font: fontBold,
            color: primaryColor,
          });

          if (edu.year) {
            const yrWidth = fontBold.widthOfTextAtSize(edu.year, 8.5);
            page.drawText(edu.year, {
              x: width - margin - yrWidth,
              y,
              size: 8.5,
              font: fontBold,
              color: mutedColor,
            });
          }
          y -= 12;

          page.drawText(edu.school || "University", {
            x: margin,
            y,
            size: 9,
            font: fontOblique,
            color: accentColor,
          });
          y -= 12;

          if (edu.details) {
            page.drawText(edu.details, {
              x: margin,
              y,
              size: 8.5,
              font: fontNormal,
              color: mutedColor,
            });
            y -= 12;
          }
          y -= 4;
        }
        y -= 6;
      }

      // 4. Skills
      if (skills.trim()) {
        drawSectionTitle("Skills & Technologies");
        const skillLines = wrapText(skills.trim(), contentWidth, fontNormal, 9);
        for (const sline of skillLines) {
          page.drawText(sline, {
            x: margin,
            y,
            size: 9,
            font: fontNormal,
            color: primaryColor,
          });
          y -= 13;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const newUrl = URL.createObjectURL(blob);
      setPdfUrl(newUrl);
    } catch (err) {
      console.error("Failed to build resume PDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--ink)] flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--primary)]" />
            Resume Builder
          </h2>
          <p className="text-xs text-[var(--ink-muted)]">
            Create a crisp, recruiter-friendly PDF resume formatted to industry standards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadSampleData}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Fill Demo Profile
          </button>
          <button
            onClick={generateResumePdf}
            disabled={isGenerating}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Generate PDF
          </button>
        </div>
      </div>

      {/* Profile & Contact Info */}
      <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
        <h3 className="font-bold text-sm text-[var(--ink)] border-b border-[var(--border)] pb-2">
          Personal Information & Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
              Professional Title / Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
              Location (City, State / Country)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
              Website / LinkedIn / Portfolio
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
        <label className="text-xs font-semibold text-[var(--ink)] block">
          Professional Summary
        </label>
        <textarea
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief 2-3 sentence overview of your qualifications, focus, and top career achievements..."
          className="w-full text-sm p-2.5 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
        />
      </div>

      {/* Work Experience */}
      <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
          <h3 className="font-bold text-sm text-[var(--ink)]">Work Experience</h3>
          <button
            onClick={addExperience}
            className="px-3 py-1 text-xs font-semibold text-[var(--ink)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--paper)] space-y-3 relative group"
            >
              <button
                onClick={() => removeExperience(exp.id)}
                disabled={experiences.length <= 1}
                className="absolute top-4 right-4 p-1.5 text-[var(--ink-muted)] hover:text-red-500 disabled:opacity-20 transition-colors"
                title="Remove experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                    placeholder="e.g. Senior Product Manager"
                    className="w-full text-sm p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full text-sm p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                    Dates (e.g. 2021 - Present)
                  </label>
                  <input
                    type="text"
                    value={exp.dates}
                    onChange={(e) => updateExperience(exp.id, "dates", e.target.value)}
                    placeholder="e.g. Jan 2022 - Present"
                    className="w-full text-sm p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                    placeholder="e.g. New York, NY (or Remote)"
                    className="w-full text-sm p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                  Bullet Points / Key Accomplishments (One per line)
                </label>
                <textarea
                  rows={3}
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                  placeholder="• Spearheaded design system migration improving velocity by 30%&#10;• Led team of 5 engineers..."
                  className="w-full text-sm p-2 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
          <h3 className="font-bold text-sm text-[var(--ink)]">Education</h3>
          <button
            onClick={addEducation}
            className="px-3 py-1 text-xs font-semibold text-[var(--ink)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Education
          </button>
        </div>

        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--paper)] space-y-3 relative group"
            >
              <button
                onClick={() => removeEducation(edu.id)}
                disabled={education.length <= 1}
                className="absolute top-4 right-4 p-1.5 text-[var(--ink-muted)] hover:text-red-500 disabled:opacity-20 transition-colors"
                title="Remove education"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                <div>
                  <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                    Degree / Certification
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    placeholder="e.g. B.S. in Computer Science"
                    className="w-full text-sm p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full text-sm p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                    Years / Graduation
                  </label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                    placeholder="e.g. 2018 - 2022"
                    className="w-full text-sm p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                  Honors / Minors / Highlights
                </label>
                <input
                  type="text"
                  value={edu.details}
                  onChange={(e) => updateEducation(edu.id, "details", e.target.value)}
                  placeholder="e.g. Magna Cum Laude, GPA 3.9, Minor in Mathematics"
                  className="w-full text-sm p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
        <label className="text-xs font-semibold text-[var(--ink)] block">
          Skills, Tools & Technologies (Comma-separated)
        </label>
        <textarea
          rows={2}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. React, TypeScript, Python, SQL, Project Management, Agile..."
          className="w-full text-sm p-2.5 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
        />
      </div>

      {/* Export Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
        <div>
          <p className="font-bold text-[var(--ink)]">Export Clean Resume PDF</p>
          <p className="text-xs text-[var(--ink-muted)]">
            Single-page, ATS-readable standard layout formatted in vector Helvetica.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={generateResumePdf}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            {pdfUrl ? "Update Resume" : "Generate Resume PDF"}
          </button>

          {pdfUrl && (
            <a
              href={pdfUrl}
              download={`${fullName.toLowerCase().replace(/\s+/g, "_")}_resume.pdf`}
              className="px-6 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download Resume PDF
            </a>
          )}
        </div>
      </div>

      {pdfUrl && (
        <div className="p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] space-y-2">
          <p className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
            Live Document Preview
          </p>
          <iframe
            src={pdfUrl}
            className="w-full h-[650px] rounded-lg border border-[var(--border)] bg-white"
            title="Resume Preview"
          />
        </div>
      )}
    </div>
  );
}
