
export interface HospitalListing {
    id: string;
    name: string;
    location: string;
    description: string;
    rating: number;
    reviews: number;
    image: string | any; // Support both string URLs and imported assets
    category: 'General' | 'Ayurvedic';
    country: string;
    specialities: string[];
    pagePath: string;
    websiteUrl: string;
    contact?: string;
}

export const ALL_HOSPITALS: HospitalListing[] = [
    {
        id: 'HOS-001',
        name: 'SRM Global Hospitals',
        location: 'Tamil Nadu, India',
        country: 'India',
        description: 'A leading multi-speciality hospital, offering a wide range of medical services with state-of-the-art infrastructure.',
        rating: 4.9,
        reviews: 450,
        image: 'https://images.unsplash.com/photo-1586773860418-d3b9797d1630?q=80&w=2073&auto=format&fit=crop',
        category: 'General',
        specialities: ['General Medicine', 'Cardiology', 'Oncology'],
        pagePath: '/hospitals/srm-global-hospitals',
        websiteUrl: 'https://srmglobalhospitals.com/'
    },
    {
        id: 'HOS-002',
        name: 'Apollo Hospitals',
        location: 'Chennai, India',
        country: 'India',
        description: 'A large, private hospital chain with a strong presence in India, known for clinical excellence.',
        rating: 4.8,
        reviews: 1240,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
        category: 'General',
        specialities: ['Cardiology', 'Neurology', 'Transplant'],
        pagePath: '/hospitals/apollo-hospitals',
        websiteUrl: 'https://www.apollohospitals.com/'
    },
    {
        id: 'HOS-003',
        name: 'Kauvery Hospital',
        location: 'Tamil Nadu, India',
        country: 'India',
        description: 'A multi-speciality hospital chain in South India, known for its patient-centric approach and quality care.',
        rating: 4.7,
        reviews: 320,
        image: 'https://images.unsplash.com/photo-1516549660599-cc906a23727b?q=80&w=2070&auto=format&fit=crop',
        category: 'General',
        specialities: ['Gastroenterology', 'Orthopedics'],
        pagePath: '/hospitals/kauvery-hospital',
        websiteUrl: 'https://www.kauveryhospital.com/'
    },
    {
        id: 'HOS-004',
        name: 'Chettinad Super Speciality Hospital',
        location: 'Tamil Nadu, India',
        country: 'India',
        description: 'A well-known super speciality hospital providing advanced healthcare and medical education.',
        rating: 4.6,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=2074&auto=format&fit=crop',
        category: 'General',
        specialities: ['Super Speciality', 'Diagnostics'],
        pagePath: '/hospitals/chettinad-super-speciality-hospital',
        websiteUrl: 'https://chettinadhealthcity.com/'
    },
    {
        id: 'HOS-005',
        name: 'MGM Hospital',
        location: 'Chennai, India',
        country: 'India',
        description: 'A modern, multi-speciality hospital committed to providing quality healthcare and innovation.',
        rating: 4.8,
        reviews: 512,
        image: 'https://images.unsplash.com/photo-1632833239869-a37e315806d2?q=80&w=1951&auto=format&fit=crop',
        category: 'General',
        specialities: ['Transplant', 'Critical Care'],
        pagePath: '/hospitals/mgm-hospital',
        websiteUrl: 'https://mgmhealthcare.in/'
    },
    {
        id: 'HOS-006',
        name: 'Medical Park',
        location: 'Istanbul, Turkey',
        country: 'Turkey',
        description: 'A leading healthcare group providing international standards of medical excellence and surgery.',
        rating: 4.8,
        reviews: 890,
        image: 'https://images.unsplash.com/photo-1666214280557-f1e5022eb634?q=80&w=2070&auto=format&fit=crop',
        category: 'General',
        specialities: ['International Healthcare', 'Surgery'],
        pagePath: '/hospitals/medical-park',
        websiteUrl: 'https://www.medicalpark.com.tr/en'
    },
    {
        id: 'HOS-007',
        name: 'Dr. Saeed Alzahr Dental Clinic',
        location: 'Varna, Bulgaria',
        country: 'Bulgaria',
        description: 'A state-of-the-art dental facility offering professional and Personalised care with latest technology.',
        rating: 5.0,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1629909613184-7ddfdf0655ef?q=80&w=2070&auto=format&fit=crop',
        category: 'General',
        specialities: ['Dentistry', 'Orthodontics'],
        pagePath: '/hospitals/dr-alzahr-dental-clinic',
        websiteUrl: 'https://dr-alzahrdental.com/'
    },
    {
        id: 'HOS-008',
        name: 'Buchinger Wilhelmi',
        location: 'Lake Constance, Germany',
        country: 'Germany',
        description: 'World-leading clinic for therapeutic fasting and integrative medicine with over 100 years of experience.',
        rating: 5.0,
        reviews: 2300,
        image: '/images/hospitals/ayurvedic/buchinger-wilhelmi.png',
        category: 'Ayurvedic',
        specialities: ['Therapeutic Fasting', 'Integrative Medicine'],
        pagePath: '/hospitals/ayurvedic/buchinger-wilhelmi',
        websiteUrl: 'https://www.buchinger-wilhelmi.com/'
    },
    {
        id: 'HOS-009',
        name: 'Arya Vaidya Sala (Kottakkal)',
        location: 'Kerala, India',
        country: 'India',
        description: 'A century-old charitable institution engaged in the practice and propagation of authentic Ayurveda.',
        rating: 4.9,
        reviews: 5000,
        image: '/images/hospitals/ayurvedic/arya-vaidya-sala.png',
        category: 'Ayurvedic',
        specialities: ['Authentic Ayurveda', 'Panchakarma'],
        pagePath: '/hospitals/ayurvedic/arya-vaidya-sala',
        websiteUrl: 'https://www.aryavaidyasala.com/'
    }
];
