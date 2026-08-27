import {
  educationData,
  experienceData,
  profile as canonicalProfile,
  projectsData,
  publicationsData,
  stackGroups,
} from './profileData';

export const profile = {
  ...canonicalProfile,
  heroIntro: canonicalProfile.summary,
};

const legacyProject = (project: (typeof projectsData)[number]) => ({
  title: project.title,
  year: project.years,
  eyebrow: project.category,
  image: project.image,
  imageFit: project.imageFit,
  description: project.description,
  tags: project.tags,
  links: project.links,
});

export const mainProjects = projectsData.filter((item) => item.featured).map(legacyProject);
export const secondaryProjects = projectsData.filter((item) => !item.featured).map(legacyProject);

export const publications = publicationsData.map((item) => ({
  year: item.year,
  title: item.title,
  authors: item.authors.join('; '),
  venue: item.venue,
  links: item.links,
}));

const logoFor = (org: string) => {
  if (org === 'Edge Audio Labs') return '/homepage_files/edge-audio-labs.svg';
  if (org === 'University of Surrey') return '/homepage_files/surrey.jpg';
  if (org === 'KPMG') return '/homepage_files/logo-kpmg.svg';
  if (org === 'Ikatu') return '/homepage_files/logo-ikatu.svg';
  return '/homepage_files/logo-webhelp.svg';
};

export const experience = experienceData.map((item) => ({
  period: item.dates,
  title: item.role,
  org: `${item.org}, ${item.location}${item.mode === 'Hybrid' ? ' (Hybrid)' : ''}`,
  logo: logoFor(item.org),
  logoFit: 'contain',
  logoAlt: `${item.org} logo`,
  companyUrl: item.orgUrl,
  bullets: item.bullets,
}));

export const education = educationData
  .filter((item) => item.degree !== 'Formal musical training')
  .map((item) => ({
    period: item.dates,
    degree: item.degree,
    institution: `${item.institution}, ${item.location}`,
    details: [item.credits, item.focus, item.details].filter(Boolean).join('. '),
  }));

export { stackGroups };
