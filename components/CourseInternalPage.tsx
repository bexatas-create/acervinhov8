
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import Navbar from './Navbar';
import { INITIAL_COURSES } from '../constants';
import { auth, db } from '../firebase';
import { progressService } from '../services/progressService';

// Icons
const VideoIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const FolderIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DownloadIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const FileIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const LiveIcon = () => (
  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
);

const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExternalLinkIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const CHAMA_FISICO_MODULES = [
  { id: 'informacoes-gerais', title: 'Comece Por Aqui' },
  { id: 'f-a-embasamento', title: 'FRENTE A – EMBASAMENTO' },
  { id: 'f-a-cinematica', title: 'Frente A | Cinemática' },
  { id: 'f-a-dinamica', title: 'Frente A | Dinâmica' },
  { id: 'f-a-trabalho', title: 'Frente A | Trabalho e Energia' },
  { id: 'f-a-impulso', title: 'Frente A | Impulso e Quantidade de Movimento' },
  { id: 'f-a-gravitacao', title: 'Frente A | Gravitação' },
  { id: 'f-a-estatica', title: 'Frente A | Estática' },
  { id: 'f-a-hidrostatica', title: 'Frente A | Hidrostática' },
  { id: 'f-b-termologia', title: 'Frente B | Termologia' },
  { id: 'f-b-optica', title: 'Frente B | Óptica Geométrica' },
  { id: 'f-b-ondulatoria', title: 'Frente B | Ondulatória' },
  { id: 'f-c-eletrostatica', title: 'Frente C | Eletrostática' },
  { id: 'f-c-eletrodinamica', title: 'Frente C | Eletrodinâmica' },
  { id: 'f-c-eletromagnetismo', title: 'Frente C | Eletromagnetismo' },
  { id: 'f-c-moderna', title: 'Frente C | Física Moderna' },
];

const INITIAL_MATERIALS = [
  { name: "Apostila de Exercícios", url: "https://drive.google.com/file/d/1kx4OkWjZBVXa7vkvY9-fmpVDm5kkq5Nm/view" },
  { name: "Embasamento Teórico do Curso", url: "https://drive.google.com/file/d/17dWvur28tn8vdVAA2oin9ve6yKQncdpz/view" },
  { name: "Frente A — Física", url: "https://drive.google.com/file/d/1A0oA79MK0iB9vxEp1M3LJigUlxTpp0Df/view" },
  { name: "Frente B — Física", url: "https://drive.google.com/file/d/1JQcMncX7p5xRwaJ-f3ExTEvyF_ejVnJQ/view" },
  { name: "Frente C — Física", url: "https://drive.google.com/file/d/1bkakLzVdFjbgPP-dD6X51wu872XevmlQ/view" },
];

const WELCOME_LESSON = {
  id: 'lesson-informacoes-gerais-01',
  blockId: 'informacoes-gerais',
  title: 'Boas-vindas',
  videoUrl: 'https://www.youtube.com/embed/gbU0Lzx75Xs',
  description: 'Bem-vindo ao Chama o Físico! Assista ao vídeo para entender como extrair o máximo da nossa plataforma.',
  type: 'video' as const
};

// EMBASAMENTO LESSONS DATA
const EMBASAMENTO_DATA = [
  { id: '001', title: 'Introdução', link: '1-2zC6Set3XmuEbsdLpXQJuYV1W8B9BO4' },
  { id: '002', title: 'Unidades de Medidas – Comprimento', link: '1-5C7_LUeBGAxCiIIlGBdzW1rv4E9Jmf9' },
  { id: '003', title: 'Unidades de Medidas – Área', link: '1-FLKVqb1TDCOqBjzK2A9KJMqtDhCVcwa' },
  { id: '004', title: 'Unidades de Medidas – Volume', link: '1-I04dHTtNDaTrS2ejAfdS_WIaiEeNJ2f' },
  { id: '005', title: 'Unidades de Medidas – Massa', link: '1-NJOI6j6xW3nV0GJEB5Mrh1N2s9AA0Ch' },
  { id: '006', title: 'Unidades de Medidas – Tempo', link: '1-NIKefrQq2clf5Xp--DyfPnLk1DRz228' },
  { id: '007', title: 'Prefixos Importantes', link: '1-WpSNCwXK_3-SEQdffTbw8fwnfd4mYF4' },
  { id: '008', title: 'Unidades Compostas', link: '1-hLObB-Eg50rNr3rnZ4HrWaU5BrucBKF' },
  { id: '009', title: 'Notação Científica', link: '1-jFbCuNFyipMG0rKmu_fTOLRws--4FLs' },
  { id: '010', title: 'Equação do 1º Grau', link: '1-lcF631LPXK71EsGjvadjXAJklDxxyF4' },
  { id: '011', title: 'Equação do 2º Grau', link: '1-nWYEfsGWyMQxk0ah7jitlJm4U1BjP4O' },
  { id: '012', title: 'Relação de Proporcionalidade', link: '1-tPEf0fm044s0Z-0g2pjT1Q8jcSfNpAl' },
  { id: '013', title: 'Geometria', link: '1-tozX2Mvs0Wg1wERZAiRuVbFemcs4YEi' },
  { id: '014', title: 'Medidas de Ângulos', link: '1-uB3NK24EiaKLOk8GGmciuSo0JiX6jQ1' },
  { id: '015', title: 'Teorema de Pitágoras', link: '1-uv3ioXUPnQcew6Suyw3xigKqckj0w_L' },
  { id: '016', title: 'Razões Trigonométricas', link: '10-uerRo8Eo67RhzeuItKHMxUTo0ErJiI' },
  { id: '017', title: 'Triângulo 30°, 60° e 90°', link: '1013M5pgg6468bTnmw0INck0vaq8dwjIU' },
  { id: '018', title: 'Lei dos Cossenos', link: '10Md50pZPinpcFLSnAKJvpPStf1Oi7C-c' },
  { id: '019', title: 'Ciclo Trigonométrico', link: '10JLFo-ulZbNFQN2mt_GhQK2fW69uKz8O' },
  { id: '020', title: 'Relações Trigonométricas', link: '10PY6oswDXvN3waVmVIUTEBeTJs352yR1' },
  { id: '021', title: 'Função do 1º Grau', link: '10R45lXn6DpbCgVC95uzpSUxktj5v1usb' },
  { id: '022', title: 'Gráfico da Função do 1º Grau', link: '10S8d2waNF6gEBNNIZEVV7nIBEAJw39OA' },
  { id: '023', title: 'Aplicação Física da Função do 1º Grau', link: '10XsazumoNt0zy9r1bhCOoEtVRIitGkGg' },
  { id: '024', title: 'Função do 2º Grau', link: '10ZvvWJ7WesNoPj4_c91KRCsAcLIA110W' },
  { id: '025', title: 'Gráfico da Função do 2º Grau', link: '10dAeIgXkmS1V2PBBXS8IULRGItLtFjCX' },
  { id: '026', title: 'Função Racional', link: '10k0hfcbMhXBVrvML2jDkNct_svyqh6aw' },
  { id: '027', title: 'Tipos de Grandezas Físicas', link: '10uCMvp0hnCSaYva9swXp7du8yKzuBN4J' },
  { id: '028', title: 'Soma Vetorial – Mesma Direção', link: '110rL6Blw_di1CLSaUYffIVlp_IwfFQGO' },
  { id: '029', title: 'Regra do Paralelogramo', link: '110wMj1swidODas4qWxtNKcgFXrkOzTYl' },
  { id: '030', title: 'Regra do Polígono', link: '113IAHP2Uja80G9t9vXgxPscTRyp4WzPG' },
  { id: '031', title: 'Decomposição Vetorial', link: '114H7wNhxX-8foqpW6dmbw1qY4pqxTUV2' },
  { id: '032', title: 'Distância x Deslocamento', link: '11B-8xrAWyBLwy4_Z3Q6c-O9sGPgxOp3B' },
  { id: '033', title: 'Equações Vetoriais', link: '11FQtYfgowAmn9frWmcQqk6oPvx6dTTIL' },
  { id: '034', title: 'Tática da Bissetriz', link: '11GiVsREgnd6CrEYcCTXFC7UhLPiDqO9h' },
];

const EMBASAMENTO_LESSONS = EMBASAMENTO_DATA.map(lesson => ({
  id: `lesson-embasamento-${lesson.id}`,
  blockId: 'f-a-embasamento',
  title: `[${lesson.id}] ${lesson.title}`,
  videoUrl: `https://drive.google.com/file/d/${lesson.link}/preview`,
  driveUrl: `https://drive.google.com/file/d/${lesson.link}/view`,
  description: `Nivelamento fundamental: ${lesson.title}. Essencial para o domínio da Física de alto nível.`,
  type: 'video' as const
}));

// LIVE CLASSES LOGIC
const START_DATE = new Date(2026, 1, 4); // 04/02/2026

const getLiveClassData = (index: number) => {
  const date = new Date(START_DATE);
  date.setDate(START_DATE.getDate() + (index - 1) * 7);
  return date;
};

const LIVE_CLASSES_SESSIONS = [
  {
    id: 'live-01',
    title: 'Aula ao Vivo 01',
    parts: [
      { id: 'live-01-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/HApPbST87w8' },
      { id: 'live-01-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/pjbGGAdxkmU' }
    ]
  },
  {
    id: 'live-02',
    title: 'Aula ao Vivo 02',
    parts: [
      { id: 'live-02-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/lZ3wmOFdzbU' },
      { id: 'live-02-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/df_M13Vxluk' },
      { id: 'live-02-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/IsQFwLGxqNM' }
    ]
  },
  {
    id: 'live-03',
    title: 'Aula ao Vivo 03',
    parts: [
      { id: 'live-03-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/-pdJI3aN-Es' },
      { id: 'live-03-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/vLLLKZMEoow' },
      { id: 'live-03-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/ntAj1PM4G-o' }
    ]
  },
  {
    id: 'live-04',
    title: 'Aula ao Vivo 04',
    parts: [
      { id: 'live-04-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/fZNRpCnXck8' },
      { id: 'live-04-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/dIo0W5i3NO0' },
      { id: 'live-04-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/6xInN8FLwOs' }
    ]
  },
  {
    id: 'live-05',
    title: 'Aula ao Vivo 05',
    parts: [
      { id: 'live-05-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/XQ3OXJHjHoU' },
      { id: 'live-05-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/Cd4_qDJC0Rc' },
      { id: 'live-05-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/uLkLBLRgSrk' }
    ]
  },
  {
    id: 'live-06',
    title: 'Aula ao Vivo 06',
    parts: [
      { id: 'live-06-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/cDiz0jYFpQ8' },
      { id: 'live-06-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/3BA51NzWZ4E' },
      { id: 'live-06-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/BUkk1ZjQwNQ' }
    ]
  },
  {
    id: 'live-07',
    title: 'Aula ao Vivo 07',
    parts: [
      { id: 'live-07-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/HbUEGkjvV-o' },
      { id: 'live-07-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/sZyYlp-bhF4' },
      { id: 'live-07-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/AlPtNOnm5sY' }
    ]
  },
  {
    id: 'live-08',
    title: 'Aula ao Vivo 08',
    parts: [
      { id: 'live-08-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/ZP53UAhfnic' },
      { id: 'live-08-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/apZ_IvcisdY' },
      { id: 'live-08-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/ha5Dx_Pv6Q4' }
    ]
  },
  {
    id: 'live-09',
    title: 'Aula ao Vivo 09',
    parts: [
      { id: 'live-09-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/HLNsOARP2aI' },
      { id: 'live-09-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/y-ujXLSRWZQ' },
      { id: 'live-09-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/oZ_7HzcFLtk' }
    ]
  },
  {
    id: 'live-10',
    title: 'Aula ao Vivo 10',
    parts: [
      { id: 'live-10-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/XOzjokA98-s' },
      { id: 'live-10-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/VSy11mta5g4' },
      { id: 'live-10-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/jn7_LIrF1Ig' }
    ]
  },
  {
    id: 'live-11',
    title: 'Aula ao Vivo 11',
    parts: [
      { id: 'live-11-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/cJzX5iGOo1o' },
      { id: 'live-11-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/NP5jT5cexxs' },
      { id: 'live-11-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/NP5jT5cexxs' }
    ]
  },
  {
    id: 'live-12',
    title: 'Aula ao Vivo 12',
    parts: [
      { id: 'live-12-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/FHyJeP-5iO8' },
      { id: 'live-12-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/s2NE-vzHbXw' },
      { id: 'live-12-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/geretq68Thk' }
    ]
  },
  {
    id: 'live-13',
    title: 'Aula ao Vivo 13',
    parts: [
      { id: 'live-13-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/_dc04E1-BLQ' },
      { id: 'live-13-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/dcsaz_UM7qc' },
      { id: 'live-13-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/aHtiCi-kZkE' }
    ]
  },
  {
    id: 'live-14',
    title: 'Aula ao Vivo 14',
    parts: [
      { id: 'live-14-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/o0_C9el7Pj8' },
      { id: 'live-14-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/jd9S0qAfojY' },
      { id: 'live-14-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/j7LB3zW3Pso' }
    ]
  },
  {
    id: 'live-15',
    title: 'Aula ao Vivo 15',
    parts: [
      { id: 'live-15-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/kwjOT1Ie1y4' },
      { id: 'live-15-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/aG2EJyqDw0s' },
      { id: 'live-15-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/Xe_z8HV4v0E' }
    ]
  },
  {
    id: 'live-16',
    title: 'Aula ao Vivo 16',
    parts: [
      { id: 'live-16-p1', title: 'Parte 1', url: 'https://www.youtube.com/embed/3Av2boda--k' },
      { id: 'live-16-p2', title: 'Parte 2', url: 'https://www.youtube.com/embed/1dICUQA_6Es' },
      { id: 'live-16-p3', title: 'Parte 3', url: 'https://www.youtube.com/embed/sunve_HWUc4' }
    ]
  }
];

const generatePlaceholderLessons = (moduleId: string, moduleTitle: string) => {
  if (moduleId === 'informacoes-gerais') return [WELCOME_LESSON];
  if (moduleId === 'f-a-embasamento') return EMBASAMENTO_LESSONS;
  return [
    { 
      id: `lesson-${moduleId}-01`, 
      blockId: moduleId, 
      title: `Aula 01: ${moduleTitle} - Introdução`, 
      videoUrl: '', 
      description: 'Conteúdo fundamental para o domínio deste tópico. Assista e faça suas anotações.',
      type: 'video' as const
    },
    { 
      id: `lesson-${moduleId}-02`, 
      blockId: moduleId, 
      title: `Aula 02: ${moduleTitle} - Prática e Exercícios`, 
      videoUrl: '', 
      description: 'Resolução comentada e aprofundamento técnico.',
      type: 'video' as const
    }
  ];
};

type ContentType = 'video' | 'pdf';
interface Material { title: string; url: string; type: string; }
interface LessonItem {
  id: string;
  title: string;
  type: ContentType;
  description?: string;
  duration?: string;
  blockId: string;
  videoUrl?: string;
  driveUrl?: string;
  materials?: Material[];
}

const CourseInternalPage = () => {
  const [activeItem, setActiveItem] = useState<LessonItem | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'player'>('overview');
  const [activeTab, setActiveTab] = useState<string>('AULAS AO VIVO'); 
  const [dbProgress, setDbProgress] = useState<Record<string, any>>({});
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set(['informacoes-gerais', 'f-a-embasamento']));
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'live' | 'recorded'>('live');

  const courseData = INITIAL_COURSES[0]; // Chama o Físico
  const courseId = 'fis-2';

  const fetchProfile = async () => {
    if (auth.currentUser) {
      const profileDoc = await getDoc(doc(db, "profiles", auth.currentUser.uid));
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setUserProfile(data);
        
        // AUTO-REDIRECT logic: 
        if (data.onboardingCompleted && viewMode === 'overview') {
          if (data.preferredCourseMode === 'live') {
            setActiveTab('AULAS AO VIVO');
          } else if (data.preferredCourseMode === 'recorded') {
            setActiveTab('ASSUNTOS');
          }
        }
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [viewMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, viewMode]);

  const loadAllProgress = async () => {
    if (auth.currentUser) {
      const b = await progressService.getBlocksProgress(auth.currentUser.uid, courseId);
      setDbProgress(b);
      const lessonsRef = collection(db, `userProgress/${auth.currentUser.uid}/lessons`);
      const q = query(lessonsRef, where("courseId", "==", courseId), where("completed", "==", true));
      const snap = await getDocs(q);
      const completedIds = new Set<string>();
      snap.forEach(doc => completedIds.add(doc.id));
      setCompletedLessons(completedIds);

      // Check for onboarding trigger
      if (completedIds.has(WELCOME_LESSON.id) && userProfile && !userProfile.onboardingCompleted) {
        setShowOnboarding(true);
      }
    }
  };

  useEffect(() => { loadAllProgress(); }, [viewMode, userProfile]);

  const handleSelectLesson = async (item: LessonItem) => {
    setActiveItem(item);
    setViewMode('player');
    if (auth.currentUser) await progressService.updateLastAccessed(auth.currentUser.uid, courseId, item.blockId, item.id);
  };

  const handleToggleCompletion = async (e: React.MouseEvent, item: LessonItem) => {
    e.stopPropagation();
    if (!auth.currentUser) return;
    const isCurrentlyCompleted = completedLessons.has(item.id);
    const newStatus = !isCurrentlyCompleted;
    setCompletedLessons(prev => {
      const next = new Set(prev);
      if (newStatus) next.add(item.id); else next.delete(item.id);
      return next;
    });
    try {
      await progressService.toggleLessonStatus(auth.currentUser.uid, courseId, item.blockId, item.id, newStatus);
      if (item.id === WELCOME_LESSON.id && newStatus && userProfile && !userProfile.onboardingCompleted) {
        setShowOnboarding(true);
      }
      loadAllProgress();
    } catch (err) { console.error(err); }
  };

  const handleSaveOnboarding = async () => {
    if (!auth.currentUser) return;
    try {
      await progressService.updateUserPreference(auth.currentUser.uid, selectedMode);
      setShowOnboarding(false);
      if (selectedMode === 'live') setActiveTab('AULAS AO VIVO');
      else setActiveTab('ASSUNTOS');
      await fetchProfile();
    } catch (err) { console.error(err); }
  };

  const chamaFisicoContent = useMemo(() => {
    return CHAMA_FISICO_MODULES.map(mod => ({
      ...mod,
      items: generatePlaceholderLessons(mod.id, mod.title)
    }));
  }, []);

  const toggleBlock = (blockId: string) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(blockId)) next.delete(blockId); else next.add(blockId);
      return next;
    });
  };

  const renderOnboardingModal = () => {
    if (!showOnboarding) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[3rem] p-10 md:p-14 shadow-[0_0_50px_rgba(37,99,235,0.2)] text-center">
           <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-600/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           </div>
           <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white mb-4">Escolha sua Experiência</h2>
           <p className="text-slate-400 text-lg mb-12">Como você prefere acompanhar o curso? Você pode mudar isso depois no seu perfil.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <button 
                onClick={() => setSelectedMode('live')}
                className={`flex flex-col items-center p-8 rounded-[2rem] border-2 transition-all group ${selectedMode === 'live' ? 'bg-blue-600 border-blue-500 shadow-xl scale-105' : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'}`}
              >
                 <div className="flex items-center mb-4">
                    <span className="text-lg font-bold text-white uppercase tracking-widest mr-2">Ao Vivo</span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${selectedMode === 'live' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>Recomendado</span>
                 </div>
                 <p className={`text-xs font-medium leading-relaxed ${selectedMode === 'live' ? 'text-blue-100' : 'text-slate-500'}`}>Ritmo ideal, orientação em tempo real e progressão guiada com o professor.</p>
              </button>

              <button 
                onClick={() => setSelectedMode('recorded')}
                className={`flex flex-col items-center p-8 rounded-[2rem] border-2 transition-all group ${selectedMode === 'recorded' ? 'bg-blue-600 border-blue-500 shadow-xl scale-105' : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'}`}
              >
                 <div className="flex items-center mb-4">
                    <span className="text-lg font-bold text-white uppercase tracking-widest">Gravado</span>
                 </div>
                 <p className={`text-xs font-medium leading-relaxed ${selectedMode === 'recorded' ? 'text-blue-100' : 'text-slate-500'}`}>Estude no seu próprio tempo, acessando o conteúdo completo de forma independente.</p>
              </button>
           </div>

           <button 
             onClick={handleSaveOnboarding}
             className="w-full bg-white text-blue-900 font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95 text-sm"
           >
             Confirmar e Entrar
           </button>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="bg-[#0F172A] min-h-screen text-white flex flex-col animate-in fade-in duration-700">
      <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
        <img src={courseData.thumbnail} alt={courseData.title} className="w-full h-full object-cover brightness-[0.3]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent"></div>
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-6 md:px-12 max-w-4xl">
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Plataforma Oficial</span>
            <span className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center">
              <LiveIcon /> Próxima Live: Quarta, 19h
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">Ambiente de <br/><span className="text-blue-500">Aprendizado</span></h1>
          <p className="text-slate-400 text-base md:text-lg mb-10 max-w-xl font-medium">Você está na plataforma oficial do Chama o Físico. Comece pelas boas-vindas ou acompanhe as lives semanais.</p>
          <div className="flex space-x-4">
            <button onClick={() => setActiveTab('AULAS AO VIVO')} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-blue-700 hover:scale-105 transition-all shadow-xl active:scale-95">Ir para as Lives</button>
            <button onClick={() => setActiveTab('ASSUNTOS')} className="bg-slate-800/80 backdrop-blur border border-slate-700 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-slate-700 transition-all active:scale-95">Assuntos Gravados</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12 relative z-10 pb-32">
        <div className="flex space-x-12 border-b border-slate-800 mb-12 overflow-x-auto hide-scrollbar">
          {['AULAS AO VIVO', 'COMECE POR AQUI', 'ASSUNTOS', 'CRONOGRAMA', 'REVISÕES'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all shrink-0 ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'AULAS AO VIVO' && (
          <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 gap-8">
               {LIVE_CLASSES_SESSIONS.map((session, index) => {
                  const classDate = getLiveClassData(index + 1);
                  const isFuture = classDate > new Date();
                  const isToday = classDate.toDateString() === new Date().toDateString();
                  const isPast = classDate < new Date() && !isToday;
                  
                  return (
                    <div 
                      key={session.id} 
                      className={`bg-slate-900 border ${isToday ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-slate-800'} p-8 md:p-10 rounded-[2.5rem] shadow-2xl transition-all ${isFuture ? 'opacity-60' : 'hover:bg-slate-800/40'}`}
                    >
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                          <div className="flex items-center space-x-5">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isToday ? 'bg-blue-600 shadow-lg' : isPast ? 'bg-green-600/20 text-green-500' : 'bg-slate-800 text-slate-600'}`}>
                                {isToday ? <LiveIcon /> : <VideoIcon className="w-6 h-6" />}
                             </div>
                             <div>
                                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                                   <CalendarIcon />
                                   <span>Quarta-feira • {classDate.toLocaleDateString('pt-BR')}</span>
                                   {isToday && <span className="text-blue-500 ml-2">• AO VIVO AGORA</span>}
                                   {isFuture && <span className="text-slate-600 ml-2">• AGUARDANDO</span>}
                                </div>
                                <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter">{session.title}</h3>
                             </div>
                          </div>
                          
                          {isPast && (
                            <button 
                              onClick={(e) => handleToggleCompletion(e, { id: session.id, blockId: 'aulas-ao-vivo' } as any)}
                              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${completedLessons.has(session.id) ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                            >
                               {completedLessons.has(session.id) ? <><CheckIcon /> Aula Concluída</> : "Marcar como Assistida"}
                            </button>
                          )}
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {session.parts.map((part) => (
                             <button 
                               key={part.id}
                               disabled={isFuture || !part.url}
                               onClick={() => handleSelectLesson({ id: part.id, title: `${session.title} - ${part.title}`, videoUrl: part.url, blockId: 'aulas-ao-vivo', type: 'video' } as any)}
                               className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isFuture ? 'bg-slate-950/50 border-slate-800 text-slate-700 cursor-not-allowed' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-blue-500/50 hover:bg-slate-800'}`}
                             >
                                <div className="flex items-center space-x-4">
                                   <div className={`p-2 rounded-lg ${isFuture ? 'bg-slate-900' : 'bg-blue-600/10 text-blue-500'}`}>
                                      <VideoIcon />
                                   </div>
                                   <span className="text-sm font-bold uppercase tracking-tight">{part.title}</span>
                                </div>
                                {isFuture ? <ClockIcon /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>}
                             </button>
                          ))}
                       </div>
                    </div>
                  );
               })}
            </div>
          </div>
        )}

        {activeTab === 'COMECE POR AQUI' && (
          <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-12">
              <div className="aspect-video w-full bg-black">
                <iframe src={WELCOME_LESSON.videoUrl} className="w-full h-full" allowFullScreen></iframe>
              </div>
              <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-slate-800">
                 <div>
                    <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter mb-2">{WELCOME_LESSON.title}</h2>
                    <p className="text-slate-400 text-sm font-medium">Assista ao vídeo e siga as instruções para começar.</p>
                 </div>
                 <button 
                  onClick={(e) => handleToggleCompletion(e, WELCOME_LESSON as any)} 
                  className={`px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-xl active:scale-95 ${completedLessons.has(WELCOME_LESSON.id) ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {completedLessons.has(WELCOME_LESSON.id) ? "Assistido" : "Marcar como Assistido"}
                </button>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
                📘 Materiais Iniciais do Curso
              </h3>
              <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
                 <div className="divide-y divide-slate-800/50">
                    {INITIAL_MATERIALS.map((mat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-6 hover:bg-slate-800/40 transition-colors">
                        <div className="flex items-center space-x-5">
                           <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-500">
                             <FileIcon />
                           </div>
                           <div>
                             <p className="text-sm font-bold text-white uppercase tracking-tight">{mat.name}</p>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Documento PDF</p>
                           </div>
                        </div>
                        <a 
                          href={mat.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-lg border border-slate-700 transition-all flex items-center"
                        >
                          <DownloadIcon className="mr-2" /> Abrir material
                        </a>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ASSUNTOS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {chamaFisicoContent.filter(b => b.id !== 'informacoes-gerais').map((block) => (
              <div 
                key={block.id} 
                onClick={() => handleSelectLesson(block.items[0])}
                className={`bg-slate-900 border ${block.id === 'f-a-embasamento' ? 'border-blue-500 shadow-blue-900/10' : 'border-slate-800'} p-8 rounded-[2rem] hover:border-blue-500/50 hover:bg-slate-800/40 transition-all cursor-pointer group flex flex-col justify-between min-h-[220px] shadow-2xl relative overflow-hidden`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all ${block.id === 'f-a-embasamento' ? 'bg-blue-600 shadow-lg text-white' : 'bg-slate-800 group-hover:bg-blue-600/20 text-slate-500 group-hover:text-blue-400'}`}>
                    <FolderIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors line-clamp-2 uppercase tracking-tighter italic">{block.title}</h3>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{block.items.length} Conteúdos</p>
                </div>
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800/50">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{dbProgress[block.id]?.completedLessons || 0} Concluídos</span>
                   <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'CRONOGRAMA' && (
           <div className="max-w-4xl py-20 text-center border-2 border-dashed border-slate-800 rounded-[3rem] animate-in fade-in duration-500">
              <div className="flex justify-center"><CalendarIcon /></div>
              <p className="text-slate-500 font-black uppercase text-[11px] tracking-[0.2em] mt-6 italic">Sincronizando cronograma pedagógico personalizado...</p>
           </div>
        )}
      </div>
    </div>
  );

  if (viewMode === 'overview') {
    return (
      <div className="bg-[#0F172A] min-h-screen text-white">
        <Navbar />
        {renderDashboard()}
        {renderOnboardingModal()}
      </div>
    );
  }

  return (
    <div className="bg-[#0F172A] min-h-screen text-white flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-64px)] mt-16 overflow-hidden">
        <div className="flex-grow overflow-y-auto bg-slate-950 flex flex-col">
          <div className="p-5 border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-between">
            <button onClick={() => setViewMode('overview')} className="text-slate-400 hover:text-white flex items-center text-[11px] font-black uppercase tracking-widest transition-colors"><BackIcon /> Dashboard</button>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest truncate max-w-xs">{activeItem?.title}</span>
          </div>
          
          <div className="flex-grow p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col items-center">
            <div className="max-w-5xl w-full">
              <div className="aspect-video w-full bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 relative group/player shadow-blue-900/10">
                {activeItem?.videoUrl ? (
                  <iframe src={activeItem.videoUrl} className="w-full h-full" allowFullScreen></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                    <div className="w-24 h-24 rounded-3xl bg-slate-800 flex items-center justify-center mb-8 group-hover/player:bg-slate-700 transition-colors shadow-inner">
                      <VideoIcon className="w-10 h-10 text-slate-600" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando aula...</p>
                  </div>
                )}
              </div>

              <div className="mt-14">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-slate-800 pb-12">
                   <div className="flex-grow">
                      <h1 className="text-4xl font-extrabold tracking-tight mb-6 leading-tight text-white">{activeItem?.title}</h1>
                      <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">{activeItem?.description || "Conteúdo exclusivo da plataforma Chama o Físico."}</p>
                   </div>
                   <div className="flex flex-col space-y-4">
                      {activeItem && (
                        <button 
                          onClick={(e) => handleToggleCompletion(e, activeItem)} 
                          className={`px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl whitespace-nowrap active:scale-95 ${completedLessons.has(activeItem.id) ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          {completedLessons.has(activeItem.id) ? <span className="flex items-center"><CheckIcon className="mr-2.5"/> Concluída</span> : "Marcar como Assistida"}
                        </button>
                      )}
                      {activeItem?.driveUrl && (
                        <a 
                          href={activeItem.driveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-12 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-center bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center"
                        >
                          <ExternalLinkIcon className="mr-2" /> Abrir no Drive
                        </a>
                      )}
                   </div>
                </div>

                <div className="mt-14 pb-20">
                  <div className="flex space-x-12 border-b border-slate-800 mb-10">
                    {['MATERIAIS', 'ANOTAÇÕES'].map(t => (
                      <button key={t} className={`pb-5 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${t === 'MATERIAIS' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}>{t}</button>
                    ))}
                  </div>
                  <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                    <p className="text-slate-600 font-bold uppercase text-[11px] tracking-widest italic">Nenhum material anexado para esta aula.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[440px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/40 backdrop-blur-sm">
            <h2 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Aulas do Módulo</h2>
            <div className="flex items-center bg-blue-600/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
              <span className="text-[11px] font-black text-blue-400">{completedLessons.size} <span className="text-slate-600 mx-1">/</span> {chamaFisicoContent.reduce((acc, b) => acc + b.items.length, 0)}</span>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {chamaFisicoContent.map(block => (
              <div key={block.id} className="border-b border-slate-800/30">
                <button 
                  onClick={() => toggleBlock(block.id)}
                  className={`w-full px-6 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between ${block.id === 'f-a-embasamento' ? 'bg-blue-600/10 text-blue-400' : 'bg-slate-950/40 text-slate-500'}`}
                >
                   <div className="flex items-center">
                     <div className={`w-1.5 h-1.5 rounded-full mr-3 ${block.id === 'f-a-embasamento' ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
                     {block.title}
                   </div>
                   <svg className={`w-3 h-3 transition-transform ${expandedBlocks.has(block.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                </button>
                {expandedBlocks.has(block.id) && (
                  <div className="divide-y divide-slate-800/20">
                    {block.items.map((lesson: any, idx: number) => (
                      <div 
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson)}
                        className={`px-6 py-4 flex items-center justify-between cursor-pointer border-l-4 transition-all ${activeItem?.id === lesson.id ? 'bg-blue-600/10 border-l-blue-500' : 'hover:bg-slate-800/40 border-l-transparent'}`}
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className={`text-[10px] font-black w-4 text-center shrink-0 ${activeItem?.id === lesson.id ? 'text-blue-400' : 'text-slate-600'}`}>
                            {idx + 1}
                          </div>
                          <div className="flex items-center space-x-3 truncate">
                            <VideoIcon className={`w-4 h-4 shrink-0 ${completedLessons.has(lesson.id) ? 'text-green-500' : 'text-slate-600'}`} />
                            <span className={`text-[13px] font-semibold truncate ${activeItem?.id === lesson.id ? 'text-white' : 'text-slate-400'}`}>
                              {lesson.title}
                            </span>
                          </div>
                        </div>
                        <div 
                          onClick={(e) => handleToggleCompletion(e, lesson)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${completedLessons.has(lesson.id) ? 'bg-green-600 border-green-600 text-white' : 'border-slate-800 text-transparent'}`}
                        >
                          {completedLessons.has(lesson.id) && <CheckIcon className="w-3 h-3" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }`}</style>
    </div>
  );
};

export default CourseInternalPage;
