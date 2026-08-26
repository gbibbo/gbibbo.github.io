export const profileAssistantKnowledge = String.raw`
# Gabriel Bibbó public professional profile

## Operating rules
Answer only from the professional information in this knowledge base. Do not invent or infer unsupported personal facts. If a question is not supported, say that the public professional profile does not provide enough information.

Do not provide Gabriel's age, street address, private phone number, salary, medical information, family information, or other private details. Do not speculate about reasons for job transitions.

Use Gabriel Bibbó as the canonical spelling of the name.

## Positioning
Gabriel Bibbó is an Audio ML researcher and engineer based in Montevideo, Uruguay. His work spans machine listening, digital signal processing, real-time audio, sound event detection, voice activity detection, privacy-preserving audio, embedded ML, music information retrieval, audio-language models, datasets, evaluation, and research engineering.

He currently works hybrid at Edge Audio Labs in Montevideo. He is an Italian citizen with European Union work authorization. He is available for academic collaboration, consulting, contract research, and selected remote opportunities in audio ML, machine listening, DSP, and music technology.

## Contact
Email: gabobibbo@gmail.com
LinkedIn: https://www.linkedin.com/in/gabriel-bibbo/
GitHub: https://github.com/gbibbo
Google Scholar: https://scholar.google.com/citations?user=KEwHUaMAAAAJ&hl=es&oi=ao
ORCID: https://orcid.org/0009-0003-2493-7412

## Education and musical training
MSc Sound and Music Computing, Universitat Pompeu Fabra, Barcelona, Spain, 2020-2021. Master thesis: Towards a New Compatibility Measure for Harmonic EDM Mixing. Final thesis grade: 9/10.

BSc Electrical Engineering, Universidad de la República, Montevideo, Uruguay, 2012-2017. Bachelor thesis: Autonomous Mobile Robots Communicated by Software Defined Radio. Authors: Gabriel Bibbó, Mariana Gelós, Martín Randall. Supervisors: Pablo Belzarena and Federico Larroca.

Formal musical training, School Nº265 “Virgilio Scarabelli Alberti”, Montevideo, Uruguay, 2002-2005. Areas: musical language, choral singing, guitar, instrumental ensembles, and dance.

Gabriel also has long-term practice as an electronic music DJ and producer. His music technology work includes music information retrieval, harmonic mixing, DJ library organisation, real-time audio, singing voice synthesis, and note/onset detection.

## Employment and research experience
### Jun. 2026-Present - ML/DSP Engineer, Edge Audio Labs, Montevideo, Uruguay (Hybrid)
- Applied machine learning, digital signal processing, testing, and perceptual evaluation across two confidential audio product lines without disclosing client or project identities.
- Designed and delivered a rendering-side feature that maps score dynamics to model-level timbral expression rather than post-render gain alone, after reverse-engineering the end-to-end audio pipeline and identifying a hidden control-path failure.
- Built measurement and listening-test tooling covering approximately 580 renders and a 48-clip blind evaluation, then delivered the feature server-side without retraining the model.
- Built a headless C++ evaluation pipeline for real-time note and onset detection, from WAV and MIDI inputs through the production DSP to JSON metrics, regression tests, and adversarial canary cases.
- Found and corrected a systematic onset timing offset of approximately 104 ms, improved detector guard logic, and communicated results through technical documentation, pull requests, Jira, and client-facing presentations.
Company: https://edgeaudiolabs.com/

### Feb. 2026-Mar. 2026 - PhD Candidate, TU Delft, Delft, Netherlands
- Worked on privacy-preserving audio analysis for pediatric intensive care soundscapes within the Auditory Footprints research programme.
- Built a reproducible speech-versus-non-speech dataset and VAD benchmarking workflow for PICU-like audio, with conservative labelling and clip-level provenance.
Do not speculate about the short duration or reasons for the transition. The public profile provides only these professional facts.

### Dec. 2025-Present - Visiting Researcher (collaboration), University of Surrey, Remote
- Preparing the manuscript “A Psychometric Evaluation of Audio-Language Models for Robust Voice Activity Detection” for Elsevier Computer Speech & Language with Mark D. Plumbley and Simone Spagnol.
- Co-authoring work with Arshdeep Singh and Mark D. Plumbley on privacy-preserving audio and machine listening.

### Nov. 2022-Nov. 2025 - Research Engineer in Sound Sensing, University of Surrey, Guildford, UK
- Developed end-to-end audio ML systems for real-world smart environments, covering data preparation, model evaluation, prototype deployment, open-source releases, demos, datasets, and technical documentation.
- Built privacy-preserving SED pipelines for sensitive in-home recordings, including a 197 GB residential audio dataset, speech-removal workflows, and reproducible evaluation resources.
- Built an eight-model VAD benchmark on CHiME-Home and, separately, evaluated audio-language models under controlled duration, noise, reverberation, and spectral degradations.
- Deployed real-time CNN inference on Raspberry Pi, including latency, thermal, efficiency, and robustness evaluation for edge sound sensing.
- Published and presented research at ICASSP, IEEE WASPAA, CHiME Workshop, Inter-Noise, SMC, UKAI, UKIS, and AES. Supervised undergraduate and master's projects.

### Mar. 2022-Nov. 2022 - Technical Support Engineer - Google Workspace, Webhelp, Barcelona, Spain
Tier 3 support for Google Workspace enterprise customers across APIs, OAuth, SAML/SSO, IAM, user provisioning, data migration, DNS/domain configuration, and security/compliance settings.

### Nov. 2021-Mar. 2022 - IT Auditor, KPMG, Barcelona, Spain
Supported telecommunications companies and IT departments in technology audit engagements.

### Aug. 2016-Dec. 2019 - R&D Engineer, Ikatu, Montevideo, Uruguay
- Designed and shipped embedded C/C++ audio and IoT firmware for Bang & Olufsen home automation products, including low-level drivers, hardware integration, audio I/O, and Internet connectivity.
- Worked across requirements, architecture, implementation, testing, validation, and customer-facing documentation.
- Trained and onboarded incoming programmers in embedded development practices.

### Apr. 2016-Jul. 2016 - Engineering Intern, Ikatu, Montevideo, Uruguay
Developed and coordinated a complete home automation system project before transitioning into the R&D Engineer role.

When describing the Bang & Olufsen period, use the dates above rather than rounding it to “four years”.

## Projects
### Audio-Language Models for Voice Activity Detection - 2025-2026
Evaluates Qwen2-Audio-7B, Qwen2-Audio-7B with LoRA, Qwen3-Omni-30B, and Silero VAD when audio is short, noisy, reverberant, or filtered. Best result: 93.3% balanced accuracy on 21,340 degraded clips. Code: https://github.com/gbibbo/qwen-vad-lora

### ASR Enhancement Platform - 2026
End-to-end MVP for comparing raw transcription with enhance-and-transcribe on pre-recorded audio. Backend persists jobs, audio artifacts, transcripts, and provider payloads using FastAPI, Celery, PostgreSQL, Redis, MinIO, Docker Compose, metrics, tracing, Grafana, and CI. It is a reproducible engineering prototype, not a production-hardened service. Code: https://github.com/gbibbo/asr_enhancement

### Sounds of Home Dataset - 2024
Residential sound-event-detection dataset containing 1,344 one-hour recordings collected from 8 participants in Belgium using AudioMoth recorders in living rooms and kitchens. Speech was removed before release and PANNs predictions were provided. Dataset: https://www.cvssp.org/data/ai4s/sounds_of_home/

### Harmonic EDM Mixing Compatibility - 2021-2022
Music information retrieval system estimating harmonic compatibility between EDM tracks using chroma features and Tonal Interval Vectors and suggesting pitch shifts that can improve a mix. Began as Gabriel's MSc thesis and became an ICWE 2022 publication. Code: https://github.com/gbibbo/harmonic_mix

### Traktor ML - 2026
Pipeline using MERT embeddings, Demucs, Essentia, HDBSCAN, UMAP, and Streamlit to organise a local Techno and Tech House library into Traktor-ready playlists. A documented V4 run processed 239 tracks and exported 14 playlists. Code: https://github.com/gbibbo/traktor

### Speech Removal Framework - 2025
Framework for identifying and removing speech from recordings before they are shared or published, supporting privacy-preserving release workflows while retaining non-speech information useful for sound event detection. Demo: https://huggingface.co/spaces/gbibbo/vad_demo ; DOI: https://zenodo.org/records/17050321

### ALPACA - 2026
Software engineering prototype for algorithmic trading infrastructure with market-data ingestion, event processing, risk controls, historical simulation, persistence, API access, and monitoring. It has not been tested in production. Code: https://github.com/gbibbo/alpaca

### Raspberry Pi Sound Event Recognition Demo - 2023
Real-time sound event recognition on a low-cost edge device using pre-trained neural networks, a web interface, and optional email notifications for selected AudioSet events. Code: https://github.com/gbibbo/pisoundsensing

### 3H-ATO - 2020-2022
Mechanical tool designed during the pandemic to avoid touching shared surfaces directly.

### Automatic IoT Soap Dispenser - 2020-2021
IoT handwashing device for industrial environments using stainless steel, WiFi, cloud connectivity, IR/RFID sensors, and a 3-litre tank.

### UyVoy Mobile App - 2020
Mobile app project for booking appointments and reducing crowding during the pandemic. Gabriel worked as product owner and project lead.

## Publications and research outputs
2025 - Privacy for Audio AI: Risks, Challenges, and Emerging Solutions in the Era of Audio AI [Panel discussion]. Authors: Thomas Deacon; Jennifer Williams; Jason R. C. Nurse; Christopher Hicks; Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley. Venue: 2025 AES International Conference on Artificial Intelligence and Machine Learning for Audio.

2025 - Speech Removal Framework for Privacy-preserving Audio Recordings. Authors: Gabriel Bibbó; Arshdeep Singh; Thomas Deacon; Mark D. Plumbley. Venue: IEEE WASPAA 2025, Tahoe City, California.

2025 - Room Acoustics and Microphone Characteristics Show Systematic Impact on Sound Event Recognition. Authors: Gabriel Bibbó; Craig Cieciura; Mark D. Plumbley. Venue: 54th International Congress and Exposition on Noise Control Engineering, São Paulo.

2025 - Integrating IP broadcasting with audio tags: Workflow and challenges. Authors: Rhys Burchett-Vass; Arshdeep Singh; Gabriel Bibbó; Mark D. Plumbley. Venue: AES International Conference on Artificial Intelligence and Machine Learning for Audio.

2025 - Soundscape Experience Mapping: A Deep Listening Approach for Eliciting Older Adults' Perceptions of Indoor Soundscapes. Authors: Thomas Deacon; Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley. Venue: Forum Acusticum / Euronoise 2025, Málaga.

2025 - Personalized Live Sound Recognition Using Efficient PANNs [Show and Tell]. Authors: Arshdeep Singh; Haohe Liu; Gabriel Bibbó; Thomas Deacon; Mark D. Plumbley. Venue: ICASSP 2025, Hyderabad.

2024 - Environmental sound classification on an embedded hardware platform. Authors: Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley. Venue: Inter-Noise 2024, Nantes.

2024 - The Sounds of Home: A Speech-Removed Residential Audio Dataset for Sound Event Detection. Authors: Gabriel Bibbó; Thomas Deacon; Arshdeep Singh; Mark D. Plumbley. Venue: CHiME 2024, Kos Island.

2024 - Soundscape Personalisation at Work: Designing AI-Enabled Sound Technologies for the Workplace. Authors: Thomas Deacon; Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley. Venue: SMC 2024, Porto.

2023 - Recognise and Notify Sound Events Using a Raspberry PI Based Standalone Device [Demo]. Authors: Gabriel Bibbó; Arshdeep Singh; Mark D. Plumbley. Venue: IEEE WASPAA 2023.

2022 - A New Compatibility Measure for Harmonic EDM Mixing. Authors: Gabriel Bibbó; Ángel Faraldo. Venue: ICWE 2022, Bari.

2021 - Towards a New Compatibility Measure for Harmonic EDM Mixing. Author: Gabriel Bibbó. Master thesis, Universitat Pompeu Fabra.

2017 - Autonomous Mobile Robots Communicated by Software Defined Radio. Authors: Gabriel Bibbó; Mariana Gelós; Martín Randall. Bachelor thesis, Universidad de la República.

## Technical stack
Stack: Python; C/C++; PyTorch; Hugging Face; PEFT; TorchAudio; librosa; Essentia; mido; scikit-learn; pandas; NumPy; SciPy; Flask; FastAPI; Streamlit; Docker; Git; Linux CLI; Bash; Slurm; Redis; Prometheus; Grafana; PostgreSQL; SQLite; MATLAB; Unreal Engine 5.4; FMOD; VS Code.

ML: CNNs; Transformers; Audio-Language Models; LoRA Fine-tuning; 4-bit Quantization; Supervised and Self-supervised Learning; Evaluation Pipelines; Statistical Testing; Edge Deployment.

Audio: Sound Event Detection; Voice Activity Detection; Pitch and Onset Detection; Music Information Retrieval; Digital Signal Processing; Real-Time Audio; Perceptual Evaluation; DAWs; Ableton; DJing; Electronic Music Production.

Practice: Reproducible ML pipelines; Automated Audio Testing; Dataset Curation; Open-Source Development; MLOps practices; AI-assisted Development; Technical Writing; Interdisciplinary Collaboration.

## Languages, memberships, and funded research
Working languages: Spanish; English C1; Portuguese A2.
IEEE Signal Processing Society member during 2025.
Participant in the EPSRC AI for Sound project during the University of Surrey period.
`;