// The initial JWT is a stable handle for existing hooks. Transport uses the latest
// bearer for that session so activity does not reload questions or progress.
export interface SessionAccess {
  handle: string;
  bearer: string | null;
  pending: Promise<void> | null;
}

let access: SessionAccess | null = null;

export function registerSessionAccess(session: SessionAccess) {
  access = session;
}

export async function resolveSessionBearer(handle: string): Promise<string> {
  const session = access;
  if (!session || session.handle !== handle) return handle;
  await session.pending;
  if (!session.bearer) throw new Error('Session ended');
  return session.bearer;
}
