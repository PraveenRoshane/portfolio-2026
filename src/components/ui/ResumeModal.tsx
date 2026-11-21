import React, { useEffect } from 'react';
import { X, Printer, Download, Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import {
  PERSONAL_INFO,
  ABOUT_DATA,
  EXPERIENCE_DATA,
  SKILLS_DATA,
  PROJECTS_DATA,
  PUBLICATION_DATA,
  EDUCATION_DATA,
  CERTIFICATIONS_DATA,
} from '@/src/data/portfolio';
import { useFocusTrap } from '@/src/lib/useFocusTrap';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadTxt = () => {
    const resumeText = `${PERSONAL_INFO.fullName}
${PERSONAL_INFO.role}
Location: ${PERSONAL_INFO.location} | Email: ${PERSONAL_INFO.email} | Phone: ${PERSONAL_INFO.phone}
GitHub: ${PERSONAL_INFO.social.github} | LinkedIn: ${PERSONAL_INFO.social.linkedin}

================================================================================
PROFESSIONAL SUMMARY
================================================================================
${ABOUT_DATA.biography.join('\n\n')}

Key Metrics:
- 5+ Years Professional Experience
- 40% Report Generation Improvement (MS SQL & Oracle Optimization)
- 80% File Upload / Reading Performance Improvement (.NET Core)
- 12-13 Years Legacy .NET Framework Enterprise Applications Modernized

================================================================================
PROFESSIONAL EXPERIENCE
================================================================================
${EXPERIENCE_DATA.map(
  (exp) => `${exp.role} — ${exp.company} (${exp.location}) | ${exp.period}
${exp.achievements.map((a) => `• ${a.description}`).join('\n')}`
).join('\n\n')}

================================================================================
TECHNICAL SKILLS
================================================================================
• Frontend: React.js, Angular, Next.js, .NET Web Forms
• Backend: C#, .NET Core, .NET Framework, Node.js, Express.js
• Databases: MS SQL Server, Oracle DB, PostgreSQL, MySQL, MongoDB
• Cloud & DevOps: Microsoft Azure, AWS
• UI / Styling: Tailwind CSS, shadcn/ui, Material UI, Bootstrap
• Tools & Practices: Redux, RESTful APIs, Git, IAM, Agile/Scrum

================================================================================
SELECTED PROJECTS
================================================================================
${PROJECTS_DATA.map(
  (p) => `${p.title} (${p.liveUrl})
${p.description}
Highlights: ${p.highlights.join(', ')}`
).join('\n\n')}

================================================================================
PUBLICATION & RESEARCH
================================================================================
${PUBLICATION_DATA.title}
Published in: ${PUBLICATION_DATA.journal} (${PUBLICATION_DATA.date})
Official URL: ${PUBLICATION_DATA.url}

================================================================================
EDUCATION
================================================================================
${EDUCATION_DATA.degree} — ${EDUCATION_DATA.institution} (${EDUCATION_DATA.abbreviation})
Period: ${EDUCATION_DATA.period} | GPA: ${EDUCATION_DATA.gpa}

================================================================================
CERTIFICATIONS
================================================================================
${CERTIFICATIONS_DATA.map((c) => `• ${c.title} — ${c.issuer}`).join('\n')}
`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Praveen_De_Silva_Senior_Software_Engineer_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const groupedSkills = {
    Frontend: SKILLS_DATA.filter((s) => s.category === 'Frontend').map((s) => s.name),
    Backend: SKILLS_DATA.filter((s) => s.category === 'Backend').map((s) => s.name),
    Databases: SKILLS_DATA.filter((s) => s.category === 'Databases').map((s) => s.name),
    'Cloud & DevOps': SKILLS_DATA.filter((s) => s.category === 'Cloud & DevOps').map((s) => s.name),
    'UI / Styling': SKILLS_DATA.filter((s) => s.category === 'UI / Styling').map((s) => s.name),
    'Tools & Practices': SKILLS_DATA.filter((s) => s.category === 'Tools & Practices').map(
      (s) => s.name
    ),
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0B0B10] border border-slate-300 dark:border-white/15 shadow-2xl p-6 sm:p-10 text-slate-800 dark:text-zinc-200 focus:outline-none"
      >
        {/* Top Action Bar */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0B0B10]/95 backdrop-blur-sm">
          <div>
            <span className="text-xs font-mono-tech text-cyan-700 dark:text-cyan-400">
              Executive Curriculum Vitae
            </span>
            <h2
              id="resume-modal-title"
              className="font-display text-lg font-bold text-slate-950 dark:text-white"
            >
              {PERSONAL_INFO.fullName}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 border border-slate-300 text-xs font-medium text-slate-800 hover:border-cyan-700 hover:text-cyan-800 dark:bg-[#14141D] dark:border-white/15 dark:text-zinc-200 dark:hover:border-cyan-400/50 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              data-autofocus="true"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-400 dark:text-[#050507] dark:hover:bg-cyan-300 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0B0B10] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV (.txt)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume modal"
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-950 hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Content Body */}
        <div className="space-y-8 text-sm">
          {/* Header Info */}
          <div className="pb-6 border-b border-slate-200 dark:border-white/10">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mb-1">
              {PERSONAL_INFO.fullName}
            </h3>
            <p className="text-cyan-700 dark:text-cyan-400 font-medium mb-4">
              {PERSONAL_INFO.role}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-zinc-400 font-mono-tech">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                {PERSONAL_INFO.location}
              </span>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="inline-flex items-center gap-1.5 hover:text-cyan-700 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                {PERSONAL_INFO.email}
              </a>
              <a
                href={`tel:${PERSONAL_INFO.phone}`}
                className="inline-flex items-center gap-1.5 hover:text-cyan-700 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                {PERSONAL_INFO.phone}
              </a>
              <a
                href={PERSONAL_INFO.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cyan-700 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                GitHub
              </a>
              <a
                href={PERSONAL_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cyan-700 dark:hover:text-cyan-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Profile Summary */}
          <div>
            <h4 className="font-mono-tech text-xs text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2">
              01. Professional Profile
            </h4>
            <p className="text-slate-700 dark:text-zinc-300 leading-relaxed">
              {ABOUT_DATA.biography.join(' ')}
            </p>
          </div>

          {/* Experience */}
          <div>
            <h4 className="font-mono-tech text-xs text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-3">
              02. Work Experience
            </h4>
            {EXPERIENCE_DATA.map((exp) => (
              <div key={exp.company} className="space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-950 dark:text-white text-base">
                      {exp.role}
                    </span>
                    <span className="text-slate-400 dark:text-zinc-500 mx-2">·</span>
                    <span className="text-slate-700 dark:text-zinc-300">{exp.company}</span>
                  </div>
                  <div className="font-mono-tech text-xs text-slate-600 dark:text-zinc-400">
                    {exp.location} · {exp.period}
                  </div>
                </div>
                <ul className="space-y-2 text-slate-700 dark:text-zinc-300">
                  {exp.achievements.map((ach) => (
                    <li key={ach.id} className="flex items-start gap-2.5">
                      <span className="text-cyan-700 dark:text-cyan-400 font-bold">·</span>
                      <span>{ach.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <div>
            <h4 className="font-mono-tech text-xs text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-3">
              03. Technical Stack
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(groupedSkills).map(([cat, list]) => (
                <div
                  key={cat}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5"
                >
                  <div className="text-xs font-semibold text-slate-900 dark:text-zinc-200 mb-1">
                    {cat}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-zinc-400 font-mono-tech">
                    {list.join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h4 className="font-mono-tech text-xs text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-3">
              04. Featured Engineering Projects
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PROJECTS_DATA.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-950 dark:text-white">
                      {proj.title}
                    </span>
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:focus-visible:ring-cyan-400"
                    >
                      Live ↗
                    </a>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Publication, Education, Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-white/10">
            <div>
              <h4 className="font-mono-tech text-xs text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2">
                05. Education
              </h4>
              <div className="font-semibold text-slate-950 dark:text-white">
                {EDUCATION_DATA.degree}
              </div>
              <div className="text-xs text-slate-700 dark:text-zinc-300 mt-0.5">
                {EDUCATION_DATA.institution} ({EDUCATION_DATA.abbreviation})
              </div>
              <div className="text-xs font-mono-tech text-slate-600 dark:text-zinc-400 mt-1">
                {EDUCATION_DATA.period} · GPA: {EDUCATION_DATA.gpa}
              </div>
            </div>

            <div>
              <h4 className="font-mono-tech text-xs text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2">
                06. Research Publication
              </h4>
              <div className="font-semibold text-slate-950 dark:text-white text-xs">
                {PUBLICATION_DATA.title}
              </div>
              <div className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
                {PUBLICATION_DATA.journal} · {PUBLICATION_DATA.date}
              </div>
              <a
                href={PUBLICATION_DATA.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1.5 text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
              >
                <span>View Official IRJIET Publication</span>
                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
              </a>
            </div>

            <div>
              <h4 className="font-mono-tech text-xs text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2">
                07. Certifications
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300">
                {CERTIFICATIONS_DATA.map((cert) => (
                  <li key={cert.id}>
                    <span className="text-slate-950 dark:text-white font-medium">
                      {cert.title}
                    </span>{' '}
                    — <span className="text-slate-600 dark:text-zinc-400">{cert.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
