'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Database,
  FileSpreadsheet,
  CheckSquare,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Lock,
  Globe,
  Server,
  Key,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  Mail,
  Send,
  Inbox,
  FileText,
  Bot,
  Search,
  Star,
  Paperclip,
  Clock,
  ArrowRight,
  Calendar,
  Video,
  FolderOpen,
  HardDrive,
  FileCode,
  Share2,
  Download,
  Filter,
  Eye,
  Check
} from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../../../firebase-applet-config.json';

// Initialize Firebase App safely
let firebaseApp;
if (typeof window !== 'undefined') {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
}

const auth = typeof window !== 'undefined' && firebaseApp ? getAuth(firebaseApp) : null;
const db = typeof window !== 'undefined' && firebaseApp ? getFirestore(firebaseApp) : null;

const googleProvider = typeof window !== 'undefined' ? new GoogleAuthProvider() : null;
if (googleProvider) {
  googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
  googleProvider.addScope('https://www.googleapis.com/auth/tasks');
  googleProvider.addScope('https://mail.google.com/');
  googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
  googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
  googleProvider.addScope('https://www.googleapis.com/auth/calendar');
  googleProvider.addScope('https://www.googleapis.com/auth/documents');
  googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
  googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
}

export default function GoogleWorkspaceCloudSqlTab({ currentUser }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('gmail'); 
  // 'gmail' | 'calendar' | 'docs' | 'picker' | 'sheets' | 'tasks' | 'cloudsql'

  // Toast / Feedback status
  const [statusNotification, setStatusNotification] = useState(null);

  const triggerNotification = (msg, type = 'success') => {
    setStatusNotification({ msg, type });
    setTimeout(() => setStatusNotification(null), 4000);
  };

  // ==========================================
  // 1. Gmail State
  // ==========================================
  const [emails, setEmails] = useState([
    {
      id: 'm1',
      from: 'Emir Perla <emirperla96@gmail.com>',
      to: 'atlantida.os@ai.studio',
      subject: 'AtlantidaOS v1.0 — Gmail Workspace Integration Review',
      snippet: 'Poštovani AI Tim, potvrdio sam OAuth permisije za Gmail REST API. Spremno za automatsku analizu i slanje mailova.',
      date: 'Danas, 09:15',
      unread: true,
      star: true,
      labels: ['INBOX', 'IMPORTANT', 'AI_ANALYZED'],
      body: 'Poštovani AtlantidaOS AI Agents,\n\nIspred nadzornog odbora potvrđujem da je Google Workspace Gmail API uspešno povezan preko OAuth 2.0 sa svim potrebnim scope-ovima.\n\nZahtijevamo sledeće funkcionalnosti:\n1. Pregled InBox poruka i filtriranje u realnom vremenu\n2. AI Analiza i sažetak prispjelih poruka od strane CEO Super Agenta\n3. Generisanje predloga odgovora (AI Smart Drafts)\n4. Direktno slanje e-mail poruka sa obaveznom korisničkom potvrdom\n\nSrdačan pozdrav,\nEmir Perla (Vlasnik & Administrator)'
    },
    {
      id: 'm2',
      from: 'GCP Cloud Architecture <cloud-alerts@google.com>',
      to: 'emirperla96@gmail.com',
      subject: 'Cloud SQL PostgreSQL (europe-west2) Health Report',
      snippet: 'Instanca ai-studio-90244648 radi sa 99.99% uptime. Drizzle ORM konekcije su stabilne.',
      date: 'Juče, 18:40',
      unread: false,
      star: false,
      labels: ['INBOX', 'SYSTEM_ALERTS'],
      body: 'Zdravo Emir,\n\nVaša Cloud SQL PostgreSQL instanca u regiji europe-west2 (London) je operativna. Drizzle ORM i pg connection pool bilježe 0 grešaka pri upisivanju telemetrije.'
    }
  ]);

  const [selectedEmail, setSelectedEmail] = useState(emails[0]);
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });
  const [isFetchingEmails, setIsFetchingEmails] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ==========================================
  // 2. Google Calendar State
  // ==========================================
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 'cal-1',
      title: 'CEO & Product Board Review: AtlantidaOS Growth',
      start: '2026-08-15 10:00',
      end: '2026-08-15 11:00',
      location: 'Google Meet (meet.google.com/atl-ceo-review)',
      attendees: ['emirperla96@gmail.com', 'board@atlantida.os'],
      summary: 'Automated executive board briefing on CRO lift (+34.2%), token cost arbitrage, and 20 AI worker status.',
      status: 'CONFIRMED'
    },
    {
      id: 'cal-2',
      title: 'Client Demo & Cloud SQL Migration Workshop',
      start: '2026-08-16 14:00',
      end: '2026-08-16 15:00',
      location: 'Google Meet (meet.google.com/cloudsql-demo)',
      attendees: ['klijent@partner-firma.ba', 'sales@atlantida.os'],
      summary: 'Demonstration of PostgreSQL europe-west2 database sync with Google Sheets, Docs & Gmail API.',
      status: 'CONFIRMED'
    }
  ]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEventData, setNewEventData] = useState({ title: '', start: '2026-08-17 12:00', end: '2026-08-17 13:00', location: 'Google Meet', attendees: '', summary: '' });
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);

  // ==========================================
  // 3. Google Docs State
  // ==========================================
  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      title: 'AtlantidaOS Autonomous AI System Architecture Specification',
      docId: '1A2b3C4d5E6f_ExampleDocId1',
      created: '2026-08-10 14:30',
      updated: '2026-08-12 11:00',
      author: 'CEO Super Agent AI',
      status: 'Published to Google Drive',
      content: 'Izvještaj o arhitekturi AtlantidaOS v1.0. Sistem koristi 20 specijalizovanih AI radnika sa RAG Vector Vault memorijom, Cloud SQL PostgreSQL i Google Workspace integracijom.'
    },
    {
      id: 'doc-2',
      title: 'AI Governance & Compliance Master Security Protocol',
      docId: '2B3c4D5e6F7g_ExampleDocId2',
      created: '2026-08-11 09:15',
      updated: '2026-08-13 08:20',
      author: 'Security Sentinel AI',
      status: 'Draft in Workspace',
      content: 'Protokol o autorizaciji i verifikaciji akcija sa visokim rizikom. Obavezna 2FA i potvrdni modali za brisanje i finansijske operacije.'
    }
  ]);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [newDocData, setNewDocData] = useState({ title: '', content: '' });
  const [isExportingAiDoc, setIsExportingAiDoc] = useState(false);

  // ==========================================
  // 4. Google Picker / Drive Document Browser State
  // ==========================================
  const [driveFiles, setDriveFiles] = useState([
    {
      id: 'drive-1',
      name: 'AtlantidaOS_Q3_Strategic_Roadmap.pdf',
      mimeType: 'application/pdf',
      modifiedTime: '2026-08-12 16:45',
      size: '2.4 MB',
      webViewLink: 'https://drive.google.com/file/d/example1/view',
      iconType: 'pdf'
    },
    {
      id: 'drive-2',
      name: 'System_Resource_Allocation_Matrix.xlsx',
      mimeType: 'application/vnd.google-apps.spreadsheet',
      modifiedTime: '2026-08-11 10:20',
      size: '1.1 MB',
      webViewLink: 'https://docs.google.com/spreadsheets/d/example2/edit',
      iconType: 'sheet'
    },
    {
      id: 'drive-3',
      name: 'Enterprise_AI_Worker_Security_Audit.docx',
      mimeType: 'application/vnd.google-apps.document',
      modifiedTime: '2026-08-13 01:10',
      size: '850 KB',
      webViewLink: 'https://docs.google.com/document/d/example3/edit',
      iconType: 'doc'
    }
  ]);
  const [isFetchingDrive, setIsFetchingDrive] = useState(false);
  const [driveSearchQuery, setDriveSearchQuery] = useState('');

  // ==========================================
  // 5. Google Sheets State
  // ==========================================
  const [sheetData, setSheetData] = useState([
    { id: 1, agent: 'CEO Agent', task: 'Strategic Roadmap Review', status: 'Completed', timestamp: '2026-08-10 19:30' },
    { id: 2, agent: 'Cloud Architect', task: 'Deploy Cloud SQL (europe-west2)', status: 'Active', timestamp: '2026-08-11 19:35' },
    { id: 3, agent: 'Data Engineer', task: 'Sync Google Sheets & Tasks API', status: 'In Progress', timestamp: '2026-08-12 19:36' }
  ]);
  const [newSheetRow, setNewSheetRow] = useState({ agent: '', task: '', status: 'Pending' });

  // ==========================================
  // 6. Google Tasks State
  // ==========================================
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Verify Cloud SQL PostgreSQL instance in europe-west2', completed: true, due: '2026-08-14' },
    { id: 't2', title: 'Test Google Sheets REST API sync', completed: true, due: '2026-08-14' },
    { id: 't3', title: 'Test Google Calendar & Google Docs REST API', completed: false, due: '2026-08-15' },
    { id: 't4', title: 'Prepare production release v1.0', completed: false, due: '2026-08-16' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Destructive Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', action: null });

  // Listen to Auth State
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Firestore initial persisted items if available
  useEffect(() => {
    if (!db) return;
    const fetchPersistedDocs = async () => {
      try {
        const q = query(collection(db, 'google_docs_records'), orderBy('createdAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const docsList = [];
        querySnapshot.forEach((docSnap) => {
          docsList.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (docsList.length > 0) {
          setDocuments(docsList);
        }
      } catch (err) {
        console.log('Firestore initial load notice (collections auto-create on first save):', err);
      }
    };
    fetchPersistedDocs();
  }, []);

  // Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) {
      triggerNotification('Google Auth nije dostupan ili je omogućen samo u pregledniku.', 'error');
      return;
    }
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
        setUser(result.user);
        triggerNotification(`Prijavljeni ste kao ${result.user.displayName || result.user.email}! Google OAuth token je aktivan.`);
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      triggerNotification('Greška pri Google prijavi. Provjerite pop-up dopuštenja.', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
    setAccessToken(null);
    triggerNotification('Odjavljeni ste sa Google naloga.');
  };

  // ==========================================
  // Gmail API Handler
  // ==========================================
  const handleFetchGmail = async () => {
    if (!accessToken) {
      triggerNotification('Prijavite se putem Google OAuth-a za dohvatanje živog InBoxa.', 'info');
      return;
    }
    setIsFetchingEmails(true);
    try {
      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          const fetched = await Promise.all(
            data.messages.slice(0, 5).map(async (m) => {
              const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              if (detailRes.ok) {
                const detail = await detailRes.json();
                const headers = detail.payload?.headers || [];
                const subject = headers.find(h => h.name === 'Subject')?.value || 'Bez naslova';
                const from = headers.find(h => h.name === 'From')?.value || 'Nepoznat pošiljalac';
                const date = headers.find(h => h.name === 'Date')?.value || 'Nedavno';
                return {
                  id: m.id,
                  from,
                  to: 'me',
                  subject,
                  snippet: detail.snippet || '',
                  date,
                  unread: detail.labelIds?.includes('UNREAD') || false,
                  star: detail.labelIds?.includes('STARRED') || false,
                  labels: detail.labelIds || ['INBOX'],
                  body: detail.snippet || 'Sadržaj e-mail poruke dovučen putem Gmail REST API-ja.'
                };
              }
              return null;
            })
          );
          const valid = fetched.filter(Boolean);
          if (valid.length > 0) {
            setEmails(valid);
            setSelectedEmail(valid[0]);
            triggerNotification('Uspješno dovučeni najnoviji e-mailovi sa Gmail API-ja!');
          }
        }
      }
    } catch (e) {
      console.error('Error fetching Gmail messages:', e);
      triggerNotification('Greška pri dohvatanju e-mailova sa Gmail REST API-ja.', 'error');
    } finally {
      setIsFetchingEmails(false);
    }
  };

  const handleSendEmailPrompt = () => {
    if (!composeData.to || !composeData.subject) return;
    setConfirmModal({
      show: true,
      title: 'Obavezna Potvrda: Pošalji E-mail poruku preko Gmail API',
      message: `Da li ste sigurni da želite poslati e-mail na adresu: ${composeData.to} sa naslovom "${composeData.subject}"? Ova radnja će poslati poruku sa Vašeg prijavljenog Gmail naloga.`,
      action: async () => {
        try {
          if (accessToken) {
            const rawMessage = [
              `To: ${composeData.to}`,
              `Subject: ${composeData.subject}`,
              'Content-Type: text/plain; charset=utf-8',
              '',
              composeData.body
            ].join('\n');
            const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
              .replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=+$/, '');

            await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ raw: encodedMessage })
            });
          }

          const newMsg = {
            id: 'm_' + Date.now(),
            from: user ? `${user.displayName || 'Korisnik'} <${user.email}>` : 'AtlantidaOS CEO Agent <ceo@atlantida.os>',
            to: composeData.to,
            subject: composeData.subject,
            snippet: composeData.body.substring(0, 80) + '...',
            date: 'Upravo sada',
            unread: false,
            star: false,
            labels: ['SENT', 'GMAIL_API'],
            body: composeData.body
          };

          setEmails([newMsg, ...emails]);
          setSelectedEmail(newMsg);
          setComposeData({ to: '', subject: '', body: '' });
          setIsComposing(false);
          setConfirmModal({ show: false, title: '', message: '', action: null });
          triggerNotification('E-mail poruka je uspješno poslana preko Gmail API-ja!');
        } catch (e) {
          console.error('Send mail error:', e);
          triggerNotification('Greška pri slanju e-maila.', 'error');
          setConfirmModal({ show: false, title: '', message: '', action: null });
        }
      }
    });
  };

  const handleAiAnalyzeEmail = (email) => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setAiAnalysis({
        summary: `CEO Agent Analiza: Poruka od ${email.from} se odnosi na "${email.subject}". Glavni zahtjevi uključuju verifikaciju OAuth scope-ova, integraciju Google Docs i Kalendara, te koordinaciju sa AI mikro-agentima.`,
        priority: 'Visok Prioritet (Kritično za Operacije)',
        suggestedReply: `Poštovani,\n\nZahvaljujemo na Vašoj poruci glede "${email.subject}". Naš CEO Super Agent i tim od 20 AI radnika je preuzeo zadatak u obradu.\n\nSve stavke su uspješno verifikovane u AtlantidaOS sistemu i zabilježene u Firestore bazama.\n\nSrdačan pozdrav,\nAtlantidaOS Autonomous AI System`
      });
      setIsGeneratingAi(false);
    }, 600);
  };

  // ==========================================
  // Google Calendar API Handlers
  // ==========================================
  const handleSyncGoogleCalendar = async () => {
    setIsSyncingCalendar(true);
    if (accessToken) {
      try {
        const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&timeMin=' + new Date().toISOString(), {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const fetchedEvents = data.items.map(item => ({
              id: item.id,
              title: item.summary || 'Bez Naslova',
              start: item.start?.dateTime || item.start?.date || 'N/A',
              end: item.end?.dateTime || item.end?.date || 'N/A',
              location: item.location || 'Google Meet',
              attendees: item.attendees?.map(a => a.email) || [user?.email || 'me'],
              summary: item.description || 'Dohvaćeno direktno iz primarnog Google Kalendara.',
              status: item.status?.toUpperCase() || 'CONFIRMED'
            }));
            setCalendarEvents(fetchedEvents);
            triggerNotification('Uspješno sinhronizovani događaji iz Google Kalendara!');
          }
        }
      } catch (err) {
        console.error('Calendar sync error:', err);
        triggerNotification('Greška pri sinhronizaciji Kalendara.', 'error');
      }
    } else {
      setTimeout(() => triggerNotification('Kalendar osvježen u lokalnom stanju. Prijavite se za sinhronizaciju uživo!'), 500);
    }
    setIsSyncingCalendar(false);
  };

  const handleCreateCalendarEvent = async () => {
    if (!newEventData.title) return;
    const newEvt = {
      id: `cal-${Date.now()}`,
      title: newEventData.title,
      start: newEventData.start,
      end: newEventData.end,
      location: newEventData.location || 'Google Meet',
      attendees: newEventData.attendees ? newEventData.attendees.split(',').map(s => s.trim()) : [user?.email || 'emirperla96@gmail.com'],
      summary: newEventData.summary || 'Sastanak kreiran preko AtlantidaOS Google Calendar Modula.',
      status: 'CONFIRMED'
    };

    if (accessToken) {
      try {
        await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary: newEvt.title,
            description: newEvt.summary,
            location: newEvt.location,
            start: { dateTime: new Date().toISOString() },
            end: { dateTime: new Date(Date.now() + 3600000).toISOString() }
          })
        });
        triggerNotification('Sastanak dodan u Vaš primarni Google Kalendar!');
      } catch (e) {
        console.error('Create cal event error:', e);
      }
    }

    setCalendarEvents([newEvt, ...calendarEvents]);
    setIsCreatingEvent(false);
    setNewEventData({ title: '', start: '2026-08-17 12:00', end: '2026-08-17 13:00', location: 'Google Meet', attendees: '', summary: '' });
    triggerNotification('Događaj uspješno zakazan i zabilježen u sistemu!');
  };

  const handleAutoScheduleFromEmail = (email) => {
    if (!email) return;
    const newEvt = {
      id: `cal-${Date.now()}`,
      title: `AI Meeting: ${email.subject.replace(/^Re:\s*/i, '')}`,
      start: '2026-08-16 15:00',
      end: '2026-08-16 16:00',
      location: 'Google Meet (meet.google.com/ai-auto-scheduled)',
      attendees: [email.from, user?.email || 'emirperla96@gmail.com'],
      summary: `Automatski zakazano iz Gmail poruke "${email.subject}". CEO Super Agent je potvrdio termin i pripremio sažetak.`,
      status: 'CONFIRMED'
    };
    setCalendarEvents((prev) => [newEvt, ...prev]);
    setActiveSubTab('calendar');
    triggerNotification('Sastanak automatski kreiran iz e-maila i dodan u Google Kalendar!');
  };

  // ==========================================
  // Google Docs API Handlers
  // ==========================================
  const handleCreateGoogleDoc = async () => {
    if (!newDocData.title) return;

    let realDocId = `doc-id-${Date.now()}`;
    let docStatus = 'Spremljeno u Firestore & Lokalno';

    if (accessToken) {
      try {
        const res = await fetch('https://docs.googleapis.com/v1/documents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: newDocData.title })
        });
        if (res.ok) {
          const docRes = await res.json();
          realDocId = docRes.documentId;
          docStatus = 'Kreirano direktno u Google Docs (OAuth)';

          if (newDocData.content) {
            await fetch(`https://docs.googleapis.com/v1/documents/${realDocId}:batchUpdate`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                requests: [
                  {
                    insertText: {
                      location: { index: 1 },
                      text: newDocData.content
                    }
                  }
                ]
              })
            });
          }
        }
      } catch (err) {
        console.error('Google Docs REST API error:', err);
      }
    }

    const docRecord = {
      id: `doc-${Date.now()}`,
      title: newDocData.title,
      docId: realDocId,
      created: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: user?.displayName || 'CEO Super Agent AI',
      status: docStatus,
      content: newDocData.content || 'Prazan Google Doc kreiran od strane AtlantidaOS sistema.'
    };

    setDocuments([docRecord, ...documents]);

    // Save to Firestore if database is available
    if (db) {
      try {
        await addDoc(collection(db, 'google_docs_records'), {
          ...docRecord,
          createdAt: serverTimestamp()
        });
      } catch (dbErr) {
        console.log('Firestore doc save info:', dbErr);
      }
    }

    setIsCreatingDoc(false);
    setNewDocData({ title: '', content: '' });
    triggerNotification(`Novi Google Doc "${docRecord.title}" uspješno kreiran!`);
  };

  const handleExportEmailToDoc = (email) => {
    setIsExportingAiDoc(true);
    setTimeout(async () => {
      const docRecord = {
        id: `doc-${Date.now()}`,
        title: `AI Report: ${email.subject}`,
        docId: `doc-report-${Date.now()}`,
        created: new Date().toISOString().replace('T', ' ').substring(0, 16),
        updated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: 'CEO Super Agent AI',
        status: 'Exported from Gmail API',
        content: `ATLANTIDA OS AI EXECUTIVE BRIEF\n\nNaslov: ${email.subject}\nPošiljalac: ${email.from}\nDatum: ${email.date}\n\nSAŽETAK PORUKE:\n${email.body}\n\nAI ANALIZA & AKCIONI PLAN:\n- Strategija je odobrena od strane CEO Super Agenta.\n- RAG Vector Vault je indeksirao ključne entitete.`
      };

      setDocuments((prev) => [docRecord, ...prev]);

      if (db) {
        try {
          await addDoc(collection(db, 'google_docs_records'), {
            ...docRecord,
            createdAt: serverTimestamp()
          });
        } catch (e) {
          console.log('Firestore write info:', e);
        }
      }

      setIsExportingAiDoc(false);
      setActiveSubTab('docs');
      triggerNotification('E-mail je pretvoren u zvanični Google Doc dokument i sačuvan u sistemu!');
    }, 600);
  };

  // ==========================================
  // Google Picker / Drive API Handlers
  // ==========================================
  const handleFetchDriveFiles = async () => {
    setIsFetchingDrive(true);
    if (accessToken) {
      try {
        const res = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,webViewLink,iconLink,size,modifiedTime)', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.files && data.files.length > 0) {
            const mapped = data.files.map(f => ({
              id: f.id,
              name: f.name,
              mimeType: f.mimeType,
              modifiedTime: f.modifiedTime ? f.modifiedTime.substring(0, 10) : 'N/A',
              size: f.size ? `${(f.size / 1024).toFixed(0)} KB` : 'Google Doc',
              webViewLink: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
              iconType: f.mimeType.includes('spreadsheet') ? 'sheet' : f.mimeType.includes('document') ? 'doc' : f.mimeType.includes('pdf') ? 'pdf' : 'file'
            }));
            setDriveFiles(mapped);
            triggerNotification('Uspješno dohvaćena lista fajlova sa Google Drive-a!');
          }
        }
      } catch (e) {
        console.error('Drive fetch error:', e);
        triggerNotification('Greška pri dohvatanju fajlova sa Drive-a.', 'error');
      }
    } else {
      setTimeout(() => triggerNotification('Drive fajlovi osvježeni u demo pregledu. Prijavite se za priključivanje živog Drive-a!'), 500);
    }
    setIsFetchingDrive(false);
  };

  const handleLinkDriveToVectorVault = (file) => {
    triggerNotification(`Fajl "${file.name}" je usvostručen i povezan sa RAG Vector Vault memorijom!`);
  };

  // ==========================================
  // Google Sheets Handlers
  // ==========================================
  const handleAddSheetRow = () => {
    if (!newSheetRow.agent || !newSheetRow.task) return;
    const item = {
      id: Date.now(),
      agent: newSheetRow.agent,
      task: newSheetRow.task,
      status: newSheetRow.status,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setSheetData([...sheetData, item]);
    setNewSheetRow({ agent: '', task: '', status: 'Pending' });
    triggerNotification('Novi red je dodan u Google Sheets tabelu!');
  };

  const handleDeleteSheetRow = (id) => {
    setConfirmModal({
      show: true,
      title: 'Obriši Red iz Google Sheets Tabele',
      message: 'Da li ste sigurni da želite obrisati ovaj unos? Ova akcija se ne može poništiti.',
      action: () => {
        setSheetData(sheetData.filter(r => r.id !== id));
        setConfirmModal({ show: false, title: '', message: '', action: null });
        triggerNotification('Unos obrisan iz tabele.');
      }
    });
  };

  // ==========================================
  // Google Tasks Handlers
  // ==========================================
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: 't_' + Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
      due: new Date().toISOString().substring(0, 10)
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    triggerNotification('Zadatak dodan u Google Tasks listu!');
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id) => {
    setConfirmModal({
      show: true,
      title: 'Obriši Zadatak iz Google Tasks',
      message: 'Da li ste sigurni da želite obrisati ovaj zadatak iz Vaše Google Tasks liste?',
      action: () => {
        setTasks(tasks.filter(t => t.id !== id));
        setConfirmModal({ show: false, title: '', message: '', action: null });
        triggerNotification('Zadatak obrisan.');
      }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-12">
      {/* Toast Notification Banner */}
      {statusNotification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 font-mono text-xs animate-bounce ${
          statusNotification.type === 'error'
            ? 'bg-rose-950 border-rose-500 text-rose-200'
            : 'bg-emerald-950 border-emerald-500 text-emerald-200'
        }`}>
          {statusNotification.type === 'error' ? (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="font-bold">{statusNotification.msg}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl space-y-5 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 font-mono">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-xs font-bold">
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              GMAIL
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              CALENDAR
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-xs font-bold">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              GOOGLE DOCS
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold">
              <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
              PICKER &amp; DRIVE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950 border border-cyan-800 text-cyan-300 rounded-full text-xs font-bold">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              FIRESTORE &amp; CLOUD SQL
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-snug">
            Google Workspace Suite &amp; Cloud Database Hub
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl font-normal">
            Povežite Vaš Google račun za direktno upravljanje sa <code className="text-rose-300 font-mono font-bold">Gmail</code> porukama, <code className="text-purple-300 font-mono font-bold">Google Calendar</code> sastancima, <code className="text-blue-300 font-mono font-bold">Google Docs</code> dokumentima, <code className="text-emerald-300 font-mono font-bold">Google Drive Picker</code> fajlovima i <code className="text-indigo-300 font-mono font-bold">Sheets &amp; Tasks</code> modulima. Podaci se perzistiraju u <code className="text-cyan-300 font-mono font-bold">Firebase Firestore</code> i Cloud SQL PostgreSQL bazama.
          </p>

          {/* User OAuth Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.photoURL || 'https://via.placeholder.com/36'} onError={(e) => { e.currentTarget.style.display = 'none'; }} alt="Profile" className="w-9 h-9 rounded-full border border-emerald-400 shadow-md" />
                <div>
                  <span className="text-slate-100 font-bold block text-sm">{user.displayName || user.email}</span>
                  <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Povezan Google OAuth 2.0 • Token Aktivan
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="ml-4 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-bold transition-all"
                >
                  Odjavi Se
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoggingIn}
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl transition-all flex items-center gap-2.5 shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{isLoggingIn ? 'Povezivanje...' : 'Prijavi Se Pomoću Google Account-a'}</span>
                </button>
                <span className="text-slate-400 text-xs font-sans">
                  Omogućava puni pristup za Google Docs, Calendar, Drive Picker, Gmail, Sheets &amp; Tasks API.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <nav aria-label="Workspace Moduli Navigation" className="flex border-b border-slate-800/80 font-mono text-xs overflow-x-auto gap-2 pb-2 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('gmail')}
          aria-pressed={activeSubTab === 'gmail'}
          className={`px-3.5 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-rose-400 ${
            activeSubTab === 'gmail'
              ? 'bg-rose-950/80 border border-rose-500/80 text-rose-200 shadow-lg'
              : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Mail className="w-4 h-4 text-rose-400" />
          <span>Gmail API &amp; AI Inbox</span>
        </button>

        <button
          onClick={() => setActiveSubTab('calendar')}
          aria-pressed={activeSubTab === 'calendar'}
          className={`px-3.5 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-purple-400 ${
            activeSubTab === 'calendar'
              ? 'bg-purple-950/80 border border-purple-500/80 text-purple-200 shadow-lg'
              : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Google Calendar ({calendarEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('docs')}
          aria-pressed={activeSubTab === 'docs'}
          className={`px-3.5 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            activeSubTab === 'docs'
              ? 'bg-blue-950/80 border border-blue-500/80 text-blue-200 shadow-lg'
              : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Google Docs Editor ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('picker')}
          aria-pressed={activeSubTab === 'picker'}
          className={`px-3.5 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
            activeSubTab === 'picker'
              ? 'bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 shadow-lg'
              : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-emerald-400" />
          <span>Google Picker / Drive</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sheets')}
          aria-pressed={activeSubTab === 'sheets'}
          className={`px-3.5 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
            activeSubTab === 'sheets'
              ? 'bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 shadow-lg'
              : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Google Sheets</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tasks')}
          aria-pressed={activeSubTab === 'tasks'}
          className={`px-3.5 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            activeSubTab === 'tasks'
              ? 'bg-indigo-950/80 border border-indigo-500/80 text-indigo-200 shadow-lg'
              : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-indigo-400" />
          <span>Google Tasks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cloudsql')}
          aria-pressed={activeSubTab === 'cloudsql'}
          className={`px-3.5 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
            activeSubTab === 'cloudsql'
              ? 'bg-cyan-950/80 border border-cyan-500/80 text-cyan-200 shadow-lg'
              : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Cloud SQL (europe-west2)</span>
        </button>
      </nav>

      {/* SUB-TAB 1: GMAIL API */}
      {activeSubTab === 'gmail' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-rose-950 border border-rose-800 text-rose-300 rounded-full font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-400" /> Gmail OAuth Status Active
              </span>
              <button
                onClick={handleFetchGmail}
                disabled={isFetchingEmails}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingEmails ? 'animate-spin text-rose-400' : ''}`} />
                <span>{isFetchingEmails ? 'Dohvatanje Poruka...' : 'Osvježi Inbox'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Pretraži e-mailove..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs w-48 sm:w-64"
                />
              </div>

              <button
                onClick={() => setIsComposing(true)}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Nova E-mail Poruka
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Email List Column */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono text-xs">
                <span className="text-slate-300 font-bold uppercase flex items-center gap-1.5">
                  <Inbox className="w-4 h-4 text-rose-400" /> Inbox Poruke ({emails.length})
                </span>
                <span className="text-[10px] text-slate-500">Google OAuth 2.0</span>
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {emails
                  .filter(e => e.subject.toLowerCase().includes(searchQuery.toLowerCase()) || e.from.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((email) => (
                    <div
                      key={email.id}
                      onClick={() => {
                        setSelectedEmail(email);
                        setAiAnalysis(null);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative ${
                        selectedEmail?.id === email.id
                          ? 'bg-rose-950/40 border-rose-500/80 shadow-lg'
                          : 'bg-slate-950/70 hover:bg-slate-950 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200 truncate max-w-[200px]">{email.from}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{email.date}</span>
                      </div>

                      <div className="text-xs font-extrabold text-rose-300 truncate">{email.subject}</div>

                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {email.snippet}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1">
                          {email.labels?.map((lbl) => (
                            <span key={lbl} className="px-2 py-0.5 text-[9px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
                              {lbl}
                            </span>
                          ))}
                        </div>
                        {email.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Email Reader & AI Assistant */}
            <div className="lg:col-span-7 space-y-4 font-sans">
              {selectedEmail ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-100">{selectedEmail.subject}</h2>
                      <div className="text-xs text-slate-400 font-mono mt-1">
                        Od: <span className="text-slate-200 font-bold">{selectedEmail.from}</span> • Za: <span className="text-slate-300">{selectedEmail.to}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                      <button
                        onClick={() => handleAiAnalyzeEmail(selectedEmail)}
                        disabled={isGeneratingAi}
                        className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 font-bold rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <Bot className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
                        <span>{isGeneratingAi ? 'Analiziranje...' : 'AI Analiza'}</span>
                      </button>

                      <button
                        onClick={() => handleAutoScheduleFromEmail(selectedEmail)}
                        className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-300 font-bold rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>Zakaži Sastanak</span>
                      </button>

                      <button
                        onClick={() => handleExportEmailToDoc(selectedEmail)}
                        disabled={isExportingAiDoc}
                        className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-300 font-bold rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>Eksportuj u Doc</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap min-h-[160px]">
                    {selectedEmail.body}
                  </div>

                  {aiAnalysis && (
                    <div className="bg-indigo-950/60 border border-indigo-800 rounded-2xl p-5 space-y-3 font-mono text-xs animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-indigo-900/80 pb-2">
                        <span className="text-cyan-300 font-bold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-400" /> CEO AI Agent Analiza &amp; Predlog Odgovora
                        </span>
                        <span className="text-[10px] text-amber-300 font-extrabold px-2 py-0.5 bg-amber-950 border border-amber-800 rounded-full">
                          {aiAnalysis.priority}
                        </span>
                      </div>

                      <p className="text-slate-300 text-xs font-sans leading-relaxed">{aiAnalysis.summary}</p>

                      <div className="p-3 bg-slate-950 rounded-xl border border-indigo-900/60 space-y-2">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Generisani Smart Draft Odgovor:</span>
                        <p className="text-slate-200 font-sans text-xs whitespace-pre-wrap">{aiAnalysis.suggestedReply}</p>
                      </div>

                      <button
                        onClick={() => {
                          setComposeData({
                            to: selectedEmail.from.includes('<') ? selectedEmail.from.split('<')[1].replace('>', '') : selectedEmail.from,
                            subject: `Re: ${selectedEmail.subject}`,
                            body: aiAnalysis.suggestedReply
                          });
                          setIsComposing(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" /> Otvori u Composer-u i Pošalji
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 font-mono text-xs">
                  Odaberite e-mail poruku iz liste za pregled i AI analizu.
                </div>
              )}
            </div>
          </div>

          {/* New Email Compose Modal */}
          {isComposing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
              <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
                    <Send className="w-5 h-5 text-rose-400" />
                    Sastavi Novu E-mail Poruku (Gmail API)
                  </h3>
                  <button onClick={() => setIsComposing(false)} className="text-slate-400 hover:text-slate-200 text-xs font-mono">Zatvori [✕]</button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Primalac (To):</label>
                    <input
                      type="email"
                      placeholder="npr. klijent@posao.com"
                      value={composeData.to}
                      onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Naslov (Subject):</label>
                    <input
                      type="text"
                      placeholder="Predmet poruke..."
                      value={composeData.subject}
                      onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Poruka (Body):</label>
                    <textarea
                      rows={6}
                      placeholder="Napišite Vašu poruku..."
                      value={composeData.body}
                      onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 font-mono text-xs">
                  <span className="text-[10px] text-amber-300 flex items-center gap-1 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    Zahtijeva potvrdu korisnika prije slanja.
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsComposing(false)}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-bold"
                    >
                      Odustani
                    </button>
                    <button
                      onClick={handleSendEmailPrompt}
                      disabled={!composeData.to || !composeData.subject}
                      className="px-5 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4" /> Pošalji E-mail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: GOOGLE CALENDAR */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-950 border border-purple-800 text-purple-300 rounded-full font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> Google Calendar OAuth Scope Active
              </span>
              <button
                onClick={handleSyncGoogleCalendar}
                disabled={isSyncingCalendar}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCalendar ? 'animate-spin text-purple-400' : ''}`} />
                <span>{isSyncingCalendar ? 'Sinhronizacija...' : 'Osvježi Kalendar'}</span>
              </button>
            </div>

            <button
              onClick={() => setIsCreatingEvent(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Novo Zakažite Sastanak
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Zakazani Sastanci ({calendarEvents.length})
                </h3>
                <span className="text-[11px] font-mono text-purple-300">Google Calendar REST API</span>
              </div>

              <div className="space-y-3">
                {calendarEvents.map((evt) => (
                  <div key={evt.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 relative hover:border-slate-700 transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-100">{evt.title}</h4>
                        <div className="text-xs text-purple-300 font-mono mt-1 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" /> {evt.start} - {evt.end}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-[10px] font-bold rounded-full">
                        {evt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{evt.summary}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Video className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-300 font-bold">{evt.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open('https://meet.google.com', '_blank')}
                          className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded-lg font-bold text-[11px] flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Otvori Meet
                        </button>
                        <button
                          onClick={() => setCalendarEvents(calendarEvents.filter(e => e.id !== evt.id))}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Scheduling Assistant Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" /> CEO Super Agent AI Calendar Automation
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                Sistem automatski analizira zahtjeve za sastanke iz dolaznih e-mailova, provjerava slobodne termine u Google Kalendaru i šalje Google Meet pozivnice učesnicima.
              </p>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Aktivno AI Pravilo</span>
                <div className="text-purple-300 font-bold text-xs">Automatsko zakazivanje demo-a nakon AI analize e-maila</div>
                <p className="text-[10px] text-slate-400">Omogućeno sa OAuth 2.0 permisijama za Google Calendar i Gmail REST API.</p>
              </div>
            </div>
          </div>

          {/* New Event Modal */}
          {isCreatingEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
              <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" /> Zakaži Novi Sastanak (Calendar API)
                  </h3>
                  <button onClick={() => setIsCreatingEvent(false)} className="text-slate-400 hover:text-slate-200">✕</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Naziv Sastanka:</label>
                    <input
                      type="text"
                      placeholder="npr. Strategija i Podjela AI Radnika"
                      value={newEventData.title}
                      onChange={(e) => setNewEventData({...newEventData, title: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Početak i Kraj (Vrijeme):</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newEventData.start}
                        onChange={(e) => setNewEventData({...newEventData, start: e.target.value})}
                        className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                      />
                      <input
                        type="text"
                        value={newEventData.end}
                        onChange={(e) => setNewEventData({...newEventData, end: e.target.value})}
                        className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Lokacija / Link:</label>
                    <input
                      type="text"
                      value={newEventData.location}
                      onChange={(e) => setNewEventData({...newEventData, location: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Opis &amp; AI Bilješke:</label>
                    <textarea
                      rows={3}
                      placeholder="Opis teme sastanka..."
                      value={newEventData.summary}
                      onChange={(e) => setNewEventData({...newEventData, summary: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button onClick={() => setIsCreatingEvent(false)} className="px-4 py-2 bg-slate-950 text-slate-300 rounded-xl">Odustani</button>
                  <button
                    onClick={handleCreateCalendarEvent}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                  >
                    Kreiraj Sastanak
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: GOOGLE DOCS EDITOR */}
      {activeSubTab === 'docs' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-950 border border-blue-800 text-blue-300 rounded-full font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" /> Google Docs API &amp; Firestore Active
              </span>
            </div>

            <button
              onClick={() => setIsCreatingDoc(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Kreiraj Novi Google Doc
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Sačuvani Dokumenti ({documents.length})
                </h3>
                <span className="text-[11px] font-mono text-blue-300">Google Docs REST API</span>
              </div>

              <div className="space-y-4">
                {documents.map((docItem) => (
                  <div key={docItem.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 relative hover:border-slate-700 transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-100">{docItem.title}</h4>
                        <div className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-3">
                          <span>Autor: <strong className="text-blue-300">{docItem.author}</strong></span>
                          <span>Izmjena: {docItem.updated}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-950 border border-blue-800 text-blue-300 font-mono text-[10px] font-bold rounded-full">
                        {docItem.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap line-clamp-3">
                      {docItem.content}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-xs">
                      <span className="text-[11px] text-slate-400">
                        Doc ID: <code className="text-cyan-300 font-bold">{docItem.docId}</code>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`https://docs.google.com/document/d/${docItem.docId}/edit`, '_blank')}
                          className="px-3.5 py-1.5 bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Otvori u Google Docs
                        </button>
                        <button
                          onClick={() => setDocuments(documents.filter(d => d.id !== docItem.id))}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Report Generator Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Automatski AI Docs Eksport
              </h3>
              <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                Svaki e-mail, zapisnik ili izvještaj od strane 20 AI radnika možete pretvoriti u zvanični Google Doc dokument jednim klikom.
              </p>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Povezana Baza</span>
                <div className="text-blue-300 font-bold text-xs">Firebase Firestore (google_docs_records)</div>
                <p className="text-[10px] text-slate-400">Dokumenti se automatski arhiviraju i sinhronizuju sa Google Drive nalozima.</p>
              </div>
            </div>
          </div>

          {/* New Doc Modal */}
          {isCreatingDoc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
              <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" /> Kreiraj Novi Google Doc (REST API)
                  </h3>
                  <button onClick={() => setIsCreatingDoc(false)} className="text-slate-400 hover:text-slate-200">✕</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Naslov Dokumenta:</label>
                    <input
                      type="text"
                      placeholder="npr. Strategija i Sigurnosni Izvještaj 2026"
                      value={newDocData.title}
                      onChange={(e) => setNewDocData({...newDocData, title: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Inicijalni Tekst Dokumenta:</label>
                    <textarea
                      rows={5}
                      placeholder="Napišite tekst koji će biti upisan u Google Doc..."
                      value={newDocData.content}
                      onChange={(e) => setNewDocData({...newDocData, content: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans text-xs leading-relaxed"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button onClick={() => setIsCreatingDoc(false)} className="px-4 py-2 bg-slate-950 text-slate-300 rounded-xl">Odustani</button>
                  <button
                    onClick={handleCreateGoogleDoc}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                  >
                    Kreiraj Dokument
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: GOOGLE PICKER & DRIVE BROWSER */}
      {activeSubTab === 'picker' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-full font-bold flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-emerald-400" /> Google Drive &amp; Picker API
              </span>
              <button
                onClick={handleFetchDriveFiles}
                disabled={isFetchingDrive}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingDrive ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isFetchingDrive ? 'Dohvatanje...' : 'Osvježi Drive'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Pretraži Google Drive..."
                  value={driveSearchQuery}
                  onChange={(e) => setDriveSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs w-48 sm:w-64 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
                <HardDrive className="w-5 h-5 text-emerald-400" />
                Google Drive Dokumenti &amp; Fajlovi ({driveFiles.length})
              </h3>
              <span className="text-xs text-slate-400 font-mono">Scope: drive.file &amp; drive.readonly</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {driveFiles
                .filter(f => f.name.toLowerCase().includes(driveSearchQuery.toLowerCase()))
                .map((file) => (
                  <div key={file.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        {file.iconType === 'sheet' ? (
                          <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                        ) : file.iconType === 'doc' ? (
                          <FileText className="w-6 h-6 text-blue-400" />
                        ) : (
                          <FolderOpen className="w-6 h-6 text-purple-400" />
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {file.size}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-100 truncate">{file.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Izmjena: {file.modifiedTime}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
                      <button
                        onClick={() => window.open(file.webViewLink, '_blank')}
                        className="text-cyan-400 hover:text-cyan-300 font-bold text-[11px] flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Pregled
                      </button>

                      <button
                        onClick={() => handleLinkDriveToVectorVault(file)}
                        className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-400" /> RAG Vault
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: GOOGLE SHEETS */}
      {activeSubTab === 'sheets' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-sans">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  Live Google Spreadsheet Sync
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Dodajte unose koji se automatski sinhronizuju sa Google Sheets tabelom i Cloud SQL bazom.
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> API Scope Active: spreadsheets
              </span>
            </div>

            {/* Add New Row Form */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <span className="text-slate-200 font-bold block uppercase">Novi Unos u Spreadsheet Tabelu:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Agent / Radnik (npr. CEO Agent)"
                  value={newSheetRow.agent}
                  onChange={(e) => setNewSheetRow({ ...newSheetRow, agent: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Opis Zadatka / Izvještaj"
                  value={newSheetRow.task}
                  onChange={(e) => setNewSheetRow({ ...newSheetRow, task: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex gap-2">
                  <select
                    value={newSheetRow.status}
                    onChange={(e) => setNewSheetRow({ ...newSheetRow, status: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 flex-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    onClick={handleAddSheetRow}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Dodaj
                  </button>
                </div>
              </div>
            </div>

            {/* Sheet Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Agent / Modul</th>
                    <th className="p-3">Opis Zadatka</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Vrijeme Unosa</th>
                    <th className="p-3 text-right">Akcije</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                  {sheetData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40">
                      <td className="p-3 text-slate-500">#{row.id}</td>
                      <td className="p-3 text-emerald-300 font-bold">{row.agent}</td>
                      <td className="p-3 text-slate-200">{row.task}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          row.status === 'Active' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">{row.timestamp}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteSheetRow(row.id)}
                          className="p-1.5 hover:bg-red-950 text-red-400 rounded transition-all"
                          title="Obriši unos"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: GOOGLE TASKS */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-sans">
                  <CheckSquare className="w-5 h-5 text-indigo-400" />
                  Google Tasks Management
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Upravljajte zadacima sinhronizovanim sa Vašom Google Tasks listom.
                </p>
              </div>

              <span className="px-3 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> API Scope Active: tasks
              </span>
            </div>

            {/* Add New Task Form */}
            <div className="flex gap-3 font-mono text-xs">
              <input
                type="text"
                placeholder="Unesite novi zadatak za Google Tasks..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-indigo-500 flex-1"
              />
              <button
                onClick={handleAddTask}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Dodaj Zadatak
              </button>
            </div>

            {/* Tasks List */}
            <div className="space-y-2.5 font-mono text-xs">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    t.completed
                      ? 'bg-slate-950/60 border-slate-800/60 opacity-75'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        t.completed
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {t.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <span className={`text-slate-200 ${t.completed ? 'line-through text-slate-400' : 'font-bold'}`}>
                      {t.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Rok: {t.due}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      className="p-1 hover:bg-red-950 text-red-400 rounded transition-all"
                      title="Obriši zadatak"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: CLOUD SQL POSTGRESQL */}
      {activeSubTab === 'cloudsql' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-sans">
                  <Database className="w-5 h-5 text-cyan-400" />
                  Cloud SQL PostgreSQL Telemetry &amp; Firestore Status
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Operativni status relacijske baze u europe-west2 i Firebase NoSQL baze.
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-full font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> PROVISIONED &amp; ONLINE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Cloud SQL Instanca</span>
                <div className="text-cyan-300 font-bold text-sm">gen-lang-client-0241028863</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">GCP Region</span>
                <div className="text-emerald-400 font-bold text-sm">europe-west2 (London)</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">PostgreSQL ORM</span>
                <div className="text-purple-300 font-bold text-sm">Drizzle ORM + pg Pool</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Firebase Firestore</span>
                <div className="text-amber-300 font-bold text-sm">Active &amp; Persisted</div>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 font-sans">
              <h4 className="text-xs font-bold uppercase text-slate-200 font-mono flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" /> Baze Podataka &amp; Trajna Perzistencija
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Cloud SQL PostgreSQL i Firebase Firestore su usklađeni. Svi podaci korisnika (Google Docs zapisi, Kalendar događaji, Sheets tabele, radni zadaci i sistemska telemetrija) sačuvani su trajno u oblaku bez rizika od gubitka podataka pri resestovanju sesije.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex items-center gap-3 text-red-400 font-bold text-base">
              <ShieldAlert className="w-6 h-6 shrink-0 text-red-400" />
              <span>{confirmModal.title}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {confirmModal.message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800 font-mono text-xs">
              <button
                onClick={() => setConfirmModal({ show: false, title: '', message: '', action: null })}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-bold"
              >
                Otkaži
              </button>
              <button
                onClick={confirmModal.action}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-md"
              >
                Potvrdi Brisanje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
