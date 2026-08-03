/**
 * Wrapper tipis di atas fetch() untuk memanggil routes/api.php (session-auth,
 * bukan lewat Inertia visit). Menyertakan cookie XSRF-TOKEN Laravel secara
 * otomatis, sama seperti yang biasanya dilakukan axios.
 */
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function apiFetch<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const token = getCookie('XSRF-TOKEN');

  const res = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { 'X-XSRF-TOKEN': token } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new ApiError(payload.message ?? 'Terjadi kesalahan.', res.status, payload.errors);
  }

  if (res.status === 204) return null as T;

  return res.json();
}
