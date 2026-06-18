type CopyEmailButtonProps = {
  email: string;
};

export default function CopyEmailButton({ email }: CopyEmailButtonProps) {
  return (
    <a
      className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-signal hover:bg-white/10"
      href={`mailto:${email}`}
      aria-label="Email Gabriel Bibbó"
    >
      Email Gabriel
    </a>
  );
}
