import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiDeleteUser, apiLogout } from '../api/auth';
import { apiCreateTimeLog, apiDeleteTimeLog, apiListTimeLogs } from '../api/timers';
import { CircularProgress } from '../components/CircularProgress';
import { IconPause, IconPlay, IconReset, IconTrash, IconUser } from '../components/Icons';
import { TECHNIQUE_NAMES } from '../constants/techniqueNames';
import { clearUserId, getUserId } from '../storage/user';
import { dashboardStyles as s } from '../theme/dashboardStyles';

const MAX_STOPWATCH_SEC = 60 * 60;
const DAYS = ['PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA', 'CUMARTESİ', 'PAZAR'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatHMS(totalSeconds) {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(ss)}`;
}

function formatDurationMinutes(minutes) {
  const sec = Math.round((minutes || 0) * 60);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;
  if (h > 0) return `${h} sa ${pad2(m)} dk`;
  if (m > 0) return `${m} dk ${pad2(ss)} sn`;
  return `${ss} sn`;
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

export function DashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('timer');
  const [mode, setMode] = useState('stopwatch');
  const [running, setRunning] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerDurationMin, setTimerDurationMin] = useState(25);
  const [timerRemaining, setTimerRemaining] = useState(25 * 60);
  const [taskTitle, setTaskTitle] = useState('');
  const [technique, setTechnique] = useState(TECHNIQUE_NAMES[0]);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const taskTitleRef = useRef('');
  const techniqueRef = useRef(TECHNIQUE_NAMES[0]);
  const timerDurationMinRef = useRef(25);

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
      setLogsError(e.response?.data?.message || e.message || 'Kayıtlar yüklenemedi');
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
    const id = setInterval(() => {
      if (mode === 'stopwatch') {
        setElapsed((e) => e + 1);
      } else {
        setTimerRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            const name = buildTaskLabel(taskTitleRef.current, techniqueRef.current);
            const mins = timerDurationMinRef.current;
            (async () => {
              try {
                await apiCreateTimeLog(name, mins);
                await loadLogs();
                setSaveError('');
                setTimerRemaining(mins * 60);
              } catch (e) {
                setSaveError(e.response?.data?.message || e.message || 'Kayıt başarısız');
              }
            })();
            return 0;
          }
          return r - 1;
        });
      }
    }, 1000);
    return () => clearInterval(id);
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
      setSaveError(e.response?.data?.message || e.message || 'Kayıt başarısız');
    } finally {
      setSaving(false);
    }
  }, [canSave, saving, sessionSeconds, taskTitle, technique, mode, timerDurationMin, loadLogs]);

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
    if (mode === 'stopwatch') setElapsed(0);
    else setTimerRemaining(timerDurationMin * 60);
  }, [mode, timerDurationMin]);

  function onModeChange(next) {
    if (next === mode) return;
    setSaveError('');
    setRunning(false);
    setMode(next);
    if (next === 'stopwatch') setElapsed(0);
    else setTimerRemaining(timerDurationMin * 60);
  }

  function onDurationChange(val) {
    const m = Math.min(60, Math.max(1, Number(val) || 1));
    setTimerDurationMin(m);
    if (!running) setTimerRemaining(m * 60);
  }

  async function onDeleteLog(id) {
    try {
      await apiDeleteTimeLog(id);
      await loadLogs();
    } catch (e) {
      setLogsError(e.response?.data?.message || e.message || 'Silinemedi');
    }
  }

  async function logout() {
    setProfileMenuOpen(false);
    await apiLogout();
    await clearUserId();
    navigation.replace('Login');
  }

  function handleDeleteUser() {
    Alert.alert(
      'Hesabı sil',
      'Hesabınızı silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = await getUserId();
              if (!userId) {
                Alert.alert('Hata', 'Kullanıcı kimliği bulunamadı.');
                return;
              }
              await apiDeleteUser(userId);
              await clearUserId();
              navigation.replace('Login');
            } catch (e) {
              Alert.alert('Hata', e.response?.data?.message || e.message || 'Silme işlemi başarısız.');
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={s.page} edges={['top']}>
      <StatusBar style="light" />

      <View style={s.header}>
        <Text style={s.brand}>Timorize</Text>

        <View style={s.nav}>
          <Pressable
            style={[s.navLink, activeTab === 'timer' && s.navLinkActive]}
            onPress={() => setActiveTab('timer')}
          >
            <Text style={[s.navLinkText, activeTab === 'timer' && s.navLinkTextActive]}>
              Zamanlayıcı
            </Text>
          </Pressable>
          <Pressable
            style={[s.navLink, activeTab === 'calendar' && s.navLinkActive]}
            onPress={() => setActiveTab('calendar')}
          >
            <Text style={[s.navLinkText, activeTab === 'calendar' && s.navLinkTextActive]}>
              Takvim
            </Text>
          </Pressable>
        </View>

        <View style={{ position: 'relative' }}>
          <Pressable style={s.profileTrigger} onPress={() => setProfileMenuOpen((p) => !p)}>
            <IconUser />
          </Pressable>
          {profileMenuOpen && (
            <View style={s.profileMenu}>
              <Pressable style={s.profileItem} onPress={logout}>
                <Text style={s.profileItemText}>Çıkış yap</Text>
              </Pressable>
              <Pressable style={s.profileItem} onPress={handleDeleteUser}>
                <Text style={[s.profileItemText, s.profileItemDanger]}>Hesabı sil</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {activeTab === 'timer' ? (
          <>
            <View style={s.panel}>
              <View style={s.modes}>
                <Pressable
                  style={[s.modeBtn, mode === 'stopwatch' && s.modeBtnActive]}
                  onPress={() => onModeChange('stopwatch')}
                >
                  <Text style={[s.modeText, mode === 'stopwatch' && s.modeTextActive]}>Kronometre</Text>
                </Pressable>
                <Pressable
                  style={[s.modeBtn, mode === 'timer' && s.modeBtnActive]}
                  onPress={() => onModeChange('timer')}
                >
                  <Text style={[s.modeText, mode === 'timer' && s.modeTextActive]}>Zamanlayıcı</Text>
                </Pressable>
              </View>

              <View style={s.circTimer}>
                <CircularProgress progress={ringProgress} size={180} />
              </View>

              <Text style={s.clock}>{displayTime}</Text>

              <View style={s.controls}>
                <Pressable style={s.fab} onPress={toggleRun}>
                  {running ? <IconPause /> : <IconPlay />}
                </Pressable>
                <Pressable style={s.iconBtn} onPress={resetSession}>
                  <IconReset />
                </Pressable>
              </View>

              {mode === 'timer' && (
                <View style={s.field}>
                  <Text style={s.label}>Süre (dakika)</Text>
                  <TextInput
                    style={s.input}
                    keyboardType="number-pad"
                    value={String(timerDurationMin)}
                    editable={!running}
                    onChangeText={onDurationChange}
                  />
                </View>
              )}

              <View style={s.field}>
                <Text style={s.label}>Görev</Text>
                <TextInput
                  style={s.input}
                  placeholder="Ne üzerinde çalışıyorsunuz?"
                  placeholderTextColor="#52525b"
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />
              </View>

              <View style={s.field}>
                <Text style={s.label}>Teknik</Text>
                <View style={s.picker}>
                  <Picker
                    selectedValue={technique}
                    onValueChange={setTechnique}
                    dropdownIconColor="#71717a"
                    style={{ color: '#fafafa' }}
                  >
                    {TECHNIQUE_NAMES.map((t) => (
                      <Picker.Item key={t} label={t} value={t}  />
                    ))}
                  </Picker>
                </View>
              </View>

              <Pressable
                style={[s.save, (!canSave || saving) && s.saveDisabled]}
                onPress={saveSession}
                disabled={!canSave || saving}
              >
                <Text style={s.saveText}>{saving ? 'Kaydediliyor…' : 'Oturumu kaydet'}</Text>
              </Pressable>

              {saveError ? <Text style={s.msgErr}>{saveError}</Text> : null}
              <Text style={s.hint}>
                Kronometrede halka 60 dakikaya göre dolar. Zamanlayıcı süresi bitince kayıt otomatik eklenir.
              </Text>
            </View>

            <View style={s.log}>
              <View style={s.logHead}>
                <Text style={s.logTitle}>Kayıtlar</Text>
                <Text style={s.logCount}>{logs.length}</Text>
              </View>

              {logsLoading ? (
                <Text style={s.logEmpty}>Yükleniyor…</Text>
              ) : logsError ? (
                <Text style={[s.logEmpty, s.logEmptyErr]}>{logsError}</Text>
              ) : logs.length === 0 ? (
                <Text style={s.logEmpty}>
                  Henüz kayıt yok. Süreyi tamamladıktan sonra &quot;Oturumu kaydet&quot; ile ekleyebilirsiniz.
                </Text>
              ) : (
                logs.map((log) => (
                  <View key={log._id} style={s.logItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.logName}>{log.taskName}</Text>
                      <View style={s.logMeta}>
                        <Text style={[s.logMetaText, s.logDur]}>
                          {formatDurationMinutes(log.durationSpent)}
                        </Text>
                        <Text style={s.logDot}>·</Text>
                        <Text style={s.logMetaText}>{formatCompletedAt(log.completedAt)}</Text>
                      </View>
                    </View>
                    <Pressable style={s.logDel} onPress={() => onDeleteLog(log._id)}>
                      <IconTrash />
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          </>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.plannerBoard}>
              {DAYS.map((day) => (
                <View key={day} style={s.plannerCol}>
                  <Text style={s.plannerDay}>{day}</Text>
                  <TextInput
                    style={s.plannerInput}
                    placeholder="..."
                    placeholderTextColor="rgba(26,26,26,0.4)"
                    multiline
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
