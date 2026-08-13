import React, { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import EmptyState from '@/components/EmptyState';
import { apiFetch, ApiError } from '@/lib/api';
import { Flame, X, Loader2, CheckCircle2 } from 'lucide-react';

interface MissionOption {
  daily_mission_options_id: number;
  option_label: string;
  option_text: string;
}
interface MissionQuestion {
  daily_mission_questions_id: number;
  question: string;
  options: MissionOption[];
}
interface MissionDetail {
  daily_missions_id: number;
  title: string;
  questions: MissionQuestion[];
}
interface Mission {
  daily_missions_id: number;
  title: string;
  description?: string;
  mission_number: number;
  xp_reward_min: number;
  xp_reward_max: number;
  end_date: string;
  questions_count: number;
  my_progress?: { is_completed: boolean } | null;
}

function MissionModal({ mission, onClose, onCompleted }: {
  mission: Mission;
  onClose: () => void;
  onCompleted: (xp: number) => void;
}) {
  const [detail, setDetail] = useState<MissionDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const m = await apiFetch<MissionDetail>(`/api/daily-missions/${mission.daily_missions_id}`);
        setDetail(m);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Gagal memuat misi.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (!detail) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch<{ xp_awarded: number; passed: boolean; message?: string }>(
        `/api/daily-missions/${mission.daily_missions_id}/complete`,
        {
          method: 'POST',
          body: JSON.stringify({
            answers: detail.questions.map((q) => ({
              question_id: q.daily_mission_questions_id,
              option_id: answers[q.daily_mission_questions_id] ?? null,
            })),
          }),
        },
      );
      if (!result.passed) {
        setError(result.message ?? 'Belum lulus, coba lagi.');
        return;
      }
      onCompleted(result.xp_awarded);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal menyelesaikan misi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-fraunces text-xl text-[#F3EEE2]">{mission.title}</h3>
          <button onClick={onClose} className="text-[#75708A] hover:text-[#F3EEE2]">
            <X size={18} />
          </button>
        </div>

        {loading && !detail && (
          <div className="mt-6 flex items-center gap-2 font-manrope text-sm text-[#75708A]">
            <Loader2 size={16} className="animate-spin" /> Memuat misi...
          </div>
        )}

        {detail && (
          <div className="mt-4 space-y-4">
            {detail.questions.map((q, i) => (
              <div key={q.daily_mission_questions_id}>
                <p className="font-manrope text-sm text-[#F3EEE2]">
                  {i + 1}. {q.question}
                </p>
                <div className="mt-2 space-y-1.5">
                  {q.options.map((opt) => (
                    <label
                      key={opt.daily_mission_options_id}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 font-manrope text-xs ${
                        answers[q.daily_mission_questions_id] === opt.daily_mission_options_id
                          ? 'border-[#D9A441] bg-[#D9A441]/8 text-[#F3EEE2]'
                          : 'border-[#2A2333] text-[#B7AFC2] hover:border-[#D9A441]/30'
                      }`}
                    >
                      <input
                        type="radio"
                        className="hidden"
                        checked={answers[q.daily_mission_questions_id] === opt.daily_mission_options_id}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.daily_mission_questions_id]: opt.daily_mission_options_id }))
                        }
                      />
                      <span className="font-mono text-[#D9A441]">{opt.option_label}.</span>{' '}
                      {opt.option_text}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={submit}
              disabled={loading || Object.keys(answers).length < detail.questions.length}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Kirim Jawaban
            </button>
          </div>
        )}

        {error && <p className="mt-3 font-manrope text-xs text-[#C1443C]">{error}</p>}
      </div>
    </div>
  );
}

export default function Index({
  community,
  dailyMissions,
}: {
  community: { community_name: string };
  dailyMissions: Mission[];
}) {
  const [missions, setMissions] = useState(dailyMissions);
  const [active, setActive] = useState<Mission | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const completedCount = missions.filter((m) => m.my_progress?.is_completed).length;

  const handleCompleted = (xp: number) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.daily_missions_id === active?.daily_missions_id
          ? { ...m, my_progress: { is_completed: true } }
          : m,
      ),
    );
    setToast(`Misi selesai! +${xp} XP diterima.`);
    setActive(null);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <AppLayout title="Daily Mission" role="Member" communityName={community.community_name}>
      <header className="flex items-center justify-between">
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            {community.community_name}
          </p>
          <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
            <Flame size={24} className="text-[#C1443C]" /> Daily Mission
          </h1>
        </div>
        <span className="font-mono text-sm text-[#C1443C]">{completedCount} / 6 misi</span>
      </header>

      {toast && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#4C8C86]/12 px-4 py-2.5 font-manrope text-sm text-[#4C8C86]">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {missions.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Flame}
            title="Belum ada Daily Mission hari ini"
            description="Cek lagi nanti — pengelola komunitas mengatur ulang misi setiap periode."
          />
        </div>
      ) : (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => {
            const done = !!mission.my_progress?.is_completed;

            return (
              <div
                key={mission.daily_missions_id}
                className={`rounded-xl border p-5 ${
                  done ? 'border-[#4C8C86]/30 bg-[#4C8C86]/8' : 'border-[#2A2333] bg-[#1E1826]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-[11px] uppercase tracking-[0.14em] text-[#75708A]">
                    Misi {mission.mission_number}
                  </span>
                  {done && <CheckCircle2 size={16} className="text-[#4C8C86]" />}
                </div>
                <p className="mt-2 font-fraunces text-lg text-[#F3EEE2]">{mission.title}</p>
                <p className="mt-1 font-mono text-xs text-[#D9A441]">
                  +{mission.xp_reward_min}-{mission.xp_reward_max} XP
                </p>
                <button
                  onClick={() => setActive(mission)}
                  disabled={done}
                  className="mt-4 w-full rounded-full bg-[#D9A441] px-4 py-2 font-manrope text-xs text-[#14101B] disabled:bg-white/5 disabled:text-[#75708A]"
                >
                  {done ? 'Selesai' : 'Mulai Kuis'}
                </button>
              </div>
            );
          })}
        </section>
      )}

      {active && (
        <MissionModal mission={active} onClose={() => setActive(null)} onCompleted={handleCompleted} />
      )}
    </AppLayout>
  );
}
