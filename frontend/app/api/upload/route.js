// Proxies file uploads to Pinata so the JWT never reaches the browser.
const PINATA_PIN_FILE_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

export async function POST(request) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    return Response.json({ error: 'PINATA_JWT is not set on the server' }, { status: 500 });
  }

  const incoming = await request.formData();
  const file = incoming.get('file');
  if (!file || typeof file === 'string') {
    return Response.json({ error: 'Expected a "file" field' }, { status: 400 });
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(PINATA_PIN_FILE_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.IpfsHash) {
    const message = typeof data.error === 'string' ? data.error : data.error?.details || data.error?.reason;
    return Response.json({ error: message || 'Pinata upload failed' }, { status: 502 });
  }

  return Response.json({ IpfsHash: data.IpfsHash });
}
