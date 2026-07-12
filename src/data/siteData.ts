export const profile = {
  name: 'Gabriel Bibbó',
  role: 'ML/DSP Engineer and Audio AI Research Engineer',
  headline: 'ML/DSP Engineer and Audio AI Research Engineer working on machine listening, real-time audio, privacy-preserving audio, and deployable ML systems.',
  heroIntro: 'I build audio machine learning and DSP systems that run outside the notebook, across real-time music analysis, sound event detection, voice activity detection, privacy-preserving audio, and music information retrieval.',
  location: 'Montevideo, Uruguay',
  email: 'gabobibbo@gmail.com',
  availability: 'Currently working hybrid in Montevideo, Uruguay. Italian citizen with European Union work authorization.',
  links: {
    linkedin: 'https://www.linkedin.com/in/gabriel-bibbo/',
    github: 'https://github.com/gbibbo',
    scholar: 'https://scholar.google.com/citations?user=KEwHUaMAAAAJ&hl=es&oi=ao',
    orcid: 'https://orcid.org/0009-0003-2493-7412',
  },
};

export const mainProjects = [
  {
    title: 'Audio-Language Models for Voice Activity Detection',
    year: '2025-2026',
    eyebrow: 'Audio AI · VAD · Model evaluation',
    image: '/homepage_files/Qwen_Overall_BA.png',
    imageFit: 'contain',
    description:
      'This research evaluates how audio-language models detect speech when the audio is short, noisy, reverberant, or filtered. It compares Qwen2-Audio-7B, Qwen2-Audio-7B with LoRA, Qwen3-Omni-30B, and Silero VAD. The best result came from Qwen2-Audio-7B with LoRA and OPRO-Template: 93.3% balanced accuracy on 21,340 degraded clips.',
    tags: ['VAD', 'Qwen', 'LoRA', 'OPRO', 'Silero', 'PyTorch'],
    links: [{ label: 'Code', href: 'https://github.com/gbibbo/qwen-vad-lora' }],
  },
  {
    title: 'ASR Enhancement Platform',
    year: '2026',
    eyebrow: 'Speech enhancement · Backend platform',
    image: '/homepage_files/asr-raspberry.jpg',
    imageFit: 'cover',
    imagePosition: 'center 58%',
    description:
      'An end-to-end MVP for comparing raw transcription with enhance-and-transcribe on pre-recorded audio. The backend persists jobs, audio artifacts, transcripts, and provider payloads, with FastAPI, Celery, PostgreSQL, Redis, MinIO, Docker Compose, metrics, tracing, Grafana, and CI. It is a reproducible engineering prototype, not a production-hardened service.',
    tags: ['ASR', 'FastAPI', 'Celery', 'Docker', 'PostgreSQL', 'Redis'],
    links: [{ label: 'Code', href: 'https://github.com/gbibbo/asr_enhancement' }],
  },
  {
    title: 'Sounds of Home Dataset',
    year: '2024',
    eyebrow: 'Privacy-preserving dataset · Domestic audio',
    image: '/homepage_files/chime_2024_sounds_of_home.png',
    imageFit: 'cover',
    description:
      'Sounds of Home is a residential audio dataset for sound event detection. It contains 1,344 one-hour recordings collected from 8 participants in Belgium, using AudioMoth recorders placed in living rooms and kitchens. Speech was removed before release, and PANNs predictions were provided for the audio frames.',
    tags: ['SED', 'Privacy', 'AudioMoth', 'PANNs', 'Datasets'],
    links: [
      { label: 'Official site', href: 'https://www.cvssp.org/data/ai4s/sounds_of_home/' },
      { label: 'Paper', href: 'http://dx.doi.org/10.21437/chime.2024-11' },
    ],
  },
  {
    title: 'Harmonic EDM Mixing Compatibility',
    year: '2021-2022',
    eyebrow: 'MIR · Harmonic mixing · MSc thesis',
    image: '/homepage_files/icwe_2022_harmonic_mixing.png',
    imageFit: 'contain',
    description:
      'This music analysis system estimates how well two EDM tracks mix harmonically. It analyzes tracks, computes chroma features, converts them into Tonal Interval Vectors, compares harmonic compatibility, and suggests pitch shifts that can improve a mix. The work began as an MSc thesis and later became an ICWE 2022 publication.',
    tags: ['MIR', 'EDM', 'Chroma', 'TIV', 'Essentia', 'librosa'],
    links: [
      { label: 'Code', href: 'https://github.com/gbibbo/harmonic_mix' },
      { label: 'Paper', href: 'http://dx.doi.org/10.1007/978-3-031-09917-5_37' },
    ],
  },
  {
    title: 'Traktor ML',
    year: '2026',
    eyebrow: 'MIR · DJ library organization',
    image: '/homepage_files/traktor_interface.svg',
    imageFit: 'contain',
    imagePosition: 'center center',
    description:
      'Traktor ML turns a local Techno and Tech House library into Traktor-ready playlists. The pipeline extracts MERT embeddings, separates stems with Demucs, reads BPM and key metadata with Essentia, clusters similar tracks, orders them for smoother transitions, and exports M3U playlists. The current V4 run processed 239 tracks and exported 14 playlists.',
    tags: ['MERT', 'Demucs', 'Essentia', 'HDBSCAN', 'UMAP', 'Streamlit'],
    links: [{ label: 'Code', href: 'https://github.com/gbibbo/traktor' }],
  },
];

export const secondaryProjects = [
  {
    title: 'Speech Removal Framework',
    year: '2025',
    image: '/homepage_files/speech_removal_framework.svg',
    imageFit: 'contain',
    description:
      'A framework for removing speech from audio recordings before they are shared or published. The system supports privacy-preserving release workflows while retaining non-speech acoustic information for sound event detection research.',
    tags: ['Speech removal', 'Privacy', 'WASPAA'],
    links: [
      { label: 'Demo', href: 'https://huggingface.co/spaces/gbibbo/vad_demo' },
      { label: 'DOI', href: 'https://zenodo.org/records/17050321' },
    ],
  },
  {
    title: 'ALPACA',
    year: '2026',
    image: '/homepage_files/alpaca-diagram.jpg',
    imageFit: 'contain',
    description:
      'Software engineering prototype for algorithmic trading infrastructure, with market data ingestion, event processing, risk controls, historical simulation, persistence, API access, and monitoring. It has not been tested in production.',
    tags: ['Python', 'Backtesting', 'Monitoring'],
    links: [{ label: 'Code', href: 'https://github.com/gbibbo/alpaca' }],
  },
  {
    title: 'Raspberry Pi Sound Event Recognition Demo',
    year: '2023',
    image: '/homepage_files/waspaa_2023_raspberry_pi_sed.png',
    imageFit: 'contain',
    description:
      'Raspberry Pi demo for real-time sound event recognition. The system runs pre-trained neural networks on a low-cost edge device, exposes a web interface, and can send email notifications when selected AudioSet events are detected.',
    tags: ['Raspberry Pi', 'Edge AI', 'AudioSet'],
    links: [
      { label: 'Code', href: 'https://github.com/gbibbo/pisoundsensing' },
      { label: 'Video', href: 'https://www.youtube.com/watch?v=ZNHtcqECNQQ' },
    ],
  },
  {
    title: '3H-ATO',
    year: '2020-2022',
    image: '/homepage_files/project_3hato.png',
    imageFit: 'cover',
    description: 'Mechanical tool designed during the pandemic to avoid touching shared surfaces directly.',
    tags: ['Product design', 'Prototyping'],
    links: [{ label: 'Video', href: 'https://www.youtube.com/watch?v=aQVo0i5OLWU' }],
  },
  {
    title: 'Automatic IoT Soap Dispenser',
    year: '2020-2021',
    image: '/homepage_files/project_iot_soap_dispenser.png',
    imageFit: 'cover',
    description:
      'IoT handwashing device for industrial environments. The device used stainless steel, WiFi, cloud connectivity, IR/RFID sensors, and a 3-litre tank.',
    tags: ['IoT', 'Sensors', 'Industrial hygiene'],
    links: [],
  },
  {
    title: 'UyVoy Mobile App',
    year: '2020',
    image: '/homepage_files/uyvoy.png',
    imageFit: 'cover',
    description:
      'Mobile app project for booking appointments and reducing crowding during the pandemic. Gabriel worked as product owner and project lead.',
    tags: ['Mobile app', 'Civic tech', 'Project management'],
    links: [],
  },
];

export const publications = [
  {
    year: '2025',
    title: 'Privacy for Audio AI: Risks, Challenges, and Emerging Solutions in the Era of Audio AI [Panel discussion]',
    authors: 'Thomas Deacon; Jennifer Williams; Jason R. C. Nurse; Christopher Hicks; Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley',
    venue: '2025 AES International Conference on Artificial Intelligence and Machine Learning for Audio',
    links: [
      { label: 'Identifier', href: 'https://openresearch.surrey.ac.uk/esploro/outputs/991036566602346' },
      { label: 'AES program', href: 'https://aes2.org/event-extra/2025-aes-international-conference-on-artificial-intelligence-and-machine-learning-for-audio-program/' },
    ],
  },
  {
    year: '2025',
    title: 'Speech Removal Framework for Privacy-preserving Audio Recordings',
    authors: 'Gabriel Bibbó; Arshdeep Singh; Thomas Deacon; Mark D. Plumbley',
    venue: '2025 IEEE Workshop on Applications of Signal Processing to Audio and Acoustics (WASPAA), Tahoe City, CA, October 2025',
    links: [
      { label: 'DOI', href: 'https://zenodo.org/records/17050321' },
      { label: 'Demo', href: 'https://huggingface.co/spaces/gbibbo/vad_demo' },
    ],
  },
  {
    year: '2025',
    title: 'Room Acoustics and Microphone Characteristics Show Systematic Impact on Sound Event Recognition',
    authors: 'Gabriel Bibbó; Craig Cieciura; Mark D. Plumbley',
    venue: 'Proceedings of the 54th International Congress and Exposition on Noise Control Engineering, São Paulo, Brazil, August 2025',
    links: [{ label: 'ISBN', href: 'https://www.even3.com.br/anais/international-congress-exposition-noise-control-engineering/1070751-room-acoustics-and-microphone-characteristics-show-systematic-impact-on-sound-event-recognition/' }],
  },
  {
    year: '2025',
    title: 'Integrating IP broadcasting with audio tags: Workflow and challenges',
    authors: 'Rhys Burchett-Vass; Arshdeep Singh; Gabriel Bibbó; Mark D. Plumbley',
    venue: '2025 AES International Conference on Artificial Intelligence and Machine Learning for Audio',
    links: [
      { label: 'Open research', href: 'https://openresearch.surrey.ac.uk/esploro/outputs/conferencePaper/Integrating-IP-broadcasting-with-audio-tags/991013165302346?institution=44SUR_INST' },
      { label: 'Preprint', href: 'https://arxiv.org/abs/2407.15423' },
    ],
  },
  {
    year: '2025',
    title: "Soundscape Experience Mapping: A Deep Listening Approach for Eliciting Older Adults' Perceptions of Indoor Soundscapes",
    authors: 'Thomas Deacon; Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley',
    venue: 'Forum Acusticum / Euronoise 2025, Málaga, Spain, June 2025',
    links: [{ label: 'Link', href: 'https://openresearch.surrey.ac.uk/esploro/outputs/conferencePresentation/Soundscape-experience-mapping-A-deep-listening/99994066602346?institution=44SUR_INST' }],
  },
  {
    year: '2025',
    title: 'Personalized Live Sound Recognition Using Efficient PANNs [Show and Tell]',
    authors: 'Arshdeep Singh; Gabriel Bibbó; Haohe Liu; Thomas Deacon; Mark D. Plumbley',
    venue: 'IEEE International Conference on Acoustics, Speech, and Signal Processing (ICASSP 2025), Hyderabad, India, April 2025',
    links: [{ label: 'Link', href: 'https://2025.ieeeicassp.org/show-tell-sessions-schedule/#1740032529376-8a1b5645-ce3c' }],
  },
  {
    year: '2024',
    title: 'Environmental sound classification on an embedded hardware platform',
    authors: 'Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley',
    venue: 'INTER-NOISE and NOISE-CON Congress and Conference Proceedings, Nantes, France, August 2024',
    links: [{ label: 'DOI', href: 'http://dx.doi.org/10.3397/in_2024_3723' }],
  },
  {
    year: '2024',
    title: 'The Sounds of Home: A Speech-Removed Residential Audio Dataset for Sound Event Detection',
    authors: 'Gabriel Bibbó; Thomas Deacon; Arshdeep Singh; Mark D. Plumbley',
    venue: '8th International Workshop on Speech Processing in Everyday Environments (CHiME 2024), Kos Island, Greece, September 2024',
    links: [
      { label: 'DOI', href: 'http://dx.doi.org/10.21437/chime.2024-11' },
      { label: 'Dataset site', href: 'https://www.cvssp.org/data/ai4s/sounds_of_home/' },
    ],
  },
  {
    year: '2024',
    title: 'Soundscape Personalisation at Work: Designing AI-Enabled Sound Technologies for the Workplace',
    authors: 'Thomas Deacon; Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley',
    venue: 'International Conference on Sound and Music Computing (SMC 2024), Porto, Portugal, July 2024',
    links: [{ label: 'Paper', href: 'https://smcnetwork.org/smc2024/papers/SMC2024_paper_id117.pdf' }],
  },
  {
    year: '2023',
    title: 'Recognise and Notify Sound Events Using a Raspberry PI Based Standalone Device [Demo]',
    authors: 'Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley',
    venue: 'IEEE Workshop on Applications of Signal Processing to Audio and Acoustics (WASPAA 2023), New York, U.S.A, October 2023',
    links: [
      { label: 'DOI', href: 'http://dx.doi.org/10.5281/zenodo.15465882' },
      { label: 'Video', href: 'https://www.youtube.com/watch?v=ZNHtcqECNQQ' },
    ],
  },
  {
    year: '2022',
    title: 'A New Compatibility Measure for Harmonic EDM Mixing',
    authors: 'Gabriel Bibbó; Ángel Faraldo',
    venue: 'International Conference on Web Engineering (ICWE 2022), Bari, Italy, July 2022',
    links: [{ label: 'DOI', href: 'http://dx.doi.org/10.1007/978-3-031-09917-5_37' }],
  },
  {
    year: '2021',
    title: 'Towards a New Compatibility Measure for Harmonic EDM Mixing',
    authors: 'Gabriel Bibbó',
    venue: 'Master thesis, Universitat Pompeu Fabra, Barcelona, Spain, 2021. Supervisor: Ángel Faraldo.',
    links: [{ label: 'Repository', href: 'https://github.com/MTG/essentia-research/tree/master/harmonic-mixing' }],
  },
  {
    year: '2017',
    title: 'Autonomous Mobile Robots Communicated by Software Defined Radio',
    authors: 'Gabriel Bibbó; Mariana Gelós; Martín Randall',
    venue: 'Bachelor thesis, Universidad de la República, Montevideo, Uruguay, 2017. Supervisors: Pablo Belzarena and Federico Larroca.',
    links: [{ label: 'Publication', href: 'https://iie.fing.edu.uy/publicaciones/2017/BGR17/' }],
  },
];

const edgeLogo = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%2290%22 viewBox=%220 0 240 90%22%3E%3Crect width=%22240%22 height=%2290%22 rx=%2218%22 fill=%22%23121a25%22/%3E%3Ctext x=%22120%22 y=%2257%22 text-anchor=%22middle%22 font-family=%22Arial,sans-serif%22 font-size=%2235%22 font-weight=%22700%22 fill=%22%237dd3fc%22%3EEAL%3C/text%3E%3C/svg%3E';
const tudelftLogo = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%2290%22 viewBox=%220 0 240 90%22%3E%3Crect width=%22240%22 height=%2290%22 rx=%2218%22 fill=%22%2300a6d6%22/%3E%3Ctext x=%22120%22 y=%2257%22 text-anchor=%22middle%22 font-family=%22Arial,sans-serif%22 font-size=%2232%22 font-weight=%22700%22 fill=%22white%22%3ETU Delft%3C/text%3E%3C/svg%3E';

export const experience = [
  {
    period: 'Jun.2026-Present',
    title: 'ML/DSP Engineer',
    org: 'Edge Audio Labs, Montevideo, Uruguay (Hybrid)',
    logo: edgeLogo,
    logoFit: 'contain',
    logoAlt: 'Edge Audio Labs',
    companyUrl: 'https://edgeaudiolabs.com/',
    bullets: [
      'Applied machine learning, digital signal processing, testing, and perceptual evaluation across two confidential audio product lines, without disclosing client or project identities.',
      'Designed and delivered a rendering-side feature that maps score dynamics to model-level timbral expression rather than post-render gain alone, after reverse-engineering the end-to-end audio pipeline and identifying a hidden control-path failure.',
      'Built measurement and listening-test tooling covering approximately 580 renders and a 48-clip blind evaluation, then delivered the feature server-side without retraining the model.',
      'Built a headless C++ evaluation pipeline for real-time note and onset detection, from WAV and MIDI inputs through the production DSP to JSON metrics, regression tests, and adversarial canary cases.',
      'Found and corrected a systematic onset timing offset of approximately 104 ms, improved detector guard logic, and communicated results through technical documentation, pull requests, Jira, and client-facing presentations.',
    ],
  },
  {
    period: 'Feb.2026-Mar.2026',
    title: 'PhD Candidate',
    org: 'TU Delft, Delft, Netherlands',
    logo: tudelftLogo,
    logoFit: 'contain',
    logoAlt: 'TU Delft',
    companyUrl: 'https://www.tudelft.nl/',
    bullets: [
      'Worked on privacy-preserving audio analysis for pediatric intensive care soundscapes within the Auditory Footprints research programme.',
      'Built a reproducible speech versus non-speech dataset and VAD benchmarking workflow for PICU-like audio, with conservative labelling and clip-level provenance.',
    ],
  },
  {
    period: 'Dec.2025-Present',
    title: 'Independent Research Collaboration',
    org: 'University of Surrey collaborators, Remote',
    logo: '/homepage_files/surrey.jpg',
    logoFit: 'contain',
    logoAlt: 'University of Surrey logo',
    companyUrl: 'https://www.surrey.ac.uk/',
    bullets: [
      'Preparing the manuscript “A Psychometric Evaluation of Audio-Language Models for Robust Voice Activity Detection” for Elsevier Computer Speech & Language with Mark D. Plumbley and Simone Spagnol.',
      'Co-authoring work with Arshdeep Singh and Mark D. Plumbley on privacy-preserving audio and machine listening.',
    ],
  },
  {
    period: 'Nov.2022-Nov.2025',
    title: 'Research Engineer in Sound Sensing',
    org: 'University of Surrey, Guildford, UK',
    logo: '/homepage_files/surrey.jpg',
    logoFit: 'contain',
    logoAlt: 'University of Surrey logo',
    companyUrl: 'https://www.surrey.ac.uk/',
    bullets: [
      'Developed end-to-end audio ML systems for real-world smart environments, covering data preparation, model evaluation, prototype deployment, open-source releases, demos, datasets, and technical documentation.',
      'Built privacy-preserving SED pipelines for sensitive in-home recordings, including a 197 GB residential audio dataset, speech-removal workflows, and reproducible evaluation resources.',
      'Built an eight-model VAD benchmark on CHiME-Home and, separately, evaluated audio-language models under controlled duration, noise, reverberation, and spectral degradations.',
      'Deployed real-time CNN inference on Raspberry Pi, including latency, thermal, efficiency, and robustness evaluation for edge sound sensing.',
      'Published and presented research at ICASSP, IEEE WASPAA, CHiME Workshop, Inter-Noise, SMC, UKAI, UKIS, and AES. Supervised undergraduate and master’s projects.',
    ],
  },
  {
    period: 'Mar.2022-Nov.2022',
    title: 'Technical Support Engineer - Google Workspace',
    org: 'Webhelp, Barcelona, Spain',
    logo: '/homepage_files/logo-google.svg',
    logoFit: 'contain',
    logoAlt: 'Google logo',
    companyUrl: 'https://workspace.google.com/',
    bullets: ['Tier 3 support for Google Workspace enterprise customers across APIs, OAuth, SAML/SSO, IAM, user provisioning, data migration, DNS/domain configuration, and security/compliance settings.'],
  },
  {
    period: 'Nov.2021-Mar.2022',
    title: 'IT Auditor',
    org: 'KPMG, Barcelona, Spain',
    logo: '/homepage_files/logo-kpmg.svg',
    logoFit: 'contain',
    logoAlt: 'KPMG logo',
    companyUrl: 'https://kpmg.com/es/es.html',
    bullets: ['Supported telecommunications companies and IT departments in technology audit engagements.'],
  },
  {
    period: 'Aug.2016-Dec.2019',
    title: 'R&D Engineer',
    org: 'Ikatu, Montevideo, Uruguay',
    logo: '/homepage_files/logo-ikatu.svg',
    logoFit: 'contain',
    logoAlt: 'Ikatu logo',
    companyUrl: 'https://www.ikatu.com/',
    bullets: [
      'Designed and shipped embedded C/C++ audio and IoT firmware for Bang & Olufsen home automation products, including low-level drivers, hardware integration, audio I/O, and Internet connectivity.',
      'Worked across requirements, architecture, implementation, testing, validation, and customer-facing documentation.',
      'Trained and onboarded incoming programmers in embedded development practices.',
    ],
  },
  {
    period: 'Apr.2016-Jul.2016',
    title: 'Engineering Intern',
    org: 'Ikatu, Montevideo, Uruguay',
    logo: '/homepage_files/logo-ikatu.svg',
    logoFit: 'contain',
    logoAlt: 'Ikatu logo',
    companyUrl: 'https://www.ikatu.com/',
    bullets: ['Developed and coordinated a complete home automation system project before transitioning into the R&D Engineer role.'],
  },
];

export const education = [
  {
    period: '2020-2021',
    degree: 'MSc Sound and Music Computing',
    institution: 'Universitat Pompeu Fabra, Barcelona, Spain',
    details: 'Master thesis on harmonic compatibility for EDM mixing. Final thesis grade: 9/10.',
  },
  {
    period: '2012-2017',
    degree: 'BSc Electrical Engineering',
    institution: 'Universidad de la República, Montevideo, Uruguay',
    details: 'Bachelor thesis on autonomous mobile robots communicated by software-defined radio.',
  },
];

export const stackGroups = [
  {
    name: 'Stack',
    items: ['Python', 'C/C++', 'PyTorch', 'Hugging Face', 'PEFT', 'TorchAudio', 'librosa', 'Essentia', 'mido', 'scikit-learn', 'pandas', 'NumPy', 'SciPy', 'Flask', 'FastAPI', 'Streamlit', 'Docker', 'Git', 'Linux CLI', 'Bash', 'Slurm', 'Redis', 'Prometheus', 'Grafana', 'PostgreSQL', 'SQLite', 'MATLAB', 'Unreal Engine 5.4', 'FMOD', 'VS Code'],
  },
  {
    name: 'ML',
    items: ['CNNs', 'Transformers', 'Audio-Language Models', 'LoRA Fine-tuning', '4-bit Quantization', 'Supervised and Self-supervised Learning', 'Evaluation Pipelines', 'Statistical Testing', 'Edge Deployment'],
  },
  {
    name: 'Audio',
    items: ['Sound Event Detection', 'Voice Activity Detection', 'Pitch and Onset Detection', 'Music Information Retrieval', 'Digital Signal Processing', 'Real-Time Audio', 'Perceptual Evaluation', 'DAWs', 'Ableton', 'DJing', 'Electronic Music Production'],
  },
  {
    name: 'Practice',
    items: ['Reproducible ML pipelines', 'Automated Audio Testing', 'Dataset Curation', 'Open-Source Development', 'MLOps practices', 'AI-assisted Development', 'Technical Writing', 'Interdisciplinary Collaboration'],
  },
];
