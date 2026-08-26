import { educationData, experienceData, profile, projectsData, publicationsData, stackGroups } from './profileData';

const normalize = (text: string) => text
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const hasAny = (text: string, terms: string[]) => terms.some((term) => text.includes(term));

export function offlineProfileAnswer(question: string, lang: 'en' | 'es'): string | null {
  const q = normalize(question);
  const es = lang === 'es';

  if (hasAny(q, ['where can', 'work authorization', 'modality', 'remote', 'hybrid', 'modalidad', 'donde puede trabajar', 'autorizacion laboral', 'disponibilidad'])) {
    return es ? profile.availabilityEs : profile.availability;
  }

  if (hasAny(q, ['embedded', 'raspberry', 'iot', 'edge device', 'sistemas embebidos', 'embebido'])) {
    const raspberry = projectsData.find((item) => item.title === 'Raspberry Pi Sound Event Recognition Demo');
    const soap = projectsData.find((item) => item.title === 'Automatic IoT Soap Dispenser');
    return es
      ? `Gabriel tiene experiencia en sistemas embebidos y edge audio. En University of Surrey desplegó inferencia CNN en tiempo real sobre Raspberry Pi para sound sensing. También desarrolló ${raspberry?.titleEs ?? 'una demo de reconocimiento de eventos sonoros en Raspberry Pi'} y ${soap?.titleEs ?? 'un dispensador IoT'}, además de trabajar con C/C++, DSP en tiempo real y hardware de bajo costo.`
      : `Gabriel has embedded and edge-audio experience. At the University of Surrey he deployed real-time CNN inference on Raspberry Pi for sound sensing. He also built the ${raspberry?.title ?? 'Raspberry Pi sound-event demo'} and the ${soap?.title ?? 'IoT soap dispenser'}, alongside C/C++, real-time DSP, and low-cost hardware work.`;
  }

  if (hasAny(q, ['privacy', 'speech removal', 'privacidad', 'eliminacion de habla'])) {
    const privacyTitles = publicationsData
      .filter((item) => /privacy|speech removal|sounds of home/i.test(`${item.title} ${item.venue}`))
      .slice(0, 4)
      .map((item) => item.title);
    return es
      ? `Las publicaciones y trabajos más directamente relacionados con privacidad en audio son: ${privacyTitles.join('; ')}.`
      : `The publications and works most directly related to audio privacy are: ${privacyTitles.join('; ')}.`;
  }

  if (hasAny(q, ['current role', 'currently work', 'trabaja actualmente', 'puesto actual', 'edge audio labs'])) {
    const current = experienceData.find((item) => item.org === 'Edge Audio Labs');
    if (current) {
      return es
        ? `Actualmente Gabriel trabaja como ${current.role} en ${current.org}, ${current.location}${current.mode ? ` (${current.mode})` : ''}.`
        : `Gabriel currently works as ${current.role} at ${current.org}, ${current.location}${current.mode ? ` (${current.mode})` : ''}.`;
    }
  }

  if (hasAny(q, ['education', 'degree', 'msc', 'bsc', 'universidad', 'educacion', 'estudios', 'formacion'])) {
    const degrees = educationData.map((item) => `${item.degree}, ${item.institution}`).join('; ');
    return es ? `Formación principal: ${degrees}.` : `Main education: ${degrees}.`;
  }

  if (hasAny(q, ['skills', 'technical stack', 'stack', 'technology', 'tecnologias', 'habilidades'])) {
    const summary = stackGroups.map((group) => `${group.name}: ${group.items.slice(0, 8).join(', ')}`).join('; ');
    return es ? `Stack técnico: ${summary}.` : `Technical stack: ${summary}.`;
  }

  if (hasAny(q, ['projects', 'project', 'proyectos', 'proyecto'])) {
    const names = projectsData.slice(0, 6).map((item) => es ? item.titleEs : item.title).join('; ');
    return es ? `Proyectos recientes y representativos: ${names}.` : `Recent and representative projects: ${names}.`;
  }

  if (hasAny(q, ['publication', 'paper', 'papers', 'publicacion', 'publicaciones', 'articulo'])) {
    const names = publicationsData.slice(0, 6).map((item) => item.title).join('; ');
    return es ? `Publicaciones recientes: ${names}.` : `Recent publications: ${names}.`;
  }

  if (hasAny(q, ['contact', 'email', 'correo', 'contacto'])) {
    return es ? `Contacto profesional: ${profile.email}.` : `Professional contact: ${profile.email}.`;
  }

  return null;
}
