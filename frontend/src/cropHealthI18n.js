/* ─────────────────────────────────────────────────────────────
   cropHealthI18n.js — Multilingual translations for Crop Health
   Analysis, Diagnostics, Remedies, Lifecycle Roadmap & TTS Audio.
   Languages: English, Telugu (తెలుగు), Hindi (हिन्दी),
              Kannada (ಕನ್ನಡ), Tamil (தமிழ்), Marathi (मराठी)
   ───────────────────────────────────────────────────────────── */

export const CROP_HEALTH_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', voiceCode: 'en-IN' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', voiceCode: 'te-IN' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', voiceCode: 'hi-IN' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', voiceCode: 'kn-IN' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', voiceCode: 'ta-IN' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', voiceCode: 'mr-IN' },
];

export const UI_STRINGS = {
  en: {
    language: 'Language',
    tabScanner: 'Image Health Scan',
    tabTimeline: 'Health Over Time',
    tabLifecycle: 'Full Cycle Roadmap',
    realtimeAi: 'Real-time Vision AI',
    uploadCropPic: 'Upload crop picture',
    uploadDesc: 'Take or upload a close-up picture of your crop leaves or canopy to detect diseases, nutrient deficiencies, or pest stress early.',
    dropzoneTitle: 'Click to upload or drag photo here',
    dropzoneSub: 'Supports JPG, PNG, WEBP from your phone camera or computer',
    replacePhoto: 'Click or drop new photo to replace',
    testPresets: 'OR TEST WITH SAMPLE CROP SCENARIOS',
    cropName: 'Crop Name',
    growthStage: 'Growth Stage',
    scanDate: 'Scan Date',
    notesLabel: 'Field Notes & Visual Symptoms (Optional)',
    notesPlaceholder: 'e.g., noticed brown concentric spots on lower leaves after recent rains...',
    runScanBtn: 'Run AI Health Diagnosis',
    analyzing: 'Analyzing crop photo...',
    readyAnalysis: 'Ready for diagnostic analysis',
    readyDesc: 'Upload your crop photo or select one of the test scenarios to inspect disease symptoms, calculate health metrics, and get instant remedies.',
    loadTomatoBlight: 'Load Tomato Blight Example',
    confidence: 'Confidence',
    canopyGreenness: 'Canopy Greenness',
    chlorosis: 'Chlorosis (Yellowing)',
    necrosis: 'Necrosis (Lesions)',
    symptomsTitle: 'IDENTIFIED SYMPTOMS',
    untreatedRiskTitle: 'If left untreated',
    recoveryPrognosisTitle: 'Expected recovery prognosis',
    curativeInterventions: 'CURATIVE INTERVENTIONS',
    immediatePlan: 'Immediate Treatment Plan',
    organicControls: 'Organic & Biological Controls',
    organicSub: 'Residue-free, pollinator-safe treatments',
    chemicalControls: 'Targeted / Agrochemical Interventions',
    chemicalSub: 'Strictly follow dosage and pre-harvest intervals',
    culturalControls: 'Cultural & Canopy Management',
    culturalSub: 'Pruning, aeration, and irrigation adjustments',
    viewRoadmap: 'View Start-to-End Cycle Roadmap',
    viewRoadmapSub: 'Prevent this issue from recurring at seedling, flowering, and harvest stages.',
    exploreRoadmapBtn: 'Explore full roadmap',
    backToDiag: 'Back to Diagnostics',
    listenDiagnosis: 'Listen in Audio',
    stopAudio: 'Stop Audio',
    speaking: 'Speaking…',
    selectCrop: 'Select Crop:',
    newScanFor: 'Log New Scan for',
    trajectoryTitle: 'CROP HEALTH TRAJECTORY',
    trajectoryHeader: 'Health Analysis Over Time',
    trajectoryDesc: "Track how your crop's vigor, disease lesions, and remedies evolve across its growing season.",
    sampleModeNotice: 'Sample Mode: Viewing demonstrative trajectory. Perform new scans to track your own farm field.',
    trendRecovery: 'Recovery Trend',
    trendDeclining: 'Attention Needed',
    trendStable: 'Steady Health',
    firstScan: 'Baseline Scan',
    latestScan: 'Current Status',
    recoveryGained: 'Improvement',
    visualSymptomsObserved: 'Visual Symptoms Observed:',
    fieldNotesLabel: 'Field Notes:',
    roadmapHeader: 'Complete Preventative & Curative Roadmap',
    roadmapSub: 'Tailored management actions designed to prevent and remedy at every phase of growth.',
    stageSeedling: 'Seedling & Nursery',
    stageVegetative: 'Active Vegetative',
    stageFlowering: 'Flowering & Heading',
    stageFruiting: 'Fruiting & Pod Fill',
    stageHarvest: 'Maturation & Harvest',
    statusHealthy: 'Prime Condition',
    statusWarning: 'Action Recommended',
    statusCritical: 'Critical Concern',
    severityNone: 'None',
    severityMild: 'Mild',
    severityModerate: 'Moderate',
    severitySevere: 'Severe',
  },
  te: {
    language: 'భాష',
    tabScanner: 'ఫోటో వ్యాధి నిర్ధారణ',
    tabTimeline: 'కాలక్రమేణా విశ్లేషణ',
    tabLifecycle: 'పూర్తి పంట చక్ర ప్రణాళిక',
    realtimeAi: 'రియల్-టైమ్ విజన్ AI',
    uploadCropPic: 'పంట ఆకు లేదా మొక్క ఫోటోను అప్‌లోడ్ చేయండి',
    uploadDesc: 'తెగుళ్ళు, పోషక లోపాలు లేదా పురుగుల ఉధృతిని ముందుగానే గుర్తించడానికి మీ పంట ఆకుల స్పష్టమైన ఫోటోను తీయండి లేదా అప్‌లోడ్ చేయండి.',
    dropzoneTitle: 'ఫోటోను ఇక్కడ వేయండి లేదా ఎంచుకోవడానికి నొక్కండి',
    dropzoneSub: 'మొబైల్ కెమెరా లేదా గ్యాలరీ నుండి JPG, PNG, WEBP ఫార్మాట్లకు మద్దతు కలదు',
    replacePhoto: 'మరో ఫోటోతో మార్చడానికి ఇక్కడ నొక్కండి',
    testPresets: 'లేదా క్షేత్ర నమూనా పరీక్షను ఎంచుకోండి',
    cropName: 'పంట పేరు',
    growthStage: 'ఎదుగుదల దశ',
    scanDate: 'పరిశీలించిన తేదీ',
    notesLabel: 'క్షేత్ర పరిశీలనలు & లక్షణాలు (ఐచ్ఛికం)',
    notesPlaceholder: 'ఉదా: 3 రోజుల వర్షం తర్వాత దిగువ ఆకులపై గోధుమ రంగు వలయాల మచ్చలు కనిపించాయి...',
    runScanBtn: 'AI పంట ఆరోగ్య విశ్లేషణ చేయండి',
    analyzing: 'పంట ఫోటోను విశ్లేషిస్తోంది...',
    readyAnalysis: 'వ్యాధి నిర్ధారణకు సిద్ధంగా ఉంది',
    readyDesc: 'తెగులు లక్షణాలు, ఆరోగ్య సూచికలు మరియు తక్షణ నివారణ చర్యలను పొందడానికి ఫోటోను అప్‌లోడ్ చేయండి లేదా నమూనాను ఎంచుకోండి.',
    loadTomatoBlight: 'టమాటా తెగులు నమూనా చూడండి',
    confidence: 'ఖచ్చితత్వం',
    canopyGreenness: 'పైరు పచ్చదనం',
    chlorosis: 'పసుపుబారడం (క్లోరోసిస్)',
    necrosis: 'ఎండిన మచ్చలు (నెక్రోసిస్)',
    symptomsTitle: 'గుర్తించిన తెగులు లక్షణాలు',
    untreatedRiskTitle: 'చికిత్స చేయకపోతే కలిగే నష్టం',
    recoveryPrognosisTitle: 'కోలుకునే అవకాశాల అంచనా',
    curativeInterventions: 'నివారణ & చికిత్సా చర్యలు',
    immediatePlan: 'తక్షణ నివారణ ప్రణాళిక',
    organicControls: 'సేంద్రీయ & జీవ నియంత్రణలు',
    organicSub: 'రసాయన రహిత, మిత్ర పురుగులకు సురక్షితమైన చర్యలు',
    chemicalControls: 'లక్ష్యిత రసాయన పిచికారీ చర్యలు',
    chemicalSub: 'సిఫార్సు చేసిన మోతాదు మరియు కోతకు ముందు వ్యవధి పాటించండి',
    culturalControls: 'క్షేత్ర & పంట యాజమాన్య పద్ధతులు',
    culturalSub: 'కత్తిరింపు, గాలి ప్రసరణ మరియు నీటి యాజమాన్యం',
    viewRoadmap: 'పూర్తి పంట చక్ర ప్రణాళికను చూడండి',
    viewRoadmapSub: 'విత్తనం నుండి కోత వరకు తెగుళ్ళు మళ్ళీ రాకుండా నివారించండి.',
    exploreRoadmapBtn: 'పూర్తి ప్రణాళిక చూడండి',
    backToDiag: 'తిరిగి విశ్లేషణకు వెళ్లండి',
    listenDiagnosis: 'ఆడియో వినండి',
    stopAudio: 'ఆపండి',
    speaking: 'వినిపిస్తోంది…',
    selectCrop: 'పంటను ఎంచుకోండి:',
    newScanFor: 'కొత్త స్కాన్ నమోదు చేయండి:',
    trajectoryTitle: 'పంట ఆరోగ్య గమనం',
    trajectoryHeader: 'కాలక్రమేణా ఆరోగ్య విశ్లేషణ',
    trajectoryDesc: 'సీజన్ పొడవునా మీ పంట ఎదుగుదల, తెగులు నియంత్రణ మరియు ఆరోగ్య మార్పులను గమనించండి.',
    sampleModeNotice: 'నమూనా మోడ్: ప్రదర్శన విశ్లేషణను చూస్తున్నారు. మీ పొలాన్ని ట్రాక్ చేయడానికి కొత్త స్కాన్ చేయండి.',
    trendRecovery: 'కోలుకుంటున్న ధోరణి',
    trendDeclining: 'జాగ్రత్త అవసరం',
    trendStable: 'స్థిరమైన ఆరోగ్యం',
    firstScan: 'మొదటి స్కాన్',
    latestScan: 'ప్రస్తుత స్థితి',
    recoveryGained: 'మెరుగుదల',
    visualSymptomsObserved: 'గమనించిన దృశ్య లక్షణాలు:',
    fieldNotesLabel: 'క్షేత్ర గమనికలు:',
    roadmapHeader: 'పూర్తి నివారణ & నిర్వహణ ప్రణాళిక',
    roadmapSub: 'పంట ఎదుగుదల ప్రతి దశలోనూ తెగుళ్ళను నివారించేందుకు అనుకూలమైన మార్గదర్శకత్వం.',
    stageSeedling: 'మొలక & నారుమడి దశ',
    stageVegetative: 'శాఖీయ ఎదుగుదల దశ',
    stageFlowering: 'పూత దశ',
    stageFruiting: 'కాయ / గింజ దశ',
    stageHarvest: 'పక్వత & కోత దశ',
    statusHealthy: 'పూర్తి ఆరోగ్యంగా ఉంది',
    statusWarning: 'మధ్యస్థ ఒత్తిడి / హెచ్చరిక',
    statusCritical: 'తీవ్రమైనది / తక్షణ చర్య అవసరం',
    severityNone: 'ఏమీ లేదు',
    severityMild: 'స్వల్పం',
    severityModerate: 'మధ్యస్థం',
    severitySevere: 'తీవ్రం',
  },
  hi: {
    language: 'भाषा',
    tabScanner: 'फ़ोटो रोग निदान',
    tabTimeline: 'समय के साथ स्वास्थ्य',
    tabLifecycle: 'संपूर्ण फ़सल चक्र रोडमैप',
    realtimeAi: 'रीयल-टाइम विज़न AI',
    uploadCropPic: 'फ़सल की तस्वीर अपलोड करें',
    uploadDesc: 'रोगों, पोषक तत्वों की कमी या कीटों के प्रकोप की समय रहते पहचान के लिए फ़सल की पत्तियों या छतरी की स्पष्ट तस्वीर लें।',
    dropzoneTitle: 'फ़ोटो यहाँ खींचें या चुनने के लिए क्लिक करें',
    dropzoneSub: 'फ़ोन कैमरे या कंप्यूटर से JPG, PNG, WEBP समर्थित',
    replacePhoto: 'तस्वीर बदलने के लिए क्लिक करें',
    testPresets: 'या फ़ील्ड नमूना परिदृश्यों के साथ परीक्षण करें',
    cropName: 'फ़सल का नाम',
    growthStage: 'विकास की अवस्था',
    scanDate: 'निरीक्षण तिथि',
    notesLabel: 'खेत के लक्षण व टिप्पणियाँ (वैकल्पिक)',
    notesPlaceholder: 'उदा. हाल की बारिश के बाद निचली पत्तियों पर गोल भूरे धब्बे दिखाई दिए...',
    runScanBtn: 'AI स्वास्थ्य निदान प्रारंभ करें',
    analyzing: 'फ़सल की तस्वीर का विश्लेषण जारी है...',
    readyAnalysis: 'रोग निदान के लिए तैयार',
    readyDesc: 'रोग के लक्षण पहचानने, स्वास्थ्य स्कोर मापने और तत्काल उपचार पाने के लिए फ़ोटो अपलोड करें या नमूना चुनें।',
    loadTomatoBlight: 'टमाटर झुलसा रोग नमूना लोड करें',
    confidence: 'सटीकता',
    canopyGreenness: 'छतरी का हरापन',
    chlorosis: 'पीलापन (क्लोरोसिस)',
    necrosis: 'सूखे धब्बे (नेक्रोसिस)',
    symptomsTitle: 'पहचाने गए लक्षण',
    untreatedRiskTitle: 'यदि उपचार न किया जाए तो जोखिम',
    recoveryPrognosisTitle: 'स्वास्थ्य सुधार का पूर्वानुमान',
    curativeInterventions: 'उपचारात्मक उपाय',
    immediatePlan: 'तत्काल उपचार योजना',
    organicControls: 'जैविक व प्राकृतिक नियंत्रण',
    organicSub: 'रसायन-मुक्त, परागणकों के लिए सुरक्षित उपचार',
    chemicalControls: 'लक्षित कृषि-रसायन छिड़काव',
    chemicalSub: 'दवा की अनुशंसित मात्रा व कटाई पूर्व अंतराल (PHI) का पालन करें',
    culturalControls: 'खेत व छतरी प्रबंधन',
    culturalSub: 'छंटाई, वायु प्रवाह और सिंचाई नियंत्रण',
    viewRoadmap: 'संपूर्ण चक्र रोडमैप देखें',
    viewRoadmapSub: 'अंकुरण, फूल आने और कटाई के चरणों में इस समस्या को दोबारा होने से रोकें।',
    exploreRoadmapBtn: 'पूरा रोडमैप देखें',
    backToDiag: 'वापस रोग निदान पर जाएँ',
    listenDiagnosis: 'ऑडियो सुनें',
    stopAudio: 'रोकें',
    speaking: 'बोल रहा है…',
    selectCrop: 'फ़सल चुनें:',
    newScanFor: 'नया स्कैन दर्ज करें:',
    trajectoryTitle: 'फ़सल स्वास्थ्य प्रक्षेपवक्र',
    trajectoryHeader: 'समय के साथ फ़सल स्वास्थ्य विश्लेषण',
    trajectoryDesc: 'मौसम भर अपनी फ़सल के विकास, रोग नियंत्रण और स्वास्थ्य सुधार पर नज़र रखें।',
    sampleModeNotice: 'नमूना मोड: निदर्शन प्रक्षेपवक्र देख रहे हैं। अपने खेत को ट्रैक करने के लिए नया स्कैन करें।',
    trendRecovery: 'सुधार की ओर',
    trendDeclining: 'ध्यान देने की आवश्यकता',
    trendStable: 'स्थिर स्वास्थ्य',
    firstScan: 'प्रारंभिक स्कैन',
    latestScan: 'वर्तमान स्थिति',
    recoveryGained: 'कुल सुधार',
    visualSymptomsObserved: 'देखे गए लक्षण:',
    fieldNotesLabel: 'खेत की टिप्पणियाँ:',
    roadmapHeader: 'पूर्ण निवारक व उपचारात्मक रोडमैप',
    roadmapSub: 'विकास के प्रत्येक चरण में रोगों की रोकथाम और उपचार के लिए अनुकूलित मार्गदर्शन।',
    stageSeedling: 'अंकुरण व नर्सरी अवस्था',
    stageVegetative: 'सक्रिय वानस्पतिक अवस्था',
    stageFlowering: 'फूल व बाली आने की अवस्था',
    stageFruiting: 'फल व दाना भराव अवस्था',
    stageHarvest: 'परिपक्वता व कटाई अवस्था',
    statusHealthy: 'उत्कृष्ट स्थिति',
    statusWarning: 'कार्रवाई अनुशंसित',
    statusCritical: 'गंभीर चिंता / तत्काल ध्यान दें',
    severityNone: 'कोई नहीं',
    severityMild: 'हल्का',
    severityModerate: 'मध्यम',
    severitySevere: 'गंभीर',
  },
  kn: {
    language: 'ಭಾಷೆ',
    tabScanner: 'ಫೋಟೋ ರೋಗ ನಿರ್ಣಯ',
    tabTimeline: 'ಕಾಲಾನುಕ್ರಮ ಆರೋಗ್ಯ',
    tabLifecycle: 'ಸಂಪೂರ್ಣ ಬೆಳೆ ಚಕ್ರ ಮಾರ್ಗಸೂಚಿ',
    realtimeAi: 'ರಿಯಲ್-ಟೈಮ್ ವಿಷನ್ AI',
    uploadCropPic: 'ಬೆಳೆಯ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    uploadDesc: 'ರೋಗಗಳು, ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ ಅಥವಾ ಕೀಟಬಾಧೆಯನ್ನು ಮೊದಲೇ ಪತ್ತೆಹಚ್ಚಲು ಎಲೆಯ ಸ್ಪಷ್ಟ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    dropzoneTitle: 'ಫೋಟೋವನ್ನು ಇಲ್ಲಿಗೆ ಎಳೆಯಿರಿ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ',
    dropzoneSub: 'ಫೋನ್ ಕ್ಯಾಮೆರಾ ಅಥವಾ ಕಂಪ್ಯೂಟರ್‌ನಿಂದ JPG, PNG, WEBP ಬೆಂಬಲಿಸುತ್ತದೆ',
    replacePhoto: 'ಹೊಸ ಫೋಟೋ ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
    testPresets: 'ಅಥವಾ ಮಾದರಿ ಬೆಳೆ ಪರೀಕ್ಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    cropName: 'ಬೆಳೆಯ ಹೆಸರು',
    growthStage: 'ಬೆಳವಣಿಗೆಯ ಹಂತ',
    scanDate: 'ಪರಿಶೀಲಿಸಿದ ದಿನಾಂಕ',
    notesLabel: 'ಕ್ಷೇತ್ರದ ಲಕ್ಷಣಗಳು & ಟಿಪ್ಪಣಿಗಳು (ಐಚ್ಛಿಕ)',
    notesPlaceholder: 'ಉದಾ: ಇತ್ತೀಚಿನ ಮಳೆಯ ನಂತರ ಕೆಳಗಿನ ಎಲೆಗಳಲ್ಲಿ ಕಂದು ಬಣ್ಣದ ಚುಕ್ಕೆಗಳು ಕಂಡಿವೆ...',
    runScanBtn: 'AI ಬೆಳೆ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ',
    analyzing: 'ಬೆಳೆಯ ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    readyAnalysis: 'ರೋಗ ನಿರ್ಣಯಕ್ಕೆ ಸಿದ್ಧವಾಗಿದೆ',
    readyDesc: 'ರೋಗ ಲಕ್ಷಣಗಳನ್ನು ಗುರುತಿಸಲು, ಆರೋಗ್ಯ ಸ್ಕೋರ್ ತಿಳಿಯಲು ಮತ್ತು ತಕ್ಷಣದ ಪರಿಹಾರ ಪಡೆಯಲು ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    loadTomatoBlight: 'ಟೊಮ್ಯಾಟೊ ರೋಗದ ಮಾದರಿ ನೋಡಿ',
    confidence: 'ನಿಖರತೆ',
    canopyGreenness: 'ಹಸಿರು ಪ್ರಮಾಣ',
    chlorosis: 'ಹಳದಿ ಬಣ್ಣ (ಕ್ಲೋರೋಸಿಸ್)',
    necrosis: 'ಕಂದು ಒಣ ಚುಕ್ಕೆಗಳು (ನೆಕ್ರೋಸಿಸ್)',
    symptomsTitle: 'ಗುರುತಿಸಲಾದ ರೋಗ ಲಕ್ಷಣಗಳು',
    untreatedRiskTitle: 'ಚಿಕಿತ್ಸೆ ನೀಡದಿದ್ದರೆ ಉಂಟಾಗುವ ನಷ್ಟ',
    recoveryPrognosisTitle: 'ಗುಣಮುಖವಾಗುವ ಮುನ್ಸೂಚನೆ',
    curativeInterventions: 'ಪರಿಹಾರ ಮತ್ತು ಚಿಕಿತ್ಸಾ ಕ್ರಮಗಳು',
    immediatePlan: 'ತಕ್ಷಣದ ಚಿಕಿತ್ಸಾ ಯೋಜನೆ',
    organicControls: 'ಸಾವಯವ & ಜೈವಿಕ ನಿಯಂತ್ರಣಗಳು',
    organicSub: 'ರಾಸಾಯನಿಕ ರಹಿತ, ಪರಾಗಸ್ಪರ್ಶಕಗಳಿಗೆ ಸುರಕ್ಷಿತ ಚಿಕಿತ್ಸೆ',
    chemicalControls: 'ನಿರ್ದಿಷ್ಟ ಕೃಷಿ-ರಾಸಾಯನಿಕ ಸಿಂಪಡಣೆ',
    chemicalSub: 'ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಮಾಣ ಮತ್ತು ಕಟಾವಿಗೆ ಮುಂಚಿನ ಅಂತರವನ್ನು ಪಾಲಿಸಿ',
    culturalControls: 'ಕ್ಷೇತ್ರ & ತೋಟದ ನಿರ್ವಹಣೆ',
    culturalSub: 'ಸವರುವಿಕೆ, ಗಾಳಿ ಸಂಚಾರ ಮತ್ತು ನೀರಾವರಿ ನಿರ್ವಹಣೆ',
    viewRoadmap: 'ಸಂಪೂರ್ಣ ಬೆಳೆ ಚಕ್ರ ಮಾರ್ಗಸೂಚಿ ನೋಡಿ',
    viewRoadmapSub: 'ಮೊಳಕೆಯಿಂದ ಕಟಾವಿನವರೆಗೆ ರೋಗ ಮರುಕಳಿಸದಂತೆ ತಡೆಯಿರಿ.',
    exploreRoadmapBtn: 'ಸಂಪೂರ್ಣ ಮಾರ್ಗಸೂಚಿ ನೋಡಿ',
    backToDiag: 'ಮರಳಿ ರೋಗ ನಿರ್ಣಯಕ್ಕೆ ಹೋಗಿ',
    listenDiagnosis: 'ಆಡಿಯೋ ಆಲಿಸಿ',
    stopAudio: 'ನಿಲ್ಲಿಸಿ',
    speaking: 'ಮಾತನಾಡುತ್ತಿದೆ…',
    selectCrop: 'ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ:',
    newScanFor: 'ಹೊಸ ಸ್ಕ್ಯಾನ್ ದಾಖಲಿಸಿ:',
    trajectoryTitle: 'ಬೆಳೆ ಆರೋಗ್ಯ ಪಥ',
    trajectoryHeader: 'ಕಾಲಾನುಕ್ರಮ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ',
    trajectoryDesc: 'ಬೆಳೆಯ ಬೆಳವಣಿಗೆ, ರೋಗ ನಿಯಂತ್ರಣ ಮತ್ತು ಸುಧಾರಣೆಯನ್ನು ಕಾಲಾನುಕ್ರಮದಲ್ಲಿ ಗಮನಿಸಿ.',
    sampleModeNotice: 'ಮಾದರಿ ಮೋಡ್: ಪ್ರದರ್ಶನ ವಿಶ್ಲೇಷಣೆ ವೀಕ್ಷಿಸುತ್ತಿದ್ದೀರಿ. ನಿಮ್ಮ ಸ್ವಂತ ಕ್ಷೇತ್ರ ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಹೊಸ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
    trendRecovery: 'ಸುಧಾರಣೆ ಕಂಡುಬರುತ್ತಿದೆ',
    trendDeclining: 'ಗಮನ ಅಗತ್ಯವಿದೆ',
    trendStable: 'ಸ್ಥಿರ ಆರೋಗ್ಯ',
    firstScan: 'ಆರಂಭಿಕ ಸ್ಕ್ಯಾನ್',
    latestScan: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
    recoveryGained: 'ಒಟ್ಟು ಸುಧಾರಣೆ',
    visualSymptomsObserved: 'ಕಂಡುಬಂದ ಲಕ್ಷಣಗಳು:',
    fieldNotesLabel: 'ಕ್ಷೇತ್ರ ಟಿಪ್ಪಣಿಗಳು:',
    roadmapHeader: 'ಸಂಪೂರ್ಣ ತಡೆಗಟ್ಟುವಿಕೆ ಮತ್ತು ಚಿಕಿತ್ಸಾ ಮಾರ್ಗಸೂಚಿ',
    roadmapSub: 'ಬೆಳವಣಿಗೆಯ ಪ್ರತಿ ಹಂತದಲ್ಲೂ ರೋಗ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ಸೂಕ್ತ ಮಾರ್ಗದರ್ಶನ.',
    stageSeedling: 'ಸಸಿ & ನರ್ಸರಿ ಹಂತ',
    stageVegetative: 'ಸಕ್ರಿಯ ಬೆಳವಣಿಗೆಯ ಹಂತ',
    stageFlowering: 'ಹೂಬಿಡುವ ಹಂತ',
    stageFruiting: 'ಕಾಯಿ / ಕಾಳು ಕಟ್ಟುವ ಹಂತ',
    stageHarvest: 'ಪಕ್ವತೆ & ಕಟಾವು ಹಂತ',
    statusHealthy: 'ಉತ್ತಮ ಆರೋಗ್ಯಕರ ಸ್ಥಿತಿ',
    statusWarning: 'ಕ್ರಮ ಅಗತ್ಯವಿದೆ',
    statusCritical: 'ತೀವ್ರ ಕಾಳಜಿ / ತಕ್ಷಣ ಕ್ರಮ ಕೈಗೊಳ್ಳಿ',
    severityNone: 'ಯಾವುದೂ ಇಲ್ಲ',
    severityMild: 'ಸ್ವಲ್ಪ',
    severityModerate: 'ಮಧ್ಯಮ',
    severitySevere: 'ತೀವ್ರ',
  },
  ta: {
    language: 'மொழி',
    tabScanner: 'புகைப்பட நோய் கண்டறிதல்',
    tabTimeline: 'காலப்போக்கில் பயிர் நலம்',
    tabLifecycle: 'முழு சுழற்சி வழிகாட்டி',
    realtimeAi: 'நிகழ்நேர விஷன் AI',
    uploadCropPic: 'பயிர் புகைப்படத்தைப் பதிவேற்றவும்',
    uploadDesc: 'நோய்கள், சத்து குறைபாடுகள் அல்லது பூச்சி தாக்குதலை ஆரம்பத்திலேயே கண்டறிய இலைகளின் தெளிவான புகைப்படத்தை எடுக்கவும்.',
    dropzoneTitle: 'புகைப்படத்தை இங்கே இழுக்கவும் அல்லது தேர்ந்தெடுக்க கிளிக் செய்யவும்',
    dropzoneSub: 'மொபைல் கேமரா அல்லது கணினியிலிருந்து JPG, PNG, WEBP கோப்புகள் ஏற்கப்படும்',
    replacePhoto: 'புதிய புகைப்படத்தை மாற்ற கிளிக் செய்யவும்',
    testPresets: 'அல்லது கள மாதிரி சோதனையைத் தேர்ந்தெடுக்கவும்',
    cropName: 'பயிர் பெயர்',
    growthStage: 'வளர்ச்சி நிலை',
    scanDate: 'பரிசோதித்த தேதி',
    notesLabel: 'களக் குறிப்புகள் & அறிகுறிகள் (விருப்பமானது)',
    notesPlaceholder: 'எ.கா: அண்மைய மழைக்குப் பிறகு கீழ் இலைகளில் பழுப்பு நிறப் புள்ளிகள் தென்படுகின்றன...',
    runScanBtn: 'AI பயிர் நலப் பரிசோதனை செய்யவும்',
    analyzing: 'பயிர் புகைப்படம் பகுப்பாய்வு செய்யப்படுகிறது...',
    readyAnalysis: 'நோய் கண்டறிதலுக்குத் தயார்',
    readyDesc: 'நோய் அறிகுறிகளைக் கண்டறியவும், சுகாதாரக் குறியீட்டை அறியவும் உடனடி நிவாரணம் பெறவும் புகைப்படத்தைப் பதிவேற்றவும்.',
    loadTomatoBlight: 'தக்காளி இலைக்கருகல் மாதிரி பார்க்க',
    confidence: 'துல்லியம்',
    canopyGreenness: 'பசுமை அளவு',
    chlorosis: 'மஞ்சளாதல் (குளோரோசிஸ்)',
    necrosis: 'காய்ந்த புள்ளிகள் (நெக்ரோசிஸ்)',
    symptomsTitle: 'கண்டறியப்பட்ட அறிகுறிகள்',
    untreatedRiskTitle: 'சிகிச்சை செய்யாவிட்டால் ஏற்படும் பாதிப்பு',
    recoveryPrognosisTitle: 'குணமாகும் வாய்ப்பின் முன்னறிவிப்பு',
    curativeInterventions: 'நிவாரண மற்றும் சிகிச்சை முறைகள்',
    immediatePlan: 'உடனடி சிகிச்சைத் திட்டம்',
    organicControls: 'இயற்கை & உயிரியல் கட்டுப்பாடுகள்',
    organicSub: 'ரசாயனமற்ற, மகரந்தச் சேர்க்கையாளர்களுக்குப் பாதுகாப்பான சிகிச்சைகள்',
    chemicalControls: 'இலக்கு சார்ந்த ரசாயன தெளிப்புகள்',
    chemicalSub: 'பரிந்துரைக்கப்பட்ட அளவு மற்றும் அறுவடைக்கு முந்தைய இடைவெளியைப் பின்பற்றவும்',
    culturalControls: 'வயல் மற்றும் பயிர் மேலாண்மை',
    culturalSub: 'கவாத்து, காற்றோட்டம் மற்றும் பாசன மேலாண்மை',
    viewRoadmap: 'முழு பயிர் சுழற்சி வழிகாட்டியைப் பார்க்கவும்',
    viewRoadmapSub: 'நாற்று முதல் அறுவடை வரை நோய் மீண்டும் ஏற்படாமல் தடுக்கவும்.',
    exploreRoadmapBtn: 'முழு வழிகாட்டியைப் பார்க்க',
    backToDiag: 'மீண்டும் பரிசோதனைக்குச் செல்ல',
    listenDiagnosis: 'ஆடியோ கேளுங்கள்',
    stopAudio: 'நிறுத்து',
    speaking: 'பேசுகிறது…',
    selectCrop: 'பயிரைத் தேர்ந்தெடுக்கவும்:',
    newScanFor: 'புதிய பரிசோதனைப் பதிவு:',
    trajectoryTitle: 'பயிர் நலப் பாதை',
    trajectoryHeader: 'காலப்போக்கில் பயிர் நலப் பகுப்பாய்வு',
    trajectoryDesc: 'பயிரின் வளர்ச்சி, நோய் கட்டுப்பாடு மற்றும் முன்னேற்றத்தை பருவம் முழுவதும் கண்காணிக்கவும்.',
    sampleModeNotice: 'மாதிரி பயன்முறை: செயல்விளக்கப் பாதையைக் காண்கிறீர்கள். உங்கள் சொந்த வயலைக் கண்காணிக்க புதிய ஸ்கேன் செய்யவும்.',
    trendRecovery: 'குணமடையும் போக்கு',
    trendDeclining: 'கவனம் தேவை',
    trendStable: 'நிலையான நலம்',
    firstScan: 'தொடக்க ஸ்கேன்',
    latestScan: 'தற்போதைய நிலை',
    recoveryGained: 'மொத்த முன்னேற்றம்',
    visualSymptomsObserved: 'கண்டறியப்பட்ட அறிகுறிகள்:',
    fieldNotesLabel: 'களக் குறிப்புகள்:',
    roadmapHeader: 'முழுமையான தடுப்பு மற்றும் சிகிச்சை வழிகாட்டி',
    roadmapSub: 'வளர்ச்சியின் ஒவ்வொரு கட்டத்திலும் நோய்களைத் தடுப்பதற்கான வழிகாட்டுதல்.',
    stageSeedling: 'நாற்று & நாற்றங்கால் நிலை',
    stageVegetative: 'செயலில் உள்ள வளர்ச்சி நிலை',
    stageFlowering: 'பூக்கும் நிலை',
    stageFruiting: 'காய் / விதை பிடிக்கும் நிலை',
    stageHarvest: 'முதிர்ச்சி & அறுவடை நிலை',
    statusHealthy: 'சிறந்த ஆரோக்கிய நிலை',
    statusWarning: 'நடவடிக்கை பரிந்துரைக்கப்படுகிறது',
    statusCritical: 'தீவிரக் கவலை / உடனடி நடவடிக்கை தேவை',
    severityNone: 'இல்லை',
    severityMild: 'லேசானது',
    severityModerate: 'மிதமானது',
    severitySevere: 'தீவிரமானது',
  },
  mr: {
    language: 'भाषा',
    tabScanner: 'फोटो रोग निदान',
    tabTimeline: 'काळानुसार पीक आरोग्य',
    tabLifecycle: 'संपूर्ण पीक चक्र आराखडा',
    realtimeAi: 'रिअल-टाइम व्हिजन AI',
    uploadCropPic: 'पिकाचा फोटो अपलोड करा',
    uploadDesc: 'रोग, पोषणद्रव्यांची कमतरता किंवा किडींचा प्रादुर्भाव वेळेत ओळखण्यासाठी पानांचा स्पष्ट फोटो घ्या किंवा अपलोड करा.',
    dropzoneTitle: 'फोटो येथे ड्रॅग करा किंवा निवडण्यासाठी क्लिक करा',
    dropzoneSub: 'मोबाईल कॅमेरा किंवा कॉम्प्युटरमधून JPG, PNG, WEBP समर्थित',
    replacePhoto: 'नवीन फोटो बदलण्यासाठी क्लिक करा',
    testPresets: 'किंवा शेतातील नमुना परिस्थिती तपासा',
    cropName: 'पिकाचे नाव',
    growthStage: 'वाढीची अवस्था',
    scanDate: 'तपासणी तारीख',
    notesLabel: 'शेतातील निरीक्षणे व लक्षणे (पर्यायी)',
    notesPlaceholder: 'उदा. पावसानंतर खालच्या पानांवर तपकिरी रंगाचे गोल ठिपके दिसले...',
    runScanBtn: 'AI पीक आरोग्य निदान करा',
    analyzing: 'पिकाच्या फोटोचे विश्लेषण सुरू आहे...',
    readyAnalysis: 'रोग निदानासाठी तयार',
    readyDesc: 'रोगाची लक्षणे ओळखण्यासाठी, आरोग्य निर्देशांक मोजण्यासाठी आणि त्वरित उपाय मिळवण्यासाठी फोटो अपलोड करा.',
    loadTomatoBlight: 'टोमॅटो करपा रोग नमुना पहा',
    confidence: 'अचूकता',
    canopyGreenness: 'हिरवेगारपणा',
    chlorosis: 'पिवळेपणा (क्लोरोसिस)',
    necrosis: 'सुकलेले ठिपके (नेक्रोसिस)',
    symptomsTitle: 'ओळखलेली लक्षणे',
    untreatedRiskTitle: 'उपचार न केल्यास होणारे नुकसान',
    recoveryPrognosisTitle: 'सुधारणेचा अंदाज',
    curativeInterventions: 'उपचारात्मक उपाययोजना',
    immediatePlan: 'तातडीची उपचार योजना',
    organicControls: 'सेंद्रिय व जैविक नियंत्रण',
    organicSub: 'रसायनमुक्त, परागीभवनास सुरक्षित उपाय',
    chemicalControls: 'लक्षित कृषी-रासायनिक फवारणी',
    chemicalSub: 'शिफारस केलेले प्रमाण आणि काढणीपूर्व अंतर (PHI) पाळा',
    culturalControls: 'मशागत व पीक व्यवस्थापन',
    culturalSub: 'छाटणी, हवा खेळती ठेवणे आणि पाणी व्यवस्थापन',
    viewRoadmap: 'संपूर्ण पीक चक्र आराखडा पहा',
    viewRoadmapSub: 'रोपावस्थेपासून काढणीपर्यंत हा रोग पुन्हा उद्भवू नये म्हणून दक्षता घ्या.',
    exploreRoadmapBtn: 'संपूर्ण आराखडा पहा',
    backToDiag: 'परत रोग निदानावर जा',
    listenDiagnosis: 'ऑडिओ ऐका',
    stopAudio: 'थांबवा',
    speaking: 'बोलत आहे…',
    selectCrop: 'पीक निवडा:',
    newScanFor: 'नवीन स्कॅन नोंदवा:',
    trajectoryTitle: 'पीक आरोग्य प्रक्षेप',
    trajectoryHeader: 'काळानुसार पीक आरोग्य विश्लेषण',
    trajectoryDesc: 'संपूर्ण हंगामात पिकाची वाढ, रोग नियंत्रण आणि आरोग्य सुधारणेवर लक्ष ठेवा.',
    sampleModeNotice: 'नमुना मोड: प्रात्यक्षिक विश्लेषण पाहत आहात. स्वतःच्या शेताची नोंद ठेवण्यासाठी नवीन स्कॅन करा.',
    trendRecovery: 'सुधारणेकडे कल',
    trendDeclining: 'लक्ष देणे आवश्यक',
    trendStable: 'स्थिर आरोग्य',
    firstScan: 'सुरुवातीचा स्कॅन',
    latestScan: 'सध्याची स्थिती',
    recoveryGained: 'एकूण सुधारणा',
    visualSymptomsObserved: 'दिसून आलेली लक्षणे:',
    fieldNotesLabel: 'शेतातील नोंदी:',
    roadmapHeader: 'संपूर्ण प्रतिबंधात्मक व उपचारात्मक आराखडा',
    roadmapSub: 'वाढीच्या प्रत्येक टप्प्यावर रोग प्रतिबंध व नियंत्रणासाठी योग्य मार्गदर्शन.',
    stageSeedling: 'रोपावस्था व रोपवाटिका',
    stageVegetative: 'सक्रिय शाकीय वाढीची अवस्था',
    stageFlowering: 'फुलधारणा अवस्था',
    stageFruiting: 'फळधारणा व दाणे भरण्याची अवस्था',
    stageHarvest: 'परिपक्वता व काढणी अवस्था',
    statusHealthy: 'उत्कृष्ट स्थिती',
    statusWarning: 'उपाययोजना शिफारस',
    statusCritical: 'गंभीर चिंता / तातडीने लक्ष द्या',
    severityNone: 'काहीही नाही',
    severityMild: 'किरकोळ',
    severityModerate: 'मध्यम',
    severitySevere: 'तीव्र',
  }
};

export const DISEASE_TRANSLATIONS = {
  early_blight: {
    en: {
      name: 'Early Blight (Alternaria solani)',
      category: 'Fungal Disease',
      severity: 'Moderate',
      symptoms: [
        'Dark brown circular lesions with concentric target-board rings',
        'Chlorotic yellowing around lesions on lower mature leaves',
        'Premature leaf drop starting from lower canopy'
      ],
      organic_remedies: [
        'Spray Neem seed kernel extract (NSKE 5%) or cold-pressed Neem oil @ 5 ml/L',
        'Apply Trichoderma viride or Pseudomonas fluorescens @ 5 g/L to foliage and root zone',
        'Spray sour buttermilk or copper-based bio-fungicide during early morning hours'
      ],
      chemical_remedies: [
        'Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2 g/L as protective spray',
        'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L for systemic curative action',
        'Observe mandatory 7-day pre-harvest interval (PHI) before picking fruit'
      ],
      cultural_practices: [
        'Prune and safely burn or bury all infected bottom leaves (defoliation)',
        'Switch to drip irrigation; strictly avoid overhead wetting of leaves',
        'Mulch beds with straw or silver-black plastic to prevent soil splash onto foliage',
        'Increase row spacing to improve canopy ventilation'
      ],
      untreated_risk: 'Can cause 40-55% defoliation, sunscald on exposed fruit, and secondary stem cankers within 14 days.',
      recovery_forecast: 'Arrests new lesion spread within 48-72 hours of treatment; healthy new canopy growth visible in 7-10 days.'
    },
    te: {
      name: 'టమాటా ముందస్తు తెగులు (ఆల్టర్నేరియా సోలాని)',
      category: 'శిలీంధ్ర వ్యాధి',
      severity: 'మధ్యస్థం',
      symptoms: [
        'దిగువ ముదిరిన ఆకులపై వలయాల వంటి గోధుమ రంగు మచ్చలు',
        'మచ్చల చుట్టూ ఆకులు పసుపు రంగులోకి మారడం',
        'కింది ఆకులు ముందే రాలిపోవడం'
      ],
      organic_remedies: [
        'వేప నూనె (NSKE 5%) లేదా కోల్డ్-ప్రెస్డ్ వేప నూనె 5 మి.లీ/లీటరు నీటిలో కలిపి పిచికారీ చేయండి',
        'ట్రైకోడెర్మా విరిడే లేదా సూడోమోనాస్ ఫ్లోరోసెన్స్ 5 గ్రా/లీటరు చొప్పున ఆకులు మరియు మొదళ్ల వద్ద పిచికారీ చేయండి',
        'పుల్లటి మజ్జిగ ద్రావణం లేదా రాగి ఆధారిత జీవ శిలీంధ్రనాశిని ఉదయం వేళల్లో పిచికారీ చేయండి'
      ],
      chemical_remedies: [
        'మాంకోజెబ్ 75% WP 2.5 గ్రా/లీ లేదా క్లోరోథలోనిల్ 75% WP 2 గ్రా/లీ రక్షక స్ప్రేగా పిచికారీ చేయండి',
        'అజోక్సిస్ట్రోబిన్ 18.2% + డైఫెనోకోనజోల్ 11.4% SC 1 మి.లీ/లీ దైహిక చికిత్స కోసం పిచికారీ చేయండి',
        'కాయలు కోయడానికి ముందు కనీసం 7 రోజుల విరామం (PHI) పాటించండి'
      ],
      cultural_practices: [
        'తెగులు సోకిన దిగువ ఆకులను తుంచి కాల్చివేయండి లేదా పాతిపెట్టండి',
        'బిందు సేద్యం (డ్రిప్) వాడండి; ఆకులపై నీరు పడకుండా చూడండి',
        'మట్టిలోని శిలీంధ్రాలు ఆకులపై పడకుండా గడ్డి లేదా ప్లాస్టిక్ మల్చింగ్ వేయండి',
        'గాలి ప్రసరణ కోసం మొక్కల మధ్య తగినంత దూరం ఉంచండి'
      ],
      untreated_risk: '14 రోజుల్లో 40-55% ఆకులు రాలిపోవడం మరియు కాయలపై మచ్చలు ఏర్పడి పంట తీవ్రంగా దెబ్బతింటుంది.',
      recovery_forecast: 'మందు పిచికారీ చేసిన 48-72 గంటల్లో తెగులు వ్యాప్తి ఆగుతుంది; 7-10 రోజుల్లో కొత్త చిగుళ్ళు ఆరోగ్యంగా వస్తాయి.'
    },
    hi: {
      name: 'टमाटर अगेती झुलसा रोग (अल्टरनेरिया सोलानी)',
      category: 'कवक जनित रोग',
      severity: 'मध्यम',
      symptoms: [
        'निचली पत्तियों पर गोल संकेन्द्रीय छल्लों (टारगेट-बोर्ड) जैसे भूरे धब्बे',
        'धब्बों के चारों ओर पत्तियों का पीला पड़ना',
        'निचली पत्तियों का समय से पहले गिरना'
      ],
      organic_remedies: [
        'नीम बीज अर्क (एनएसकेई 5%) या नीम का तेल 5 मिली/लीटर पानी में मिलाकर छिड़कें',
        'ट्राइकोडर्मा विरिडी या स्यूडोमोनास 5 ग्राम/लीटर पत्तियों व जड़ों पर डालें',
        'खट्टी छाछ या तांबा आधारित जैव कवकनाशी का सुबह के समय छिड़काव करें'
      ],
      chemical_remedies: [
        'मैंकोजेब 75% डब्ल्यूपी 2.5 ग्राम/लीटर या क्लोरोथैलोनिल 2 ग्राम/लीटर का छिड़काव करें',
        'अज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% एससी 1 मिली/लीटर का छिड़काव करें',
        'फल तुड़ाई से पहले कम से कम 7 दिन का प्रतीक्षा समय (PHI) अवश्य रखें'
      ],
      cultural_practices: [
        'संक्रमित निचली पत्तियों को तोड़कर खेत से दूर जला दें या दबा दें',
        'ड्रिप सिंचाई अपनाएं; पत्तियों पर ऊपर से पानी छिड़कने से बचें',
        'मिट्टी के छींटों से बचाव के लिए पुआल या प्लास्टिक मल्चिंग का उपयोग करें',
        'हवा के संचलन के लिए पौधों के बीच पर्याप्त दूरी रखें'
      ],
      untreated_risk: '14 दिनों के भीतर 40-55% पत्तियाँ झड़ सकती हैं और फल धूप से झुलस सकते हैं।',
      recovery_forecast: 'उपचार के 48-72 घंटों में नए धब्बों का प्रसार रुकता है; 7-10 दिनों में नई स्वस्थ पत्तियाँ निकलती हैं।'
    },
    kn: {
      name: 'ಟೊಮ್ಯಾಟೊ ಆರಂಭಿಕ ಕರಗು ರೋಗ (ಆಲ್ಟರ್ನೇರಿಯಾ ಸೊಲಾನಿ)',
      category: 'ಶಿಲೀಂಧ್ರ ರೋಗ',
      severity: 'ಮಧ್ಯಮ',
      symptoms: [
        'ಕೆಳಗಿನ ಬಲಿತ ಎಲೆಗಳ ಮೇಲೆ ವೃತ್ತಾಕಾರದ ಕಂದು ಬಣ್ಣದ ಚುಕ್ಕೆಗಳು',
        'ಚುಕ್ಕೆಗಳ ಸುತ್ತಲೂ ಎಲೆಗಳು ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗುವುದು',
        'ಕೆಳಭಾಗದ ಎಲೆಗಳು ಅಕಾಲಿಕವಾಗಿ ಉದುರುವುದು'
      ],
      organic_remedies: [
        'ಬೇವಿನ ಎಣ್ಣೆ (NSKE 5%) 5 ಮಿಲಿ/ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ',
        'ಟ್ರೈಕೋಡರ್ಮ ವಿರಿಡೆ ಅಥವಾ ಸ್ಯೂಡೋಮೊನಾಸ್ 5 ಗ್ರಾಂ/ಲೀಟರ್ ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಿಸಿ',
        'ಹುಳಿ ಮಜ್ಜಿಗೆಯ ದ್ರಾವಣವನ್ನು ಬೆಳಗಿನ ಜಾವ ಸಿಂಪಡಿಸಿ'
      ],
      chemical_remedies: [
        'ಮ್ಯಾಂಕೋಜೆಬ್ 75% ಡಬ್ಲ್ಯುಪಿ 2.5 ಗ್ರಾಂ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ',
        'ಅಜೋಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ + ಡೈಫೆನೊಕೊನಜೋಲ್ 1 ಮಿಲಿ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ',
        'ಹಣ್ಣು ಕೀಳುವ ಮೊದಲು 7 ದಿನಗಳ ಅಂತರವನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಪಾಲಿಸಿ'
      ],
      cultural_practices: [
        'ರೋಗಪೀಡಿತ ಕೆಳಗಿನ ಎಲೆಗಳನ್ನು ತೆಗೆದು ಸುಟ್ಟುಹಾಕಿ',
        'ಹನಿ ನೀರಾವರಿ ಬಳಸಿ; ಎಲೆಗಳ ಮೇಲೆ ನೇರವಾಗಿ ನೀರು ಬೀಳದಂತೆ ನೋಡಿಕೊಳ್ಳಿ',
        'ಸಾಲುಗಳ ನಡುವೆ ಗಾಳಿ ಬೆಳಕು ಚೆನ್ನಾಗಿ ಆಡುವಂತೆ ಅಂತರವಿರಿಸಿ'
      ],
      untreated_risk: '14 ದಿನಗಳಲ್ಲಿ 40-55% ಎಲೆಗಳು ಉದುರಿ ಕಾಯಿಗಳ ಮೇಲೆ ಕಲೆಗಳು ಉಂಟಾಗಬಹುದು.',
      recovery_forecast: 'ಸಿಂಪಡಿಸಿದ 48-72 ಗಂಟೆಗಳಲ್ಲಿ ರೋಗ ಹರಡುವಿಕೆ ನಿಲ್ಲುತ್ತದೆ; 7-10 ದಿನಗಳಲ್ಲಿ ಹೊಸ ಚಿಗುರುಗಳು ಬರುತ್ತವೆ.'
    },
    ta: {
      name: 'தக்காளி முன்கூட்டிய கருகல் நோய் (ஆல்டர்நேரியா சொலானி)',
      category: 'பூஞ்சை நோய்',
      severity: 'மிதமானது',
      symptoms: [
        'கீழ் இலைகளில் வளைய வடிவிலான அடர் பழுப்பு நிறப் புள்ளிகள்',
        'புள்ளிகளைச் சுற்றி இலைகள் மஞ்சளாதல்',
        'கீழ் இலைகள் முன்கூட்டியே உதிர்தல்'
      ],
      organic_remedies: [
        'வேப்ப எண்ணெய் (5%) 5 மி.லி/லிட்டர் நீரில் கலந்து தெளிக்கவும்',
        'டிரைக்கோடெர்மா விரிடி அல்லது சூடோமோனாஸ் 5 கிராம்/லிட்டர் தெளிக்கவும்',
        'புளித்த மோர் கரைசலை அதிகாலை வேளையில் தெளிக்கவும்'
      ],
      chemical_remedies: [
        'மேன்கோசெப் 75% WP 2.5 கிராம்/லிட்டர் தெளிக்கவும்',
        'அசோக்சிஸ்ட்ரோபின் + டைபனோகோனசோல் 1 மி.லி/லிட்டர் தெளிக்கவும்',
        'பழம் பறிப்பதற்கு முன் 7 நாட்கள் இடைவெளி விடவும்'
      ],
      cultural_practices: [
        'பாதிக்கப்பட்ட கீழ் இலைகளை அகற்றி எரிக்கவும்',
        'சொட்டு நீர்ப்பாசனத்தைப் பயன்படுத்தவும்; இலைகளில் நீர் தெளிப்பதைத் தவிர்க்கவும்',
        'காற்றோட்டத்திற்கு செடிகளுக்கு இடையே போதிய இடைவெளி விடவும்'
      ],
      untreated_risk: '14 நாட்களில் 40-55% இலைகள் உதிர்ந்து காய்கள் சேதமடைய வாய்ப்புள்ளது.',
      recovery_forecast: 'மருந்து தெளித்த 48-72 மணி நேரத்தில் நோய் பரவுவது நிற்கும்; 7-10 நாட்களில் புதிய தளிர்கள் தோன்றும்.'
    },
    mr: {
      name: 'टोमॅटोवरील लवकर येणारा करपा (अल्टरनेरिया सोलानी)',
      category: 'बुरशीजन्य रोग',
      severity: 'मध्यम',
      symptoms: [
        'खालच्या पानांवर गोल रिंगसारखे तपकिरी ठिपके',
        'ठिपक्यांच्या भोवती पाने पिवळी पडणे',
        'खालची पाने अकाली गळणे'
      ],
      organic_remedies: [
        'निंबोळी अर्क (५%) किंवा निंबोळी तेल ५ मिली/लिटर पाण्यात मिसळून फवारा',
        'ट्रायकोडर्मा व्हिरिडी किंवा स्यूडोमोनास ५ ग्रॅम/लिटर फवारा',
        'आंबट ताक किंवा तांबेयुक्त सेंद्रिय बुरशीनाशक सकाळी फवारा'
      ],
      chemical_remedies: [
        'मँकोझेब ७५% डब्ल्यूपी २.५ ग्रॅम/लिटर फवारा',
        'अझॉक्सीस्ट्रोबिन + डायफेनोकोनॅझोल १ मिली/लिटर फवारा',
        'फळे तोडण्यापूर्वी किमान ७ दिवसांचा कालावधी (PHI) पाळा'
      ],
      cultural_practices: [
        'रोगट पाने तोडून शेताबाहेर नष्ट करा',
        'ठिबक सिंचन वापरा; पानांवर पाणी साचू देऊ नका',
        'हवा खेळती राहण्यासाठी रोपांमध्ये योग्य अंतर ठेवा'
      ],
      untreated_risk: '१४ दिवसांत ४०-५५% पाने गळू शकतात आणि फळे खराब होऊ शकतात.',
      recovery_forecast: 'फवारणीनंतर ४८-७२ तासांत प्रसार थांबतो; ७-१० दिवसांत नवीन निरोगी पाने फुटतात.'
    }
  },

  blast: {
    en: {
      name: 'Rice Blast (Magnaporthe oryzae)',
      category: 'Fungal Disease',
      severity: 'Severe',
      symptoms: [
        'Spindle or diamond-shaped lesions with grey or whitish centers and brown margins',
        'Coalescing lesions causing complete drying and firing of leaf blades',
        'Dark necrotic lesions at node and neck of the panicle (neck blast)'
      ],
      organic_remedies: [
        'Seed treatment with Pseudomonas fluorescens @ 10 g/kg seed',
        'Foliar spray of 10% Kasugamycin bio-formulation or fermented buttermilk with garlic'
      ],
      chemical_remedies: [
        'Tricyclazole 75% WP @ 0.6 g/L (highly specific and effective against blast)',
        'Isoprothiolane 40% EC @ 1.5 ml/L or Azoxystrobin @ 1 ml/L'
      ],
      cultural_practices: [
        'Avoid excessive or late split applications of nitrogen fertilizer',
        'Maintain a thin layer of standing water; do not allow field to dry out during blast warning',
        'Burn stubble of previously infected blast crops'
      ],
      untreated_risk: 'Neck blast can cause up to 70-80% empty or chaffy grains and lodging.',
      recovery_forecast: 'Foliar lesions stabilize in 3-5 days; prompt action prevents catastrophic neck blast.'
    },
    te: {
      name: 'వరి అగ్గి తెగులు (మాగ్నాపోర్తే ఒరైజే)',
      category: 'శిలీంధ్ర వ్యాధి',
      severity: 'తీవ్రం',
      symptoms: [
        'ఆకులపై నూలు కండె (స్పిండిల్) ఆకారంలో బూడిద రంగు కేంద్రం మరియు గోధుమ అంచులు గల మచ్చలు',
        'మచ్చలు కలిసిపోయి ఆకులు పూర్తిగా ఎండిపోయి అగ్ని తగిలినట్లు మారడం',
        'కంకి మెడ వద్ద నల్లటి మచ్చలు ఏర్పడి విరిగిపోవడం (మెడ విరుపు)'
      ],
      organic_remedies: [
        'విత్తన శుద్ధి: సూడోమోనాస్ ఫ్లోరోసెన్స్ 10 గ్రా/కేజీ విత్తనానికి పట్టించండి',
        'కాసుగామైసిన్ జీవ మిశ్రమం లేదా ఇంగువ-వెల్లుల్లి పులిసిన మజ్జిగ ద్రావణం పిచికారీ చేయండి'
      ],
      chemical_remedies: [
        'ట్రైసైక్లాజోల్ 75% WP 0.6 గ్రా/లీటరు నీటిలో కలిపి పిచికారీ చేయండి (అగ్గి తెగులుకు అత్యంత ప్రభావవంతమైనది)',
        'ఐసోప్రోథియోలేన్ 40% EC 1.5 మి.లీ/లీ లేదా అజోక్సిస్ట్రోబిన్ 1 మి.లీ/లీ పిచికారీ చేయండి'
      ],
      cultural_practices: [
        'నత్రజని ఎరువులను ఒకేసారి ఎక్కువగా వాడకండి, దఫాలుగా వేయండి',
        'పొలంలో పలుచటి నీటి నిల్వను కొనసాగించండి; నేల పూర్తిగా ఆరిపోనివ్వకండి',
        'తెగులు సోకిన పంట మోడులను కాల్చివేయండి'
      ],
      untreated_risk: 'మెడ విరుపు తెగులు వల్ల 70-80% తాలు గింజలు ఏర్పడి దిగుబడి తీవ్రంగా పడిపోతుంది.',
      recovery_forecast: '3-5 రోజుల్లో ఆకులపై మచ్చల వ్యాప్తి అదుపులోకి వస్తుంది; సకాలంలో పిచికారీ చేస్తే మెడ విరుపు నివారించవచ్చు.'
    },
    hi: {
      name: 'धान का ब्लास्ट / झोंका रोग (मैग्नापोर्थे ओराइजी)',
      category: 'कवक जनित रोग',
      severity: 'गंभीर',
      symptoms: [
        'पत्तियों पर नाव या धुरी के आकार के धब्बे जिनका केंद्र धूसर और किनारे भूरे होते हैं',
        'धब्बे आपस में मिलकर पत्तियों को पूरी तरह झुलसा देते हैं',
        'बाली की गर्दन पर काले धब्बे पड़ना (गर्दन तोड़ / नेक ब्लास्ट)'
      ],
      organic_remedies: [
        'स्यूडोमोनास फ्लोरोसेंस 10 ग्राम/किग्रा बीज से बीजोपचार करें',
        'कासुगामाइसिन जैव-फॉर्मूलेशन या लहसुन-छाछ के घोल का छिड़काव करें'
      ],
      chemical_remedies: [
        'ट्राइसाइक्लाजोल 75% डब्ल्यूपी 0.6 ग्राम/लीटर (ब्लास्ट के लिए सर्वोत्तम दवा)',
        'आइसोप्रोपियोलेन 40% ईसी 1.5 मिली/लीटर या अज़ोक्सीस्ट्रोबिन 1 मिली/लीटर का छिड़काव करें'
      ],
      cultural_practices: [
        'नाइट्रोजन (यूरिया) का अत्यधिक व देर से उपयोग न करें; संतुलित पोटाश दें',
        'खेत में हल्का पानी बनाए रखें; ब्लास्ट के प्रकोप के समय खेत को सूखने न दें',
        'संक्रमित फ़सल के अवशेषों को नष्ट कर दें'
      ],
      untreated_risk: 'नेक ब्लास्ट से 70-80% दाने खोखले (पोचे) हो सकते हैं और भारी नुकसान होता है।',
      recovery_forecast: '3-5 दिनों में पत्तियों के धब्बे स्थिर हो जाते हैं; समय पर उपचार नेक ब्लास्ट को रोकता है।'
    },
    kn: {
      name: 'ಭತ್ತದ ಬೆಂಕಿ ರೋಗ / ಬ್ಲಾಸ್ಟ್ (ಮ್ಯಾಗ್ನಾಪೋರ್ಥೆ ಒರೈಜೆ)',
      category: 'ಶಿಲೀಂಧ್ರ ರೋಗ',
      severity: 'ತೀವ್ರ',
      symptoms: [
        'ಎಲೆಗಳ ಮೇಲೆ ಕದಿರಿನ ಆಕಾರದ ಬೂದು ಕೇಂದ್ರ ಮತ್ತು ಕಂದು ಅಂಚಿನ ಚುಕ್ಕೆಗಳು',
        'ಚುಕ್ಕೆಗಳು ಒಟ್ಟಾಗಿ ಎಲೆಗಳು ಸುಟ್ಟಂತೆ ಒಣಗುವುದು',
        'ತೆನೆಯ ಕತ್ತಿನ ಭಾಗದಲ್ಲಿ ಕಪ್ಪು ಕಲೆಗಳು ಉಂಟಾಗಿ ಮುರಿಯುವುದು (ಕುತ್ತಿಗೆ ಬೆಂಕಿ ರೋಗ)'
      ],
      organic_remedies: [
        'ಸ್ಯೂಡೋಮೊನಾಸ್ 10 ಗ್ರಾಂ/ಕೆಜಿ ಬೀಜೋಪಚಾರ ಮಾಡಿ',
        'ಕಸುಗಾಮೈಸಿನ್ ಜೈವಿಕ ದ್ರಾವಣವನ್ನು ಸಿಂಪಡಿಸಿ'
      ],
      chemical_remedies: [
        'ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ 75% ಡಬ್ಲ್ಯುಪಿ 0.6 ಗ್ರಾಂ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ',
        'ಐಸೊಪ್ರೊಥಿಯೊಲೇನ್ 40% ಇಸಿ 1.5 ಮಿಲಿ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ'
      ],
      cultural_practices: [
        'ಸಾರಜನಕ ಗೊಬ್ಬರವನ್ನು ಅತಿಯಾಗಿ ಬಳಸಬೇಡಿ',
        'ಗದ್ದೆಯಲ್ಲಿ ತೆಳುವಾದ ನೀರಿನ ಮಟ್ಟವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಿ',
        'ರೋಗಪೀಡಿತ ಕೊಳೆತ ಕಸವನ್ನು ಸುಟ್ಟುಹಾಕಿ'
      ],
      untreated_risk: 'ಕುತ್ತಿಗೆ ಬೆಂಕಿ ರೋಗದಿಂದ 70-80% ಕಾಳುಗಳು ಜೊಳ್ಳಾಗುವ ಅಪಾಯವಿದೆ.',
      recovery_forecast: '3-5 ದಿನಗಳಲ್ಲಿ ಎಲೆಗಳ ಚುಕ್ಕೆಗಳು ನಿಯಂತ್ರಣಕ್ಕೆ ಬರುತ್ತವೆ.'
    },
    ta: {
      name: 'நெல் குலை நோய் / பிளாஸ்ட் (மேக்னபோர்த்தே ஒரைசே)',
      category: 'பூஞ்சை நோய்',
      severity: 'தீவிரமானது',
      symptoms: [
        'இலைகளில் கதிர் வடிவிலான சாம்பல் நிற மையமும் பழுப்பு ஓரமும் கொண்ட புள்ளிகள்',
        'புள்ளிகள் இணைந்து இலைகள் தீய்ந்து போதல்',
        'கதிர் கழுத்துப் பகுதியில் கரும்புள்ளிகள் தோன்றி கதிர் முறிதல்'
      ],
      organic_remedies: [
        'சூடோமோனாஸ் 10 கிராம்/கிலோ விதை நேர்த்தி செய்யவும்',
        'காசுகாமைசின் உயிரி கரைசல் தெளிக்கவும்'
      ],
      chemical_remedies: [
        'டிரைசைக்ளசோல் 75% WP 0.6 கிராம்/லிட்டர் தெளிக்கவும்',
        'ஐசோபுரோதியோலேன் 1.5 மி.லி/லிட்டர் தெளிக்கவும்'
      ],
      cultural_practices: [
        'அளவுக்கு அதிகமான தழைச்சத்து உரங்களைத் தவிர்க்கவும்',
        'வயலில் சீரான நீர்மட்டத்தைப் பராமரிக்கவும்; வயல் காய விடக்கூடாது',
        'பாதிக்கப்பட்ட பயிர் தாள்களை எரிக்கவும்'
      ],
      untreated_risk: 'கழுத்து குலை நோயால் 70-80% மணிகள் பதராகி மகசூல் பெருமளவு குறையும்.',
      recovery_forecast: '3-5 நாட்களில் இலைப் புள்ளிகள் கட்டுக்குள் வரும்.'
    },
    mr: {
      name: 'भातावरील करपा / ब्लास्ट (मॅग्नापोर्थे ओरायझी)',
      category: 'बुरशीजन्य रोग',
      severity: 'तीव्र',
      symptoms: [
        'पानांवर डोळ्यासारखे किंवा धुरीच्या आकाराचे करडे-तपकिरी ठिपके',
        'ठिपके पसरून पाने होरपळल्यासारखी सुकणे',
        'लोंबीच्या मानेवर काळे ठिपके पडून मान मोडणे (मानेवरील करपा)'
      ],
      organic_remedies: [
        'स्यूडोमोनास १० ग्रॅम/किलो बियाण्यास चोळा',
        'कासुगामायसिन जैविक औषध किंवा लसूण-ताक फवारा'
      ],
      chemical_remedies: [
        'ट्रायसायक्लाझोल ७५% डब्ल्यूपी ०.६ ग्रॅम/लिटर फवारा (ब्लास्टवर सर्वोत्तम)',
        'आयसोप्रोथिओलेन १.५ मिली/लिटर फवारा'
      ],
      cultural_practices: [
        'युरियाचा अतिरेकी वापर टाळा; पलाश खताचा वापर वाढवा',
        'शेतात पातळ पाणी साचवून ठेवा; शेत कोरडे पडू देऊ नका',
        'रोगट पिकाचे अवशेष नष्ट करा'
      ],
      untreated_risk: 'मानेवरील करप्यामुळे ७०-८०% दाणे पोचट होऊन मोठे नुकसान होऊ शकते.',
      recovery_forecast: '३-५ दिवसांत ठिपक्यांचा प्रसार थांबतो.'
    }
  },

  angular_leaf_spot: {
    en: {
      name: 'Cotton Angular Leaf Spot / Bacterial Blight',
      category: 'Bacterial Disease',
      severity: 'Moderate',
      symptoms: [
        'Angular, water-soaked spots on leaves delimited by small veins',
        'Lesions turn reddish-brown to dark black with time',
        'Black arm symptoms on petioles and young stems leading to branch snapping'
      ],
      organic_remedies: [
        'Seed treatment with Pseudomonas fluorescens @ 10 g/kg',
        'Foliar spray of 1% Bordeaux mixture or Copper Hydroxide @ 2 g/L'
      ],
      chemical_remedies: [
        'Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 0.5 g/L',
        'Repeat after 12-14 days if rainy weather persists'
      ],
      cultural_practices: [
        'Acid-delint seed prior to sowing (100 ml concentrated H2SO4 per kg seed)',
        'Avoid high plant densities; thin seedlings to maintain optimal spacing'
      ],
      untreated_risk: 'Can cause boll rot, lint staining, and loss of 25-35% fruiting branches.',
      recovery_forecast: 'Arrests spread to squares and young bolls within 5-7 days.'
    },
    te: {
      name: 'పత్తి బాక్టీరియా ఆకుమచ్చ తెగులు / కోణీయ మచ్చ తెగులు',
      category: 'బాక్టీరియా వ్యాధి',
      severity: 'మధ్యస్థం',
      symptoms: [
        'ఆకు ఈనెల మధ్య కోణాకారపు నీటి మచ్చలు',
        'కాలక్రమేణా మచ్చలు ముదురు ఎరుపు-గోధుమ మరియు నలుపు రంగులోకి మారడం',
        'కొమ్మలు మరియు కాడలపై నల్లటి చారలు ఏర్పడి కొమ్మలు విరిగిపోవడం (బ్లాక్ ఆర్మ్)'
      ],
      organic_remedies: [
        'సూడోమోనాస్ ఫ్లోరోసెన్స్ 10 గ్రా/కేజీ విత్తనంతో విత్తన శుద్ధి',
        '1% బోర్డో మిశ్రమం లేదా కాపర్ హైడ్రాక్సైడ్ 2 గ్రా/లీ పిచికారీ చేయండి'
      ],
      chemical_remedies: [
        'కాపర్ ఆక్సీక్లోరైడ్ 50% WP 2.5 గ్రా/లీ + స్ట్రెప్టోసైక్లిన్ 0.5 గ్రా/లీ కలిపి పిచికారీ చేయండి',
        'వర్షాలు కొనసాగితే 12-14 రోజుల తర్వాత మళ్లీ పిచికారీ చేయండి'
      ],
      cultural_practices: [
        'యాసిడ్ డీలింటింగ్ చేసిన విత్తనాలను మాత్రమే వాడండి',
        'మొక్కల మధ్య తగినంత దూరం (90x60 సెం.మీ) ఉంచండి, సాంద్రత తగ్గించండి'
      ],
      untreated_risk: 'కాయ కుళ్ళు, పత్తి నాణ్యత దెబ్బతినడం మరియు 25-35% కొమ్మలు కోల్పోయే ప్రమాదం ఉంది.',
      recovery_forecast: 'చికిత్స తర్వాత 5-7 రోజుల్లో పిందెలు మరియు కొత్త కాయలకు తెగులు వ్యాప్తి ఆగుతుంది.'
    },
    hi: {
      name: 'कपास का कोणीय पत्ती धब्बा / जीवाणु झुलसा रोग',
      category: 'जीवाणु जनित रोग',
      severity: 'मध्यम',
      symptoms: [
        'पत्तियों की नसों के बीच कोणीय, पानी से भीगे हुए जैसे धब्बे',
        'समय के साथ धब्बे लाल-भूरे और गहरे काले हो जाते हैं',
        'टहनियों पर काले घाव (ब्लैक आर्म) जिससे टहनियाँ टूट जाती हैं'
      ],
      organic_remedies: [
        'स्यूडोमोनास 10 ग्राम/किग्रा बीज से बीजोपचार करें',
        '1% बोर्डो मिश्रण या कॉपर हाइड्रॉक्साइड 2 ग्राम/लीटर का छिड़काव करें'
      ],
      chemical_remedies: [
        'कॉपर ऑक्सीक्लोराइड 50% डब्ल्यूपी 2.5 ग्राम + स्ट्रेप्टोसाइक्लिन 0.5 ग्राम/लीटर मिलाकर छिड़कें',
        'बारिश जारी रहने पर 12-14 दिनों के बाद दोहराएं'
      ],
      cultural_practices: [
        'बुवाई से पहले तेजाब से रोएँ रहित (डीलिंटेड) बीज का उपयोग करें',
        'पौधों के बीच पर्याप्त दूरी रखें; सघन बुवाई से बचें'
      ],
      untreated_risk: 'टिंडों का सड़ना, रुई पर दाग और 25-35% फलदार शाखाओं का नुकसान हो सकता है।',
      recovery_forecast: '5-7 दिनों के भीतर नए फूलों व टिंडों में रोग का फैलाव रुक जाता है।'
    },
    kn: {
      name: 'ಹತ್ತಿಯ ಕೋನೀಯ ಎಲೆ ಚುಕ್ಕೆ / ಬ್ಯಾಕ್ಟೀರಿಯಾ ರೋಗ',
      category: 'ಬ್ಯಾಕ್ಟೀರಿಯಾ ರೋಗ',
      severity: 'ಮಧ್ಯಮ',
      symptoms: [
        'ಎಲೆಗಳ ನರಗಳ ನಡುವೆ ಕೋನೀಯ ನೀರಿನಂತಹ ಚುಕ್ಕೆಗಳು',
        'ಚುಕ್ಕೆಗಳು ಕೆಂಪು-ಕಂದು ಮತ್ತು ಕಪ್ಪು ಬಣ್ಣಕ್ಕೆ ತಿರುಗುವುದು',
        'ರೆಂಬೆಗಳ ಮೇಲೆ ಕಪ್ಪು ಕಲೆಗಳು ಉಂಟಾಗಿ ಮುರಿಯುವುದು (ಬ್ಲ್ಯಾಕ್ ಆರ್ಮ್)'
      ],
      organic_remedies: [
        'ಸ್ಯೂಡೋಮೊನಾಸ್ 10 ಗ್ರಾಂ/ಕೆಜಿ ಬೀಜೋಪಚಾರ ಮಾಡಿ',
        '1% ಬೋರ್ಡೋ ಮಿಶ್ರಣ ಸಿಂಪಡಿಸಿ'
      ],
      chemical_remedies: [
        'ಕಾಪರ್ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ 2.5 ಗ್ರಾಂ + ಸ್ಟ್ರೆಪ್ಟೋಸೈಕ್ಲಿನ್ 0.5 ಗ್ರಾಂ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ'
      ],
      cultural_practices: [
        'ಆಸಿಡ್ ಡಿಲಿಂಟ್ ಮಾಡಿದ ಪ್ರಮಾಣೀಕೃತ ಬೀಜಗಳನ್ನು ಬಳಸಿ',
        'ಗಿಡಗಳ ನಡುವೆ ಸರಿಯಾದ ಅಂತರವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ'
      ],
      untreated_risk: 'ಹತ್ತಿ ಕಾಯಿ ಕೊಳೆತು ಹತ್ತಿಯ ಗುಣಮಟ್ಟ ಹಾಳಾಗುವ ಅಪಾಯವಿದೆ.',
      recovery_forecast: '5-7 ದಿನಗಳಲ್ಲಿ ಹರಡುವಿಕೆ ನಿಯಂತ್ರಣಕ್ಕೆ ಬರುತ್ತದೆ.'
    },
    ta: {
      name: 'பருத்தி கோண இலைப்புள்ளி நோய் / பாக்டீரியா கருகல்',
      category: 'பாக்டீரியா நோய்',
      severity: 'மிதமானது',
      symptoms: [
        'இலை நரம்புகளுக்கு இடையே கோண வடிவ ஈரப்பதம் போன்ற புள்ளிகள்',
        'நாளடைவில் புள்ளிகள் செம்பழுப்பு மற்றும் கருப்பாக மாறுதல்',
        'கிளைகளில் கரும் புண்கள் தோன்றி கிளைகள் முறிதல் (பிளாக் ஆர்ம்)'
      ],
      organic_remedies: [
        'சூடோமோனாஸ் 10 கிராம்/கிலோ விதை நேர்த்தி செய்யவும்',
        '1% போர்டோ கலவை தெளிக்கவும்'
      ],
      chemical_remedies: [
        'காப்பர் ஆக்ஸிகுளோரைடு 2.5 கிராம் + ஸ்ட்ரெப்டோமைசின் 0.5 கிராம்/லிட்டர் தெளிக்கவும்'
      ],
      cultural_practices: [
        'அமிலத்தால் பஞ்சு நீக்கப்பட்ட விதைகளைப் பயன்படுத்தவும்',
        'செடிகளுக்கு இடையே போதிய இடைவெளி விடவும்'
      ],
      untreated_risk: 'காய் அழுகல் மற்றும் 25-35% காய்க்கும் கிளைகள் சேதமடையலாம்.',
      recovery_forecast: '5-7 நாட்களில் நோய் பரவல் கட்டுப்படும்.'
    },
    mr: {
      name: 'कापसावरील कोनीय ठिपके / जिवाणूजन्य करपा',
      category: 'जिवाणूजन्य रोग',
      severity: 'मध्यम',
      symptoms: [
        'पानांच्या शिरांच्या दरम्यान कोनीय, पाण्यासारखे ठिपके',
        'ठिपके तांबूस-तपकिरी ते काळे पडणे',
        'फांद्यांवर काळे चट्टे पडून फांद्या मोडणे (ब्लॅक आर्म)'
      ],
      organic_remedies: [
        'स्यूडोमोनास १० ग्रॅम/किलो बियाण्यास चोळा',
        '१% बोर्डो मिश्रण किंवा कॉपर हायड्रॉक्साईड २ ग्रॅम/लिटर फवारा'
      ],
      chemical_remedies: [
        'कॉपर ऑक्सिक्लोराईड २.५ ग्रॅम + स्ट्रेप्टोसायक्लिन ०.५ ग्रॅम/लिटर फवारा'
      ],
      cultural_practices: [
        'ऍसिड प्रक्रिया केलेले (डिलिंटेड) बियाणे वापरा',
        'झाडांमध्ये योग्य अंतर ठेवा; गर्दी टाळा'
      ],
      untreated_risk: 'बोंड सडणे आणि २५-३५% फांद्यांचे नुकसान होऊ शकते.',
      recovery_forecast: '५-७ दिवसांत नवीन बोंडांवर प्रसार थांबतो.'
    }
  },

  healthy: {
    en: {
      name: 'Healthy Crop Stand',
      category: 'Optimal Health',
      severity: 'None',
      symptoms: [
        'Vibrant deep green foliage with balanced turgidity and no spot lesions',
        'Active vegetative apical growth and healthy branching',
        'No signs of pest feeding, wilting, or marginal yellowing'
      ],
      organic_remedies: [
        'Continue preventive spray of Seaweed extract @ 2 ml/L every 15 days',
        'Maintain soil microbial health with regular Jeevamrutha or compost tea drenching'
      ],
      chemical_remedies: [
        'No chemical interventions required. Maintain balanced fertigation as per soil schedule.'
      ],
      cultural_practices: [
        'Maintain consistent soil moisture; avoid waterlogging or moisture stress',
        'Keep weed-free field borders to discourage harbor of wandering pests'
      ],
      untreated_risk: 'None. Keep maintaining good agronomic practices.',
      recovery_forecast: 'Crop is performing at peak vigor; continue current care regimen.'
    },
    te: {
      name: 'ఆరోగ్యకరమైన పైరు',
      category: 'ఉత్తమ ఆరోగ్యం',
      severity: 'ఏమీ లేదు',
      symptoms: [
        'ముదురు పచ్చని రంగుతో ఎటువంటి మచ్చలు లేని ఆరోగ్యకరమైన ఆకులు',
        'చురుకైన శాఖీయ ఎదుగుదల మరియు దృఢమైన కొమ్మలు',
        'పురుగుల దాడి లేదా పసుపుబారే సంకేతాలు లేవు'
      ],
      organic_remedies: [
        'ప్రతి 15 రోజులకు ఒకసారి సముద్రపు పాచి సారం (Seaweed extract) 2 మి.లీ/లీ పిచికారీ చేయండి',
        'జీవామృతం లేదా వర్మీవాష్ క్రమం తప్పకుండా మొదళ్లలో వేయండి'
      ],
      chemical_remedies: [
        'ఎటువంటి రసాయన మందులు అవసరం లేదు. సమతుల్య పోషకాలు అందించండి.'
      ],
      cultural_practices: [
        'సమతుల్య తేమను కొనసాగించండి; కలుపు లేకుండా చూసుకోండి'
      ],
      untreated_risk: 'ఎటువంటి నష్టం లేదు. మంచి యాజమాన్య పద్ధతులు కొనసాగించండి.',
      recovery_forecast: 'పైరు పూర్తి ఆరోగ్యంతో, ఆశించిన గరిష్ట దిగుబడి దిశగా ఎదుగుతోంది.'
    },
    hi: {
      name: 'स्वस्थ व निरोगी फ़सल',
      category: 'उत्कृष्ट स्वास्थ्य',
      severity: 'कोई नहीं',
      symptoms: [
        'गहरा हरा चमकदार रंग और बिना किसी दाग-धब्बे की स्वस्थ पत्तियाँ',
        'सक्रिय वानस्पतिक विकास और मजबूत टहनियाँ',
        'कीटों या पीलापन का कोई लक्षण नहीं'
      ],
      organic_remedies: [
        'हर 15 दिन में सीवीड एक्सट्रैक्ट 2 मिली/लीटर का छिड़काव जारी रखें',
        'जीवामृत या वर्मीवाश का नियमित उपयोग करें'
      ],
      chemical_remedies: [
        'किसी रासायनिक कीटनाशक की आवश्यकता नहीं है। संतुलित पोषण दें।'
      ],
      cultural_practices: [
        'खेत में नमी का उचित स्तर बनाए रखें; खरपतवार नियंत्रण रखें'
      ],
      untreated_risk: 'कोई जोखिम नहीं। अच्छी कृषि पद्धतियाँ जारी रखें।',
      recovery_forecast: 'फ़सल पूर्ण ओज के साथ बढ़ रही है; वर्तमान देखभाल जारी रखें।'
    },
    kn: {
      name: 'ಆರೋಗ್ಯಕರ ಬೆಳೆ',
      category: 'ಉತ್ತಮ ಆರೋಗ್ಯ',
      severity: 'ಯಾವುದೂ ಇಲ್ಲ',
      symptoms: [
        'ಆಕರ್ಷಕ ಕಡು ಹಸಿರು ಎಲೆಗಳು ಮತ್ತು ಯಾವುದೇ ಕಲೆಗಳಿಲ್ಲ',
        'ಚುರುಕಾದ ಬೆಳವಣಿಗೆ ಮತ್ತು ಗಟ್ಟಿಮುಟ್ಟಾದ ರೆಂಬೆಗಳು',
        'ಕೀಟ ಅಥವಾ ಹಳದಿ ಬಣ್ಣದ ಯಾವುದೇ ಲಕ್ಷಣಗಳಿಲ್ಲ'
      ],
      organic_remedies: [
        'ಪ್ರತಿ 15 ದಿನಕ್ಕೊಮ್ಮೆ ಸಮುದ್ರ ಪಾಚಿ ಸಾರ 2 ಮಿಲಿ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ',
        'ಜೀವಾಮೃತವನ್ನು ನಿಯಮಿತವಾಗಿ ಮಣ್ಣಿಗೆ ನೀಡಿ'
      ],
      chemical_remedies: [
        'ಯಾವುದೇ ರಾಸಾಯನಿಕ ಅಗತ್ಯವಿಲ್ಲ. ಸಮತೋಲಿತ ಪೋಷಕಾಂಶ ನೀಡಿ.'
      ],
      cultural_practices: [
        'ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ; ಕಳೆ ಮುಕ್ತವಾಗಿರಿಸಿ'
      ],
      untreated_risk: 'ಯಾವುದೇ ನಷ್ಟವಿಲ್ಲ. ಉತ್ತಮ ಕೃಷಿ ಪದ್ಧತಿ ಮುಂದುವರಿಸಿ.',
      recovery_forecast: 'ಬೆಳೆಯು ಅತ್ಯುತ್ತಮ ಇಳುವರಿಯತ್ತ ಆರೋಗ್ಯಕರವಾಗಿ ಸಾಗುತ್ತಿದೆ.'
    },
    ta: {
      name: 'ஆரோக்கியமான பயிர்',
      category: 'சிறந்த ஆரோக்கியம்',
      severity: 'இல்லை',
      symptoms: [
        'அடர்ந்த பச்சை நிறத்துடன் புள்ளிகள் அற்ற ஆரோக்கியமான இலைகள்',
        'வீரியமான வளர்ச்சி மற்றும் வலுவான கிளைகள்',
        'பூச்சித் தாக்குதல் அல்லது மஞ்சளாதல் அறிகுறிகள் இல்லை'
      ],
      organic_remedies: [
        '15 நாட்களுக்கு ஒருமுறை கடற்பாசி சாறு 2 மி.லி/லிட்டர் தெளிக்கவும்',
        'ஜீவாமிர்தம் தவறாமல் மண்ணில் விடவும்'
      ],
      chemical_remedies: [
        'ரசாயன மருந்துகள் தேவையில்லை. சீரான ஊட்டச்சத்து வழங்கவும்.'
      ],
      cultural_practices: [
        'சீரான ஈரப்பதத்தைப் பராமரிக்கவும்; களையற்ற நிலையை உறுதிசெய்யவும்'
      ],
      untreated_risk: 'பாதிப்பு ஏதுமில்லை. சிறந்த பராமரிப்பைத் தொடரவும்.',
      recovery_forecast: 'பயிர் உச்சக்கட்ட வீரியத்துடன் வளர்ந்து வருகிறது.'
    },
    mr: {
      name: 'निरोगी पीक',
      category: 'उत्कृष्ट आरोग्य',
      severity: 'काहीही नाही',
      symptoms: [
        'गडद हिरवीगार पाने आणि कोणताही डाग नसलेली निरोगी स्थिती',
        'जोमदार शाकीय वाढ आणि मजबूत फांद्या',
        'किडींचा किंवा पिवळेपणाचा कोणताही प्रादुर्भाव नाही'
      ],
      organic_remedies: [
        'दर १५ दिवसांनी सीवीड अर्क २ मिली/लिटर फवारणी चालू ठेवा',
        'जीवामृत किंवा व्हर्मीवॉश नियमितपणे जमिनीतून द्या'
      ],
      chemical_remedies: [
        'कोणत्याही रासायनिक औषधांची गरज नाही. संतुलित खत व्यवस्थापन ठेवा.'
      ],
      cultural_practices: [
        'जमिनीत योग्य ओलावा ठेवा; शेत तणमुक्त ठेवा'
      ],
      untreated_risk: 'कोणताही धोका नाही. उत्तम मशागत चालू ठेवा.',
      recovery_forecast: 'पीक उत्तम वाढीच्या स्थितीत आहे; नियमित काळजी सुरू ठेवा.'
    }
  },

  fungal_leaf_spot: {
    en: {
      name: 'Fungal Leaf Spot / Blight Complex',
      category: 'Fungal Disease',
      severity: 'Moderate',
      symptoms: [
        'Scattered circular or irregular necrotic spots on foliage',
        'Yellow chlorotic rings surrounding lesions',
        'Lower canopy leaf drying and premature senescence'
      ],
      organic_remedies: [
        'Spray Neem oil @ 5 ml/L mixed with mild soap emulsifier',
        'Apply biocontrol agents (Trichoderma or Bacillus subtilis @ 5 g/L)',
        'Foliar spray of liquid vermiwash or compost extract (10% solution)'
      ],
      chemical_remedies: [
        'Broad-spectrum protective fungicide: Mancozeb 75% WP @ 2.5 g/L',
        'Systemic curative: Tebuconazole 25.9% EC @ 1 ml/L or Carbendazim @ 1 g/L'
      ],
      cultural_practices: [
        'Prune dead and heavily spotted lower leaves to improve airflow',
        'Avoid overhead irrigation; irrigate early morning at soil level',
        'Improve soil drainage and avoid root waterlogging'
      ],
      untreated_risk: 'Gradual defoliation causing reduced photosynthesis, smaller produce, and yield drop of 20-40%.',
      recovery_forecast: 'Fungicide stops new spot formation within 3-4 days; new shoots emerge healthy.'
    },
    te: {
      name: 'శిలీంధ్ర ఆకుమచ్చ తెగులు',
      category: 'శిలీంధ్ర వ్యాధి',
      severity: 'మధ్యస్థం',
      symptoms: [
        'ఆకులపై వెదజల్లినట్లు ఉండే గుండ్రని గోధుమ రంగు మచ్చలు',
        'మచ్చల చుట్టూ పసుపు రంగు వలయాలు',
        'దిగువ ఆకులు ఎండిపోయి రాలిపోవడం'
      ],
      organic_remedies: [
        'వేప నూనె 5 మి.లీ/లీటర్ నీటిలో కలిపి పిచికారీ చేయండి',
        'ట్రైకోడెర్మా లేదా బాసిల్లస్ 5 గ్రా/లీటర్ ఆకులపై పిచికారీ చేయండి',
        'వర్మీవాష్ లేదా కంపోస్ట్ టీ 10% ద్రావణం పిచికారీ చేయండి'
      ],
      chemical_remedies: [
        'మాంకోజెబ్ 75% WP 2.5 గ్రా/లీటర్ రక్షక మందుగా పిచికారీ చేయండి',
        'టెబుకోనజోల్ 1 మి.లీ/లీటర్ లేదా కార్బెండజిమ్ 1 గ్రా/లీటర్ పిచికారీ చేయండి'
      ],
      cultural_practices: [
        'ఎండిన ఆకులను తొలగించి గాలి వెలుతురు ప్రసరించేలా చేయండి',
        'ఆకులపై నీరు పడకుండా మొదళ్ల వద్ద మాత్రమే నీరు అందించండి'
      ],
      untreated_risk: 'కిరణజన్య సంయోగక్రియ తగ్గి దిగుబడి 20-40% తగ్గే ప్రమాదం ఉంది.',
      recovery_forecast: 'మందు పిచికారీతో 3-4 రోజుల్లో కొత్త మచ్చలు రావడం ఆగుతుంది.'
    },
    hi: {
      name: 'कवक पत्ती धब्बा / झुलसा रोग',
      category: 'कवक जनित रोग',
      severity: 'मध्यम',
      symptoms: [
        'पत्तियों पर बिखरे हुए गोल या अनियमित भूरे धब्बे',
        'धब्बों के चारों ओर पीले घेरे',
        'निचली पत्तियों का सूखना और समय से पहले गिरना'
      ],
      organic_remedies: [
        'नीम का तेल 5 मिली/लीटर पानी में मिलाकर छिड़कें',
        'ट्राइकोडर्मा या बैसिलस सबटिलिस 5 ग्राम/लीटर का छिड़काव करें'
      ],
      chemical_remedies: [
        'मैंकोजेब 75% डब्ल्यूपी 2.5 ग्राम/लीटर का छिड़काव करें',
        'टेबुकोनाज़ोल 1 मिली/लीटर या कार्बेन्डाजिम 1 ग्राम/लीटर छिड़कें'
      ],
      cultural_practices: [
        'रोगग्रस्त निचली पत्तियों को हटाएँ ताकि हवा का संचार बना रहे',
        'ऊपर से छिड़काव सिंचाई से बचें; जड़ों में पानी दें'
      ],
      untreated_risk: 'पत्तियाँ झड़ने से प्रकाश संश्लेषण घटता है और पैदावार 20-40% तक घट सकती है।',
      recovery_forecast: '3-4 दिनों में नए धब्बों का बनना रुक जाता है।'
    },
    kn: {
      name: 'ಶಿಲೀಂಧ್ರ ಎಲೆ ಚುಕ್ಕೆ ರೋಗ',
      category: 'ಶಿಲೀಂಧ್ರ ರೋಗ',
      severity: 'ಮಧ್ಯಮ',
      symptoms: [
        'ಎಲೆಗಳ ಮೇಲೆ ಚದುರಿದ ಕಂದು ಬಣ್ಣದ ಚುಕ್ಕೆಗಳು',
        'ಚುಕ್ಕೆಗಳ ಸುತ್ತ ಹಳದಿ ವಲಯಗಳು',
        'ಕೆಳಗಿನ ಎಲೆಗಳು ಒಣಗಿ ಉದುರುವುದು'
      ],
      organic_remedies: [
        'ಬೇವಿನ ಎಣ್ಣೆ 5 ಮಿಲಿ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ',
        'ಟ್ರೈಕೋಡರ್ಮ 5 ಗ್ರಾಂ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ'
      ],
      chemical_remedies: [
        'ಮ್ಯಾಂಕೋಜೆಬ್ 2.5 ಗ್ರಾಂ/ಲೀಟರ್ ಅಥವಾ ಟೆಬುಕೊನಜೋಲ್ 1 ಮಿಲಿ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ'
      ],
      cultural_practices: [
        'ಒಣಗಿದ ಎಲೆಗಳನ್ನು ತೆಗೆದು ಗಾಳಿ ಬೆಳಕು ಆಡುವಂತೆ ಮಾಡಿ'
      ],
      untreated_risk: 'ಇಳುವರಿಯಲ್ಲಿ 20-40% ನಷ್ಟವಾಗಬಹುದು.',
      recovery_forecast: '3-4 ದಿನಗಳಲ್ಲಿ ರೋಗ ನಿಯಂತ್ರಣಕ್ಕೆ ಬರುತ್ತದೆ.'
    },
    ta: {
      name: 'பூஞ்சை இலைப்புள்ளி நோய்',
      category: 'பூஞ்சை நோய்',
      severity: 'மிதமானது',
      symptoms: [
        'இலைகளில் வட்ட வடிவ பழுப்புப் புள்ளிகள்',
        'புள்ளிகளைச் சுற்றி மஞ்சள் வளையம்',
        'கீழ் இலைகள் காய்ந்து உதிர்தல்'
      ],
      organic_remedies: [
        'வேப்ப எண்ணெய் 5 மி.லி/லிட்டர் தெளிக்கவும்',
        'டிரைக்கோடெர்மா 5 கிராம்/லிட்டர் தெளிக்கவும்'
      ],
      chemical_remedies: [
        'மேன்கோசெப் 2.5 கிராம்/லிட்டர் அல்லது டெபுகோனசோல் 1 மி.லி/லிட்டர் தெளிக்கவும்'
      ],
      cultural_practices: [
        'காய்ந்த இலைகளை அகற்றி காற்றோட்டத்தை அதிகரிக்கவும்'
      ],
      untreated_risk: 'மகசூல் 20-40% குறைய வாய்ப்புள்ளது.',
      recovery_forecast: '3-4 நாட்களில் புதிய புள்ளிகள் தோன்றுவது நிற்கும்.'
    },
    mr: {
      name: 'बुरशीजन्य पानांवरील ठिपके',
      category: 'बुरशीजन्य रोग',
      severity: 'मध्यम',
      symptoms: [
        'पानांवर अनियमित तपकिरी ठिपके',
        'ठिपक्यांच्या भोवती पिवळे वलय',
        'खालची पाने सुकणे आणि गळणे'
      ],
      organic_remedies: [
        'निंबोळी तेल ५ मिली/लिटर फवारा',
        'ट्रायकोडर्मा ५ ग्रॅम/लिटर फवारा'
      ],
      chemical_remedies: [
        'मँकोझेब २.५ ग्रॅम/लिटर किंवा टेब्युकोनॅझोल १ मिली/लिटर फवारा'
      ],
      cultural_practices: [
        'खालची रोगट पाने काढून हवा खेळती ठेवा'
      ],
      untreated_risk: 'उत्पादनात २०-४०% घट होऊ शकते.',
      recovery_forecast: '३-४ दिवसांत नवीन ठिपके येणे थांबते.'
    }
  },

  nutrient_stress: {
    en: {
      name: 'Nutritional Stress / Chlorosis',
      category: 'Nutrient Deficiency',
      severity: 'Mild to Moderate',
      symptoms: [
        'Interveinal or marginal yellowing across foliage',
        'Pale leaf color and reduced vegetative growth vigor',
        'Absence of circular fungal spots or bacterial water-soaked lesions'
      ],
      organic_remedies: [
        'Apply enriched compost or well-rotted farmyard manure around root zone',
        'Foliar application of fermented Jeevamrutha or seaweed extract (3 ml/L)'
      ],
      chemical_remedies: [
        'Foliar spray of water-soluble NPK 19:19:19 @ 5 g/L + Chelated Micronutrient mix @ 1.5 g/L',
        'Apply secondary nutrients (Magnesium Sulphate @ 5 g/L if interveinal yellowing)'
      ],
      cultural_practices: [
        'Test soil pH and electrical conductivity (EC) to diagnose nutrient lockout',
        'Ensure soil is well aerated and not compacted or flooded'
      ],
      untreated_risk: 'Reduces plant vigor, leads to premature flower/fruit drop and lower grade produce.',
      recovery_forecast: 'Visible color restoration and canopy greening within 5-7 days following foliar nutrition.'
    },
    te: {
      name: 'పోషకాల లోపం / పసుపుబారడం (క్లోరోసిస్)',
      category: 'పోషకాహార లోపం',
      severity: 'స్వల్పం నుండి మధ్యస్థం',
      symptoms: [
        'ఆకు ఈనెల మధ్య లేదా అంచుల వద్ద పసుపు రంగులోకి మారడం',
        'లేత ఆకుపచ్చ రంగు మరియు తగ్గిన ఎదుగుదల',
        'శిలీంధ్ర లేదా బాక్టీరియా మచ్చలు లేకపోవడం'
      ],
      organic_remedies: [
        'మొక్కల మొదళ్ల వద్ద బాగా చివికిన పశువుల ఎరువు లేదా వర్మీకంపోస్ట్ వేయండి',
        'జీవామృతం లేదా సముద్రపు పాచి సారం (3 మి.లీ/లీ) పిచికారీ చేయండి'
      ],
      chemical_remedies: [
        'నీటిలో కరిగే 19:19:19 ఎరువు 5 గ్రా/లీ + సూక్ష్మపోషకాల మిశ్రమం 1.5 గ్రా/లీ పిచికారీ చేయండి',
        'ఈనెల మధ్య పసుపు ఉంటే మెగ్నీషియం సల్ఫేట్ 5 గ్రా/లీ పిచికారీ చేయండి'
      ],
      cultural_practices: [
        'నేల pH పరీక్షించండి; నీరు నిల్వ ఉండకుండా మురుగు నీటి వసతి కల్పించండి'
      ],
      untreated_risk: 'మొక్క బలహీనపడి పూత, పిందె రాలిపోయి దిగుబడి తగ్గుతుంది.',
      recovery_forecast: 'పోషకాలు అందించిన 5-7 రోజుల్లో ఆకులు తిరిగి ముదురు పచ్చగా మారతాయి.'
    },
    hi: {
      name: 'पोषक तत्वों की कमी / पीलापन (क्लोरोसिस)',
      category: 'पोषक तत्व विकार',
      severity: 'हल्का से मध्यम',
      symptoms: [
        'पत्तियों की नसों के बीच या किनारों पर पीलापन',
        'पत्तियों का हल्का रंग व धीमा वानस्पतिक विकास',
        'कवक या जीवाणु जनित धब्बों की अनुपस्थिति'
      ],
      organic_remedies: [
        'जड़ों के पास अच्छी सड़ी गोबर की खाद या केंचुआ खाद डालें',
        'जीवामृत या समुद्री शैवाल अर्क (3 मिली/लीटर) का छिड़काव करें'
      ],
      chemical_remedies: [
        'घुलनशील एनपीके 19:19:19 (5 ग्राम/लीटर) + सूक्ष्म पोषक तत्व मिश्रण (1.5 ग्राम/लीटर) का छिड़काव करें',
        'नसों के बीच पीलापन होने पर मैग्नीशियम सल्फेट 5 ग्राम/लीटर छिड़कें'
      ],
      cultural_practices: [
        'मिट्टी का पीएच परीक्षण कराएं; खेत में जलभराव न होने दें'
      ],
      untreated_risk: 'फूल-फल झड़ने लगते हैं और फ़सल की गुणवत्ता व पैदावार घटती है।',
      recovery_forecast: 'पोषक छिड़काव के 5-7 दिनों में पत्तियाँ हरी होने लगती हैं।'
    },
    kn: {
      name: 'ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ / ಹಳದಿ ರೋಗ (ಕ್ಲೋರೋಸಿಸ್)',
      category: 'ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ',
      severity: 'ಸ್ವಲ್ಪದಿಂದ ಮಧ್ಯಮ',
      symptoms: [
        'ಎಲೆಗಳ ನರಗಳ ನಡುವೆ ಅಥವಾ ಅಂಚಿನಲ್ಲಿ ಹಳದಿ ಬಣ್ಣ',
        'ಕುಂಠಿತ ಬೆಳವಣಿಗೆ ಮತ್ತು ಬಿಳಿಚಿಕೊಂಡ ಎಲೆಗಳು',
        'ಯಾವುದೇ ಶಿಲೀಂಧ್ರ ಅಥವಾ ಬ್ಯಾಕ್ಟೀರಿಯಾ ಕಲೆಗಳಿಲ್ಲದಿರುವುದು'
      ],
      organic_remedies: [
        'ಕೊಳೆತ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಅಥವಾ ಎರೆಹುಳು ಗೊಬ್ಬರ ಹಾಕಿ',
        'ಜೀವಾಮೃತ (3 ಮಿಲಿ/ಲೀಟರ್) ಸಿಂಪಡಿಸಿ'
      ],
      chemical_remedies: [
        '19:19:19 ಕರಗುವ ಗೊಬ್ಬರ 5 ಗ್ರಾಂ/ಲೀಟರ್ + ಲಘು ಪೋಷಕಾಂಶ ಮಿಶ್ರಣ 1.5 ಗ್ರಾಂ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ'
      ],
      cultural_practices: [
        'ಮಣ್ಣಿನ pH ಪರೀಕ್ಷಿಸಿ; ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿದು ಹೋಗಲು ದಾರಿ ಮಾಡಿ'
      ],
      untreated_risk: 'ಹೂವು ಕಾಯಿ ಉದುರಿ ಇಳುವರಿ ಕಡಿಮೆಯಾಗುತ್ತದೆ.',
      recovery_forecast: '5-7 ದಿನಗಳಲ್ಲಿ ಎಲೆಗಳು ಮರಳಿ ಹಸಿರಾಗುತ್ತವೆ.'
    },
    ta: {
      name: 'ஊட்டச்சத்துக் குறைபாடு / இலை மஞ்சளாதல்',
      category: 'ஊட்டச்சத்துக் குறைபாடு',
      severity: 'மிதமானது',
      symptoms: [
        'இலை நரம்புகளுக்கு இடையே அல்லது விளிம்பில் மஞ்சளாதல்',
        'வளர்ச்சி குன்றுதல் மற்றும் வெளிர் நிற இலைகள்',
        'புள்ளிகள் அல்லது புண்கள் இல்லாமை'
      ],
      organic_remedies: [
        'மக்கிய தொழு உரம் அல்லது மண்புழு உரம் இடுங்கள்',
        'ஜீவாமிர்தம் தெளிக்கவும்'
      ],
      chemical_remedies: [
        '19:19:19 நீரில் கரையும் உரம் 5 கிராம்/லிட்டர் + நுண்ணூட்டக் கலவை 1.5 கிராம்/லிட்டர் தெளிக்கவும்'
      ],
      cultural_practices: [
        'மண் பரிசோதனை செய்யவும்; தண்ணீர் தேங்குவதைத் தவிர்க்கவும்'
      ],
      untreated_risk: 'பூ பிடிப்பு குறைந்து விளைச்சல் குறையும்.',
      recovery_forecast: '5-7 நாட்களில் இலைகள் மீண்டும் பச்சையாக மாறும்.'
    },
    mr: {
      name: 'पोषकद्रव्यांची कमतरता / पिवळेपणा (क्लोरोसिस)',
      category: 'पोषणद्रव्य कमतरता',
      severity: 'किरकोळ ते मध्यम',
      symptoms: [
        'पानांच्या शिरांमधील भाग किंवा कडा पिवळ्या पडणे',
        'पानांचा फिकट रंग व पिकाची वाढ खुंटणे',
        'बुरशीचे किंवा जिवाणूंचे डाग नसणे'
      ],
      organic_remedies: [
        'चांगले कुजलेले शेणखत किंवा गांडूळ खत द्या',
        'जीवामृत किंवा सीवीड अर्क (३ मिली/लिटर) फवारा'
      ],
      chemical_remedies: [
        '१९:१९:१९ विद्राव्य खत ५ ग्रॅम + सूक्ष्मअन्नद्रव्ये १.५ ग्रॅम/लिटर फवारा'
      ],
      cultural_practices: [
        'जमिनीचा सामू (pH) तपासा; पाणी साचू देऊ नका'
      ],
      untreated_risk: 'फूलगळ व फळगळ वाढून उत्पादन घटू शकते.',
      recovery_forecast: '५-७ दिवसांत पाने पुन्हा गडद हिरवी होतात.'
    }
  },

  pest_damage: {
    en: {
      name: 'Insect Pest / Foliar Feeding Damage',
      category: 'Pest Attack',
      severity: 'Moderate',
      symptoms: [
        'Chewed leaf margins, shot-holes, or curling along leaf tips',
        'Visible frass (droppings), webbing, or sap-sucking insect clusters',
        'Distorted new flushes with silvery or bronzed leaf surface'
      ],
      organic_remedies: [
        'Spray 10,000 ppm Azadirachtin / Neem formulation @ 2 ml/L',
        'Release biological predators like Chrysoperla or Trichogramma parasitoids',
        'Install sticky pheromone / light traps suited to target pest species'
      ],
      chemical_remedies: [
        'For sucking pests: Acetamiprid 20% SP @ 0.5 g/L or Flonicamid 50% WG @ 0.3 g/L',
        'For chewing caterpillars: Chlorantraniliprole 18.5% SC @ 0.3 ml/L'
      ],
      cultural_practices: [
        'Handpick and destroy early caterpillar egg masses or clusters',
        'Grow trap crops (marigold or castor) on field boundaries'
      ],
      untreated_risk: 'Severe canopy destruction and potential transmission of viral diseases.',
      recovery_forecast: 'Stops feeding activity within 24-48 hours; new flushes grow without distortion.'
    },
    te: {
      name: 'కీటకాలు / పురుగుల ఉధృతి',
      category: 'పురుగుల దాడి',
      severity: 'మధ్యస్థం',
      symptoms: [
        'కొరికిన ఆకు అంచులు, రంధ్రాలు లేదా ముడుచుకుపోయిన ఆకులు',
        'పురుగుల విసర్జన, గూళ్ళు లేదా రసం పీల్చే పురుగుల గుంపులు',
        'కొత్త చిగుళ్ళు వంకర్లు తిరిగి వెండి లేదా కంచు రంగులోకి మారడం'
      ],
      organic_remedies: [
        'వేప నూనె (10,000 ppm) 2 మి.లీ/లీటర్ పిచికారీ చేయండి',
        'పసుపు, నీలి రంగు జిగురు అట్టలు ఎకరానికి 15-20 ఏర్పాటు చేయండి',
        'ట్రైకోగ్రామా కార్డులు లేదా క్రైసోపెర్లా మిత్ర పురుగులను వదలండి'
      ],
      chemical_remedies: [
        'రసం పీల్చే పురుగులకు: ఎసిటామిప్రిడ్ 0.5 గ్రా/లీ లేదా ఫ్లోనికామిడ్ 0.3 గ్రా/లీ పిచికారీ చేయండి',
        'ఆకు తినే లద్దె పురుగులకు: కోరాజెన్ 0.3 మి.లీ/లీ పిచికారీ చేయండి'
      ],
      cultural_practices: [
        'గుడ్ల సముదాయాలు, లద్దె పురుగులను చేత్తో ఏరి నాశనం చేయండి',
        'పొలం చుట్టూ బంతి లేదా ఆముదం ఎర పంటలుగా వేయండి'
      ],
      untreated_risk: 'పైరు పూర్తిగా నాశనమై వైరస్ తెగుళ్ళు వ్యాపించే ప్రమాదం ఉంది.',
      recovery_forecast: 'మందు పిచికారీ చేసిన 24-48 గంటల్లో పురుగుల దాడి ఆగిపోతుంది.'
    },
    hi: {
      name: 'कीट प्रकोप / पत्तियों को नुकसान',
      category: 'कीट हमला',
      severity: 'मध्यम',
      symptoms: [
        'पत्तियों के कटे हुए किनारे, गोल छेद या पत्तियों का मुड़ना',
        'कीटों का मल, जाला या रस चूसक कीटों का समूह दिखाई देना',
        'नई पत्तियों का मुड़ना और चांदी जैसा या तांबई रंग होना'
      ],
      organic_remedies: [
        'नीम तेल (10,000 पीपीएम) 2 मिली/लीटर का छिड़काव करें',
        'पीले व नीले चिपचिपे प्रपंच (ट्रैप) 15-20 प्रति एकड़ लगाएं',
        'ट्राइकोग्रामा परजीवी ततैया या क्राइसोपर्ला छोड़ें'
      ],
      chemical_remedies: [
        'रस चूसक कीटों के लिए: एसिटामिप्रिड 0.5 ग्राम/लीटर या फ्लोनिकामाइड 0.3 ग्राम/लीटर',
        'इल्ली/सुंडी के लिए: क्लोरएंट्रानिलिप्रोल 0.3 मिली/लीटर का छिड़काव करें'
      ],
      cultural_practices: [
        'इल्लियों के अंडों व समूहों को हाथ से चुनकर नष्ट करें',
        'खेत की मेड़ों पर गेंदा या अरंडी की ट्रैप फ़सल लगाएं'
      ],
      untreated_risk: 'पत्तियाँ छलनी होने से प्रकाश संश्लेषण समाप्त हो सकता है और विषाणु फैल सकते हैं।',
      recovery_forecast: '24-48 घंटों में कीटों का भोजन रुक जाता है; नई पत्तियाँ स्वस्थ निकलती हैं।'
    },
    kn: {
      name: 'ಕೀಟಬಾಧೆ / ಎಲೆ ತಿನ್ನುವ ಕೀಟಗಳು',
      category: 'ಕೀಟಗಳ ದಾಳಿ',
      severity: 'ಮಧ್ಯಮ',
      symptoms: [
        'ಕಚ್ಚಿದ ಎಲೆಗಳ ಅಂಚುಗಳು, ರಂಧ್ರಗಳು ಅಥವಾ ಮುದುಡಿದ ಎಲೆಗಳು',
        'ರಸ ಹೀರುವ ಕೀಟಗಳ ಗುಂಪು ಅಥವಾ ಬಲೆಗಳು',
        'ಹೊಸ ಚಿಗುರುಗಳು ವಿರೂಪಗೊಳ್ಳುವುದು'
      ],
      organic_remedies: [
        'ಬೇವಿನ ಕೀಟನಾಶಕ 2 ಮಿಲಿ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ',
        'ಹಳದಿ ಜಿಗುಟು ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ'
      ],
      chemical_remedies: [
        'ರಸ ಹೀರುವ ಕೀಟಗಳಿಗೆ: ಅಸಿಟಾಮಿಪ್ರಿಡ್ 0.5 ಗ್ರಾಂ/ಲೀಟರ್',
        'ಲದ್ದಿ ಹುಳುಗಳಿಗೆ: ಕ್ಲೋರಾಂಟ್ರಾನಿಲಿಪ್ರೋಲ್ 0.3 ಮಿಲಿ/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ'
      ],
      cultural_practices: [
        'ಹುಳುಗಳನ್ನು ಕೈಯಿಂದ ಆರಿಸಿ ನಾಶಮಾಡಿ',
        'ಬದುಗಳ ಮೇಲೆ ಚೆಂಡು ಹೂವು ಬೆಳೆಸಿ'
      ],
      untreated_risk: 'ಗಿಡಗಳು ಬೋಳಾಗಿ ಇಳುವರಿ ನಾಶವಾಗಬಹುದು.',
      recovery_forecast: '24-48 ಗಂಟೆಗಳಲ್ಲಿ ಕೀಟಗಳ ಬಾಧೆ ನಿಲ್ಲುತ್ತದೆ.'
    },
    ta: {
      name: 'பூச்சித் தாக்குதல் / இலை சேதம்',
      category: 'பூச்சித் தாக்குதல்',
      severity: 'மிதமானது',
      symptoms: [
        'கடிக்கப்பட்ட இலை ஓரங்கள், துளைகள் அல்லது சுருண்ட இலைகள்',
        'சாறு உறிஞ்சும் பூச்சிகளின் கூட்டம் அல்லது வலைகள்',
        'புதிய தளிர்கள் சுருங்குதல்'
      ],
      organic_remedies: [
        'வேப்ப எண்ணெய் 2 மி.லி/லிட்டர் தெளிக்கவும்',
        'மஞ்சள் ஒட்டும் பொறிகளை அமைக்கவும்'
      ],
      chemical_remedies: [
        'சாறு உறிஞ்சும் பூச்சிகளுக்கு: அசிடமிபிரிட் 0.5 கிராம்/லிட்டர்',
        'புழுக்களுக்கு: குளோரன்ட்ரானிலிபுரோல் 0.3 மி.லி/லிட்டர் தெளிக்கவும்'
      ],
      cultural_practices: [
        'புழுக்களைக் கையால் பிடித்து அழிக்கவும்',
        'வரப்புகளில் சாமந்தி போன்ற கவர்ச்சிப் பயிர்களை நடவும்'
      ],
      untreated_risk: 'பயிர் கடுமையாக சேதமடைந்து வைரஸ் பரவ வாய்ப்புள்ளது.',
      recovery_forecast: '24-48 மணி நேரத்தில் பூச்சிகளின் தாக்கம் கட்டுப்படும்.'
    },
    mr: {
      name: 'कीटकांचा प्रादुर्भाव / पानांचे नुकसान',
      category: 'कीड हल्ला',
      severity: 'मध्यम',
      symptoms: [
        'कुरतडलेली पाने, छिद्रे किंवा चुरमुरलेली पाने',
        'रसशोषक किडींचे पुंजके किंवा जाळे दिसणे',
        'नवीन फुटवे वाकडेतिकडे होणे'
      ],
      organic_remedies: [
        'निंबोळी अर्क २ मिली/लिटर फवारा',
        'पिवळे व निळे चिकट सापळे एकरी १५-२० लावा'
      ],
      chemical_remedies: [
        'रसशोषक किडींसाठी: ॲसिटामिप्रिड ०.५ ग्रॅम/लिटर',
        'अळीसाठी: क्लोरएंट्रानिलीप्रोल ०.३ मिली/लिटर फवारा'
      ],
      cultural_practices: [
        'अंड्यांचे पुंजके व अळ्या हाताने वेचून नष्ट करा',
        'शेताच्या बांधावर झेंडू किंवा एरंडी सापळा पीक लावा'
      ],
      untreated_risk: 'पाने खाल्ल्यामुळे अन्ननिर्मिती थांबून विषाणूजन्य रोग पसरू शकतात.',
      recovery_forecast: '२४-४८ तासांत किडींचे नुकसान थांबते.'
    }
  }
};

/**
 * Retrieve a UI localized string
 */
export function tCropHealth(lang, key) {
  const strings = UI_STRINGS[lang] || UI_STRINGS.en;
  return strings[key] ?? UI_STRINGS.en[key] ?? key;
}

/**
 * Localize the complete diagnostic payload into the target language.
 */
export function localizeDiagnosis(diagnosis, targetLang = 'en') {
  if (!diagnosis) return null;
  if (targetLang === 'en') return diagnosis;

  // Determine disease key
  let diseaseKey = diagnosis.disease_key;
  if (!diseaseKey) {
    const rawName = (diagnosis.disease_detected || '').toLowerCase();
    if (rawName.includes('early blight')) diseaseKey = 'early_blight';
    else if (rawName.includes('blast')) diseaseKey = 'blast';
    else if (rawName.includes('angular') || rawName.includes('bacterial blight')) diseaseKey = 'angular_leaf_spot';
    else if (rawName.includes('healthy') || rawName.includes('prime')) diseaseKey = 'healthy';
    else if (rawName.includes('nutrient') || rawName.includes('nitrogen') || rawName.includes('chlorosis')) diseaseKey = 'nutrient_stress';
    else if (rawName.includes('pest') || rawName.includes('insect')) diseaseKey = 'pest_damage';
    else diseaseKey = 'fungal_leaf_spot';
  }

  const diseaseEntry = DISEASE_TRANSLATIONS[diseaseKey];
  const localizedDisease = diseaseEntry?.[targetLang] || diseaseEntry?.en;

  if (!localizedDisease) {
    return diagnosis;
  }

  return {
    ...diagnosis,
    disease_key: diseaseKey,
    disease_detected: localizedDisease.name,
    category: localizedDisease.category,
    severity: localizedDisease.severity,
    symptoms: localizedDisease.symptoms || diagnosis.symptoms,
    remedies: {
      organic: localizedDisease.organic_remedies || diagnosis.remedies?.organic,
      chemical: localizedDisease.chemical_remedies || diagnosis.remedies?.chemical,
      cultural: localizedDisease.cultural_practices || diagnosis.remedies?.cultural
    },
    forecast: {
      untreated_risk: localizedDisease.untreated_risk || diagnosis.forecast?.untreated_risk,
      recovery_forecast: localizedDisease.recovery_forecast || diagnosis.forecast?.recovery_forecast
    }
  };
}

/**
 * Returns localized preset buttons for quick testing
 */
export function getLocalizedPresets(lang = 'en') {
  const basePresets = [
    {
      id: 'tomato_early_blight',
      crop: 'Tomato',
      stage: 'Active Vegetative',
      accent: '#d97706',
      svgType: 'blight',
      force: 'early_blight'
    },
    {
      id: 'rice_blast',
      crop: 'Rice',
      stage: 'Active Vegetative',
      accent: '#dc2626',
      svgType: 'blast',
      force: 'blast'
    },
    {
      id: 'cotton_leaf_spot',
      crop: 'Cotton',
      stage: 'Flowering / Heading',
      accent: '#ea580c',
      svgType: 'angular',
      force: 'angular_leaf_spot'
    },
    {
      id: 'tomato_healthy',
      crop: 'Tomato',
      stage: 'Fruiting / Pod Fill',
      accent: '#16a34a',
      svgType: 'healthy',
      force: 'healthy'
    }
  ];

  const presetTexts = {
    en: [
      { title: 'Tomato — Early Blight', badge: 'Fungal Blight', notes: 'Brown concentric target rings with yellow chlorotic margins on lower leaves.' },
      { title: 'Rice — Leaf Blast', badge: 'Fungal Pathogen', notes: 'Spindle-shaped diamond lesions with greyish center and dark brown halo.' },
      { title: 'Cotton — Angular Spot', badge: 'Bacterial Blight', notes: 'Angular water-soaked leaf lesions bordered by veinlets.' },
      { title: 'Tomato — Prime Health', badge: 'Vigorous Stand', notes: 'Vibrant green canopy, strong turgidity, clean leaf undersides.' }
    ],
    te: [
      { title: 'టమాటా — ముందస్తు తెగులు', badge: 'శిలీంధ్ర తెగులు', notes: 'దిగువ ఆకులపై గోధుమ రంగు వలయాల వంటి మచ్చలు మరియు పసుపు అంచులు.' },
      { title: 'వరి — అగ్గి తెగులు', badge: 'శిలీంధ్ర రోగకారకం', notes: 'ఆకులపై నూలు కండె ఆకారపు బూడిద కేంద్రం గల మచ్చలు.' },
      { title: 'పత్తి — కోణీయ ఆకుమచ్చ', badge: 'బాక్టీరియా తెగులు', notes: 'ఈనెల మధ్య కోణాకారపు నీటి మచ్చలు మరియు కొమ్మలపై నల్ల చారలు.' },
      { title: 'టమాటా — ఆరోగ్యకరమైన పైరు', badge: 'పూర్తి ఆరోగ్యం', notes: 'ముదురు పచ్చని ఆరోగ్యకరమైన ఆకులు, ఎటువంటి తెగులు మచ్చలు లేవు.' }
    ],
    hi: [
      { title: 'टमाटर — अगेती झुलसा', badge: 'कवक झुलसा', notes: 'निचली पत्तियों पर संकेन्द्रीय छल्लों जैसे भूरे धब्बे और पीलापन।' },
      { title: 'धान — झोंका (ब्लास्ट)', badge: 'कवक रोगजनक', notes: 'नाव के आकार के धब्बे जिनका केंद्र धूसर और किनारे भूरे हैं।' },
      { title: 'कपास — कोणीय धब्बा', badge: 'जीवाणु झुलसा', notes: 'नसों के बीच कोणीय, पानी से भीगे हुए जैसे धब्बे।' },
      { title: 'टमाटर — उत्कृष्ट स्वास्थ्य', badge: 'स्वस्थ पौधा', notes: 'गहरा हरा चमकदार रंग और बिना किसी दाग-धब्बे की स्वस्थ पत्तियाँ।' }
    ],
    kn: [
      { title: 'ಟೊಮ್ಯಾಟೊ — ಕರಗು ರೋಗ', badge: 'ಶಿಲೀಂಧ್ರ ರೋಗ', notes: 'ಕೆಳಗಿನ ಎಲೆಗಳ ಮೇಲೆ ವೃತ್ತಾಕಾರದ ಕಂದು ಚುಕ್ಕೆಗಳು.' },
      { title: 'ಭತ್ತ — ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್)', badge: 'ಶಿಲೀಂಧ್ರ ರೋಗಾಣು', notes: 'ಎಲೆಗಳ ಮೇಲೆ ಕದಿರಿನ ಆಕಾರದ ಬೂದು ಚುಕ್ಕೆಗಳು.' },
      { title: 'ಹತ್ತಿ — ಕೋನೀಯ ಚುಕ್ಕೆ', badge: 'ಬ್ಯಾಕ್ಟೀರಿಯಾ ರೋಗ', notes: 'ಎಲೆಯ ನರಗಳ ನಡುವೆ ಕೋನೀಯ ನೀರಿನಂತಹ ಕಲೆಗಳು.' },
      { title: 'ಟೊಮ್ಯಾಟೊ — ಉತ್ತಮ ಆರೋಗ್ಯ', badge: 'ಆರೋಗ್ಯಕರ ಬೆಳೆ', notes: 'ಆಕರ್ಷಕ ಕಡು ಹಸಿರು ಎಲೆಗಳು, ಯಾವುದೇ ಕಲೆಗಳಿಲ್ಲ.' }
    ],
    ta: [
      { title: 'தக்காளி — முன்கூட்டிய கருகல்', badge: 'பூஞ்சை நோய்', notes: 'கீழ் இலைகளில் வளைய வடிவிலான அடர் பழுப்புப் புள்ளிகள்.' },
      { title: 'நெல் — குலை நோய் (பிளாஸ்ட்)', badge: 'பூஞ்சை நோய்க்கிருமி', notes: 'இலைகளில் கதிர் வடிவிலான சாம்பல் மையப் புள்ளிகள்.' },
      { title: 'பருத்தி — கோண இலைப்புள்ளி', badge: 'பாக்டீரியா கருகல்', notes: 'நரம்புகளுக்கு இடையே கோண வடிவ ஈரப்பதம் போன்ற புள்ளிகள்.' },
      { title: 'தக்காளி — சிறந்த நலம்', badge: 'ஆரோக்கியமான செடி', notes: 'அடர்ந்த பச்சை நிறத்துடன் புள்ளிகள் அற்ற ஆரோக்கியமான இலைகள்.' }
    ],
    mr: [
      { title: 'टोमॅटो — लवकर येणारा करपा', badge: 'बुरशीजन्य करपा', notes: 'खालच्या पानांवर गोल रिंगसारखे तपकिरी ठिपके.' },
      { title: 'भात — करपा (ब्लास्ट)', badge: 'बुरशीजन्य रोगकारक', notes: 'पानांवर डोळ्यासारखे करडे-तपकिरी ठिपके.' },
      { title: 'कापूस — कोणीय ठिपके', badge: 'जिवाणूजन्य करपा', notes: 'पानांच्या शिरांमधील भागात कोणीय ठिपके.' },
      { title: 'टोमॅटो — उत्कृष्ट आरोग्य', badge: 'निरोगी पीक', notes: 'गडद हिरवीगार पाने आणि कोणताही डाग नसलेली स्थिती.' }
    ]
  };

  const texts = presetTexts[lang] || presetTexts.en;
  return basePresets.map((p, i) => ({
    ...p,
    title: texts[i]?.title || p.title,
    badge: texts[i]?.badge || p.badge,
    notes: texts[i]?.notes || p.notes
  }));
}

/**
 * Generate natural spoken audio summary for diagnosis
 */
export function getSpeechSummary(diagnosis, lang = 'en') {
  if (!diagnosis) return '';
  const d = localizeDiagnosis(diagnosis, lang);
  const organic = d.remedies?.organic?.[0] || '';
  const chemical = d.remedies?.chemical?.[0] || '';

  if (lang === 'te') {
    return `పంట ఆరోగ్య విశ్లేషణ ఫలితం: ${d.crop_name}. గుర్తించిన వ్యాధి: ${d.disease_detected}. తీవ్రత: ${d.severity}. ఆరోగ్య స్కోరు: 100 కి ${d.health_score}. సిఫార్సు చేసిన సేంద్రీయ చర్య: ${organic}. రసాయన చర్య: ${chemical}.`;
  }
  if (lang === 'hi') {
    return `फ़सल स्वास्थ्य निदान परिणाम: ${d.crop_name}। पहचाना गया रोग: ${d.disease_detected}। गंभीरता: ${d.severity}। स्वास्थ्य स्कोर: 100 में से ${d.health_score}। अनुशंसित जैविक उपचार: ${organic}। रासायनिक उपचार: ${chemical}।`;
  }
  if (lang === 'kn') {
    return `ಬೆಳೆ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶ: ${d.crop_name}. ಪತ್ತೆಯಾದ ರೋಗ: ${d.disease_detected}. ತೀವ್ರತೆ: ${d.severity}. ಆರೋಗ್ಯ ಅಂಕ: ${d.health_score}. ಸಾವಯವ ಪರಿಹಾರ: ${organic}. ರಾಸಾಯನಿಕ ಕ್ರಮ: ${chemical}.`;
  }
  if (lang === 'ta') {
    return `பயிர் நலப் பரிசோதனை முடிவு: ${d.crop_name}. கண்டறியப்பட்ட நோய்: ${d.disease_detected}. தீவிரம்: ${d.severity}. நலக் குறியீடு: ${d.health_score}. இயற்கை சிகிச்சை: ${organic}. ரசாயன சிகிச்சை: ${chemical}.`;
  }
  if (lang === 'mr') {
    return `पीक आरोग्य निदान निकाल: ${d.crop_name}. ओळखलेला रोग: ${d.disease_detected}. तीव्रता: ${d.severity}. आरोग्य स्कोर: ${d.health_score}. सेंद्रिय उपाय: ${organic}. रासायनिक उपाय: ${chemical}.`;
  }

  return `Crop Health Diagnosis for ${d.crop_name}: Detected condition is ${d.disease_detected}. Severity is ${d.severity}. Health score is ${d.health_score} out of 100. Recommended organic action: ${organic}. Chemical action: ${chemical}.`;
}

/**
 * Generate natural spoken audio summary specifically for monthly health & changes needed
 */
export function getMonthlySpeechSummary(monthNum, diagnosis, lang = 'en') {
  if (!diagnosis) return '';
  const d = localizeDiagnosis(diagnosis, lang);
  const changes = d.changes_needed?.map(c => c.text).slice(0, 2).join('. ') || d.remedies?.organic?.[0] || '';

  if (lang === 'te') {
    return `${monthNum} వ నెల పంట ఆరోగ్యం: 100 కి ${d.health_score}. పరిస్థితి: ${d.monthly_verdict || d.disease_detected}. ఈ నెల చేయవలసిన ముఖ్యమైన మార్పులు: ${changes}.`;
  }
  if (lang === 'hi') {
    return `महीना ${monthNum} फ़सल स्वास्थ्य: 100 में से ${d.health_score}। स्थिति: ${d.monthly_verdict || d.disease_detected}। इस महीने ज़रूरी बदलाव: ${changes}।`;
  }
  if (lang === 'kn') {
    return `${monthNum} ನೇ ತಿಂಗಳ ಬೆಳೆ ಆರೋಗ್ಯ: ${d.health_score}. ಈ ತಿಂಗಳು ಮಾಡಬೇಕಾದ ಬದಲಾವಣೆಗಳು: ${changes}.`;
  }
  if (lang === 'ta') {
    return `மாதம் ${monthNum} பயிர் நலம்: ${d.health_score}. இந்த மாதம் செய்ய வேண்டிய மாற்றங்கள்: ${changes}.`;
  }
  if (lang === 'mr') {
    return `महिना ${monthNum} पीक आरोग्य: ${d.health_score}. या महिन्यात करावयाचे बदल: ${changes}.`;
  }
  return `Month ${monthNum} Crop Health is ${d.health_score} out of 100. Status: ${d.monthly_verdict || d.disease_detected}. Suggested changes needed this month: ${changes}.`;
}

