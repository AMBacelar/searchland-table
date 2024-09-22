export default function Page({ params }: { params: { id: string } }) {
  return <div>My User: {params.id}</div>
}