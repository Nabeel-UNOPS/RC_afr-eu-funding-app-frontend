export type Opportunity = {
  id: string;
  title: string;
  country: string;
  subRegion: string;
  fundingAmount: string;
  status: 'Open' | 'Closed' | 'Upcoming';
  deadline: string;
  fundingInstrument: string;
  fundingType: 'Development' | 'Humanitarian';
  thematicPrio: string;
  summary: string;
  eligibility: string;
  applicationProcess: string;
  mipPrios: string[];
  documents: { name: string; url: string }[];
  contacts: { type: string; name: string; details: string }[];
};

export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Sustainable Economic Growth Initiative for West Africa',
    country: 'Benin',
    subRegion: 'West Africa',
    fundingAmount: '€15,000,000',
    status: 'Open',
    deadline: '2024-12-31',
    fundingInstrument: 'NDICI - Global Europe',
    fundingType: 'Development',
    thematicPrio: 'Sustainable economic growth',
    summary: 'This initiative aims to foster sustainable and inclusive economic growth in Benin by supporting local enterprises, improving market access, and promoting green technologies.',
    eligibility: 'Open to non-governmental organizations, public sector bodies, and private sector entities based in the EU or Benin. A minimum of 3 years of operational experience is required.',
    applicationProcess: 'Applications must be submitted through the EU\'s official APPEL portal. The process involves a concept note submission followed by a full proposal for shortlisted candidates. All templates and guides are available on the portal.',
    mipPrios: ['Green and digital transition', 'Sustainable growth and jobs', 'Human development'],
    documents: [{ name: 'Annual Action Plan.pdf', url: '#' }, { name: 'MIP for Benin.pdf', url: '#' }],
    contacts: [
      { type: 'Internal UNOPS', name: 'John Smith', details: 'Partnerships Lead, West Africa Hub' },
      { type: 'EU Delegation', name: 'Maria Garcia', details: 'Programme Manager, EU Delegation to Benin' },
    ],
  },
  {
    id: '2',
    title: 'Humanitarian Aid for Displaced Populations in Burkina Faso',
    country: 'Burkina Faso',
    subRegion: 'West Africa',
    fundingAmount: '€5,000,000',
    status: 'Upcoming',
    deadline: '2025-02-28',
    fundingInstrument: 'Humanitarian Implementation Plans (HIPs)',
    fundingType: 'Humanitarian',
    thematicPrio: 'Peace',
    summary: 'Emergency assistance to provide shelter, food security, and protection to populations displaced by conflict in Burkina Faso.',
    eligibility: 'Certified humanitarian organizations with a proven track record in conflict zones. Must have existing operations in Burkina Faso.',
    applicationProcess: 'Proposals are by invitation only after contacting the DG ECHO focal points. Do not submit unsolicited proposals. This is a rapid response mechanism.',
    mipPrios: [],
    documents: [{ name: 'HIP West Africa 2025.pdf', url: '#' }],
    contacts: [
      { type: 'DG ECHO', name: 'Focal Point for Sahel', details: 'Contact prior to any submission is mandatory.' },
    ],
  },
  {
    id: '3',
    title: 'Governance and Peace Building in the Horn of Africa',
    country: 'Somalia',
    subRegion: 'East Africa',
    fundingAmount: '€20,000,000',
    status: 'Closed',
    deadline: '2024-05-31',
    fundingInstrument: 'European Peace Facility',
    fundingType: 'Development',
    thematicPrio: 'Governance',
    summary: 'A project to support the strengthening of security and justice sectors in Somalia, contributing to overall peace and stability. The project has been successfully awarded.',
    eligibility: 'Governmental and international organizations with expertise in security sector reform and peacebuilding.',
    applicationProcess: 'The call for proposals is closed. This entry is for informational purposes.',
    mipPrios: ['Security, peace and governance', 'Economic development'],
    documents: [],
    contacts: [
      { type: 'Internal UNOPS', name: 'Amina Yusuf', details: 'Project Manager, Somalia' },
    ],
  },
   {
    id: '4',
    title: 'Digital Transformation in Education for Angola',
    country: 'Angola',
    subRegion: 'Southern Africa',
    fundingAmount: '€8,000,000',
    status: 'Open',
    deadline: '2025-01-15',
    fundingInstrument: 'Global Gateway',
    fundingType: 'Development',
    thematicPrio: 'Human development',
    summary: 'Supporting the digitalization of the Angolan education system through infrastructure development, teacher training, and curriculum modernization.',
    eligibility: 'Consortia of educational institutions, tech companies, and NGOs. Lead applicant must be from an EU member state.',
    applicationProcess: 'Two-stage application process via the Global Gateway portal. Focus on scalability and long-term sustainability.',
    mipPrios: ['Human capital development', 'Digital and green transition'],
    documents: [{ name: 'Global Gateway Africa Investment Package.pdf', url: '#' }],
    contacts: [
      { type: 'EU Delegation', name: 'Pedro Costa', details: 'Digital Transformation Lead, EU Delegation to Angola' }
    ],
  },
  {
    id: '5',
    title: 'Peace and Security Architecture in the Sahel',
    country: 'Regional',
    subRegion: 'West Africa',
    fundingAmount: '€25,000,000',
    status: 'Open',
    deadline: '2025-06-30',
    fundingInstrument: 'NDICI - Global Europe',
    fundingType: 'Development',
    thematicPrio: 'Peace',
    summary: 'Strengthening regional cooperation on peace and security matters in the Sahel G5 countries. Focus on cross-border security and counter-terrorism.',
    eligibility: 'Regional organizations, Member States agencies, and international bodies with a mandate in peace and security.',
    applicationProcess: 'Direct negotiation with pre-identified key partners. A restricted call may be published for specific components.',
    mipPrios: ['Security, peace and governance'],
    documents: [{ name: 'Regional MIP for Sub-Saharan Africa.pdf', url: '#' }],
    contacts: [
      { type: 'Internal UNOPS', name: 'Frank Miller', details: 'Senior Programme Manager, Sahel' },
      { type: 'EU Delegation', name: 'DG INTPA Unit G1', details: 'Peace, Stability and Security' },
    ],
  },
  {
    id: '6',
    title: 'Climate-Smart Agriculture for Rural Kenya',
    country: 'Kenya',
    subRegion: 'East Africa',
    fundingAmount: '€12,000,000',
    status: 'Open',
    deadline: '2024-11-30',
    fundingInstrument: 'Global Gateway',
    fundingType: 'Development',
    thematicPrio: 'Green Deal',
    summary: 'Promoting climate-resilient agricultural practices among smallholder farmers in arid and semi-arid lands of Kenya to enhance food security and livelihoods.',
    eligibility: 'Open to Kenyan CSOs, research institutions, and private sector actors in the agricultural value chain. International partners must have a local office.',
    applicationProcess: 'Submit a full proposal via the EU Funding & Tenders portal. Guidelines detail required annexes, including PADOR registration.',
    mipPrios: ['Green Transition', 'Sustainable growth and jobs'],
    documents: [{ name: 'MIP for Kenya.pdf', url: '#' }, { name: 'Call for Proposals Guide.pdf', url: '#' }],
    contacts: [
      { type: 'EU Delegation', name: 'Susan Otieno', details: 'Agriculture Programme Manager, EU Delegation to Kenya' },
    ],
  },
  {
    id: '7',
    title: 'Support to Civil Society in Democratic Republic of Congo',
    country: 'DRC',
    subRegion: 'Central Africa',
    fundingAmount: '€7,500,000',
    status: 'Upcoming',
    deadline: '2025-04-15',
    fundingInstrument: 'NDICI - Thematic Programmes',
    fundingType: 'Development',
    thematicPrio: 'Human Rights',
    summary: 'Strengthening the capacity of civil society organizations in DRC to participate in democratic processes, advocate for human rights, and monitor public policies.',
    eligibility: 'Local and international non-profit organizations with at least 5 years of experience working on governance and human rights in DRC.',
    applicationProcess: 'A call for proposals will be published on the EU Delegation website. Information sessions will be held in Kinshasa and Goma.',
    mipPrios: ['Human rights and democracy', 'Civil society actors'],
    documents: [],
    contacts: [
      { type: 'Internal UNOPS', name: 'Chloe Dubois', details: 'Liaison Officer, Central Africa' },
    ],
  },
  {
    id: '8',
    title: 'Emergency Food Assistance for Northern Nigeria',
    country: 'Nigeria',
    subRegion: 'West Africa',
    fundingAmount: '€10,000,000',
    status: 'Open',
    deadline: '2024-09-30',
    fundingInstrument: 'Humanitarian Implementation Plans (HIPs)',
    fundingType: 'Humanitarian',
    thematicPrio: 'Food Security',
    summary: 'To provide life-saving food and nutrition assistance to conflict-affected populations in Northeast Nigeria, addressing acute malnutrition and food insecurity.',
    eligibility: 'ECHO-certified partners with active FPA (Framework Partnership Agreement). Strong logistics and access in Borno, Adamawa, and Yobe states required.',
    applicationProcess: 'Partners to submit proposals directly in the APPEL system. Close coordination with OCHA and the Food Security sector is essential.',
    mipPrios: [],
    documents: [{ name: 'HIP West Africa 2024.pdf', url: '#' }],
    contacts: [
      { type: 'DG ECHO', name: 'Abuja Office', details: 'For technical questions regarding the intervention.' },
    ],
  },
    {
    id: '9',
    title: 'Green Energy Transition in South Africa',
    country: 'South Africa',
    subRegion: 'Southern Africa',
    fundingAmount: '€50,000,000',
    status: 'Open',
    deadline: '2025-03-20',
    fundingInstrument: 'Global Gateway / Just Energy Transition Partnership',
    fundingType: 'Development',
    thematicPrio: 'Green Deal',
    summary: 'Large-scale support for South Africa\'s transition away from coal, focusing on renewable energy infrastructure, grid modernization, and support for affected communities.',
    eligibility: 'Public entities, development finance institutions, and large private sector consortia. Proposals must align with the JETP Investment Plan.',
    applicationProcess: 'Primarily through blending and guarantees. Interested parties should engage with the EU Delegation and relevant South African government departments. Specific calls may be issued for technical assistance components.',
    mipPrios: ['Green and digital transition', 'Sustainable growth and jobs'],
    documents: [{ name: 'JETP Investment Plan.pdf', url: '#' }],
    contacts: [
       { type: 'EU Delegation', name: 'Investment Team', details: 'jetp.sa@eeas.europa.eu' },
    ],
  }
];

export const userProfile = {
  name: 'Kelly McAulay',
  role: 'Senior Partnership Advisor to the Africa Region | Office of the Regional Director | Nairobi, Kenya.',
  expertise: 'Specializes in humanitarian aid and post-conflict recovery projects. Strong experience in West Africa.',
  contact: 'jane.doe@unops.org',
};

export const notifications = [
  {
    id: '1',
    title: 'New Opportunity Matching Your Criteria',
    description: 'A new humanitarian fund for Burkina Faso has been added.',
    date: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Deadline Reminder',
    description: 'The "Sustainable Economic Growth Initiative for West Africa" is closing in 15 days.',
    date: '1 day ago',
    read: false,
  },
  {
    id: '3',
    title: 'Opportunity Updated',
    description: 'The contact person for the Angola education fund has been updated.',
    date: '3 days ago',
    read: true,
  },
    {
    id: '4',
    title: 'Welcome to the Navigator!',
    description: 'Explore funding opportunities and set up your notification preferences.',
    date: '1 week ago',
    read: true,
  }
];

export const supportContent = {
  faq: [
    {
      question: 'How is the data in the app updated?',
      answer: 'The app is connected to live data feeds from various EU funding portals, ensuring that you have the most up-to-date information on opportunities.',
    },
    {
      question: 'Who should I contact before submitting a proposal for a HIP?',
      answer: 'It is mandatory to contact the relevant DG ECHO focal points before any proposal submission. Their contact details can be found in the opportunity details view.',
    },
    {
      question: 'What is NDICI-Global Europe?',
      answer: 'It is the EU\'s main financing instrument for development cooperation and international partnership for the 2021-2027 period.',
    },
     {
      question: 'How do I use the AI Opportunity Matching tool?',
      answer: 'On any opportunity details page, click the "Analyze Relevance" button. The AI will assess the opportunity against your user profile and recent activity to provide a relevance score and a brief explanation.',
    },
     {
      question: 'Can I save my search filters?',
      answer: 'Yes, on the dashboard you can find a "Saved Searches" section. This feature allows you to quickly run frequent searches with a single click. Adding and managing saved searches will be enhanced in future updates.',
    }
  ],
  glossary: [
    {
      term: 'MIP',
      definition: 'Multi-annual Indicative Programme. A document that sets out the priority areas for cooperation between the EU and a partner country for a specific period.',
    },
    {
      term: 'HIP',
      definition: 'Humanitarian Implementation Plan. A document that outlines the EU\'s humanitarian response strategy for a specific crisis or region.',
    },
    {
      term: 'Global Gateway',
      definition: 'The EU\'s strategy to boost smart, clean and secure links in digital, energy and transport sectors and to strengthen health, education and research systems across the world.',
    },
    {
      term: 'DG ECHO',
      definition: 'The Directorate-General for European Civil Protection and Humanitarian Aid Operations. It is the European Commission\'s department for overseas humanitarian aid and for civil protection.',
    },
     {
      term: 'PADOR',
      definition: 'Potential Applicant Data On-Line Registration. A database where organisations can register and upload their data, which is then used by the European Commission for checking the eligibility of applicants.',
    }
  ],
  contacts: [
    { name: 'Global EU Partnership Lead', details: 'John Doe, john.doe@unops.org' },
    { name: 'AFR Regional Partnerships Advisor', details: 'Fatima Ahmed, fatima.ahmed@unops.org' },
  ]
};
