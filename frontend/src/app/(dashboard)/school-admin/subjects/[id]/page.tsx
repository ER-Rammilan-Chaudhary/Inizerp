import SubjectDetailsClient from "./SubjectDetailsClient";

export default async function SubjectDetailsPage({params,}: {params: Promise<{ id: string }>;}) {
    const { id } = await params;

    return <SubjectDetailsClient id={id} />;
}
