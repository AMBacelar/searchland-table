import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { Badge } from "~components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~components/ui/card";

export default async function Page({ params }: { params: { id: string } }) {

  const user = await api.user.getUser({ id: Number(params.id) });

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
        <p className="text-xl text-muted-foreground">{user.title}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Personal and contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-2 text-sm">
              <div className="grid grid-cols-3">
                <dt className="font-medium">Email:</dt>
                <dd className="col-span-2">{user.email}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium">Location:</dt>
                <dd className="col-span-2">London, United Kingdom</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium">Date of Birth:</dt>
                <dd className="col-span-2">{user.dob.toLocaleDateString()}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium">Joined:</dt>
                <dd className="col-span-2">{user.createdAt.toLocaleDateString()}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium">Website:</dt>
                <dd className="col-span-2">
                  <a target="_blank" rel="noopener noreferrer" href="http://ambacelar.com">Adilsons Personal Site</a>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Professional information</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-2 text-sm mb-4">
              <div className="grid grid-cols-3">
                <dt className="font-medium">Job Title:</dt>
                <dd className="col-span-2">{user.title}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium">Department:</dt>
                <dd className="col-span-2">{user.department}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2">
              <Badge>React</Badge>
              <Badge>TypeScript</Badge>
              <Badge>Node.js</Badge>
              <Badge>GraphQL</Badge>
              <Badge>AWS</Badge>
              <Badge>Docker</Badge>
              <Badge>Golang</Badge>
              <Badge>Git</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  )
}