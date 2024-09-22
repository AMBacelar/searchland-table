/* eslint-disable @next/next/no-img-element */
"use client";

import { api } from "~/trpc/react";
import { type users as userSchema } from "~/server/db/schema";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~components/ui/dialog"
import { CreateUserForm } from "~components/create-user-form";
import Link from "next/link";

export const UsersTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') ?? '10', 10);
  const utils = api.useUtils();
  const [{ users, totalCount }] = api.user.getUsers.useSuspenseQuery({ limit: 10 });
  const deleteUserMutation = api.user.deleteUser.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
    }
  }
  );

  console.log('total count:', totalCount);

  const TableRow = ({ user }: { user: typeof userSchema.$inferSelect }) => {

    const handleDeleteUser = () => {
      deleteUserMutation.mutate({ id: user.id });
    }

    return (
      <tr key={user.email}>
        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
          <div className="flex items-center">
            <div className="ml-4">
              <div className="font-medium">{user.username}</div>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-5 text-sm">
          <div className="">{user.title}</div>
        </td>
        <td className="whitespace-nowrap px-3 py-5 text-sm">
          <div className="">{user.department}</div>
        </td>
        <td className="whitespace-nowrap px-3 py-5 text-sm">{user.email}</td>
        <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <Link href={`/users/${user.id}`} className="">View</Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-red-600 hover:text-red-900">
                Delete<span className="sr-only">, {user.username}</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this user
                  account and remove this data from our database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </td>
      </tr>
    )
  }

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6">Users</h1>
            <p className="mt-2 text-sm">
              A list of all the users in the database including their name, title, email and role.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={(e) => {
                e.preventDefault();
                api.user.seed.useMutation();
              }}
            >
              seed table
            </button>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">

            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add user
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <CreateUserForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="">
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                      Username
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                      Job Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                      Department
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                      Email
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((person) => (
                    <TableRow user={person} key={person.id} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
