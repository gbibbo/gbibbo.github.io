import profileJson from './profile.json';
import experienceJson from './experience.json';
import publicationsJson from './publications.json';
import projectsJson from './projects.json';
import educationJson from './education.json';
import coursesJson from './courses.json';
import skillsJson from './skills.json';

export const profile = profileJson;
export const experienceData = experienceJson;
export const publicationsData = publicationsJson;
export const projectsData = [...projectsJson].sort((a, b) => b.sortYear - a.sortYear || a.title.localeCompare(b.title));
export const educationData = educationJson;
export const coursesData = coursesJson;
export const stackGroups = skillsJson;

export const featuredProjects = projectsData.filter((item) => item.featured);
export const otherProjects = projectsData.filter((item) => !item.featured);
export const featuredPublications = publicationsData.filter((item) => item.featured);
export const otherPublications = publicationsData.filter((item) => !item.featured);

const formatLinks = (links: Array<{ label: string; href: string }>) =>
  links.length ? ` Links: ${links.map((link) => `${link.label}: ${link.href}`).join(' ; ')}` : '';

export const profileAssistantKnowledge = String.raw`
# Gabriel Bibbó public professional profile

## Operating rules
Use only the professional information in this knowledge base as factual evidence. Do not invent unsupported personal facts. You may combine several supported facts to explain professional relevance, fit, strengths, implications, or the reasoning behind an earlier answer. Make clear when something is a reasonable synthesis rather than an explicitly stated biographical fact. Say that information is unavailable only when the user asks for a factual detail that truly is not present and cannot responsibly be derived from the supplied professional evidence.

Maintain conversation context across turns. Short reactions or follow-ups such as "Why?", "How so?", "Strange", "¿Por qué?" or "Qué raro" refer to the preceding exchange unless the user clearly changes topic.

Do not provide Gabriel's age, street address, private phone number, salary, medical information, family information, or other private details. Do not speculate about reasons for job transitions. Use Gabriel Bibbó as the canonical spelling of the name.

## Positioning
${profile.name} is an ${profile.role} based in ${profile.location}. ${profile.headline}

Professional availability: ${profile.availability}
Italian citizen with European Union work authorization.

## Contact
Email: ${profile.email}
Web: ${profile.links.web}
LinkedIn: ${profile.links.linkedin}
GitHub: ${profile.links.github}
Google Scholar: ${profile.links.scholar}
ORCID: ${profile.links.orcid}

## Education and training
${educationData.map((item) => `${item.dates} - ${item.degree}, ${item.institution}, ${item.location}${item.credits ? ` (${item.credits})` : ''}. ${item.focus}.${item.details ? ` ${item.details}` : ''}`).join('\n\n')}

## Employment and research experience
${experienceData.map((item) => `### ${item.dates} - ${item.role}, ${item.org}, ${item.location}${item.mode ? ` (${item.mode})` : ''}\n${item.summary}\n${item.bullets.map((bullet) => `- ${bullet}`).join('\n')}\nOrganisation: ${item.orgUrl}`).join('\n\n')}

## Projects
${projectsData.map((item) => `### ${item.title} - ${item.years}\nCategory: ${item.category}\n${item.description}\nTags: ${item.tags.join('; ')}.${formatLinks(item.links)}`).join('\n\n')}

## Publications and research outputs
${publicationsData.map((item) => `${item.year} - ${item.title}. Authors: ${item.authors.join('; ')}. Venue: ${item.venue}.${formatLinks(item.links)}`).join('\n\n')}

## Courses and certifications
${coursesData.map((item) => `${item.year} - ${item.title}${item.provider ? `, ${item.provider}` : ''}${item.status ? `. ${item.status}` : ''}${item.details ? `. ${item.details}` : ''}`).join('\n')}

## Technical stack
${stackGroups.map((group) => `${group.name}: ${group.items.join('; ')}.`).join('\n\n')}

## Languages, memberships, and funded research
Languages: ${profile.languages.map((item) => `${item.nameEn} - ${item.levelEn}`).join('; ')}.
Memberships: ${profile.memberships.map((item) => `${item.name} (${item.period})`).join('; ')}.
Funded research: ${profile.fundedResearch.map((item) => `${item.name}, ${item.context}`).join('; ')}.
`;
