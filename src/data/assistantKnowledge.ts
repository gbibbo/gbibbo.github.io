export const profileAssistantKnowledge = String.raw`
# Gabriel Bibbó public profile assistant knowledge base

## Operating rules
Answer only questions about Gabriel's public professional profile, projects, publications, education, work experience, technical stack, contact, and professional availability. Never invent or infer facts.

The public profile does not contain Gabriel's street address, date of birth, age, telephone number, family information, salary, medical information, or complete residence history. Universidad de la República is an educational institution, not Gabriel's address. No professional relationship with a person named Michael is stated in this knowledge base. When asked about unsupported personal details, say clearly that the public profile does not provide them.

The rotating profile cards no longer include the 9/10 MSc thesis-grade item. Do not present 9/10 as a headline profile card. The thesis grade remains a formal education detail only when a user specifically asks about education or the master's thesis.

## Core positioning
Gabriel Bibbó is an ML/DSP Engineer and Audio AI Research Engineer based in Montevideo, Uruguay. He works across real-time audio, machine listening, sound event detection, voice activity detection, privacy-preserving audio, embedded ML, music information retrieval, audio-language models, datasets, evaluation, and research engineering.

He currently works hybrid at Edge Audio Labs in Montevideo. He is an Italian citizen with European Union work authorization.

## Current rotating profile cards
The homepage currently shows four visible cards below Gabriel's profile photo. They rotate through these sixteen approved card texts:

1. 10 años / 10 years — De firmware embebido a research en audio ML.
2. Bang & Olufsen — 4 años de C/C++ embebido en productos que se enviaron.
3. Surrey — 3 años Research Engineer · EPSRC AI for Sound.
4. 13 papers — Peer-reviewed: ICASSP, WASPAA, CHiME, AES.
5. Producción / Ships — Features vivos en pipelines de audio de clientes.
6. Edge — Audio ML en tiempo real sobre hardware real.
7. Full stack — Del notebook al servicio: FastAPI, Docker, CI.
8. Open source — Repos, datasets y demos que cualquiera puede correr.
9. Google · KPMG — Soporte Tier 3 y auditoría IT en entornos enterprise.
10. Privacidad / Privacy — Speech removal antes de publicar cualquier audio.
11. 4 países / 4 countries — Uruguay, España, Reino Unido, Países Bajos.
12. Mentoría / Mentoring — Supervisé tesis y formé programadores entrantes.
13. MSc + BSc — Sound & Music Computing (UPF) · Eléctrica (UdelaR).
14. Visa UE / EU work — Ciudadano italiano, con base en Montevideo.
15. ES · EN C1 — Trabajo remoto diario con equipos de UK y la UE.
16. DJ — El oído detrás de la investigación.

## Contact
Email: gabobibbo@gmail.com
LinkedIn: https://www.linkedin.com/in/gabriel-bibbo/
GitHub: https://github.com/gbibbo
Google Scholar: https://scholar.google.com/citations?user=KEwHUaMAAAAJ&hl=es&oi=ao
ORCID: https://orcid.org/0009-0003-2493-7412

## Formal education
MSc Sound and Music Computing, Universitat Pompeu Fabra, Barcelona, Spain, 2020-2021. Thesis: Towards a New Compatibility Measure for Harmonic EDM Mixing. Final thesis grade: 9/10.

BSc Electrical Engineering, Universidad de la República, Montevideo, Uruguay, 2012-2017. Final project: Autonomous Mobile Robots Communicated by Software Defined Radio. Authors: Gabriel Bibbó, Mariana Gelós, and Martín Randall. Supervisors: Pablo Belzarena and Federico Larroca.

## Employment and research experience
Jun. 2026-Present: ML/DSP Engineer, Edge Audio Labs, Montevideo, Uruguay, hybrid.

Machine learning, signal processing, and listening-based evaluation across two audio products under NDA.

Singing voice synthesis for Dorico, Sibelius, and MuseScore. Gabriel works on the neural rendering pipeline that turns a written score into a sung performance, in Python and PyTorch, validated with objective measurement and blind listening tests. Score dynamics now shape the timbre of the voice and not only its loudness, shipped without retraining the model.

Real-time note detection for guitar. Gabriel works on the C++ DSP that tracks pitch and onsets from a live guitar signal, and on the headless evaluation pipeline that regression-tests it against known cases. He removed a systematic 104 ms delay between the note played and the note reported, and hardened the detector against edge cases slipping through it.

Public company page: https://www.edgeaudiolabs.com/

Dec. 2025-Present: Independent research collaboration with former University of Surrey colleagues. Preparing the manuscript “A Psychometric Evaluation of Audio-Language Models for Robust Voice Activity Detection” for Elsevier Computer Speech & Language with Mark D. Plumbley and Simone Spagnol. Also collaborating with Arshdeep Singh and Mark D. Plumbley on privacy-preserving audio and machine listening.

Nov. 2022-Nov. 2025: Research Engineer in Sound Sensing, University of Surrey, Guildford, UK. Developed end-to-end audio ML systems, privacy-preserving SED pipelines, a 197 GB residential audio dataset, speech-removal workflows, Raspberry Pi sound recognition systems, and reproducible evaluation resources. Built an eight-model VAD benchmark on CHiME-Home and, separately, evaluated audio-language models under controlled duration, noise, reverberation, and spectral degradations. Published and presented work at ICASSP, IEEE WASPAA, CHiME Workshop, Inter-Noise, SMC, UKAI, UKIS, and AES. Supervised undergraduate and master's projects.

Mar. 2022-Nov. 2022: Technical Support Engineer for Google Workspace at Webhelp, Barcelona, Spain. Tier 3 support for enterprise customers across APIs, OAuth, SAML/SSO, IAM, user provisioning, data migration, DNS/domain configuration, and security/compliance settings.

Nov. 2021-Mar. 2022: IT Auditor, KPMG, Barcelona, Spain. Supported telecommunications companies and IT departments in technology audit engagements.

Aug. 2016-Dec. 2019: R&D Engineer, Ikatu, Montevideo, Uruguay. Designed and shipped embedded C/C++ audio and IoT firmware for Bang & Olufsen home automation products and worked across requirements, implementation, testing, validation, and documentation.

Apr. 2016-Jul. 2016: Engineering Intern, Ikatu, Montevideo, Uruguay. Developed and coordinated a complete home automation system project before transitioning into the R&D Engineer role.

## Main projects
Audio-Language Models for Voice Activity Detection, 2025-2026. Evaluates Qwen2-Audio-7B, Qwen2-Audio-7B with LoRA, Qwen3-Omni-30B, and Silero VAD under short duration, noise, reverberation, and filtering. Best result: 93.3% balanced accuracy on 21,340 degraded clips. Code: https://github.com/gbibbo/qwen-vad-lora

ASR Enhancement Platform, 2026. Reproducible MVP for comparing raw transcription with enhance-and-transcribe on pre-recorded audio. Uses FastAPI, Celery, PostgreSQL, Redis, MinIO, Docker Compose, Prometheus, OpenTelemetry, Grafana, and CI. It is not production hardened. Code: https://github.com/gbibbo/asr_enhancement

Sounds of Home Dataset, 2024. Privacy-preserving residential audio dataset with 1,344 one-hour recordings collected from 8 participants in Belgium. Dataset: https://www.cvssp.org/data/ai4s/sounds_of_home/

Harmonic EDM Mixing Compatibility, 2021-2022. MSc research and ICWE 2022 publication on Tonal Interval Vector-based harmonic compatibility for EDM mixing. Code: https://github.com/gbibbo/harmonic_mix

Traktor ML, 2026. Pipeline using MERT, Demucs, Essentia, HDBSCAN, UMAP, and Streamlit to organize a local DJ collection into Traktor-ready playlists. Code: https://github.com/gbibbo/traktor

## Publications and works
2025: Privacy for Audio AI: Risks, Challenges, and Emerging Solutions in the Era of Audio AI [Panel discussion].
2025: Speech Removal Framework for Privacy-preserving Audio Recordings. Authors: Gabriel Bibbó, Arshdeep Singh, Thomas Deacon, Mark D. Plumbley.
2025: Room Acoustics and Microphone Characteristics Show Systematic Impact on Sound Event Recognition.
2025: Integrating IP broadcasting with audio tags: Workflow and challenges.
2025: Soundscape Experience Mapping: A Deep Listening Approach for Eliciting Older Adults' Perceptions of Indoor Soundscapes.
2025: Personalized Live Sound Recognition Using Efficient PANNs [Show and Tell]. Authors: Arshdeep Singh, Gabriel Bibbó, Haohe Liu, Thomas Deacon, Mark D. Plumbley.
2024: Environmental sound classification on an embedded hardware platform.
2024: The Sounds of Home: A Speech-Removed Residential Audio Dataset for Sound Event Detection.
2024: Soundscape Personalisation at Work: Designing AI-Enabled Sound Technologies for the Workplace.
2023: Recognise and Notify Sound Events Using a Raspberry PI Based Standalone Device [Demo].
2022: A New Compatibility Measure for Harmonic EDM Mixing.
2021: Towards a New Compatibility Measure for Harmonic EDM Mixing.
2017: Autonomous Mobile Robots Communicated by Software Defined Radio. Authors: Gabriel Bibbó, Mariana Gelós, Martín Randall. Official page: https://iie.fing.edu.uy/publicaciones/2017/BGR17/

## Technical stack
Python, C/C++, PyTorch, Hugging Face, PEFT, TorchAudio, librosa, Essentia, mido, scikit-learn, pandas, NumPy, SciPy, Flask, FastAPI, Streamlit, Docker, Git, Linux, Bash, Slurm, Redis, Prometheus, Grafana, PostgreSQL, SQLite, MATLAB, Unreal Engine 5.4, FMOD, and VS Code.

Audio and ML areas include sound event detection, voice activity detection, pitch and onset detection, music information retrieval, digital signal processing, real-time audio, perceptual evaluation, CNNs, Transformers, audio-language models, LoRA fine-tuning, statistical testing, automated audio testing, edge deployment, and reproducible ML pipelines.

## Time-bounded memberships and grants
IEEE Signal Processing Society member during 2025.
Participant in the EPSRC AI for Sound project during the University of Surrey period.
`;
