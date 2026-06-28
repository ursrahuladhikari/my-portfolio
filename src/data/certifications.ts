export interface Certification {
  id: string;
  title: string;
  issuer: string;
  period: string;
  skills: string[];
  link: string;
  logoType: 'oracle' | 'microsoft' | 'google' | 'ibm' | 'mongodb' | 'umich' | 'ucolorado' | 'skillup';
  domain: 'ds-ai' | 'analytics-bi' | 'database-cloud' | 'programming';
}

export const certificationsData: Certification[] = [
  {
    id: 'cert-1',
    title: 'Oracle Cloud Infrastructure Certified Data Science Professional',
    issuer: 'Oracle Learning',
    period: 'Nov 2025 – Nov 2027',
    skills: ['OCI', 'Machine Learning', 'Model Deployment', 'AutoML'],
    link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6DEDAD566435634C9732610078A0BA14BB779CE71FB3B31FF44B09C321E4B35C',
    logoType: 'oracle',
    domain: 'ds-ai'
  },
  {
    id: 'cert-2',
    title: 'Oracle Data Platform Certified Foundations Associate',
    issuer: 'Oracle Learning',
    period: 'Oct 2025 - Oct 2027',
    skills: ['Cloud Data', 'Data Warehousing', 'Oracle Analytics'],
    link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6DEDAD566435634C9732610078A0BA14F19D2E89DFF1FBB03C6F31B765090CC7',
    logoType: 'oracle',
    domain: 'database-cloud'
  },
  {
    id: 'cert-3',
    title: 'Microsoft Power BI Data Analyst Professional Certificate',
    issuer: 'Coursera, Microsoft',
    period: 'Mar 2024 – Oct 2024',
    skills: ['Power BI', 'DAX', 'Data Modeling', 'Power Query'],
    link: 'https://www.coursera.org/account/accomplishments/professional-cert/MPN6DUW07SPF',
    logoType: 'microsoft',
    domain: 'analytics-bi'
  },
  {
    id: 'cert-4',
    title: 'Google Data Analytics Professional Certificate',
    issuer: 'Google (2023)',
    period: 'Sep 2022 – Sep 2023',
    skills: ['SQL', 'Tableau', 'R Programming', 'Data Cleaning'],
    link: 'https://www.credly.com/badges/12d217ef-371f-4aa7-ab5f-b1453dbf0e45/linked_in_profile',
    logoType: 'google',
    domain: 'analytics-bi'
  },
  {
    id: 'cert-5',
    title: 'Generative AI for Business Intelligence (BI) Analysts',
    issuer: 'SkillUp EdTech (2025)',
    period: 'Jan 2025 – Mar 2025',
    skills: ['GenAI', 'Prompt Engineering', 'BI Strategy'],
    link: 'https://www.coursera.org/account/accomplishments/specialization/certificate/5UWTG1BH5HBB',
    logoType: 'skillup',
    domain: 'ds-ai'
  },
  {
    id: 'cert-6',
    title: 'Generative AI for Data Scientists',
    issuer: 'IBM, Coursera (2025)',
    period: 'Sep 2024 – Dec 2024',
    skills: ['LLMs', 'LangChain', 'AI Development'],
    link: 'https://www.coursera.org/account/accomplishments/verify/2ZHC0E3DT17M',
    logoType: 'ibm',
    domain: 'ds-ai'
  },
  {
    id: 'cert-7',
    title: 'Introduction to MongoDB',
    issuer: 'MongoDB, Inc (2025)',
    period: 'Mar 2025 – Apr 2025',
    skills: ['NoSQL', 'Document Databases', 'Aggregation'],
    link: 'https://www.coursera.org/account/accomplishments/verify/64OBEYY4E1BO',
    logoType: 'mongodb',
    domain: 'database-cloud'
  },
  {
    id: 'cert-8',
    title: 'IBM Applied Data Science Certificate',
    issuer: 'IBM (2023)',
    period: 'Aug 2022 – Jan 2023',
    skills: ['Python', 'Data Analysis', 'Scikit-Learn'],
    link: 'https://www.coursera.org/account/accomplishments/verify/KUG9KCFWU5CR',
    logoType: 'ibm',
    domain: 'ds-ai'
  },
  {
    id: 'cert-9',
    title: 'Relational Database & Design Certification',
    issuer: 'University of Colorado Boulder (2024)',
    period: 'Oct 2024 – Dec 2024',
    skills: ['SQL', 'Database Normalization', 'ER Modeling'],
    link: '#',
    logoType: 'ucolorado',
    domain: 'database-cloud'
  },
  {
    id: 'cert-10',
    title: 'Python for Everybody Specialization with Honours',
    issuer: 'University of Michigan (2022)',
    period: 'July 2022 – Mar 2023',
    skills: ['Python', 'Data Structures', 'Web Scraping'],
    link: 'https://www.coursera.org/account/accomplishments/verify/CXEVVGTE2ERM',
    logoType: 'umich',
    domain: 'programming'
  }
];
