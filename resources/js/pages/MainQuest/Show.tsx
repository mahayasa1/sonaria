import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import StaffProgress from '@/components/StaffProgress';
import { apiFetch, ApiError } from '@/lib/api';
import {
  ArrowLeft,
  BookOpen,
  ListChecks,
  Video,
  CheckCircle2,
  Loader2,
  Clock,
  FileText,
  Music,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

interface QuizOption {
  quiz_options_id: number;
  option_label: string;
  option_text: string;
}
interface QuizQuestion {
  quiz_questions_id: number;
  question: string;
  options: QuizOption[];
}
interface Quiz {
  quizzes_id: number;
  title: string;
  passing_score: number;
  xp_reward: number;
  questions: QuizQuestion[];
}
interface Practice {
  practices_id: number;
  title: string;
  xp_reward: number;
  deadline?: string;
}
interface MaterialProgress {
  progress_percentage: number;
  status: string;
}
interface MaterialFile {
  material_files_id: number;
  file_type: 'Video' | 'PDF' | 'Audio' | 'Image';
  title: string;
  file_path: string;
  duration?: string;
}
interface Material {
  materials_id: number;
  title: string;
  description?: string;
  difficulty?: string;
  estimated_time?: number;
  files: MaterialFile[];
  quizzes: Quiz[];
  practices: Practice[];
  progress: MaterialProgress[];
}
interface MainQuest {
  main_quests_id: number;
  level: number;
  title: string;
  description?: string;
  xp_reward: number;
  community: { communities_id: number; community_name: string };
  materials: Material[];
}

function QuizPanel({ quiz }: { quiz: Quiz }) {
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; is_passed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setLoading(true);
    setError(null);
    try {
      const attempt = await apiFetch<{ quiz_attempts_id: number }>(`/api/quizzes/${quiz.quizzes_id}/attempts`, {
        method: 'POST',
      });
      setAttemptId(attempt.quiz_attempts_id);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal memulai quiz.');
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!attemptId) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        answers: quiz.questions.map((q) => ({
          question_id: q.quiz_questions_id,
          option_id: answers[q.quiz_questions_id] ?? null,
        })),
      };
      const res = await apiFetch<{ score: number; is_passed: boolean }>(
        `/api/quiz-attempts/${attemptId}/submit`,
        { method: 'POST', body: JSON.stringify(payload) },
      );
      setResult(res);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal mengirim jawaban.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div
        className={`rounded-lg p-4 font-manrope text-sm ${
          result.is_passed ? 'bg-[#4C8C86]/12 text-[#4C8C86]' : 'bg-[#C1443C]/12 text-[#C1443C]'
        }`}
      >
        {result.is_passed
          ? `Lulus dengan skor ${result.score}! XP telah ditambahkan.`
          : `Belum lulus (skor ${result.score}, minimal ${quiz.passing_score}). Coba lagi nanti.`}
      </div>
    );
  }

  if (!attemptId) {
    return (
      <div>
        <button
          onClick={start}
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-50"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Mulai Kuis ({quiz.questions.length} soal)
        </button>
        {error && <p className="mt-2 font-manrope text-xs text-[#C1443C]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quiz.questions.map((q, i) => (
        <div key={q.quiz_questions_id}>
          <p className="font-manrope text-sm text-[#F3EEE2]">
            {i + 1}. {q.question}
          </p>
          <div className="mt-2 space-y-1.5">
            {q.options.map((opt) => (
              <label
                key={opt.quiz_options_id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 font-manrope text-xs ${
                  answers[q.quiz_questions_id] === opt.quiz_options_id
                    ? 'border-[#D9A441] bg-[#D9A441]/8 text-[#F3EEE2]'
                    : 'border-[#2A2333] text-[#B7AFC2] hover:border-[#D9A441]/30'
                }`}
              >
                <input
                  type="radio"
                  className="hidden"
                  checked={answers[q.quiz_questions_id] === opt.quiz_options_id}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [q.quiz_questions_id]: opt.quiz_options_id }))
                  }
                />
                <span className="font-mono text-[#D9A441]">{opt.option_label}.</span> {opt.option_text}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={submit}
        disabled={loading || Object.keys(answers).length < quiz.questions.length}
        className="flex items-center gap-2 rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Kirim Jawaban
      </button>
      {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
    </div>
  );
}

function PracticePanel({ practice }: { practice: Practice }) {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoPath, setVideoPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!videoPath) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/practices/${practice.practices_id}/submissions`, {
        method: 'POST',
        body: JSON.stringify({ video_title: videoTitle, video_path: videoPath }),
      });
      setDone(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal mengirim video latihan.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-lg bg-[#4C8C86]/12 p-4 font-manrope text-sm text-[#4C8C86]">
        Video latihan terkirim, menunggu review dari pengelola komunitas.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        value={videoTitle}
        onChange={(e) => setVideoTitle(e.target.value)}
        placeholder="Judul video (opsional)"
        className="w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
      />
      <input
        value={videoPath}
        onChange={(e) => setVideoPath(e.target.value)}
        placeholder="Link video latihan (YouTube/Drive, dsb.)"
        className="w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
      />
      <button
        onClick={submit}
        disabled={loading || !videoPath}
        className="flex items-center gap-2 rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Kirim Video Latihan
      </button>
      {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
    </div>
  );
}

function fileTypeIcon(type: MaterialFile['file_type']) {
  switch (type) {
    case 'Video':
      return <Video size={14} />;
    case 'PDF':
      return <FileText size={14} />;
    case 'Audio':
      return <Music size={14} />;
    default:
      return <ImageIcon size={14} />;
  }
}

function MaterialFileRow({ file }: { file: MaterialFile }) {
  return (
    <a
      href={file.file_path}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2.5 rounded-lg border border-[#2A2333] px-3 py-2.5 font-manrope text-sm text-[#B7AFC2] hover:border-[#4C8C86]/40 hover:text-[#F3EEE2]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#4C8C86]/12 text-[#4C8C86]">
        {fileTypeIcon(file.file_type)}
      </span>
      <span className="min-w-0 flex-1 truncate">{file.title}</span>
      {file.duration && <span className="shrink-0 font-mono text-xs text-[#75708A]">{file.duration}</span>}
      <ExternalLink size={12} className="shrink-0 text-[#75708A]" />
    </a>
  );
}

function MaterialCard({ material, canManage }: { material: Material; canManage: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [marking, setMarking] = useState(false);
  const [progress, setProgress] = useState(material.progress[0]?.progress_percentage ?? 0);

  const markComplete = async () => {
    setMarking(true);
    try {
      await apiFetch(`/api/materials/${material.materials_id}/progress`, {
        method: 'POST',
        body: JSON.stringify({ progress_percentage: 100 }),
      });
      setProgress(100);
    } catch {
      // biarkan silent, badge tetap menampilkan progress lama
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#2A2333] bg-[#1E1826]">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#D9A441]">
          <BookOpen size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-fraunces text-lg text-[#F3EEE2]">{material.title}</p>
          <div className="mt-1 flex flex-wrap gap-3 font-manrope text-xs text-[#75708A]">
            {material.difficulty && <span>Kesulitan: {material.difficulty}</span>}
            {material.estimated_time && (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {material.estimated_time} menit
              </span>
            )}
          </div>
        </div>
        {progress >= 100 && <CheckCircle2 size={20} className="shrink-0 text-[#4C8C86]" />}
      </button>

      <div className="px-5 pb-2">
        <StaffProgress percentage={progress} accent="reed" />
      </div>

      {expanded && (
        <div className="space-y-6 border-t border-[#2A2333] p-5">
          {material.description && (
            <p className="font-manrope text-sm text-[#B7AFC2]">{material.description}</p>
          )}

          {progress < 100 && (
            <button
              onClick={markComplete}
              disabled={marking}
              className="flex items-center gap-2 rounded-full border border-[#4C8C86]/40 bg-[#4C8C86]/12 px-5 py-2.5 font-manrope text-sm text-[#4C8C86] disabled:opacity-50"
            >
              {marking && <Loader2 size={14} className="animate-spin" />}
              Tandai Materi Selesai Dibaca
            </button>
          )}

          {material.files.length > 0 && (
            <div className="space-y-2">
              {material.files.map((file) => (
                <MaterialFileRow key={file.material_files_id} file={file} />
              ))}
            </div>
          )}

          {material.quizzes.map((quiz) => (
            <div key={quiz.quizzes_id}>
              <div className="mb-2 flex items-center gap-2 text-[#D9A441]">
                <ListChecks size={16} />
                <span className="font-manrope text-sm">{quiz.title}</span>
                <span className="font-mono text-xs">+{quiz.xp_reward} XP</span>
              </div>
              <QuizPanel quiz={quiz} />
            </div>
          ))}

          {material.practices.map((practice) => (
            <div key={practice.practices_id}>
              <div className="mb-2 flex items-center gap-2 text-[#C1443C]">
                <Video size={16} />
                <span className="font-manrope text-sm">{practice.title}</span>
                <span className="font-mono text-xs">+{practice.xp_reward} XP</span>
              </div>
              <PracticePanel practice={practice} />
            </div>
          ))}

          {canManage && (
            <div className="flex flex-wrap gap-2 border-t border-[#2A2333] pt-4">
              <Link
                href={`/manage/materials/${material.materials_id}/files/create`}
                className="rounded-full border border-[#4C8C86]/40 px-4 py-1.5 font-manrope text-xs text-[#4C8C86]"
              >
                + Tambah File Materi
              </Link>
              <Link
                href={`/manage/materials/${material.materials_id}/quizzes/create`}
                className="rounded-full border border-[#D9A441]/40 px-4 py-1.5 font-manrope text-xs text-[#D9A441]"
              >
                + Tambah Quiz
              </Link>
              <Link
                href={`/manage/materials/${material.materials_id}/practices/create`}
                className="rounded-full border border-[#C1443C]/40 px-4 py-1.5 font-manrope text-xs text-[#C1443C]"
              >
                + Tambah Practice
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Show({ mainQuest, canManage }: { mainQuest: MainQuest; canManage: boolean }) {
  return (
    <AppLayout
      title={mainQuest.title}
      role="Member"
      communityName={mainQuest.community.community_name}
    >
      <Link
        href="/main-quests"
        className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]"
      >
        <ArrowLeft size={14} /> Kembali ke Main Quest
      </Link>

      <header className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            Birama {mainQuest.level}
          </p>
          <h1 className="font-fraunces text-3xl text-[#F3EEE2]">{mainQuest.title}</h1>
          {mainQuest.description && (
            <p className="mt-2 max-w-xl font-manrope text-sm text-[#B7AFC2]">{mainQuest.description}</p>
          )}
          <span className="mt-2 inline-block font-mono text-sm text-[#D9A441]">
            +{mainQuest.xp_reward} XP total
          </span>
        </div>
        {canManage && (
          <Link
            href={`/manage/main-quests/${mainQuest.main_quests_id}/materials/create`}
            className="rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B]"
          >
            + Tambah Materi
          </Link>
        )}
      </header>

      <section className="mt-6 space-y-4">
        {mainQuest.materials.map((material) => (
          <MaterialCard key={material.materials_id} material={material} canManage={canManage} />
        ))}
      </section>
    </AppLayout>
  );
}
