import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  TrendingUp,
  Music,
  BadgeCheck,
  Trophy,
  Plus,
  Trash2,
  Loader2,
  Pencil,
  X,
} from 'lucide-react';

type TabKey = 'roles' | 'levels' | 'categories' | 'badges' | 'achievements';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'roles', label: 'Roles', icon: <ShieldCheck size={14} /> },
  { key: 'levels', label: 'Levels', icon: <TrendingUp size={14} /> },
  { key: 'categories', label: 'Kategori Alat Musik', icon: <Music size={14} /> },
  { key: 'badges', label: 'Badge', icon: <BadgeCheck size={14} /> },
  { key: 'achievements', label: 'Achievement', icon: <Trophy size={14} /> },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block font-manrope text-xs text-[#75708A]">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none';

/* ---------------------------------------------------------------------- */
/* Generic CRUD panel: fetch list, add/edit form, delete                  */
/* ---------------------------------------------------------------------- */

interface ColumnDef<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

function CrudPanel<T extends Record<string, any>>({
  endpoint,
  idKey,
  columns,
  formFields,
  emptyLabel = 'Belum ada data.',
}: {
  endpoint: string;
  idKey: string;
  columns: ColumnDef<T>[];
  formFields: {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'checkbox' | 'textarea';
    placeholder?: string;
  }[];
  emptyLabel?: string;
}) {
  const [items, setItems] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [editingId, setEditingId] = useState<number | string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch<T[]>(endpoint)
      .then(setItems)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Gagal memuat data.'))
      .finally(() => setLoading(false));
  }, [endpoint]);

  const resetForm = () => {
    setForm({});
    setEditingId(null);
  };

  const startEdit = (item: T) => {
    setEditingId(item[idKey]);
    setForm({ ...item });
  };

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editingId !== null) {
        const updated = await apiFetch<T>(`${endpoint}/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        setItems((prev) => (prev ?? []).map((it) => (it[idKey] === editingId ? updated : it)));
      } else {
        const created = await apiFetch<T>(endpoint, {
          method: 'POST',
          body: JSON.stringify(form),
        });
        setItems((prev) => [created, ...(prev ?? [])]);
      }
      resetForm();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const destroy = async (item: T) => {
    if (!confirm('Hapus data ini?')) return;
    try {
      await apiFetch(`${endpoint}/${item[idKey]}`, { method: 'DELETE' });
      setItems((prev) => (prev ?? []).filter((it) => it[idKey] !== item[idKey]));
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Gagal menghapus data.');
    }
  };

  return (
    <div className="mt-6">
      <div className="grid gap-3 rounded-xl border border-[#2A2333] bg-[#1E1826] p-5 sm:grid-cols-2">
        {formFields.map((f) => (
          <Field key={f.key} label={f.label}>
            {f.type === 'checkbox' ? (
              <label className="flex items-center gap-2 pt-1.5 font-manrope text-sm text-[#B7AFC2]">
                <input
                  type="checkbox"
                  checked={!!form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                />
                Aktif
              </label>
            ) : f.type === 'textarea' ? (
              <textarea
                value={form[f.key] ?? ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                rows={2}
                className={inputClass}
              />
            ) : (
              <input
                type={f.type ?? 'text'}
                value={form[f.key] ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value,
                  })
                }
                placeholder={f.placeholder}
                className={inputClass}
              />
            )}
          </Field>
        ))}
        <div className="flex items-end gap-2 sm:col-span-2">
          <button
            onClick={submit}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-full bg-[#D9A441] px-5 py-2 font-manrope text-sm text-[#14101B] disabled:opacity-40"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {editingId !== null ? 'Simpan Perubahan' : 'Tambah'}
          </button>
          {editingId !== null && (
            <button
              onClick={resetForm}
              className="flex items-center gap-1.5 rounded-full border border-[#2A2333] px-4 py-2 font-manrope text-sm text-[#75708A]"
            >
              <X size={14} /> Batal
            </button>
          )}
        </div>
        {error && <p className="font-manrope text-xs text-[#C1443C] sm:col-span-2">{error}</p>}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[#2A2333] bg-[#1E1826]">
        {loading ? (
          <div className="flex items-center gap-2 px-5 py-6 font-manrope text-sm text-[#75708A]">
            <Loader2 size={14} className="animate-spin" /> Memuat...
          </div>
        ) : !items || items.length === 0 ? (
          <p className="px-5 py-6 font-manrope text-sm text-[#75708A]">{emptyLabel}</p>
        ) : (
          <div className="divide-y divide-[#2A2333]">
            {items.map((item) => (
              <div key={item[idKey]} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="flex min-w-0 flex-1 flex-wrap gap-x-5 gap-y-1">
                  {columns.map((col) => (
                    <div key={col.key} className="min-w-0">
                      <p className="font-manrope text-sm text-[#F3EEE2]">
                        {col.render ? col.render(item) : String(item[col.key] ?? '-')}
                      </p>
                      <p className="font-manrope text-[10px] uppercase tracking-wide text-[#75708A]">
                        {col.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button onClick={() => startEdit(item)} className="text-[#75708A] hover:text-[#D9A441]">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => destroy(item)} className="text-[#75708A] hover:text-[#C1443C]">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

export default function Settings({ appName }: { appName: string }) {
  const [tab, setTab] = useState<TabKey>('roles');

  return (
    <AppLayout title="Pengaturan" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">Admin</p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <SettingsIcon size={24} className="text-[#D9A441]" /> Pengaturan
        </h1>
        <p className="mt-1 font-manrope text-sm text-[#75708A]">
          Aplikasi: <span className="text-[#F3EEE2]">{appName}</span>
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-[#2A2333] pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-manrope text-sm transition ${
              tab === t.key
                ? 'bg-[#D9A441] text-[#14101B]'
                : 'border border-[#2A2333] text-[#B7AFC2] hover:border-[#D9A441]/40'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'roles' && (
        <CrudPanel
          endpoint="/api/admin/roles"
          idKey="role_id"
          formFields={[
            { key: 'role_name', label: 'Nama Role', placeholder: 'mis. Member' },
            { key: 'description', label: 'Deskripsi', placeholder: 'Opsional' },
          ]}
          columns={[
            { key: 'role_name', label: 'Nama Role' },
            { key: 'description', label: 'Deskripsi' },
            {
              key: 'users_count',
              label: 'Jumlah User',
              render: (i) => <span className="text-[#D9A441]">{i.users_count ?? 0}</span>,
            },
          ]}
        />
      )}

      {tab === 'levels' && (
        <CrudPanel
          endpoint="/api/admin/levels"
          idKey="level_id"
          formFields={[
            { key: 'level', label: 'Level', type: 'number', placeholder: '1' },
            { key: 'title', label: 'Judul', placeholder: 'mis. Pemula' },
            { key: 'min_xp', label: 'Min XP', type: 'number', placeholder: '0' },
            { key: 'max_xp', label: 'Max XP', type: 'number', placeholder: 'Opsional' },
            { key: 'icon', label: 'Icon', placeholder: 'Opsional' },
            { key: 'color', label: 'Warna', placeholder: 'mis. #D9A441' },
            { key: 'can_create_community', label: 'Boleh Buat Komunitas', type: 'checkbox' },
          ]}
          columns={[
            {
              key: 'level',
              label: 'Level',
              render: (i) => (
                <span>
                  Lv.{i.level} — {i.title}
                </span>
              ),
            },
            { key: 'xp', label: 'Rentang XP', render: (i) => `${i.min_xp} - ${i.max_xp ?? '∞'}` },
            {
              key: 'users_count',
              label: 'Jumlah User',
              render: (i) => <span className="text-[#D9A441]">{i.users_count ?? 0}</span>,
            },
          ]}
        />
      )}

      {tab === 'categories' && (
        <CrudPanel
          endpoint="/api/admin/categories"
          idKey="music_categories_id"
          formFields={[
            { key: 'name', label: 'Nama Kategori', placeholder: 'mis. Gitar' },
            { key: 'icon', label: 'Icon', placeholder: 'Opsional' },
            { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Opsional' },
          ]}
          columns={[
            { key: 'name', label: 'Kategori' },
            {
              key: 'instruments_count',
              label: 'Instrument',
              render: (i) => <span className="text-[#4C8C86]">{i.instruments_count ?? 0}</span>,
            },
            {
              key: 'communities_count',
              label: 'Komunitas',
              render: (i) => <span className="text-[#D9A441]">{i.communities_count ?? 0}</span>,
            },
          ]}
        />
      )}

      {tab === 'badges' && (
        <CrudPanel
          endpoint="/api/admin/badges"
          idKey="badges_id"
          formFields={[
            { key: 'badge_name', label: 'Nama Badge', placeholder: 'mis. Rajin Berlatih' },
            { key: 'icon', label: 'Icon', placeholder: 'Opsional' },
            { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Opsional' },
            { key: 'xp_required', label: 'XP Dibutuhkan', type: 'number', placeholder: '0' },
            { key: 'point_required', label: 'Point Dibutuhkan', type: 'number', placeholder: '0' },
          ]}
          columns={[
            { key: 'badge_name', label: 'Badge' },
            { key: 'description', label: 'Deskripsi' },
            {
              key: 'user_badges_count',
              label: 'Dimiliki User',
              render: (i) => <span className="text-[#D9A441]">{i.user_badges_count ?? 0}</span>,
            },
          ]}
        />
      )}

      {tab === 'achievements' && (
        <CrudPanel
          endpoint="/api/admin/achievements"
          idKey="achievements_id"
          formFields={[
            { key: 'title', label: 'Judul', placeholder: 'mis. 7 Hari Berturut-turut' },
            { key: 'icon', label: 'Icon', placeholder: 'Opsional' },
            { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Opsional' },
            { key: 'xp_reward', label: 'XP Reward', type: 'number', placeholder: '0' },
            { key: 'point_reward', label: 'Point Reward', type: 'number', placeholder: '0' },
          ]}
          columns={[
            { key: 'title', label: 'Achievement' },
            { key: 'description', label: 'Deskripsi' },
            {
              key: 'user_achievements_count',
              label: 'Diraih User',
              render: (i) => <span className="text-[#D9A441]">{i.user_achievements_count ?? 0}</span>,
            },
          ]}
        />
      )}
    </AppLayout>
  );
}
