import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  apiCreateTimeLog,
  apiDeleteTimeLog,
  apiListTimeLogs,
  clearToken,
  apiDeleteUser,
} from '../api';

import { TECHNIQUE_NAMES } from '../constants/techniqueNames';
import { CircularProgress } from '../components/CircularProgress';
import './TimerPage.css';

const MAX_STOPWATCH_SEC = 60 * 60;

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatHMS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(sec)}`;
}

/** durationSpent API: dakika (ondalıklı) */
function formatDurationMinutes(minutes) {
  const sec = Math.round((minutes || 0) * 60);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h} sa ${pad2(m)} dk`;
  if (m > 0) return `${m} dk ${pad2(s)} sn`;
  return `${s} sn`;
}

function buildTaskLabel(title, technique) {
  const t = title.trim() || 'Adsız görev';
  return `${t} · ${technique}`;
}

function formatCompletedAt(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function TimerPage() {
  const navigate = useNavigate();
  
  // -- SEKME STATE'LERİ --
  const [activeTab, setActiveTab] = useState('timer');
  const DAYS = ['PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA', 'CUMARTESİ', 'PAZAR'];

  // -- ZAMANLAYICI STATE'LERİ --
  const [mode, setMode] = useState('stopwatch');
  const [running, setRunning] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerDurationMin, setTimerDurationMin] = useState(25);
  const [timerRemaining, setTimerRemaining] = useState(25 * 60);
  const [taskTitle, setTaskTitle] = useState('');
  const [technique, setTechnique] = useState(TECHNIQUE_NAMES[0]);

  // -- LOG STATE'LERİ --
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const taskTitleRef = useRef('');
  const techniqueRef = useRef(TECHNIQUE_NAMES[0]);
  const timerDurationMinRef = useRef(25);

  async function handleDeleteUser() {
    const confirmDelete = window.confirm("Hesabınızı silmek istediğinize emin misiniz?");
    
    if (confirmDelete) {
      try {
        const userId = localStorage.getItem('userId'); 
  
        if (!userId) {
          alert("Kullanıcı kimliği bulunamadı.");
          return;
        }
  
        await apiDeleteUser(userId);
        clearToken(); 
        localStorage.removeItem('userId'); 
        navigate('/', { replace: true }); 
      } catch (e) {
        alert(e.message || "Silme işlemi başarısız.");
      }
    }
  }

  useEffect(() => {
    taskTitleRef.current = taskTitle;
    techniqueRef.current = technique;
    timerDurationMinRef.current = timerDurationMin;
  });
  
  const loadLogs = useCallback(async () => {
    setLogsError('');
    try {
      const data = await apiListTimeLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      setLogsError(e.message || 'Kayıtlar yüklenemedi');
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => {
      if (mode === 'stopwatch') {
        setElapsed((e) => e + 1);
      } else {
        setTimerRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            const name = buildTaskLabel(taskTitleRef.current, techniqueRef.current);
            const mins = timerDurationMinRef.current;
            queueMicrotask(async () => {
              try {
                await apiCreateTimeLog(name, mins);
                await loadLogs();
                setSaveError('');
                setTimerRemaining(mins * 60);
              } catch (e) {
                setSaveError(e.message || 'Kayıt başarısız');
              }
            });
            return 0;
          }
          return r - 1;
        });
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, mode, loadLogs]);

  const ringProgress = useMemo(() => {
    if (mode === 'stopwatch') {
      return Math.min(elapsed, MAX_STOPWATCH_SEC) / MAX_STOPWATCH_SEC;
    }
    const total = timerDurationMin * 60;
    if (total <= 0) return 0;
    return (total - timerRemaining) / total;
  }, [mode, elapsed, timerDurationMin, timerRemaining]);
 
  const displayTime = useMemo(() => {
    if (mode === 'stopwatch') return formatHMS(elapsed);
    return formatHMS(timerRemaining);
  }, [mode, elapsed, timerRemaining]);

  const sessionSeconds = useMemo(() => {
    if (mode === 'stopwatch') return elapsed;
    return timerDurationMin * 60 - timerRemaining;
  }, [mode, elapsed, timerDurationMin, timerRemaining]);

  const canSave = !running && sessionSeconds >= 1;

  const saveSession = useCallback(async () => {
    if (!canSave || saving) return;
    const minutes = sessionSeconds / 60;
    const name = buildTaskLabel(taskTitle, technique);
    setSaveError('');
    setSaving(true);
    try {
      await apiCreateTimeLog(name, minutes);
      await loadLogs();
      if (mode === 'stopwatch') setElapsed(0);
      else setTimerRemaining(timerDurationMin * 60);
    } catch (e) {
      setSaveError(e.message || 'Kayıt başarısız');
    } finally {
      setSaving(false);
    }
  }, [
    canSave,
    saving,
    sessionSeconds,
    taskTitle,
    technique,
    mode,
    timerDurationMin,
    loadLogs,
  ]);

  const toggleRun = useCallback(() => {
    setSaveError('');
    if (mode === 'timer' && timerRemaining <= 0) {
      setTimerRemaining(timerDurationMin * 60);
    }
    setRunning((r) => !r);
  }, [mode, timerRemaining, timerDurationMin]);

  const resetSession = useCallback(() => {
    setSaveError('');
    setRunning(false);
    if (mode === 'stopwatch') {
      setElapsed(0);
    } else {
      setTimerRemaining(timerDurationMin * 60);
    }
  }, [mode, timerDurationMin]);

  function onModeChange(next) {
    if (next === mode) return;
    setSaveError('');
    setRunning(false);
    setMode(next);
    if (next === 'stopwatch') {
      setElapsed(0);
    } else {
      setTimerRemaining(timerDurationMin * 60);
    }
  }

  function onDurationChange(min) {
    const m = Math.min(60, Math.max(1, Number(min) || 1));
    setTimerDurationMin(m);
    if (!running) setTimerRemaining(m * 60);
  }

  async function onDeleteLog(id) {
    try {
      await apiDeleteTimeLog(id);
      await loadLogs();
    } catch (e) {
      setLogsError(e.message || 'Silinemedi');
    }
  }

  function logout() {
    clearToken();
    navigate('/', { replace: true });
  }

  return (
    <div className="timer-page">
      <header className="timer-header">
        <div className="timer-header__brand">Timorize</div>
        
        <nav className="timer-header__nav">
          <button 
            className={`timer-header__link ${activeTab === 'timer' ? 'timer-header__link--active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            Zamanlayıcı
          </button>
          <button 
            className={`timer-header__link ${activeTab === 'calendar' ? 'timer-header__link--active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            Takvim
          </button>
        </nav>

        <div className="timer-header__right">
          <div className="profile">
            <button
              type="button"
              className="profile__trigger"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              aria-label="Profil menüsü"
            >
              <IconUser />
            </button>

            {profileMenuOpen && (
              <div className="profile__menu" role="menu">
                <button
                  type="button"
                  className="profile__item"
                  onClick={logout}
                >
                  Çıkış yap
                </button>

                <button
                  type="button"
                  className="profile__item profile__item--danger"
                  onClick={handleDeleteUser}
                >
                  Hesabı sil
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="timer-main">
        {/* AKTİF SEKMEYE GÖRE GÖRÜNÜMÜ DEĞİŞTİRİYORUZ */}
        {activeTab === 'timer' ? (
          <>
            <section className="timer-panel" aria-labelledby="timer-heading">
              <h1 id="timer-heading" className="visually-hidden">
                Zamanlayıcı
              </h1>

              <div className="timer-panel__modes" role="group" aria-label="Mod">
                <button
                  type="button"
                  className={`timer-panel__mode ${mode === 'stopwatch' ? 'is-active' : ''}`}
                  onClick={() => onModeChange('stopwatch')}
                >
                  Kronometre
                </button>
                <button
                  type="button"
                  className={`timer-panel__mode ${mode === 'timer' ? 'is-active' : ''}`}
                  onClick={() => onModeChange('timer')}
                >
                  Zamanlayıcı
                </button>
              </div>

              <div className="circ-timer">
                <CircularProgress progress={ringProgress} />
              </div>

              <div className="timer-panel__clock" aria-live="polite">
                {displayTime}
              </div>

              <div className="timer-panel__controls">
                <button
                  type="button"
                  className="timer-panel__fab"
                  onClick={toggleRun}
                  aria-label={running ? 'Duraklat' : 'Başlat'}
                >
                  {running ? <IconPause /> : <IconPlay />}
                </button>
                <button
                  type="button"
                  className="timer-panel__iconbtn"
                  onClick={resetSession}
                  aria-label="Oturumu sıfırla"
                >
                  <IconReset />
                </button>
              </div>

              {mode === 'timer' && (
                <label className="timer-panel__field">
                  <span className="timer-panel__label">Süre (dakika)</span>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={timerDurationMin}
                    disabled={running}
                    onChange={(e) => onDurationChange(e.target.value)}
                  />
                </label>
              )}

              <div className="timer-panel__fields">
                <label className="timer-panel__field timer-panel__field--full">
                  <span className="timer-panel__label">Görev</span>
                  <input
                    type="text"
                    placeholder="Ne üzerinde çalışıyorsunuz?"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    autoComplete="off"
                  />
                </label>
                <label className="timer-panel__field timer-panel__field--full">
                  <span className="timer-panel__label">Teknik</span>
                  <select value={technique} onChange={(e) => setTechnique(e.target.value)}>
                    {TECHNIQUE_NAMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="timer-panel__save-row">
                <button
                  type="button"
                  className="timer-panel__save"
                  disabled={!canSave || saving}
                  onClick={saveSession}
                >
                  {saving ? 'Kaydediliyor…' : 'Oturumu kaydet'}
                </button>
              </div>
              {saveError ? <p className="timer-panel__msg timer-panel__msg--err">{saveError}</p> : null}
              <p className="timer-panel__hint">
                Kronometrede halka 60 dakikaya göre dolar. Zamanlayıcı süresi bitince kayıt otomatik eklenir.
              </p>
            </section>

            <section className="timer-log" aria-labelledby="log-heading">
              <div className="timer-log__head">
                <h2 id="log-heading" className="timer-log__title">
                  Kayıtlar
                </h2>
                <span className="timer-log__count">{logs.length}</span>
              </div>

              {logsLoading ? (
                <p className="timer-log__empty">Yükleniyor…</p>
              ) : logsError ? (
                <p className="timer-log__empty timer-log__empty--err">{logsError}</p>
              ) : logs.length === 0 ? (
                <p className="timer-log__empty">
                  Henüz kayıt yok. Süreyi tamamladıktan sonra &quot;Oturumu kaydet&quot; ile ekleyebilirsiniz.
                </p>
              ) : (
                <ul className="timer-log__list">
                  {logs.map((log) => (
                    <li key={log._id} className="timer-log__item">
                      <div className="timer-log__body">
                        <p className="timer-log__name">{log.taskName}</p>
                        <p className="timer-log__meta">
                          <span className="timer-log__dur">
                            {formatDurationMinutes(log.durationSpent)}
                          </span>
                          <span className="timer-log__dot">·</span>
                          <span>{formatCompletedAt(log.completedAt)}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        className="timer-log__del"
                        aria-label="Kaydı sil"
                        onClick={() => onDeleteLog(log._id)}
                      >
                        <IconTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : (
          <div className="planner-board">
            {DAYS.map((day) => (
              <div key={day} className="planner-col">
                <span className="planner-day">{day}</span>
                <textarea className="planner-input" placeholder="..."></textarea>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// --- İKON BİLEŞENLERİ ---

function IconPlay() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function IconReset() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-7.1" strokeLinecap="round" />
      <path d="M3 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" 
            strokeLinecap="round" 
            strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}