import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { content } from "@/lib/content";
import { codeChallengeSchema } from "@/lib/form-schemas";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const maxPageSize = 12;

type ChallengeProject = {
  id: string;
  projectName: string;
  githubRepoUrl: string;
  projectDescription: string;
  gorixUsage: string;
  builderName: string;
  demoUrl: string;
  score: number;
};

type FirestoreError = {
  code?: number | string;
  details?: string;
};

function isIndexBuildingError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const firestoreError = error as FirestoreError;
  return firestoreError.code === 9 || firestoreError.code === "failed-precondition" || firestoreError.details?.includes("requires an index");
}

function mapProject(id: string, data: FirebaseFirestore.DocumentData): ChallengeProject {
  return {
    id,
    projectName: String(data.projectName ?? ""),
    githubRepoUrl: String(data.githubRepoUrl ?? ""),
    projectDescription: String(data.projectDescription ?? ""),
    gorixUsage: String(data.gorixUsage ?? ""),
    builderName: String(data.builderName ?? ""),
    demoUrl: String(data.demoUrl ?? ""),
    score: Number(data.score ?? 0),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const pageSize = Math.min(maxPageSize, Math.max(1, Number(searchParams.get("pageSize") ?? 6) || 6));
  const collection = process.env.CODE_CHALLENGE_COLLECTION ?? "codeChallengeProjects";

  try {
    const snapshot = await getAdminFirestore()
      .collection(collection)
      .where("verified", "==", true)
      .orderBy("score", "desc")
      .offset((page - 1) * pageSize)
      .limit(pageSize + 1)
      .get();

    const docs = snapshot.docs.slice(0, pageSize);
    const projects = docs.map((doc) => mapProject(doc.id, doc.data()));

    return NextResponse.json({ projects, page, pageSize, hasNextPage: snapshot.docs.length > pageSize });
  } catch (error) {
    if (isIndexBuildingError(error)) {
      const snapshot = await getAdminFirestore()
        .collection(collection)
        .where("verified", "==", true)
        .get();
      const orderedProjects = snapshot.docs
        .map((doc) => mapProject(doc.id, doc.data()))
        .sort((first, second) => second.score - first.score || first.projectName.localeCompare(second.projectName));
      const start = (page - 1) * pageSize;
      const projects = orderedProjects.slice(start, start + pageSize);

      return NextResponse.json({
        projects,
        page,
        pageSize,
        hasNextPage: orderedProjects.length > start + pageSize,
        indexFallback: true,
      });
    }

    console.error("Code challenge listing failed", error);
    return NextResponse.json({ error: "The project listing is temporarily unavailable." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });

    const decodedToken = await getAdminAuth().verifyIdToken(authorization.slice(7), true);
    if (decodedToken.firebase.sign_in_provider !== "github.com") return NextResponse.json({ error: content.forms.codeChallenge.authError }, { status: 403 });

    const json: unknown = await request.json();
    const parsed = codeChallengeSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid project submission." }, { status: 400 });
    if (parsed.data.website) return NextResponse.json({ error: "Unable to submit this project." }, { status: 400 });

    const requestBody = Object.fromEntries(Object.entries(parsed.data).filter(([key]) => key !== "website"));
    const collection = process.env.CODE_CHALLENGE_COLLECTION ?? "codeChallengeProjects";
    const reference = await getAdminFirestore().collection(collection).add({
      ...requestBody,
      submitterUid: decodedToken.uid,
      submitterEmail: decodedToken.email ?? "",
      submitterProvider: decodedToken.firebase.sign_in_provider,
      verified: false,
      score: 0,
      source: "gorix-website",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: reference.id }, { status: 201 });
  } catch (error) {
    console.error("Code challenge submission failed", error);
    return NextResponse.json({ error: "The challenge service is temporarily unavailable." }, { status: 500 });
  }
}
