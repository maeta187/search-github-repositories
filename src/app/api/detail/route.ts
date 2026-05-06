const ENDPOINT = 'https://api.github.com/repos';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fullName = searchParams.get('fullName');
  if (!fullName) {
    return Response.json({ error: 'fullName が必要です' }, { status: 400 });
  }
  const response = await fetch(`${ENDPOINT}/${fullName}`, {
    method: 'GET',
    headers: {
      'X-GitHub-Api-Version': '2026-03-10',
    },
  });
  if (!response.ok) {
    return Response.json(
      { error: 'リポジトリーの取得に失敗しました' },
      { status: response.status },
    );
  }
  return Response.json(await response.json());
}
