import data from '~/data/cv.json'

export interface CvRole {
  title: string
  /** "YYYY-MM"; no end means the current role */
  start: string
  end?: string
  bullets?: string[]
  summary?: string
}

export interface CvCompany {
  name: string
  url?: string
  /** Letters in the company's circle */
  monogram: string
  location: string
  roles: CvRole[]
}

export interface CvEducation {
  degree: string
  /** Named in the collapsed "3 more: …" line */
  short: string
  institution: string
  detail?: string
  monogram: string
  start: string
  end: string
}

export interface Cv {
  updated: string
  /** File name of the PDF that scripts/cv-pdf.mjs writes next to the site */
  pdf: string
  headline: string
  location: string
  workMode: string
  experience: CvCompany[]
  /** "owner/repo#number"; shown only while the pull request is in /api/contributions */
  notablePullRequests: string[]
  skills: { group: string, items: string }[]
  education: CvEducation[]
  papers: { count: number, topic: string, start: string, end: string }
  awards: { title: string, note?: string, years: string }[]
  languages: { name: string, level: string }[]
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function label(date: string): string {
  const [year, month] = date.split('-')
  return month ? `${months[Number(month) - 1]} ${year}` : year!
}

// "2022-01".."2026-05" → "Jan 2022 – May 2026"; one year is written once: "Feb – Apr 2020"
export function formatCvRange(start: string, end?: string): string {
  if (!end) return `${label(start)} – now`
  if (start === end) return label(start)
  const [startYear, startMonth] = start.split('-')
  const [endYear, endMonth] = end.split('-')
  if (startMonth && endMonth && startYear === endYear) return `${months[Number(startMonth) - 1]} – ${label(end)}`
  return `${label(start)} – ${label(end)}`
}

// "fix(web): let the lists scroll" → "Let the lists scroll"; "SOLR-6853: Add…" stays
export function plainPullRequestTitle(title: string): string {
  const stripped = title.replace(/^[a-z]+(\([^)]*\))?!?:\s*/, '')
  return stripped.charAt(0).toUpperCase() + stripped.slice(1)
}

export function useCv(): Cv {
  return data as Cv
}
