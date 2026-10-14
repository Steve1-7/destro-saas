const requiredServerEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

const requiredPublicEnv = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const;

export function getMissingEnvVars(): string[] {
  const env = process.env;

  return [...requiredServerEnv].filter((key) => {
    const value = env[key];
    return !value || value.trim() === '';
  });
}

export function assertRequiredEnv(): void {
  const missing = getMissingEnvVars();

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. Add them before production deployment.`
    );
  }
}

export function getPublicClientEnv() {
  const missing = requiredPublicEnv.filter((key) => !process.env[key]?.trim());

  return {
    hasConfig: missing.length === 0,
    missing,
  };
}
