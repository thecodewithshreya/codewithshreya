import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const languageConfig = {
  python: { judge0LanguageId: 71 },
  csharp: { judge0LanguageId: 51 },
  javascript: { judge0LanguageId: 63 },
  java: { judge0LanguageId: 62 },
  cpp: { judge0LanguageId: 54 },
} as const;

type LanguageId = keyof typeof languageConfig;

type Judge0Status = {
  id: number;
  description: string;
};

type Judge0Submission = {
  token?: string;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  time?: string | null;
  memory?: number | null;
  status?: Judge0Status | null;
  error?: string;
};

function invalidRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return invalidRequest("Invalid request body.");
  }

  if (!payload || typeof payload !== "object") {
    return invalidRequest("Invalid request body.");
  }

  const language =
    "language" in payload && typeof payload.language === "string"
      ? payload.language
      : "";
  const code =
    "code" in payload && typeof payload.code === "string"
      ? payload.code
      : "";
  const input =
    "input" in payload && typeof payload.input === "string"
      ? payload.input
      : "";

  if (!isLanguageId(language)) {
    return invalidRequest("Unsupported compiler language.");
  }

  if (!code.trim()) {
    return invalidRequest("Code cannot be empty.");
  }

  if (code.length > 20_000) {
    return invalidRequest("Code is too long. Keep it under 20,000 characters.");
  }

  const apiBaseUrl = (process.env.JUDGE0_API_URL || "https://ce.judge0.com").replace(/\/$/, "");
  const headers = getJudge0Headers();

  try {
    const createResponse = await fetch(`${apiBaseUrl}/submissions?base64_encoded=false&wait=false`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: code,
        language_id: languageConfig[language].judge0LanguageId,
        stdin: input,
        cpu_time_limit: 3,
        wall_time_limit: 10,
        memory_limit: 128000,
      }),
    });
    const created = await createResponse.json() as Judge0Submission;

    if (!createResponse.ok || !created.token) {
      return NextResponse.json(
        { error: created.error || "Judge0 could not create a submission." },
        { status: createResponse.status },
      );
    }

    const result = await pollSubmission(apiBaseUrl, created.token, headers);
    const output = formatJudge0Output(result);
    const statusId = result.status?.id ?? 0;

    return NextResponse.json({
      output,
      success: statusId === 3,
      status: result.status?.description,
      time: result.time,
      memory: result.memory,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Compiler service is unavailable. Configure JUDGE0_API_URL and JUDGE0_API_KEY, or try again later.",
      },
      { status: 502 },
    );
  }
}

function getJudge0Headers(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const apiKey = process.env.JUDGE0_API_KEY;
  const rapidApiHost = process.env.JUDGE0_RAPIDAPI_HOST;

  if (apiKey && rapidApiHost) {
    headers["X-RapidAPI-Key"] = apiKey;
    headers["X-RapidAPI-Host"] = rapidApiHost;
    return headers;
  }

  if (apiKey) {
    headers["X-Auth-Token"] = apiKey;
  }

  return headers;
}

async function pollSubmission(apiBaseUrl: string, token: string, headers: HeadersInit) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const response = await fetch(
      `${apiBaseUrl}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,message,status,time,memory`,
      { headers },
    );
    const result = await response.json() as Judge0Submission;

    if (!response.ok) {
      throw new Error(result.error || "Judge0 could not fetch submission result.");
    }

    const statusId = result.status?.id ?? 0;
    if (statusId !== 1 && statusId !== 2) {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, 700));
  }

  throw new Error("Compiler timed out while waiting for the result.");
}

function isLanguageId(value: string): value is LanguageId {
  return value in languageConfig;
}

function formatJudge0Output(result: Judge0Submission) {
  const output = [
    result.stdout,
    result.stderr,
    result.compile_output,
    result.message,
    result.status && result.status.id !== 3 ? `Status: ${result.status.description}` : "",
  ]
    .filter(Boolean)
    .join("\n")
    .trim();

  return output || "Program finished with no output.";
}
