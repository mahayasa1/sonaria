import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, Flame, Loader2, Plus, Trash2 } from 'lucide-react';

interface OptionForm {
  option_label: string;
  option_text: string;
  is_correct: boolean;
}
interface QuestionForm {
  question: string;
  options: OptionForm[];
}

const LABELS = ['A', 'B', 'C', 'D', 'E'];

function emptyQuestion(): QuestionForm {
  return {
    question: '',
    options: [
      { option_label: 'A', option_text: '', is_correct: true },
      { option_label: 'B', option_text: '', is_correct: false },
    ],
  };
}

export default function DailyMissionCreate({
  community,
  activeCount,
}: {
  community: { communities_id: number; community_name: string };
  activeCount: number;
}) {
  const [missionNumber, setMissionNumber] = useState(activeCount + 1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [passingScore, setPassingScore] = useState(100);
  const [xpMin, setXpMin] = useState(15);
  const [xpMax, setXpMax] = useState(30);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuestion = (qi: number, patch: Partial<QuestionForm>) => {
    setQuestions((prev) => prev.map((q, i) => (i === qi ? { ...q, ...patch } : q)));
  };

  const updateOption = (qi: number, oi: number, patch: Partial<OptionForm>) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.map((o, j) => (j === oi ? { ...o, ...patch } : o)) }
          : q,
      ),
    );
  };

  const setCorrect = (qi: number, oi: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.map((o, j) => ({ ...o, is_correct: j === oi })) }
          : q,
      ),
    );
  };

  const addOption = (qi: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi && q.options.length < 5
          ? {
              ...q,
              options: [
                ...q.options,
                { option_label: LABELS[q.options.length], option_text: '', is_correct: false },
              ],
            }
          : q,
      ),
    );
  };

  const removeOption = (qi: number, oi: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi && q.options.length > 2 ? { ...q, options: q.options.filter((_, j) => j !== oi) } : q)),
    );
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);
  const removeQuestion = (qi: number) =>
    setQuestions((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== qi) : prev));

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/communities/${community.communities_id}/daily-missions`, {
        method: 'POST',
        body: JSON.stringify({
          mission_number: missionNumber,
          title,
          description,
          passing_score: passingScore,
          xp_reward_min: xpMin,
          xp_reward_max: xpMax,
          start_date: startDate,
          end_date: endDate,
          questions,
        }),
      });
      router.visit('/daily-missions');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal membuat Daily Mission.');
    } finally {
      setLoading(false);
    }
  };

  const valid =
    title.trim() &&
    questions.every((q) => q.question.trim() && q.options.every((o) => o.option_text.trim()));

  return (
    <AppLayout title="Buat Daily Mission" role="Member" communityRole="Ketua" communityName={community.community_name}>
      <Link href="/dashboard" className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]">
        <ArrowLeft size={14} /> Kembali
      </Link>

      <header className="mt-3">
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Flame size={24} className="text-[#C1443C]" /> Daily Mission Baru
        </h1>
        <p className="mt-1 font-manrope text-sm text-[#75708A]">
          Misi harian punya soal sendiri — tidak perlu bikin Quiz lewat Main Quest lagi.
        </p>
      </header>

      {activeCount >= 6 ? (
        <p className="mt-6 font-manrope text-sm text-[#B7AFC2]">
          Komunitas ini sudah punya 6 daily mission aktif. Nonaktifkan salah satu dulu sebelum
          membuat yang baru.
        </p>
      ) : (
        <div className="mt-6 max-w-2xl space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Judul</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Nomor Misi (1-6)</label>
              <input
                type="number"
                min={1}
                max={6}
                value={missionNumber}
                onChange={(e) => setMissionNumber(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-manrope text-xs text-[#75708A]">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Passing Score (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-manrope text-xs text-[#75708A]">XP Min</label>
              <input
                type="number"
                value={xpMin}
                onChange={(e) => setXpMin(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-manrope text-xs text-[#75708A]">XP Max</label>
              <input
                type="number"
                value={xpMax}
                onChange={(e) => setXpMax(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Selesai</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
              Soal Daily Mission
            </p>
            {questions.map((q, qi) => (
              <div key={qi} className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
                    Pertanyaan {qi + 1}
                  </span>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(qi)} className="text-[#C1443C]">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <textarea
                  value={q.question}
                  onChange={(e) => updateQuestion(qi, { question: e.target.value })}
                  placeholder="Tulis pertanyaan..."
                  rows={2}
                  className="mt-2 w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
                />

                <div className="mt-3 space-y-2">
                  {q.options.map((o, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        onClick={() => setCorrect(qi, oi)}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                          o.is_correct
                            ? 'border-[#4C8C86] bg-[#4C8C86]/20 text-[#4C8C86]'
                            : 'border-[#2A2333] text-[#75708A]'
                        }`}
                        title="Tandai sebagai jawaban benar"
                      >
                        {o.option_label}
                      </button>
                      <input
                        value={o.option_text}
                        onChange={(e) => updateOption(qi, oi, { option_text: e.target.value })}
                        placeholder={`Opsi ${o.option_label}`}
                        className="flex-1 rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-1.5 font-manrope text-xs text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
                      />
                      {q.options.length > 2 && (
                        <button onClick={() => removeOption(qi, oi)} className="text-[#75708A] hover:text-[#C1443C]">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  {q.options.length < 5 && (
                    <button
                      onClick={() => addOption(qi)}
                      className="flex items-center gap-1 font-manrope text-xs text-[#D9A441]"
                    >
                      <Plus size={13} /> Tambah opsi
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addQuestion}
              className="flex items-center gap-1.5 rounded-full border border-[#2A2333] px-4 py-2 font-manrope text-xs text-[#B7AFC2] hover:border-[#D9A441]/40"
            >
              <Plus size={14} /> Tambah Pertanyaan
            </button>
          </div>

          <button
            onClick={submit}
            disabled={loading || !valid}
            className="flex items-center gap-2 rounded-full bg-[#D9A441] px-6 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Simpan
          </button>
          {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
        </div>
      )}
    </AppLayout>
  );
}
