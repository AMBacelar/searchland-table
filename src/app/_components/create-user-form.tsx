/* eslint-disable react/no-children-prop */
"use client";

import { type FieldApi, useForm } from '@tanstack/react-form';
import { api } from "~/trpc/react";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FieldInfo = ({ field }: { field: FieldApi<any, any, any, any> }) => {
  return (
    <div className="mb-3">
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? <em>Validating...</em> : null}
    </div>
  )
}

export const CreateUserForm = ({ onSubmitComplete }: { onSubmitComplete: () => void }) => {

  const utils = api.useUtils();
  const createUser = api.user.create.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
    },
  });

  const form = useForm({
    defaultValues: {
      department: '',
      dob: '',
      email: '',
      familyName: '',
      givenName: '',
      title: '',
      username: '',
    },
    onSubmit: async ({ value }) => {
      createUser.mutate(value);
      onSubmitComplete();
    },
    validatorAdapter: zodValidator()
  })

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
      className="space-y-6 mx-auto w-full p-6"
    >
      <form.Field
        name="givenName"
        children={(field) => (
          <>
            <Label htmlFor="givenName">Given Name</Label>
            <Input
              id="givenName"
              name="givenName"
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              required
            />
            <FieldInfo field={field} />
          </>
        )}
      />

      <form.Field
        name="familyName"
        children={(field) => (
          <>
            <Label htmlFor="familyName">Family Name</Label>
            <Input
              id="familyName"
              name="familyName"
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              required
            />
            <FieldInfo field={field} />
          </>
        )}
      />

      <form.Field
        name="username"
        children={(field) => (
          <>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              required
            />
            <FieldInfo field={field} />
          </>
        )}
      />

      <form.Field
        name="email"
        children={(field) => (
          <>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              required
            />
            <FieldInfo field={field} />
          </>
        )}
      />
      <form.Field
        name="dob"
        children={(field) => (
          <>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              type="date"
              id="dob"
              name="dob"
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              required
            />
            <FieldInfo field={field} />
          </>
        )}
      />
      <form.Field
        name="title"
        children={(field) => (
          <>
            <Label htmlFor="email">Job Title</Label>
            <Input
              id="email"
              name="email"
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              required
            />
            <FieldInfo field={field} />
          </>
        )}
      />

      <form.Field
        name="department"
        children={(field) => (
          <>
            <Label htmlFor="department">Department</Label>
            <Select onValueChange={field.handleChange} value={field.state.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      />

      <Button type="submit" className="w-full">Create User</Button>
    </form>
  )
}