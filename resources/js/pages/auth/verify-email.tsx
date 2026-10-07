// Components
import { Form, Head, usePage } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const { auth } = usePage<{ auth: { user: { email: string } | null } }>()
        .props;

    return (
        <>
            <Head title="Verifikasi email" />

            {auth.user?.email && (
                <p className="mb-4 text-center text-sm text-muted-foreground">
                    Tautan verifikasi dikirim ke{' '}
                    <span className="font-medium text-foreground">
                        {auth.user.email}
                    </span>
                    . Cek juga folder spam.
                </p>
            )}

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Tautan verifikasi baru sudah dikirim ke email yang kamu
                    daftarkan.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            Kirim ulang email verifikasi
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            Keluar
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifikasi email kamu',
    description:
        'Klik tautan yang kami kirim ke emailmu untuk mengaktifkan akun Sonaria.',
};
