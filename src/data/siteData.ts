export const profile = {
  name: 'Gabriel Bibbó',
  role: 'Audio AI Research Engineer',
  headline: 'Audio AI Research Engineer bridging machine listening research, experimental software, and deployable prototypes.',
  heroIntro: 'I research, implement, evaluate, and deploy audio machine learning systems. My work connects sound event detection, voice activity detection, privacy-preserving audio, embedded ML, and music information retrieval.',
  location: 'Montevideo, Uruguay',
  email: 'gabobibbo@gmail.com',
  availability: 'Italian citizen with EU work authorization. Open to remote roles in LATAM/Europe and selected relocation opportunities within the EU.',
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
    eyebrow: 'Audio AI · VAD · Model evaluation',
    image: '/homepage_files/waspaa_2025_vad_demo.png',
    imageFit: 'cover',
    description:
      'I tested how audio-language models detect speech when the audio is short, noisy, reverberant, or filtered. The project compares Qwen2-Audio-7B, Qwen2-Audio-7B with LoRA, Qwen3-Omni-30B, and Silero VAD on the same degraded test bank. The best result came from Qwen2-Audio-7B with LoRA and OPRO-Template: 93.3% balanced accuracy on 21,340 degraded clips.',
    tags: ['VAD', 'Qwen', 'LoRA', 'OPRO', 'Silero', 'PyTorch'],
    links: [{ label: 'Code', href: 'https://github.com/gbibbo/qwen-vad-lora' }],
  },
  {
    title: 'ASR Enhancement Platform',
    eyebrow: 'Speech enhancement · Backend platform',
    image: '/homepage_files/asr-raspberry.jpg',
    imageFit: 'cover',
    description:
      'I built a backend platform to compare two ASR paths on the same audio: raw transcription and enhance-and-transcribe. The system stores jobs, audio files, transcripts, and provider payloads so each result can be inspected later. It uses FastAPI, Celery, PostgreSQL, Redis, MinIO, Docker Compose, metrics, tracing, Grafana, and CI.',
    tags: ['ASR', 'FastAPI', 'Celery', 'Docker', 'PostgreSQL', 'Redis'],
    links: [{ label: 'Code', href: 'https://github.com/gbibbo/asr_enhancement' }],
  },
  {
    title: 'Sounds of Home Dataset',
    eyebrow: 'Privacy-preserving dataset · Domestic audio',
    image: '/homepage_files/chime_2024_sounds_of_home.png',
    imageFit: 'cover',
    description:
      'I worked on Sounds of Home, a residential audio dataset for sound event detection. The dataset contains 1,344 one-hour recordings from 8 homes in Belgium. AudioMoth recorders were placed in living rooms and kitchens. Speech was removed before release, and PANNs predictions were provided for the audio frames.',
    tags: ['SED', 'Privacy', 'AudioMoth', 'PANNs', 'Datasets'],
    links: [{ label: 'Paper', href: 'http://dx.doi.org/10.21437/chime.2024-11' }],
  },
  {
    title: 'Harmonic EDM Mixing Compatibility',
    eyebrow: 'MIR · Harmonic mixing · MSc thesis',
    image: '/homepage_files/icwe_2022_harmonic_mixing.png',
    imageFit: 'contain',
    description:
      'I built a music analysis system for estimating how well two EDM tracks mix harmonically. The system analyzes tracks, computes chroma features, converts them into Tonal Interval Vectors, compares harmonic compatibility, and suggests pitch shifts that can improve a mix. This was my MSc thesis work and later became an ICWE 2022 publication.',
    tags: ['MIR', 'EDM', 'Chroma', 'TIV', 'Essentia', 'librosa'],
    links: [
      { label: 'Code', href: 'https://github.com/gbibbo/harmonic_mix' },
      { label: 'Paper', href: 'http://dx.doi.org/10.1007/978-3-031-09917-5_37' },
    ],
  },
  {
    title: 'Traktor ML',
    eyebrow: 'MIR · DJ library organization',
    image: 'https://raw.githubusercontent.com/gbibbo/traktor/main/interface.png',
    imageFit: 'contain',
    description:
      'I built a pipeline that turns a local Techno and Tech House library into Traktor-ready playlists. The system extracts MERT embeddings, separates stems with Demucs, reads BPM and key metadata with Essentia, clusters similar tracks, orders them for smoother transitions, and exports M3U playlists. The current V4 run processed 239 tracks and exported 14 playlists. The private audio collection is not included in the repo.',
    tags: ['MERT', 'Demucs', 'Essentia', 'HDBSCAN', 'UMAP', 'Streamlit'],
    links: [{ label: 'Code', href: 'https://github.com/gbibbo/traktor' }],
  },
];

export const secondaryProjects = [
  {
    title: 'Speech Removal Framework',
    image: '/homepage_files/waspaa_2025_vad_demo.png',
    imageFit: 'cover',
    description:
      'Framework for removing speech from audio recordings before they are shared or published. It belongs to the privacy-preserving audio line of work and is linked to the WASPAA 2025 demo/publication.',
    tags: ['Speech removal', 'Privacy', 'WASPAA'],
    links: [
      { label: 'Demo', href: 'https://huggingface.co/spaces/gbibbo/vad_demo' },
      { label: 'DOI', href: 'https://zenodo.org/records/17050321' },
    ],
  },
  {
    title: 'ALPACA',
    image: '/homepage_files/alpaca-diagram.jpg',
    imageFit: 'contain',
    description:
      'Python-based algorithmic trading platform with market data ingestion, risk controls, backtesting, and real-time monitoring. Kept as a secondary project because it shows backend and system design outside Audio AI.',
    tags: ['Python', 'Backtesting', 'Monitoring'],
    links: [{ label: 'Code', href: 'https://github.com/gbibbo/alpaca' }],
  },
  {
    title: 'Raspberry Pi Sound Event Recognition Demo',
    image: '/homepage_files/waspaa_2023_raspberry_pi_sed.png',
    imageFit: 'cover',
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
    image: '/homepage_files/project_3hato.png',
    imageFit: 'cover',
    description:
      'Mechanical tool designed during the pandemic to avoid touching shared surfaces directly. It is a physical prototyping project, not an AI project.',
    tags: ['Product design', 'Prototyping'],
    links: [{ label: 'Video', href: 'https://www.youtube.com/watch?v=aQVo0i5OLWU' }],
  },
  {
    title: 'Automatic IoT Soap Dispenser',
    image: '/homepage_files/project_iot_soap_dispenser.png',
    imageFit: 'cover',
    description:
      'IoT handwashing device for industrial environments. The device used stainless steel, WiFi, cloud connectivity, IR/RFID sensors, and a 3-litre tank.',
    tags: ['IoT', 'Sensors', 'Industrial hygiene'],
    links: [],
  },
  {
    title: 'UyVoy Mobile App',
    image: '/homepage_files/uyvoy.png',
    imageFit: 'cover',
    description:
      'Mobile app project for booking appointments and reducing crowding during the pandemic. My role is shown as Project Manager.',
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
    authors: 'Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley',
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
    authors: 'Arshdeep Singh; Gabriel Bibbó; Thomas Deacon; Haohe Liu; Mark D. Plumbley',
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
    links: [{ label: 'DOI', href: 'http://dx.doi.org/10.21437/chime.2024-11' }],
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
    authors: 'Gabriel Bibbó Frau; Ángel Faraldo',
    venue: 'International Conference on Web Engineering (ICWE 2022), Springer, Bari, Italy, July 2022',
    links: [{ label: 'DOI', href: 'http://dx.doi.org/10.1007/978-3-031-09917-5_37' }],
  },
  {
    year: '2021',
    title: 'Towards a New Compatibility Measure for Harmonic EDM Mixing',
    authors: 'Gabriel Bibbó; Angel Faraldo',
    venue: 'Dissertation or Thesis, Universitat Pompeu Fabra, October 2021',
    links: [{ label: 'DOI', href: 'http://dx.doi.org/10.5281/zenodo.5554688' }],
  },
  {
    year: '2017',
    title: 'Autonomous Mobile Robots Comunicated by Software Defined Radio',
    authors: 'Gabriel Bibbó; Mariana Gelós; Martín Randall; Pablo Belzarena; Federico Larroca',
    venue: 'Dissertation or Thesis, Universidad de la República, December 2017',
    links: [{ label: 'Link', href: 'https://iie.fing.edu.uy/publicaciones/2017/BGR17/' }],
  },
];

export const experience = [
  {
    period: 'Dec.2025-Present',
    title: 'Visiting Researcher (collaboration)',
    org: 'University of Surrey, Remote',
    logo: '/homepage_files/surrey.jpg',
    logoFit: 'contain',
    logoAlt: 'University of Surrey logo',
    bullets: [
      'Preparing IEEE/ACM TASLP article with Mark D. Plumbley and Simone Spagnol (Università Iuav di Venezia) on VAD with Qwen-Audio family under psychoacoustic degradations, using PEFT/LoRA, OPRO prompt optimization, 4-bit NF4 quantization, evaluation against frozen Qwen3-Omni baseline.',
      'Co-authoring IEEE Signal Processing Magazine article with Arshdeep Singh (King’s College London) on privacy-preserving audio and machine listening.',
    ],
  },
  {
    period: 'Nov.2022-Nov.2025',
    title: 'Research Engineer in Sound Sensing',
    org: 'University of Surrey, Guildford, UK',
    logo: '/homepage_files/surrey.jpg',
    logoFit: 'contain',
    logoAlt: 'University of Surrey logo',
    bullets: [
      'Developed end-to-end audio ML systems for real-world smart environments, covering data preparation, model evaluation, prototype deployment, open-source releases, demos, datasets and technical documentation for assisted living, smart buildings and urban sound monitoring.',
      'Built privacy-preserving SED pipelines for sensitive in-home recordings, including a 197 GB residential audio dataset, speech-removal workflows and reproducible evaluation resources.',
      'Designed Slurm-based VAD pipelines benchmarking 8 models under controlled acoustic degradations, with robustness analysis and statistical comparison across model families.',
      'Deployed real-time CNN inference on Raspberry Pi, including quantization, thermal profiling, power-aware evaluation and edge sound-sensing documentation.',
      'Published and presented research at IEEE WASPAA, CHiME Workshop, ICWE, Inter-Noise, SMC, UKAI, UKIS and AES. Supervised undergraduate and master’s projects.',
    ],
  },
  {
    period: 'Mar.2022-Nov.2022',
    title: 'Technical Support Engineer - Google Workspace',
    org: 'Webhelp, Barcelona, Spain',
    logo: '/homepage_files/logo-webhelp.svg',
    logoFit: 'contain',
    logoAlt: 'Webhelp logo',
    bullets: ['Tier 3 support for Google Workspace enterprise customers across APIs, OAuth, SAML/SSO, IAM, user provisioning, data migration, DNS/domain configuration, and security/compliance settings.'],
  },
  {
    period: 'Nov.2021-Mar.2022',
    title: 'IT Auditor',
    org: 'KPMG, Barcelona, Spain',
    logo: '/homepage_files/logo-kpmg.svg',
    logoFit: 'contain',
    logoAlt: 'KPMG logo',
    bullets: ['Support to telecommunications companies and IT departments in audit services.'],
  },
  {
    period: 'Apr.2016-Dec.2019',
    title: 'R&D Engineer',
    org: 'Ikatu, Montevideo, Uruguay',
    logo: '/homepage_files/logo-ikatu.svg',
    logoFit: 'contain',
    logoAlt: 'Ikatu logo',
    bullets: [
      'Designed and shipped embedded C/C++ audio and IoT firmware for Bang & Olufsen home automation products: low-level drivers, hardware integration, audio I/O, and Internet connectivity.',
      'Owned product lifecycle work across requirements, architecture, implementation, testing, validation, and customer-facing documentation.',
      'Trained and onboarded incoming programmers on embedded development practices.',
    ],
  },
];

export const stackGroups = [
  {
    name: 'Stack',
    items: ['Python', 'C/C++', 'PyTorch', 'Hugging Face', 'PEFT', 'TorchAudio', 'librosa', 'Essentia', 'scikit-learn', 'pandas', 'NumPy', 'SciPy', 'Flask', 'Streamlit', 'Hugging Face Spaces', 'Docker', 'Git', 'Linux CLI', 'Bash', 'Slurm', 'Redis Streams', 'Prometheus', 'Grafana', 'SQLite', 'MATLAB', 'Claude Code / VS Code'],
  },
  {
    name: 'ML',
    items: ['CNNs', 'Transformers', 'Audio-Language Models', 'LoRA Fine-tuning', '4-bit Quantization', 'Supervised and Self-supervised Learning', 'Evaluation Pipelines', 'Statistical Testing', 'Edge Deployment'],
  },
  {
    name: 'Audio',
    items: ['Sound Event Detection', 'Voice Activity Detection', 'Music Information Retrieval', 'Digital Signal Processing', 'Real-Time Audio', 'DAWs', 'Ableton', 'DJing', 'Electronic Music Production'],
  },
  {
    name: 'Practice',
    items: ['Reproducible ML pipelines', 'Dataset Curation', 'Open-Source Development', 'MLOps practices', 'AI-assisted Development', 'Technical Writing', 'Interdisciplinary Collaboration'],
  },
];
