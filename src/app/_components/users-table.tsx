/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  type PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import Link from "next/link";

import { api } from "~/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
} from "~components/ui/dialog"
import { CreateUserForm } from "~components/create-user-form";
import { Button } from "./ui/button";
import { useFilters } from "~/lib/useFilters";

export const DEFAULT_PAGE_INDEX = '0';
export const DEFAULT_PAGE_SIZE = '10';

const toObject = (filters: PaginationState) => Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, String(value)]))

export const UsersTable = () => {
  const [showDialogOpen, setShowDialogOpen] = useState(false);
  const [showAlertOpen, setShowAlertOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number>();
  const { filters, setFilters } = useFilters();

  const paginationState: PaginationState = {
    pageIndex: parseInt(filters.get('pageIndex') ?? DEFAULT_PAGE_INDEX, 10),
    pageSize: parseInt(filters.get('pageSize') ?? DEFAULT_PAGE_SIZE, 10),
  }

  const utils = api.useUtils();
  const [{ users, totalCount }] = api.user.getUsers.useSuspenseQuery({
    limit: paginationState.pageSize,
    offset: paginationState.pageIndex * paginationState.pageSize,
  });
  const deleteUserMutation = api.user.deleteUser.useMutation({
    onSuccess: async () => {
      setShowAlertOpen(false);
      setDeleteUserId(undefined);
      await utils.user.invalidate();
    }
  });
  const seedUsersMutation = api.user.seed.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
    }
  });

  const TableRow = ({ user }: { user: typeof users[number] }) => {
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
        <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex gap-2">
          <Link
            href={`/users/${user.id}`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
            View
          </Link>
          <Button variant="destructive" onClick={() => {
            setShowAlertOpen(true);
            setDeleteUserId(user.id);
          }} >
            Delete<span className="sr-only">, {user.username}</span>
          </Button>
        </td>
      </tr>
    )
  }

  const USER_COLUMNS: ColumnDef<typeof users[number]>[] = [
    {
      accessorKey: 'id',
      header: () => <span>ID</span>,
      meta: { filterKey: 'id', filterVariant: 'number' },
    },
    {
      accessorKey: 'username',
      header: () => <span>Username</span>,
      meta: { filterKey: 'username' },
    },
    {
      accessorKey: 'title',
      header: () => <span>Job Title</span>,
      meta: { filterKey: 'title' },
    },
    {
      accessorKey: 'email',
      header: () => <span>Email</span>,
      meta: { filterKey: 'email' },
    },
  ]

  const table = useReactTable({
    data: users,
    columns: USER_COLUMNS,
    state: { pagination: paginationState },
    rowCount: totalCount,
    onPaginationChange: pagination => {
      setFilters(
        typeof pagination === 'function'
          ? toObject(pagination(paginationState))
          : toObject(pagination)
      )
    },
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  })

  const Pagination = () => (
    <div className="flex items-center gap-2 my-2">
      <button
        className="border rounded p-1 disabled:text-gray-500 disabled:cursor-not-allowed"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        className="border rounded p-1 disabled:text-gray-500 disabled:cursor-not-allowed"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <button
        className="border rounded p-1 disabled:text-gray-500 disabled:cursor-not-allowed"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        className="border rounded p-1 disabled:text-gray-500 disabled:cursor-not-allowed"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Go to page:
        <input
          type="number"
          value={table.getState().pagination.pageIndex + 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            table.setPageIndex(page)
          }}
          className="border p-1 rounded w-16"
        />
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={e => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      <span className="flex items-center gap-1">
        Showing row {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalCount)} of {totalCount}

      </span>
    </div>
  )

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
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                seedUsersMutation.mutate();
              }}
            >
              Seed table
            </Button>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button
              onClick={() => setShowDialogOpen(true)}
              type="button"
            >
              Add user
            </Button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <Pagination />
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
              <Pagination />
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showDialogOpen} onOpenChange={setShowDialogOpen} >
        <DialogContent className="sm:max-w-[425px]">
          <CreateUserForm onSubmitComplete={() => setShowDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      <AlertDialog open={showAlertOpen} onOpenChange={setShowAlertOpen} >
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
            <AlertDialogAction onClick={(e) => {
              e.preventDefault();
              deleteUserMutation.mutate({ id: deleteUserId! })
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
