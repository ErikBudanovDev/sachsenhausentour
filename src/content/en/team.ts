export interface TeamMember {
  name: string
  slug: string
  role: string
  credentials: string
  bio: string
  expertise: string[]
  image: string
  linkedin?: string
  languages: string[]
  yearJoined: number
}

export interface CompanyHistory {
  year: string
  event: string
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Miguel Ribeiro',
    slug: 'miguel-ribeiro',
    role: 'Lead Historian & Tour Guide',
    credentials: 'MA in 20th Century European History, Humboldt University of Berlin',
    bio: 'Miguel has been leading tours at Sachsenhausen since 2016. His academic focus on the political structures of the Third Reich gives him a unique ability to contextualise the camp within the broader history of the Nazi regime. Visitors consistently praise his ability to connect historical events to present-day relevance.',
    expertise: ['Holocaust Education', 'Nazi Germany Political History', 'Memorial Pedagogy'],
    image: '/images/gallery/DSCF6098-scaled.jpg',
    linkedin: 'https://linkedin.com/in/miguel-ribeiro-bot',
    languages: ['English', 'Portuguese', 'German'],
    yearJoined: 2016,
  },
  {
    name: 'Georgia Hartmann',
    slug: 'georgia-hartmann',
    role: 'Senior Tour Guide & Educator',
    credentials: 'BA in History & Political Science, Freie Universität Berlin',
    bio: 'Georgia brings a deeply empathetic approach to memorial education. With a background in political science, she helps visitors understand the systemic forces behind the Holocaust — not just the events, but the decisions, propaganda, and social conditions that made them possible.',
    expertise: ['Holocaust Memorial Studies', 'Political Science', 'Educational Outreach'],
    image: '/images/gallery/DSCF5956-min-scaled.jpg',
    linkedin: 'https://linkedin.com/in/georgia-hartmann-bot',
    languages: ['English', 'German'],
    yearJoined: 2018,
  },
  {
    name: 'Lewis Carter',
    slug: 'lewis-carter',
    role: 'Tour Guide & Researcher',
    credentials: 'MA in Holocaust Studies, Royal Holloway, University of London',
    bio: 'Lewis joined the team after completing his master\u2019s thesis on survivor testimony and memory. His tours are known for their sensitivity and narrative depth — weaving individual prisoner stories into the broader historical context of Sachsenhausen.',
    expertise: ['Survivor Testimony', 'Holocaust Memory Studies', 'WWII History'],
    image: '/images/gallery/DSCF5958-min-scaled.jpg',
    linkedin: 'https://linkedin.com/in/lewis-carter-bot',
    languages: ['English', 'Spanish'],
    yearJoined: 2020,
  },
]

export const companyHistory: CompanyHistory[] = [
  { year: '2015', event: 'Be Original Tours founded in Berlin with a focus on historically grounded city tours.' },
  { year: '2016', event: 'Launched the Sachsenhausen Memorial tour — our first dedicated Holocaust education experience.' },
  { year: '2017', event: 'Reached 1,000 guided visitors. Partnered with Gateway Berlin DMC for group logistics.' },
  { year: '2019', event: 'Expanded the guide team to four historians. Introduced Spanish-language tour dates.' },
  { year: '2020', event: 'Adapted operations during COVID-19 with reduced group sizes and safety protocols.' },
  { year: '2022', event: 'Recognised as a recommended cultural experience by Visit Berlin.' },
  { year: '2023', event: 'Surpassed 10,000 guided visitors at Sachsenhausen Memorial.' },
  { year: '2024', event: 'Partnership with Germany Retold for heritage tourism collaboration.' },
  { year: '2025', event: '320+ verified reviews with a 4.8-star average across Google and TripAdvisor.' },
]

export const achievements = [
  { value: '15,000+', label: 'Visitors Guided' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '320+', label: 'Verified Reviews' },
  { value: '10+', label: 'Years in Berlin' },
]
