import data from '~/data/cv.json'

export interface CvRole {
  title: string
  start: string
  end?: string
  bullets: string[]
}

export interface CvCompany {
  name: string
  monogram: string
  location: string
  roles: CvRole[]
}

export interface CvEducation {
  degree: string
  short: string
  institution: string
  detail?: string
  monogram: string
  start: string
  end: string
}

export interface Cv {
  updated: string
  pdf: string
  headline: string
  careerStart: string
  location: string
  workMode: string
  experience: CvCompany[]
  notablePullRequests: string[]
  skills: { group: string, items: string }[]
  education: CvEducation[]
  papers: { count: number, topic: string, start: string, end: string }
  awards: { title: string, note?: string, years: string }[]
  languages: { name: string, level: string }[]
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatCvMonth(date: string): string {
  const [year, month] = date.split('-')
  return month ? `${months[Number(month) - 1]} ${year}` : year!
}

export function formatCvRange(start: string, end?: string): string {
  if (!end) return `${formatCvMonth(start)} – Present`
  if (start === end) return formatCvMonth(start)
  const [startYear, startMonth] = start.split('-')
  const [endYear, endMonth] = end.split('-')
  if (startMonth && endMonth && startYear === endYear) return `${months[Number(startMonth) - 1]} – ${formatCvMonth(end)}`
  return `${formatCvMonth(start)} – ${formatCvMonth(end)}`
}

function yearsSince(start: string, now: Date): number {
  const [year, month] = start.split('-').map(Number)
  return Math.floor(((now.getFullYear() - year!) * 12 + now.getMonth() + 1 - month!) / 12)
}

export function useCv(): Cv {
  const cv = data as Cv
  const years = useState('cv-years', () => yearsSince(cv.careerStart, new Date()))
  return { ...cv, headline: cv.headline.replace('{years}', String(years.value)) }
}
