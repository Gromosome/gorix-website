import { redirect } from "next/navigation";
import { getAllDocs } from "@/lib/docs";

export default function DocumentationIndexPage() {
  const [firstDoc] = getAllDocs();
  redirect(firstDoc?.href ?? "/");
}
